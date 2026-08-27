import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { validateConfig } from '../../config';
import { DatabaseClient, DatabaseModule } from '../../database/database.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AdminNewsController, PublicNewsController } from './news.controller';
import { NewsMediaService } from './news-media.service';
import { NEWS_PRISMA, NewsService } from './news.service';

@Module({
  imports: [
    DatabaseModule,
    AuthenticationModule,
    CloudinaryModule.forRoot({
      isGlobal: false,
      cloudName: validateConfig().CLOUDINARY_CLOUD_NAME,
      apiKey: validateConfig().CLOUDINARY_API_KEY,
      apiSecret: validateConfig().CLOUDINARY_API_SECRET,
    }),
  ],
  controllers: [PublicNewsController, AdminNewsController],
  providers: [
    { provide: NEWS_PRISMA, useExisting: DatabaseClient },
    NewsService,
    NewsMediaService,
  ],
})
export class NewsModule {}
