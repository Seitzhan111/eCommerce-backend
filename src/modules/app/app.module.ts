import {Module} from '@nestjs/common';
import {UsersModule} from "../users/users.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import configurations from "../../configurations/configuratins";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/models/user.model";
import { AuthModule } from "../auth/auth.module";
import { TokenModule } from "../token/token.module";
import { ResetPasswordController } from "../../reset-password/reset-password.controller";
import { ResetPasswordService } from "../../reset-password/reset-password.service";
import { MailerModule } from "../mail/mail.module";
import { ResetPasswordModule } from "../../reset-password/reset-password.module";
import {JwtStrategy} from "../../strategy/jwt.strategy";
import {FacebookStrategy} from "../../strategy/facebook .strategy";
import {VkStrategy} from "../../strategy/vk.strategy";
import {GoogleStrategy} from "../../strategy/google.strategy";
import {CategoryModule} from "../category/category.module";
import {Category} from "../category/models/category.model";
import {Product} from "../products/models/product.model";
import {ProductsModule} from "../products/products.module";
import {Role} from "../roles/models/roles.model";
import {RolesModule} from "../roles/roles.module";
import {UserRoles} from "../roles/models/user-roles.model";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { Order } from "../order/models/order.model";
import { OrderDetail } from "../order-detail/models/order-detail.model";
import { OrderModule } from "../order/order.module";
import { Payment } from "../payment/models/payment.model";
import { PaymentModule } from "../payment/payment.module";
import { Delivery } from "../delivery/models/delivery.model";
import { DeliveryModule } from "../delivery/delivery.module";
import { OrderDetailModule } from "../order-detail/order-detail.module";
import { Blog } from "../blogs/models/blog.model";
import { BlogsModule } from "../blogs/blogs.module";

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    load: [configurations]
  }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('db_host'),
        port: configService.get('db_port'),
        username: configService.get('db_user'),
        password: configService.get('db_password'),
        database: configService.get('db_name'),
        synchronize: true,
        autoLoadModels: true,
        models: [User, Category, Product, Role, UserRoles, Order, OrderDetail, Payment, Delivery, Blog],
      })
    }),
    UsersModule,
    AuthModule,
    TokenModule,
    MailerModule,
    ResetPasswordModule,
    CategoryModule,
    ProductsModule,
    RolesModule,
    CloudinaryModule,
    OrderModule,
    PaymentModule,
    DeliveryModule,
    OrderDetailModule,
    BlogsModule
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService, JwtStrategy, FacebookStrategy, VkStrategy, GoogleStrategy],
})
export class AppModule {}
