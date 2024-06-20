-- CreateTable
CREATE TABLE `moment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `userId` INTEGER NOT NULL,
    `visibility` VARCHAR(8) NOT NULL,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `likeCount` INTEGER NOT NULL DEFAULT 0,
    `collectCount` INTEGER NOT NULL DEFAULT 0,
    `createAt` DATETIME(0) NULL DEFAULT (now()),

    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `momentId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `commentId` INTEGER NULL,
    `createAt` DATETIME(0) NULL DEFAULT (now()),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `label` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(8) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `moment_label` (
    `momentId` INTEGER NOT NULL,
    `labelId` INTEGER NOT NULL,

    INDEX `labelId`(`labelId`),
    INDEX `momentId`(`momentId`),
    PRIMARY KEY (`momentId`, `labelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `moment` ADD CONSTRAINT `moment_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`momentId`) REFERENCES `moment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moment_label` ADD CONSTRAINT `moment_label_ibfk_1` FOREIGN KEY (`momentId`) REFERENCES `moment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moment_label` ADD CONSTRAINT `moment_label_ibfk_2` FOREIGN KEY (`labelId`) REFERENCES `label`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
