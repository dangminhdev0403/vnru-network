import { BadRequestException } from '@nestjs/common';
import { PublicationController } from './publication.controller';

describe('PublicationController', () => {
  it('returns the approved envelope', async () => {
    const service = { list: jest.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const query = Object.assign(Object.create(null), { limit: '1' });
    await expect(new PublicationController(service as never).list(query)).resolves.toEqual({ items: [], nextCursor: null });
  });
  it('maps invalid queries to INVALID_QUERY', async () => {
    const controller = new PublicationController({ list: jest.fn() } as never);
    await expect(controller.list({ limit: '51' })).rejects.toMatchObject<BadRequestException>({ response: { error: { code: 'INVALID_QUERY', message: 'Invalid request query' } } });
  });
});
