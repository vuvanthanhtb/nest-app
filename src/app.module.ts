import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '@/modules/users/users.module';
import { LikesModule } from '@/modules/likes/likes.module';
import { ReviewsModule } from '@/modules/reviews/reviews.module';
import { RestaurantsModule } from '@/modules/restaurants/restaurants.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { OrderDetailModule } from '@/modules/order.detail/order.detail.module';
import { MenusModule } from '@/modules/menus/menus.module';
import { MenuItemsModule } from '@/modules/menu.items/menu.items.module';
import { MenuItemOptionsModule } from '@/modules/menu.item.options/menu.item.options.module';
import { AuthModule } from '@/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    LikesModule,
    ReviewsModule,
    RestaurantsModule,
    OrdersModule,
    OrderDetailModule,
    MenusModule,
    MenuItemsModule,
    MenuItemOptionsModule,
    AuthModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          // ignoreTLS: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
