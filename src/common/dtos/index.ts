import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { Order } from "../constants";

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly pageSize?: number = 5;


 

  @Type(()=> String)
  readonly search?: string;
}