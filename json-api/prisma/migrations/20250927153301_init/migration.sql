-- CreateTable
CREATE TABLE "InputJson" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "keys" TEXT[],
    "keysAndValues" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InputJson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutputJson" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "transformationModel" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutputJson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InputJson_name_key" ON "InputJson"("name");

-- CreateIndex
CREATE UNIQUE INDEX "OutputJson_name_key" ON "OutputJson"("name");
