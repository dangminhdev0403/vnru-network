import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { parsePublicationQuery } from './publication-query';
import { PublicationService } from './publication.service';

@Controller('api/v1/publications')
export class PublicationController {
  constructor(private readonly service: PublicationService) {}
  @Get()
  async list(@Query() raw: Record<string, unknown>) {
    let query;
    try {
      query = parsePublicationQuery({ ...raw });
    } catch {
      throw new BadRequestException({ error: { code: 'INVALID_QUERY', message: 'Invalid request query' } });
    }
    return await this.service.list(query);
  }
}
