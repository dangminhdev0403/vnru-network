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
import {
  createOpportunitySchema,
  createProposalSchema,
  decisionProposalSchema,
  parseBody,
  reviseProposalSchema,
  screenProposalSchema,
} from './validation';

@Controller('api/v1/collab')
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
  @RequireCapability('collab.opportunities.create')
  async createOpportunity(@Req() req: any, @Body() body: any) {
    return await this.service.createOpportunity(req.user, parseBody(createOpportunitySchema, body));
  }

  @Post('opportunities/:id/publish')
  @HttpCode(200)
  @RequireCapability('collab.opportunities.publish')
  async publishOpportunity(@Req() req: any, @Param('id') id: string) {
    return await this.service.publishOpportunity(req.user, id);
  }

  @Post('opportunities/:id/close')
  @HttpCode(200)
  @RequireCapability('collab.opportunities.publish')
  async closeOpportunity(@Req() req: any, @Param('id') id: string) {
    return await this.service.closeOpportunity(req.user, id);
  }

  @Post('proposals')
  @RequireCapability('collab.proposals.create')
  async createProposal(@Req() req: any, @Body() body: any) {
    return await this.service.createProposal(req.user, parseBody(createProposalSchema, body));
  }

  @Get('proposals/:id')
  async getProposal(@Req() req: any, @Param('id') id: string) {
    return await this.service.getProposal(req.user, id);
  }

  @Put('proposals/:id')
  @RequireCapability('collab.proposals.create')
  async reviseProposal(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return await this.service.reviseProposal(req.user, id, parseBody(reviseProposalSchema, body));
  }

  @Post('proposals/:id/confirm')
  @HttpCode(200)
  @RequireCapability('collab.proposals.confirm_paired')
  async confirmProposal(@Req() req: any, @Param('id') id: string) {
    return await this.service.confirmProposal(req.user, id);
  }

  @Post('proposals/:id/endorse')
  @HttpCode(200)
  @RequireCapability('collab.proposals.endorse')
  async endorseProposal(@Req() req: any, @Param('id') id: string) {
    return await this.service.endorseProposal(req.user, id);
  }

  @Post('proposals/:id/submit')
  @HttpCode(200)
  @RequireCapability('collab.proposals.submit')
  async submitProposal(@Req() req: any, @Param('id') id: string) {
    return await this.service.submitProposal(req.user, id);
  }

  @Post('proposals/:id/screen')
  @HttpCode(200)
  @RequireCapability('collab.proposals.screen')
  async screenProposal(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return await this.service.screenProposal(req.user, id, parseBody(screenProposalSchema, body));
  }

  @Post('proposals/:id/decision')
  @HttpCode(200)
  @RequireCapability('collab.decisions.issue_foundation')
  async decisionProposal(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return await this.service.decisionProposal(req.user, id, parseBody(decisionProposalSchema, body));
  }
}
