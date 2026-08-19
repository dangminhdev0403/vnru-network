import { BadRequestException } from '@nestjs/common';
import { ExpertController } from './expert.controller';
describe('ExpertController',()=>{ it('returns approved envelope',async()=>{const s={list:jest.fn().mockResolvedValue({items:[],nextCursor:null})};const query=Object.assign(Object.create(null),{limit:'1'});await expect(new ExpertController(s as never).list(query)).resolves.toEqual({items:[],nextCursor:null});}); it('maps invalid query',async()=>{const c=new ExpertController({list:jest.fn()} as never); await expect(c.list({limit:'51'})).rejects.toBeInstanceOf(BadRequestException);});});
