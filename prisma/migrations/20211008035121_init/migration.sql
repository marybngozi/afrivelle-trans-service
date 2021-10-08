-- noinspection SqlNoDataSourceInspectionForFile

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transactionId` VARCHAR(191) NOT NULL,
    `walletAddress` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `currencyType` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `transactionDate` DATETIME(3) NOT NULL,
    `timeLogged` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Transaction_transactionId_key`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
