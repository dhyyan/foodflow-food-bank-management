export const LOT_STATUS = {
  RECEIVED: 'received',
  CHECKED: 'checked',
  SHELVED: 'shelved',
  RESERVED: 'reserved',
  RELEASED: 'released',
  QUARANTINED: 'quarantined',
  DISCARDED: 'discarded'
} as const;

export type LotStatusType = typeof LOT_STATUS[keyof typeof LOT_STATUS];

export const LOT_STATUS_LABELS: Record<LotStatusType, string> = {
  [LOT_STATUS.RECEIVED]: 'Received',
  [LOT_STATUS.CHECKED]: 'Checked',
  [LOT_STATUS.SHELVED]: 'Shelved',
  [LOT_STATUS.RESERVED]: 'Reserved',
  [LOT_STATUS.RELEASED]: 'Released',
  [LOT_STATUS.QUARANTINED]: 'Quarantined',
  [LOT_STATUS.DISCARDED]: 'Discarded'
};
