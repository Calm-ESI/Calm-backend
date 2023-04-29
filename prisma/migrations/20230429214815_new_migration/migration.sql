-- CreateTable
CREATE TABLE "calm_users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "calm_users_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "codes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "codes_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addressing_modes" (
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "imagepath" VARCHAR(100),

    CONSTRAINT "addressing_modes_pk" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "components" (
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imagepath" VARCHAR(100),

    CONSTRAINT "components_pk" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "examples" (
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,

    CONSTRAINT "exmples_pk" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "calm_users_email_key" ON "calm_users"("email");

-- AddForeignKey
ALTER TABLE "codes" ADD CONSTRAINT "codes_fk0" FOREIGN KEY ("user_id") REFERENCES "calm_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
