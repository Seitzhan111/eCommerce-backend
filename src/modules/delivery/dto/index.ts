import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateDeliveryDto {
  @IsString({ message: 'Адрес доставки должен быть строкой' })
  @IsNotEmpty({ message: 'Адрес доставки не должен быть пустым' })
  deliveryAddress: string;

  @IsString({ message: 'Полное имя получателя должно быть строкой' })
  @IsNotEmpty({ message: 'Полное имя получателя не должно быть пустым' })
  recipientFullName: string;

  @IsString({ message: 'Номер телефона получателя должен быть строкой' })
  @IsNotEmpty({ message: 'Номер телефона получателя не должен быть пустым' })
  recipientPhoneNumber: string;

  @IsString({ message: 'Метод оплаты должен быть строкой' })
  @IsNotEmpty({ message: 'Метод оплаты не должен быть пустым' })
  paymentMethod: string;

  @IsNumber({}, { message: 'Идентификатор заказа должен быть числом' })
  @IsNotEmpty({ message: 'Идентификатор заказа не должен быть пустым' })
  orderId: number;

  @IsNumber({}, { message: 'Идентификатор пользователя должен быть числом' })
  @IsNotEmpty({ message: 'Идентификатор пользователя не должен быть пустым' })
  userId: number;
}