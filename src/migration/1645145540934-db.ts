import {MigrationInterface, QueryRunner} from "typeorm";

export class db1645145540934 implements MigrationInterface {
    name = 'db1645145540934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "bio" character varying NOT NULL DEFAULT '', "image" character varying NOT NULL DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "body" character varying NOT NULL, "authorId" integer, "articleId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "body" character varying NOT NULL, "tagList" text NOT NULL, "authorId" integer, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tag" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_followers_user" ("userId_1" integer NOT NULL, "userId_2" integer NOT NULL, CONSTRAINT "PK_980ff03f415077df184596dcf73" PRIMARY KEY ("userId_1", "userId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_26312a1e34901011fc6f63545e" ON "user_followers_user" ("userId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_110f993e5e9213a7a44f172b26" ON "user_followers_user" ("userId_2") `);
        await queryRunner.query(`CREATE TABLE "article_favorited_by_user" ("articleId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_584a0349787a81ec1567cd18273" PRIMARY KEY ("articleId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cb1864cfd2e4ca08fe74b35469" ON "article_favorited_by_user" ("articleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_125c0127ed37d254414b821cbb" ON "article_favorited_by_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c20404221e5c125a581a0d90c0e" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_followers_user" ADD CONSTRAINT "FK_26312a1e34901011fc6f63545e2" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_followers_user" ADD CONSTRAINT "FK_110f993e5e9213a7a44f172b264" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_favorited_by_user" ADD CONSTRAINT "FK_cb1864cfd2e4ca08fe74b354691" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "article_favorited_by_user" ADD CONSTRAINT "FK_125c0127ed37d254414b821cbbf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_favorited_by_user" DROP CONSTRAINT "FK_125c0127ed37d254414b821cbbf"`);
        await queryRunner.query(`ALTER TABLE "article_favorited_by_user" DROP CONSTRAINT "FK_cb1864cfd2e4ca08fe74b354691"`);
        await queryRunner.query(`ALTER TABLE "user_followers_user" DROP CONSTRAINT "FK_110f993e5e9213a7a44f172b264"`);
        await queryRunner.query(`ALTER TABLE "user_followers_user" DROP CONSTRAINT "FK_26312a1e34901011fc6f63545e2"`);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c20404221e5c125a581a0d90c0e"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_125c0127ed37d254414b821cbb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb1864cfd2e4ca08fe74b35469"`);
        await queryRunner.query(`DROP TABLE "article_favorited_by_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_110f993e5e9213a7a44f172b26"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_26312a1e34901011fc6f63545e"`);
        await queryRunner.query(`DROP TABLE "user_followers_user"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "article"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
