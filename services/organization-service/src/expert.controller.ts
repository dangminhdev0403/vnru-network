import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { parseExpertQuery } from './expert-query';
import { ExpertService } from './expert.service';

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
}
