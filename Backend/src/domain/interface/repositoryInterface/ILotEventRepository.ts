import { LotEvent } from '../../entities/LotEvent';

export interface ILotEventRepository {
  create(event: LotEvent): Promise<LotEvent>;
  createMany(events: LotEvent[]): Promise<LotEvent[]>;
  findByLotId(lotId: string): Promise<LotEvent[]>;
}
