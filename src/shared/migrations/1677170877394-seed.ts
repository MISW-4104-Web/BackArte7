import { MigrationInterface, QueryRunner } from "typeorm"
import { sqlScript } from "./seedData";

export class seed1677170877394 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(sqlScript);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
