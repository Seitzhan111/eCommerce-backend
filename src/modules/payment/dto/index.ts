import { IsNumber, IsString, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber({}, { message: 'Сумма должна быть числом' })
  @IsNotEmpty({ message: 'Сумма обязательна' })
  amount: number;

  @IsString({ message: 'Идентификатор транзакции должен быть строкой' })
  @IsNotEmpty({ message: 'Идентификатор транзакции обязателен' })
  transactionId: string;

  @IsEnum(['success', 'failure'], { message: 'Статус должен быть либо success, либо failure' })
  @IsNotEmpty({ message: 'Статус обязателен' })
  status: string;

  @IsDateString({}, { message: 'Неверный формат даты для даты платежа' })
  @IsNotEmpty({ message: 'Дата платежа обязательна' })
  paymentDate: Date;

  @IsNumber({}, { message: 'Идентификатор заказа должен быть числом' })
  @IsNotEmpty({ message: 'Идентификатор заказа обязателен' })
  orderId: number;
}