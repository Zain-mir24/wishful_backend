import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductController } from "./products.controllers";
import { product } from "./entities/product.entities";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports:[TypeOrmModule.forFeature([product])],
   controllers:[ProductController],
   providers:[ProductsService]
})
export class ProductsModule{}
