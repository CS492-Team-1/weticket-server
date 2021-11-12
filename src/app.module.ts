import * as Joi from 'joi';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { JwtModule } from './jwt/jwt.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_CONNECTION_STRING: Joi.string().required(),
        JWT_PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/schema.gql',
      installSubscriptionHandlers: true,
      context: ({ req, connection }) => {
        const authorization: string | null =
          req?.headers?.authorization ||
          connection?.context?.Authorization ||
          null;

        if (authorization) {
          const token = authorization.replace('Bearer ', '');

          return {
            token,
          };
        }
      },
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION_STRING),
    JwtModule.forRoot({
      privateKey: process.env.JWT_PRIVATE_KEY,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    CommonModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
