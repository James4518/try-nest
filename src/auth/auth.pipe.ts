import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema  } from 'zod';

export class ValidationUserPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error.errors[0].message ==='Required'){
        throw new BadRequestException(`${error.errors[0].path[0]} is Required!`);
      } 
      throw new BadRequestException(error.errors[0].message)
    }
  }
}