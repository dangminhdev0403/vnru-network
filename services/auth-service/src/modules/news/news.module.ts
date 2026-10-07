import { Module } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { validateConfig } from '../../config';
import { DatabaseClient, DatabaseModule } from '../../database/database.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AdminNewsController, PublicNewsController } from './news.controller';
import { NEWS_MEDIA_BUCKET, NewsMediaService } from './news-media.service';
import { NEWS_PRISMA, NewsService } from './news.service';

@Module({
  imports: [DatabaseModule, AuthenticationModule],
  controllers: [PublicNewsController, AdminNewsController],
  providers: [
    { provide: NEWS_PRISMA, useExisting: DatabaseClient },
    {
      provide: NEWS_MEDIA_BUCKET,
      useFactory: () => {
        const config = validateConfig();
        return new Storage({
          projectId: config.GOOGLE_CLOUD_PROJECT,
          userAgent: 'gcs-skills/1.0 (skill:google-cloud-storage-basics)',
        }).bucket(config.GCS_BUCKET);
      },
    },
    NewsService,
    NewsMediaService,
  ],
})
export class NewsModule {}
