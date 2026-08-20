import { BadRequestException, Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { parseExpertQuery } from './expert-query';
import { ExpertService } from './expert.service';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NOT_FOUND = { error: { code: 'NOT_FOUND', message: 'Expert not found' } };

@Controller('api/v1/experts')
export class ExpertController {
  constructor(private readonly service: ExpertService) {}

  @Get()
  async list(@Query() raw: Record<string, unknown>) {
    let query;
    try {
      query = parseExpertQuery({ ...raw });
    } catch {
      throw new BadRequestException({ error: { code: 'INVALID_QUERY', message: 'Invalid request query' } });
    }
    return await this.service.list(query);
  }

  @Get(':id/matches')
  async getMatches(@Param('id') id: string, @Query('limit') limitRaw?: string) {
    if (!uuidRegex.test(id)) throw new NotFoundException(NOT_FOUND);
    let limit = 20;
    if (limitRaw !== undefined) {
      const n = Number.parseInt(limitRaw, 10);
      if (!/^\d+$/.test(limitRaw) || n < 1 || n > 50) {
        throw new BadRequestException({ error: { code: 'INVALID_QUERY', message: 'Limit must be an integer between 1 and 50' } });
      }
      limit = n;
    }
    const result = await this.service.findMatches(id, limit);
    if (!result) throw new NotFoundException(NOT_FOUND);
    return result;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    if (!uuidRegex.test(id)) throw new NotFoundException(NOT_FOUND);
    const expert = await this.service.findById(id);
    if (!expert) throw new NotFoundException(NOT_FOUND);
    return expert;
  }
}
