import { Module } from '@nestjs/common';
import { PublicationsModule } from './modules/publications/publications.module';
import { DirectoryModule } from './modules/directory/directory.module';

@Module({ imports: [PublicationsModule, DirectoryModule] })
export class AppModule {}
