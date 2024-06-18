import { Injectable } from '@nestjs/common';
import { label } from '@prisma/client';
import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class LabelService {
  constructor(private readonly prisma: PrismaService) {}
  async create(name): Promise<label> {
    return this.prisma.label.create({ data: { name } });
  }
  async search(name:string): Promise<label> {
    return this.prisma.label.findUnique({ where: { name }})
  }
  async findAll(offset: number, size: number): Promise<label[]> {
    return this.prisma.label.findMany({
      skip: offset,
      take: size,
    });
  }
}
