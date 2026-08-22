import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Public, RequireCapability } from './auth.guard';
import { GrantService } from './grant.service';
import { parseOpportunityQuery } from './opportunity-query';

@Controller('api/v1/grants')
@UseGuards(AuthGuard)
export class GrantController {
  constructor(private readonly service: GrantService) {}

  @Get('opportunities')
  @Public()
  async listOpportunities(@Query() raw: Record<string, unknown>) {
    let query;
    try {
      query = parseOpportunityQuery({ ...raw });
    } catch (err: any) {
      throw new BadRequestException({
        error: { code: 'INVALID_QUERY', message: err?.message || 'Invalid query parameters' },
      });
    }
    return await this.service.listOpportunities(query);
  }

  @Post('opportunities')
  @RequireCapability('grants.opportunities.create')
  async createOpportunity(@Req() req: any, @Body() body: any) {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException({ error: { code: 'INVALID_BODY', message: 'Request body must be an object' } });
    }
    return await this.service.createOpportunity(req.user, {
      id: body.id,
      title: body.title,
      description: body.description,
      fundingProgramRef: body.fundingProgramRef,
    });
  }

  @Post('opportunities/:id/publish')
  @HttpCode(200)
  @RequireCapability('grants.opportunities.publish')
  async publishOpportunity(@Req() req: any, @Param('id') id: string) {
    return await this.service.publishOpportunity(req.user, id);
  }

  @Post('opportunities/:id/close')
  @HttpCode(200)
  @RequireCapability('grants.opportunities.publish')
  async closeOpportunity(@Req() req: any, @Param('id') id: string) {
    return await this.service.closeOpportunity(req.user, id);
  }

  @Post('proposals')
  @RequireCapability('grants.proposals.create')
  async createProposal(@Req() req: any, @Body() body: any) {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException({ error: { code: 'INVALID_BODY', message: 'Request body must be an object' } });
    }
    return await this.service.createProposal(req.user, {
      id: body.id,
      opportunityId: body.opportunityId,
      content: body.content,
      vnParticipant: body.vnParticipant,
      ruParticipant: body.ruParticipant,
    });
  }

  @Get('proposals/:id')
  async getProposal(@Req() req: any, @Param('id') id: string) {
    return await this.service.getProposal(req.user, id);
  }

  @Put('proposals/:id')
  @RequireCapability('grants.proposals.create')
  async reviseProposal(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException({ error: { code: 'INVALID_BODY', message: 'Request body must be an object' } });
    }
    return await this.service.reviseProposal(req.user, id, {
      content: body.content,
      expectedRevision: body.expectedRevision,
    });
  }

  @Post('proposals/:id/confirm')
  @HttpCode(200)
  @RequireCapability('grants.proposals.confirm_paired')
  async confirmProposal(@Req() req: any, @Param('id') id: string) {
    return await this.service.confirmProposal(req.user, id);
  }

  @Post('proposals/:id/endorse')
  @HttpCode(200)
  @RequireCapability('grants.proposals.endorse')
  async endorseProposal(@Req() req: any, @Param('id') id: string) {
    return await this.service.endorseProposal(req.user, id);
  }

  @Post('proposals/:id/submit')
  @HttpCode(200)
  @RequireCapability('grants.proposals.submit')
  async submitProposal(@Req() req: any, @Param('id') id: string) {
    return await this.service.submitProposal(req.user, id);
  }

  @Post('proposals/:id/screen')
  @HttpCode(200)
  @RequireCapability('grants.proposals.screen')
  async screenProposal(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException({ error: { code: 'INVALID_BODY', message: 'Request body must be an object' } });
    }
    return await this.service.screenProposal(req.user, id, {
      eligible: body.eligible,
      reason: body.reason,
    });
  }

  @Post('proposals/:id/decision')
  @HttpCode(200)
  @RequireCapability('grants.decisions.issue_foundation')
  async decisionProposal(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException({ error: { code: 'INVALID_BODY', message: 'Request body must be an object' } });
    }
    return await this.service.decisionProposal(req.user, id, {
      approved: body.approved,
      reason: body.reason,
      requestRevision: body.requestRevision,
    });
  }
}
