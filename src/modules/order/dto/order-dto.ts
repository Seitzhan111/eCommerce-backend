import { IsEnum, IsArray, IsOptional, IsNumber } from "class-validator";
import { CreateDeliveryDto } from "./delivery-dto";
import { Orders_status } from "../models/order.model";
import { CreateOrderDetailDto } from "./order-detail.dto";

export class CreateOrderDto {
  @IsEnum(Orders_status)
  @IsOptional()
  status?: Orders_status;

  @IsArray()
  @IsOptional()
  orderDetails?: CreateOrderDetailDto[];

  @IsOptional()
  delivery?: CreateDeliveryDto;

  @IsOptional()
  @IsNumber()
  userId: number;
}