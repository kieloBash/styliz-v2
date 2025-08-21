-- CreateTable
CREATE TABLE "verification-tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification-tokens_pkey" PRIMARY KEY ("identifier","token")
);
