export interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  sector: string;
}

export interface LiquidationEvent {
  id: string;
  ticker: string;
  quantity: number;
  price: number;
  date: string;
  status: 'Pending' | 'Liquidated' | 'T+1' | 'T+2';
  type: 'Buy' | 'Sell';
}

export const MOCK_STOCKS: Stock[] = [
  { ticker: 'PETR4', name: 'Petrobras PN', price: 38.45, change: 0.52, changePercent: 1.37, volume: '1.2B', marketCap: '512B', sector: 'Energy' },
  { ticker: 'VALE3', name: 'Vale ON', price: 62.10, change: -1.20, changePercent: -1.89, volume: '980M', marketCap: '280B', sector: 'Mining' },
  { ticker: 'ITUB4', name: 'Itaú Unibanco PN', price: 34.15, change: 0.15, changePercent: 0.44, volume: '450M', marketCap: '310B', sector: 'Finance' },
  { ticker: 'BBDC4', name: 'Bradesco PN', price: 14.20, change: -0.05, changePercent: -0.35, volume: '320M', marketCap: '150B', sector: 'Finance' },
  { ticker: 'ABEV3', name: 'Ambev ON', price: 12.80, change: 0.10, changePercent: 0.79, volume: '210M', marketCap: '200B', sector: 'Consumer' },
  { ticker: 'WEGE3', name: 'Weg ON', price: 39.50, change: 0.85, changePercent: 2.20, volume: '150M', marketCap: '165B', sector: 'Industrial' },
  { ticker: 'MGLU3', name: 'Magalu ON', price: 1.95, change: -0.02, changePercent: -1.02, volume: '500M', marketCap: '13B', sector: 'Retail' },
];

export const MOCK_LIQUIDATIONS: LiquidationEvent[] = [
  { id: '1', ticker: 'PETR4', quantity: 100, price: 38.00, date: '2024-03-01', status: 'Liquidated', type: 'Buy' },
  { id: '2', ticker: 'VALE3', quantity: 50, price: 63.50, date: '2024-03-02', status: 'T+1', type: 'Sell' },
  { id: '3', ticker: 'ITUB4', quantity: 200, price: 33.90, date: '2024-03-03', status: 'Pending', type: 'Buy' },
];
