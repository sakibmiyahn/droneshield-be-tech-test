import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1751171450027 implements MigrationInterface {
    name = 'InitialMigration1751171450027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "software" ("id" SERIAL NOT NULL, "version" character varying NOT NULL, "filePath" character varying NOT NULL, "originalFileName" character varying NOT NULL, "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_83534220f3e823e90b989b2ae85" UNIQUE ("version"), CONSTRAINT "PK_3ceec82cc90b32643b07e8d9841" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_83534220f3e823e90b989b2ae8" ON "software" ("version") `);
        await queryRunner.query(`CREATE TABLE "sensor" ("id" SERIAL NOT NULL, "serial" character varying NOT NULL, "isOnline" boolean NOT NULL DEFAULT false, "softwareId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ea8e4b14160a976b4445bd6eff2" UNIQUE ("serial"), CONSTRAINT "PK_ccc38b9aa8b3e198b6503d5eee9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ea8e4b14160a976b4445bd6eff" ON "sensor" ("serial") `);
        await queryRunner.query(`CREATE INDEX "IDX_64e13fac825a0666d7a8034321" ON "sensor" ("isOnline") `);
        await queryRunner.query(`CREATE TABLE "sensor_software_history" ("id" SERIAL NOT NULL, "reportedAt" TIMESTAMP NOT NULL DEFAULT now(), "sensorId" integer, "softwareId" integer, CONSTRAINT "PK_f3f63a4834b53ba786d50baec25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD CONSTRAINT "FK_25775af746ea843412f68fb6755" FOREIGN KEY ("softwareId") REFERENCES "software"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor_software_history" ADD CONSTRAINT "FK_e3c58369f34a162bbce9cd84312" FOREIGN KEY ("sensorId") REFERENCES "sensor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor_software_history" ADD CONSTRAINT "FK_b87a72c013daa8004c318077115" FOREIGN KEY ("softwareId") REFERENCES "software"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor_software_history" DROP CONSTRAINT "FK_b87a72c013daa8004c318077115"`);
        await queryRunner.query(`ALTER TABLE "sensor_software_history" DROP CONSTRAINT "FK_e3c58369f34a162bbce9cd84312"`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP CONSTRAINT "FK_25775af746ea843412f68fb6755"`);
        await queryRunner.query(`DROP TABLE "sensor_software_history"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_64e13fac825a0666d7a8034321"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ea8e4b14160a976b4445bd6eff"`);
        await queryRunner.query(`DROP TABLE "sensor"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83534220f3e823e90b989b2ae8"`);
        await queryRunner.query(`DROP TABLE "software"`);
    }

}
