import { MenuItemOption } from '@/modules/menu.item.options/schema/menu.item.option.schema';
import { MenuItem } from '@/modules/menu.items/schema/menu.item.schema';
import { Menu } from '@/modules/menus/schema/menu.schema';
import { Order } from '@/modules/orders/schema/order.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDetailDocument = HydratedDocument<OrderDetail>;

@Schema({ timestamps: true })
export class OrderDetail {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Order.name })
  order: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Menu.name })
  menu: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MenuItem.name })
  menuItem: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MenuItemOption.name })
  menuItemOption: mongoose.Schema.Types.ObjectId;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
