import { Module } from '@nestjs/common';
import { LabelController } from './label.controller';
import { LabelService } from './label.service';
import { PrismaService } from '@/common/services/prisma.service';

@Module({
  controllers: [LabelController],
  providers: [LabelService, PrismaService]
})
export class LabelModule {}
