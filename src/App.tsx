/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  BarChart3, 
  Wallet, 
  Clock, 
  LayoutDashboard,
  Menu,
  X,
  RefreshCw,
  Globe,
  Layers,
  Activity
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_LIQUIDATIONS } from './data';

const chartDataMock = [
  { time: '10:00', price: 125000 },
  { time: '11:00', price: 125500 },
  { time: '12:00', price: 124800 },
  { time: '13:00', price: 126200 },
  { time: '14:00', price: 125900 },
  { time: '15:00', price: 127100 },
  { time: '16:00', price: 126800 },
  { time: '17:00', price: 127500 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio' | 'liquidation' | 'indices' | 'derivativos' | 'outros'>('market');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [stocks, setStocks] = useState<any[]>([]);
  const [indices, setIndices] = useState<any[]>([]);
  const [fiis, setFiis] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>(chartDataMock);
  const [timeRange, setTimeRange] = useState('1D');
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchChartData = async (range: string) => {
    setIsChartLoading(true);
    try {
      const res = await fetch(`/api/b3/chart/${range}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setChartData(data);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setIsChartLoading(false);
    }
  };

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const [stocksRes, indicesRes, fiisRes] = await Promise.all([
        fetch('/api/b3/quotes'),
        fetch('/api/b3/indices'),
        fetch('/api/b3/fiis')
      ]);
      const stocksData = await stocksRes.json();
      const indicesData = await indicesRes.json();
      const fiisData = await fiisRes.json();
      
      setStocks(stocksData.stocks || []);
      setIndices(indicesData.stocks || []);
      setFiis(fiisData.stocks || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching market data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    fetchChartData(timeRange);
    const interval = setInterval(fetchMarketData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchChartData(timeRange);
  }, [timeRange]);

  const filteredStocks = useMemo(() => {
    return stocks.filter(s => 
      s.stock.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stocks, searchQuery]);

  const SidebarItem = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        activeTab === id 
          ? 'bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500' 
          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={20} />
      {isSidebarOpen && <span className="font-medium">{label}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="border-r border-zinc-800 bg-[#0f0f0f] flex flex-col"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
            <BarChart3 size={20} className="text-black" />
          </div>
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tighter">B3 TERMINAL</h1>}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <SidebarItem id="market" icon={LayoutDashboard} label="Ações" />
          <SidebarItem id="indices" icon={Globe} label="Índices" />
          <SidebarItem id="derivativos" icon={Activity} label="Derivativos" />
          <SidebarItem id="outros" icon={Layers} label="Outros Ativos" />
          <SidebarItem id="portfolio" icon={Wallet} label="Carteira" />
          <SidebarItem id="liquidation" icon={Clock} label="Liquidação" />
        </nav>

        <div className="p-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full py-2 flex justify-center text-zinc-500 hover:text-white"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Buscar ativos (ex: PETR4, VALE3)..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Live</span>
              {lastUpdated && (
                <span className="text-[10px] text-zinc-500 ml-1">
                  {lastUpdated.toLocaleTimeString('pt-BR')}
                </span>
              )}
            </div>
            <button 
              onClick={fetchMarketData}
              className={`p-2 hover:bg-white/5 rounded-full transition-all ${isLoading ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={18} className="text-zinc-500" />
            </button>
            <div className="text-right">
              <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">IBOVESPA</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-bold">
                  {indices.find(i => i.stock === '^BVSP')?.close?.toLocaleString('pt-BR') || '127.500'}
                </span>
                <span className={`text-xs flex items-center font-bold ${
                  (indices.find(i => i.stock === '^BVSP')?.change || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {(indices.find(i => i.stock === '^BVSP')?.change || 0) >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {indices.find(i => i.stock === '^BVSP')?.change?.toFixed(2) || '+1.24'}%
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'market' && (
              <motion.div 
                key="market"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Hero Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">
                        Desempenho {timeRange === '1D' ? 'Intraday' : timeRange === '1W' ? 'Semanal' : timeRange === '1M' ? 'Mensal' : 'Anual'} - IBOV
                      </h3>
                      <div className="flex gap-2">
                        {['1D', '1W', '1M', '1Y'].map(t => (
                          <button 
                            key={t} 
                            onClick={() => setTimeRange(t)}
                            className={`px-3 py-1 text-xs rounded-md transition-all ${t === timeRange ? 'bg-emerald-500 text-black font-bold' : 'hover:bg-white/5 text-zinc-400'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-[300px] relative">
                      {isChartLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/50 z-10 rounded-xl">
                          <RefreshCw size={24} className="text-emerald-500 animate-spin" />
                        </div>
                      )}
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                          <XAxis dataKey="time" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis hide domain={['auto', 'auto']} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                            itemStyle={{ color: '#10b981' }}
                          />
                          <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Resumo do Dia</h3>
                    <div className="space-y-4 flex-1">
                      <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                        <div className="text-xs text-zinc-500 uppercase mb-1">Volume Total</div>
                        <div className="text-2xl font-mono font-bold">R$ 24.8B</div>
                      </div>
                      <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                        <div className="text-xs text-zinc-500 uppercase mb-1">Maiores Altas</div>
                        <div className="space-y-2 mt-2">
                          {stocks.sort((a, b) => b.change - a.change).slice(0, 2).map(s => (
                            <div key={s.stock} className="flex justify-between text-sm">
                              <span>{s.stock}</span>
                              <span className="text-emerald-400">+{s.change.toFixed(2)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                        <div className="text-xs text-zinc-500 uppercase mb-1">Maiores Baixas</div>
                        <div className="space-y-2 mt-2">
                          {stocks.sort((a, b) => a.change - b.change).slice(0, 2).map(s => (
                            <div key={s.stock} className="flex justify-between text-sm">
                              <span>{s.stock}</span>
                              <span className="text-red-400">{s.change.toFixed(2)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stocks Table */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Ações B3 (Real-time)</h3>
                    <span className="text-xs text-zinc-500">Dados oficiais via API</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                          <th className="px-6 py-4 font-semibold">Ativo</th>
                          <th className="px-6 py-4 font-semibold">Preço</th>
                          <th className="px-6 py-4 font-semibold">Var. %</th>
                          <th className="px-6 py-4 font-semibold">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {isLoading ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">Carregando dados da B3...</td>
                          </tr>
                        ) : filteredStocks.map((stock) => (
                          <tr key={stock.stock} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center font-bold text-xs">
                                  {stock.stock.slice(0, 2)}
                                </div>
                                <div>
                                  <div className="font-bold">{stock.stock}</div>
                                  <div className="text-xs text-zinc-500">{stock.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono">R$ {stock.close?.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`flex items-center gap-1 ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {stock.change?.toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-zinc-400">{stock.volume?.toLocaleString('pt-BR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'indices' && (
              <motion.div 
                key="indices"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold tracking-tight">Índices B3</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {indices.map(idx => (
                    <div key={idx.stock} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                      <div className="text-xs text-zinc-500 font-bold uppercase mb-1">{idx.stock}</div>
                      <div className="text-xl font-bold mb-2">{idx.name}</div>
                      <div className="flex items-end justify-between">
                        <div className="text-2xl font-mono font-bold">{idx.close?.toLocaleString('pt-BR')}</div>
                        <div className={`text-sm font-bold ${idx.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {idx.change >= 0 ? '+' : ''}{idx.change?.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'derivativos' && (
              <motion.div 
                key="derivativos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4"
              >
                <Activity size={64} className="text-emerald-500/20" />
                <h2 className="text-2xl font-bold">Derivativos & Futuros</h2>
                <p className="text-zinc-500 max-w-md">
                  Dados de Opções, Futuros de Índice e Dólar estão sendo processados. 
                  Devido à complexidade dos dados de derivativos em tempo real, esta seção requer integração com o feed de dados de baixa latência da B3.
                </p>
                <button className="px-6 py-2 bg-zinc-800 rounded-full text-sm font-bold hover:bg-zinc-700">
                  Solicitar Acesso ao Feed
                </button>
              </motion.div>
            )}

            {activeTab === 'outros' && (
              <motion.div 
                key="outros"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold tracking-tight">Outros Ativos (FIIs)</h2>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                          <th className="px-6 py-4 font-semibold">Fundo</th>
                          <th className="px-6 py-4 font-semibold">Preço</th>
                          <th className="px-6 py-4 font-semibold">Var. %</th>
                          <th className="px-6 py-4 font-semibold">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {fiis.map((fii) => (
                          <tr key={fii.stock} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold">{fii.stock}</div>
                              <div className="text-xs text-zinc-500">{fii.name}</div>
                            </td>
                            <td className="px-6 py-4 font-mono">R$ {fii.close?.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`flex items-center gap-1 ${fii.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {fii.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {fii.change?.toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-zinc-400">{fii.volume?.toLocaleString('pt-BR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'liquidation' && (
              <motion.div 
                key="liquidation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Status de Liquidação</h2>
                    <p className="text-zinc-500">Acompanhamento de ordens e prazos T+2 da B3</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold">A Liquidar</div>
                      <div className="text-xl font-mono font-bold text-amber-400">R$ 12.450,00</div>
                    </div>
                    <div className="text-center px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold">Disponível</div>
                      <div className="text-xl font-mono font-bold text-emerald-400">R$ 4.200,00</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {MOCK_LIQUIDATIONS.map((event) => (
                    <div key={event.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
                      <div className={`absolute top-0 right-0 w-1 h-full ${event.type === 'Buy' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-2xl font-bold">{event.ticker}</div>
                          <div className="text-xs text-zinc-500">{event.date}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          event.status === 'Liquidated' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {event.status}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Quantidade</span>
                          <span>{event.quantity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Preço Exec.</span>
                          <span>R$ {event.price.toFixed(2)}</span>
                        </div>
                        <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                          <span className="text-xs font-bold uppercase text-zinc-500">Total</span>
                          <span className="text-lg font-mono font-bold">R$ {(event.quantity * event.price).toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-400">Lembrete de Liquidação</h4>
                    <p className="text-sm text-zinc-400 mt-1">
                      A B3 opera no regime T+2. Suas compras realizadas hoje estarão disponíveis para retirada ou novas operações de liquidação financeira em 2 dias úteis.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <footer className="mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-600 text-[10px] uppercase tracking-widest pb-8">
            Dados em tempo real via B3 API & brapi.dev • Atualização a cada 30s
          </footer>
        </div>
      </main>
    </div>
  );
}
