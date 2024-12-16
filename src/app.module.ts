import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './typeorm/entities/User';
import { Post } from './typeorm/entities/Post';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Load .env globally
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', // Replace with your database type
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10), // Ensure correct type conversion
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Post],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    PostModule, // Import PostModule
  ],
  // controllers: [AppController], // Only AppController here
  providers: [AppService], // Only AppService here
})
export class AppModule {}
