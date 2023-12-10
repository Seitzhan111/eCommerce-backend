import { IsInt, Min, IsNumber, MinLength } from 'class-validator';

export class CreateOrderDetailDto {
  @IsInt({ message: 'Количество должно быть целым числом' })
  @Min(1, { message: 'Количество должно быть не меньше 1' })
  quantity: number;

  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена должна быть не меньше 0' })
  price: number;

  @IsInt({ message: 'orderId должен быть целым числом' })
  @Min(1, { message: 'orderId должен быть не меньше 1' })
  orderId: number;

  @IsInt({ message: 'productId должен быть целым числом' })
  @Min(1, { message: 'productId должен быть не меньше 1' })
  productId: number;

  @IsInt({ message: 'userId должен быть целым числом' })
  @Min(1, { message: 'userId должен быть не меньше 1' })
  userId: number;
}