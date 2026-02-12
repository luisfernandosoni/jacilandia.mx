
import React, { useState, useEffect } from 'react';
import { ViewContainer, InteractionCard, ScrollReveal, GlassBadge, OptimizedImage, Magnetic, FloatingMonster } from '../components/MotionPrimitives';
import { motion, AnimatePresence } from 'framer-motion';
import { DESIGN_SYSTEM } from '../types';
import { useDataCache } from '../App';

interface Stats {
  kpis: {
    mrr: number;
    revenue_24h: number;
    revenue_7d: number;
    revenue_total: number;
    total_users: number;
    active_subs: number;
    churn_rate: string;
  };
  topDrops: Array<{
    title: string;
    unlocks: number;
  }>;
}

export const AdminView: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error("Acceso denegado o error de servidor.");
        const data = await res.json();
        setStats(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <ViewContainer className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </ViewContainer>
    );
  }

  if (error) {
    return (
      <ViewContainer className="min-h-[60vh] flex items-center justify-center">
        <GlassBadge icon="warning" colorClass="text-red-500">{error}</GlassBadge>
      </ViewContainer>
    );
  }

  const kpiCards = [
    { label: 'MRR', value: `$${stats?.kpis.mrr}`, icon: 'payments', color: 'text-primary' },
    { label: 'Revenue (7d)', value: `$${stats?.kpis.revenue_7d}`, icon: 'trending_up', color: 'text-jaci-green' },
    { label: 'Active Subs', value: stats?.kpis.active_subs, icon: 'star', color: 'text-purple' },
    { label: 'Churn Rate', value: stats?.kpis.churn_rate, icon: 'analytics', color: 'text-pink' },
  ];

  return (
    <div className="w-full min-h-screen pb-24 relative overflow-hidden">
      <div className="absolute top-[5%] left-[5%] opacity-10 rotate-12"><FloatingMonster monster="GULY" size="size-48" /></div>
      
      <ViewContainer className="relative z-10 pt-12">
        <header className="mb-20 px-4">
          <ScrollReveal>
            <GlassBadge icon="monitoring" colorClass="text-primary">Intelligence Cockpit</GlassBadge>
            <h1 className={DESIGN_SYSTEM.typography.h1 + " mt-8"}>Control de <span className="text-primary">Misión</span></h1>
            <p className={DESIGN_SYSTEM.typography.body + " mt-4 max-w-2xl"}>Análisis en tiempo real de la economía de Jacilandia. Métricas críticas y rendimiento de contenidos.</p>
          </ScrollReveal>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 mb-20">
          {kpiCards.map((kpi, idx) => (
            <ScrollReveal key={kpi.label} delay={idx * 0.1}>
              <InteractionCard className="relative overflow-hidden group">
                <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                   <span className="material-symbols-outlined text-8xl">{kpi.icon}</span>
                </div>
                <div className="relative z-10">
                  <span className={DESIGN_SYSTEM.typography.label + " mb-2 block"}>{kpi.label}</span>
                  <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined ${kpi.color} text-2xl`}>{kpi.icon}</span>
                    <span className="text-4xl font-black font-display text-slate-900">{kpi.value}</span>
                  </div>
                </div>
              </InteractionCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Top Content Table */}
        <div className="px-4">
          <ScrollReveal delay={0.4}>
            <InteractionCard className="!p-0 overflow-hidden border-white/40 bg-white/40 backdrop-blur-3xl shadow-2xl">
              <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white/20">
                <h3 className="text-xl font-black font-display text-slate-900 uppercase tracking-widest">Contenido Destacado</h3>
                <span className="material-symbols-outlined text-primary">award_star</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Título del Drop</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Desbloqueos</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rendimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.topDrops.map((drop, idx) => {
                      const percentage = stats?.kpis.total_users > 0 ? (drop.unlocks / stats.kpis.total_users * 100).toFixed(0) : "0";
                      return (
                        <tr key={drop.title} className="border-t border-slate-50 hover:bg-white/40 transition-colors">
                          <td className="px-10 py-8 font-black font-display text-slate-800 uppercase text-xs tracking-wider">{drop.title}</td>
                          <td className="px-10 py-8 font-display font-medium text-slate-600">{drop.unlocks}</td>
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ delay: 1 + (idx * 0.1), duration: 1.5, ease: "circOut" }}
                                  className="h-full bg-primary"
                                />
                              </div>
                              <span className="text-[10px] font-black text-slate-400">{percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </InteractionCard>
          </ScrollReveal>
        </div>
      </ViewContainer>
      
      <div className="absolute bottom-0 right-0 opacity-10 -rotate-12 translate-x-1/4 translate-y-1/4 pointer-events-none">
        <FloatingMonster monster="POW" size="size-[30rem]" />
      </div>
    </div>
  );
};

export default AdminView;
