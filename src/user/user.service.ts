import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private users: Model<UserDocument>) {}

  async create(username: string, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new this.users({
      username,
      password: hashedPassword,
    });

    return user.save();
  }

  async findOneById(id: string) {
    return this.users.findById(id);
  }

  async findOneByUsername(username: string) {
    return this.users.findOne({
      username,
    });
  }
}
