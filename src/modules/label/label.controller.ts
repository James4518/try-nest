import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Public } from '@/common/decorators/public.decorators';
import { LabelService } from './label.service';
import { label } from '@prisma/client';

@Controller('label')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}
  @Post()
  async create(@Body('name') name:string): Promise<label> {
    return this.labelService.create(name);
  }

  @Public()
  @Get('list')
  findAll(@Query('offset') offset: number, @Query('size') size: number): Promise<label[]> {
    offset = offset || 0;
    size = size || 10;
    return this.labelService.findAll(offset, size);
  }
}
