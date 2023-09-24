import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductController } from "./products.controllers";
@Module({
   controllers:[ProductController],
   providers:[ProductsService]
})
export class ProductsModule{}
