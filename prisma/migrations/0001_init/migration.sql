-- CreateTable
CREATE TABLE IF NOT EXISTS "Query" (
    "id" TEXT PRIMARY KEY,
    "address" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "resultWei" TEXT NOT NULL,
    "queriedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Query_address_queriedAt_idx" ON "Query" ("address", "queriedAt");


