export const PRODUCTION_TYPES = ["Sample Yardage", "SMS", "Bulk"] as const;
export type ProductionType = (typeof PRODUCTION_TYPES)[number];

export const STOCK_TYPES = ["IN", "OUT"] as const;
export type StockType = (typeof STOCK_TYPES)[number];
