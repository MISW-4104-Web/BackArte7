import { MigrationInterface, QueryRunner } from "typeorm"
import { seedData } from "./seedData";

export class seed1677170877394 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "director_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "photo" character varying NOT NULL, "nationality" character varying NOT NULL, "birthDate" TIMESTAMP NOT NULL, "biography" character varying NOT NULL, CONSTRAINT "PK_626cf3e00366a5dafb43b6cbb63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genre_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, CONSTRAINT "PK_cae0cec334ef1e35fe187160f0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "platform_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_ad26ad68861322f0ec769b5b7e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "score" integer NOT NULL, "creator" character varying NOT NULL, "movieId" uuid, CONSTRAINT "PK_5a7a10bab252068bd06d10d49e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "youtube_trailer_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "url" character varying NOT NULL, "duration" integer NOT NULL, "channel" character varying NOT NULL, CONSTRAINT "PK_8e7e5a529e0a33109a13f280112" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "poster" character varying NOT NULL, "duration" integer NOT NULL, "country" character varying NOT NULL, "releaseDate" TIMESTAMP NOT NULL, "popularity" integer NOT NULL, "directorId" uuid, "genreId" uuid, "youtubeTrailerId" uuid, CONSTRAINT "REL_011744a49b8acc97dc8b2d90ed" UNIQUE ("youtubeTrailerId"), CONSTRAINT "PK_9a7f80ec733baad243af6ba1f80" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "actor_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "photo" character varying NOT NULL, "nationality" character varying NOT NULL, "birthDate" TIMESTAMP NOT NULL, "biography" character varying NOT NULL, CONSTRAINT "PK_6f735d208eac41f67be7cb349bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "platform_entity_movies_movie_entity" ("platformEntityId" uuid NOT NULL, "movieEntityId" uuid NOT NULL, CONSTRAINT "PK_0e3e78a782b032726f206550037" PRIMARY KEY ("platformEntityId", "movieEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1ca2b623a482fa33d637032be1" ON "platform_entity_movies_movie_entity" ("platformEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a57cae2228544c798351921c97" ON "platform_entity_movies_movie_entity" ("movieEntityId") `);
        await queryRunner.query(`CREATE TABLE "movie_entity_actors_actor_entity" ("movieEntityId" uuid NOT NULL, "actorEntityId" uuid NOT NULL, CONSTRAINT "PK_7e3757233c8221b499df2b3ec6b" PRIMARY KEY ("movieEntityId", "actorEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6f22362497d7d47d7962b7cba9" ON "movie_entity_actors_actor_entity" ("movieEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9f995b4c5539aa2c437c62b18a" ON "movie_entity_actors_actor_entity" ("actorEntityId") `);
        await queryRunner.query(`ALTER TABLE "review_entity" ADD CONSTRAINT "FK_2ed623f9d0b913233b46e798aa4" FOREIGN KEY ("movieId") REFERENCES "movie_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_entity" ADD CONSTRAINT "FK_31f16d3bf3f40e6c9d3966d300d" FOREIGN KEY ("directorId") REFERENCES "director_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_entity" ADD CONSTRAINT "FK_300c2231d5ce2e8dda5173873e8" FOREIGN KEY ("genreId") REFERENCES "genre_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_entity" ADD CONSTRAINT "FK_011744a49b8acc97dc8b2d90ede" FOREIGN KEY ("youtubeTrailerId") REFERENCES "youtube_trailer_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "platform_entity_movies_movie_entity" ADD CONSTRAINT "FK_1ca2b623a482fa33d637032be18" FOREIGN KEY ("platformEntityId") REFERENCES "platform_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "platform_entity_movies_movie_entity" ADD CONSTRAINT "FK_a57cae2228544c798351921c970" FOREIGN KEY ("movieEntityId") REFERENCES "movie_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_entity_actors_actor_entity" ADD CONSTRAINT "FK_6f22362497d7d47d7962b7cba9f" FOREIGN KEY ("movieEntityId") REFERENCES "movie_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movie_entity_actors_actor_entity" ADD CONSTRAINT "FK_9f995b4c5539aa2c437c62b18a1" FOREIGN KEY ("actorEntityId") REFERENCES "actor_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(seedData);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
