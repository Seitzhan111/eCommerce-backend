import { IsNotEmpty, IsNumber, IsObject, IsPositive } from "class-validator";
import { Product } from "../../products/models/product.model";

export class CreateOrderDetailDto {
  @IsObject()
  @IsNotEmpty()
  product: Product;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  totalPrice: number;
}