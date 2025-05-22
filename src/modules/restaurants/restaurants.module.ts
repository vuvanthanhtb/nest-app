import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './schema/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Restaurant.name,
      schema: RestaurantSchema
    }])
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})

export class RestaurantsModule { }
