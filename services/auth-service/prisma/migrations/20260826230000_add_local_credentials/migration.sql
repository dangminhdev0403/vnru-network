CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "LocalCredential" (
    "userId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    CONSTRAINT "LocalCredential_pkey" PRIMARY KEY ("userId")
);

ALTER TABLE "LocalCredential" ADD CONSTRAINT "LocalCredential_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
