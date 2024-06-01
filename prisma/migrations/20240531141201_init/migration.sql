-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(10) NOT NULL,
    `password` VARCHAR(32) NOT NULL,
    `createAt` DATETIME(0) NULL DEFAULT (now()),
    `updateAt` DATETIME(0) NULL DEFAULT (now()),

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
