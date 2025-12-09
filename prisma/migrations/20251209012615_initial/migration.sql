-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Smoke" (
    "id" TEXT NOT NULL,
    "recipeTitle" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "smokerType" TEXT NOT NULL,
    "weather" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Smoke_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "Smoke_recipeTitle_idx" ON "Smoke"("recipeTitle");

-- CreateIndex
CREATE INDEX "Smoke_date_idx" ON "Smoke"("date");

-- CreateIndex
CREATE INDEX "Smoke_rating_idx" ON "Smoke"("rating");

-- CreateIndex
CREATE INDEX "Smoke_weather_idx" ON "Smoke"("weather");

-- CreateIndex
CREATE INDEX "Smoke_userId_idx" ON "Smoke"("userId");

-- AddForeignKey
ALTER TABLE "Smoke" ADD CONSTRAINT "Smoke_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
