import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PublicationController } from './publication.controller';

describe('PublicationController', () => {
  it('returns the approved envelope', async () => {
    const service = { list: jest.fn().mockResolvedValue({ items: [], nextCursor: null }), findOne: jest.fn() };
    const query = Object.assign(Object.create(null), { limit: '1' });
    await expect(new PublicationController(service as never).list(query)).resolves.toEqual({ items: [], nextCursor: null });
  });
  it('maps invalid queries to INVALID_QUERY', async () => {
    const controller = new PublicationController({ list: jest.fn(), findOne: jest.fn() } as never);
    await expect(controller.list({ limit: '51' })).rejects.toMatchObject<BadRequestException>({ response: { error: { code: 'INVALID_QUERY', message: 'Invalid request query' } } });
  });
  it('returns detail for a PUBLIC publication', async () => {
    const detail = { id: '11111111-1111-4111-8111-111111111111', title: 'T', visibility: 'PUBLIC' };
    const service = { list: jest.fn(), findOne: jest.fn().mockResolvedValue(detail) };
    const result = await new PublicationController(service as never).detail('11111111-1111-4111-8111-111111111111');
    expect(result).toEqual(detail);
    expect(service.findOne).toHaveBeenCalledWith('11111111-1111-4111-8111-111111111111');
  });
  it('returns 404 for non-UUID id', async () => {
    const controller = new PublicationController({ list: jest.fn(), findOne: jest.fn() } as never);
    await expect(controller.detail('not-a-uuid')).rejects.toBeInstanceOf(NotFoundException);
  });
  it('returns 404 when service returns null (missing or PRIVATE)', async () => {
    const service = { list: jest.fn(), findOne: jest.fn().mockResolvedValue(null) };
    await expect(new PublicationController(service as never).detail('11111111-1111-4111-8111-111111111111')).rejects.toBeInstanceOf(NotFoundException);
  });
});
