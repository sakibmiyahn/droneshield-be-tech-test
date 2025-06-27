package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"os"
	"sort"
	"time"

	pb "emitter/pb"

	_ "github.com/lib/pq"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var versions = []string{
	"v1.0.0", "v1.1.0", "v2.0.1", "v3.4.2",
}

var sortedVersions []string

// Track the highest version each serial has sent
var serialVersionMap = make(map[string]string)

func init() {
	sortedVersions = make([]string, len(versions))
	copy(sortedVersions, versions)
	sort.Slice(sortedVersions, func(i, j int) bool {
		return versionLess(sortedVersions[i], sortedVersions[j])
	})
	rand.New(rand.NewSource(time.Now().UnixNano()))
}

func versionLess(a, b string) bool {
	var majorA, minorA, patchA int
	var majorB, minorB, patchB int
	fmt.Sscanf(a, "v%d.%d.%d", &majorA, &minorA, &patchA)
	fmt.Sscanf(b, "v%d.%d.%d", &majorB, &minorB, &patchB)

	if majorA != majorB {
		return majorA < majorB
	}
	if minorA != minorB {
		return minorA < minorB
	}
	return patchA < patchB
}

func getEligibleVersions(current string) []string {
	for i, v := range sortedVersions {
		if v == current {
			return sortedVersions[i:]
		}
	}
	return []string{"v1.0.0"}
}

func loadSerialsFromDB() []string {
	dbUrl := os.Getenv("DB_URL")
	if dbUrl == "" {
		log.Fatal("DB_URL environment variable not set")
	}

	dsn := fmt.Sprintf("%s?sslmode=disable", dbUrl)
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("failed to connect to DB: %v", err)
	}
	defer db.Close()

	rows, err := db.Query("SELECT serial FROM sensor")
	if err != nil {
		log.Fatalf("failed to query serials: %v", err)
	}
	defer rows.Close()

	var serials []string
	for rows.Next() {
		var serial string
		if err := rows.Scan(&serial); err != nil {
			log.Printf("failed to scan row: %v", err)
			continue
		}
		serials = append(serials, serial)
	}

	log.Printf("Loaded %d serials from DB", len(serials))
	return serials
}

func randomSerial(from []string) string {
	return from[rand.Intn(len(from))]
}

func main() {
	serials := loadSerialsFromDB()

	conn, err := grpc.NewClient(
		"server:50051",
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		log.Fatalf("failed to connect: %v", err)
	}
	defer conn.Close()

	client := pb.NewDeviceStatusServiceClient(conn)

	for {
		if len(serials) == 0 {
			log.Printf("Status update skipped: No serials found in DB.")
			time.Sleep(5 * time.Second)
			continue
		}

		serial := randomSerial(serials)

		var chosenVersion string
		currentVersion, sentBefore := serialVersionMap[serial]

		if !sentBefore {
			// First time sending — must be v1.0.0
			chosenVersion = "v1.0.0"
			serialVersionMap[serial] = chosenVersion
		} else {
			eligible := getEligibleVersions(currentVersion)
			chosenVersion = eligible[rand.Intn(len(eligible))]

			// Update if newer version is selected
			if versionLess(currentVersion, chosenVersion) {
				serialVersionMap[serial] = chosenVersion
			}
		}

		status := &pb.DeviceStatus{
			Serial:          serial,
			SoftwareVersion: chosenVersion,
		}

		log.Printf("Sending: %+v", status)

		response, err := client.SendStatus(context.Background(), status)
		if err != nil {
			log.Printf("failed to send status: %v", err)
		} else {
			log.Printf("Acknowledged: %s", response.GetMessage())
		}

		time.Sleep(5 * time.Second)
	}
}
