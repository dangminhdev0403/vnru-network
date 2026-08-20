import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExpertController } from './expert.controller';

describe('ExpertController', () => {
  it('returns approved envelope', async () => {
    const s = { list: jest.fn().mockResolvedValue({ items: [], nextCursor: null }) };
    const query = Object.assign(Object.create(null), { limit: '1' });
    await expect(new ExpertController(s as never).list(query)).resolves.toEqual({ items: [], nextCursor: null });
  });

  it('maps invalid query', async () => {
    const c = new ExpertController({ list: jest.fn() } as never);
    await expect(c.list({ limit: '51' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('getById returns expert', async () => {
    const expert = { id: '11111111-1111-4111-8111-111111111111', displayName: 'A' };
    const s = { findById: jest.fn().mockResolvedValue(expert) };
    await expect(new ExpertController(s as never).getById('11111111-1111-4111-8111-111111111111')).resolves.toEqual(expert);
  });

  it('getById 404 for non-uuid', async () => {
    const c = new ExpertController({} as never);
    await expect(c.getById('not-a-uuid')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('getById 404 for missing', async () => {
    const s = { findById: jest.fn().mockResolvedValue(null) };
    await expect(new ExpertController(s as never).getById('11111111-1111-4111-8111-111111111111')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('getMatches returns result', async () => {
    const result = { items: [] };
    const s = { findMatches: jest.fn().mockResolvedValue(result) };
    await expect(new ExpertController(s as never).getMatches('11111111-1111-4111-8111-111111111111')).resolves.toEqual(result);
  });

  it('getMatches 404 for missing expert', async () => {
    const s = { findMatches: jest.fn().mockResolvedValue(null) };
    await expect(new ExpertController(s as never).getMatches('11111111-1111-4111-8111-111111111111')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('getMatches 404 for non-uuid', async () => {
    await expect(new ExpertController({} as never).getMatches('bad')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('getMatches rejects invalid limit', async () => {
    await expect(new ExpertController({} as never).getMatches('11111111-1111-4111-8111-111111111111', '0')).rejects.toBeInstanceOf(BadRequestException);
    await expect(new ExpertController({} as never).getMatches('11111111-1111-4111-8111-111111111111', '51')).rejects.toBeInstanceOf(BadRequestException);
    await expect(new ExpertController({} as never).getMatches('11111111-1111-4111-8111-111111111111', 'abc')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('getMatches passes parsed limit to service', async () => {
    const s = { findMatches: jest.fn().mockResolvedValue({ items: [] }) };
    await new ExpertController(s as never).getMatches('11111111-1111-4111-8111-111111111111', '5');
    expect(s.findMatches).toHaveBeenCalledWith('11111111-1111-4111-8111-111111111111', 5);
  });
});
