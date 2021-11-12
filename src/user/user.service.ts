import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private users: Model<UserDocument>) {}
}
