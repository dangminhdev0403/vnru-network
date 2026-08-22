import { BadRequestException, Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { parsePublicationQuery } from './publication-query';
import { PublicationService } from './publication.service';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  @Get(':id')
  async detail(@Param('id') id: string) {
    if (!UUID_RE.test(id)) throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Publication not found' } });
    const result = await this.service.findOne(id);
    if (!result) throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Publication not found' } });
    return result;
  }
}
