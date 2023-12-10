import { IsEnum, IsArray, IsOptional, IsNotEmpty } from "class-validator";
import { CreateDeliveryDto } from "../../delivery/dto";
import { Orders_status } from "../models/order.model";
import { CreateOrderDetailDto } from "../../order-detail/dto/order-detail.dto";

export class CreateOrderDto {
  @IsEnum(Orders_status)
  @IsNotEmpty()
  status: Orders_status;

  @IsArray()
  orderDetails: CreateOrderDetailDto[];

  @IsOptional()
  delivery: CreateDeliveryDto;
}