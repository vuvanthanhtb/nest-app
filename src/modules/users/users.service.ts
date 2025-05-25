import { BadRequestException, Injectable } from '@nestjs/common';
import { hashPasswordHelper } from '@/helpers/utils';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  hasEmailExist = async (email: string) => {
    const hasExist = await this.userModel.exists({ email });
    return !!hasExist;
  };

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;

    const hasEmail = await this.hasEmailExist(email);
    if (hasEmail) {
      throw new BadRequestException(
        `Email: ${email} đã tồn tại. Vui lòng sử dụng email khác.`,
      );
    }

    const hashPassword = await hashPasswordHelper(password);
    const newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      image,
    });

    return {
      _id: newUser._id,
    };
  }

  async findAll(query: string, pageIndex: number, pageSize: number) {
    const { filter = {}, sort } = aqp(query);

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (pageIndex - 1) * pageSize;

    const result = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as { [key: string]: 1 | -1 });

    return {
      data: result,
      totalPages,
      totalItems,
      pageSize,
      pageIndex,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id}`;
  }

  async update(updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne(
      {
        _id: updateUserDto._id,
      },
      { ...updateUserDto },
    );
  }

  async remove(_id: string) {
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('_id không hợp lệ');
    }

    return await this.userModel.deleteOne({ _id });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async handleRegister(createAuthDto: CreateAuthDto) {
    const { name, email, password } = createAuthDto;

    const hasEmail = await this.hasEmailExist(email);
    if (hasEmail) {
      throw new BadRequestException(
        `Email: ${email} đã tồn tại. Vui lòng sử dụng email khác.`,
      );
    }

    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const newUser = await this.userModel.create({
      name,
      email,
      codeId,
      codeExpired: dayjs().add(1, 'day').toDate(),
      password: hashPassword,
    });

    this.mailerService
      .sendMail({
        to: newUser.email,
        subject: 'Xác thực tài khoản',
        template: 'register.hbs',
        context: {
          activationCode: codeId,
          name: newUser?.name || newUser.email,
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });

    return {
      _id: newUser._id,
    };
  }
}
