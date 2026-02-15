
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

// Import JSZip for client-side processing
import JSZip from 'jszip';

export const AdminView: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // CMS State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newDrop, setNewDrop] = useState({
    title: '',
    description: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    slug: ''
  });
  const [pendingAssets, setPendingAssets] = useState<any[]>([]);

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

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const zip = await JSZip.loadAsync(file);
      
      const assets: any[] = [];
      const filePromises: Promise<void>[] = [];

      zip.forEach((relativePath: string, zipEntry: any) => {
        if (!zipEntry.dir) {
          filePromises.push(zipEntry.async('blob').then((blob: Blob) => {
            assets.push({
              id: crypto.randomUUID(),
              filename: relativePath.split('/').pop() || 'unknown',
              blob,
              type: relativePath.includes('preview') ? 'preview' : 
                    relativePath.includes('master') ? 'master' : 
                    relativePath.includes('print') ? 'print_ready' : 'master',
              size: blob.size,
              mime: blob.type
            });
          }));
        }
      });

      await Promise.all(filePromises);
      setPendingAssets(assets);
      
      // Auto-fill title from ZIP name
      setNewDrop(prev => ({ ...prev, title: file.name.replace('.zip', ''), slug: file.name.replace('.zip', '').toLowerCase().replace(/\s+/g, '-') }));

    } catch (e) {
      alert("Error al procesar el ZIP");
    } finally {
      setIsUploading(false);
    }
  };

  const publishDrop = async () => {
    if (!newDrop.title || pendingAssets.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedAssets = [];
      let count = 0;

      // 1. Upload each asset to R2 vía Worker Proxy
      for (const asset of pendingAssets) {
        const intentRes = await fetch('/api/admin/upload-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: asset.filename, contentType: asset.mime })
        });
        const { uploadUrl, key } = await intentRes.json();

        // Subida directa al Worker Proxy (@api-upload-security)
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          body: asset.blob
        });

        if (!uploadRes.ok) throw new Error(`Error subiendo ${asset.filename}`);

        uploadedAssets.push({
          type: asset.type,
          r2_key: key,
          filename: asset.filename,
          mime_type: asset.mime,
          file_size: asset.size,
          sort_order: count
        });

        count++;
        setUploadProgress(Math.round((count / pendingAssets.length) * 100));
      }

      // 2. Publish to D1
      const res = await fetch('/api/admin/publish-drop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDrop,
          assets: uploadedAssets,
          thumbnail_key: uploadedAssets.find(a => a.type === 'preview')?.r2_key || uploadedAssets[0].r2_key
        })
      });

      if (res.ok) {
        alert("Drop publicado con éxito!");
        setPendingAssets([]);
      }
    } catch (e) {
      alert("Error al publicar el drop");
    } finally {
      setIsUploading(false);
    }
  };

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

        {/* CMS Uploader (@file-uploads) */}
        <div className="px-4 mb-20">
          <ScrollReveal delay={0.2}>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.primary} className="border-2 border-primary/20">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-8">
                  <h3 className="text-2xl font-black font-display text-slate-900 uppercase">Cargar Nuevo Drop</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 pl-4">Título</label>
                      <input 
                        className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:outline-none transition-all"
                        value={newDrop.title}
                        onChange={e => setNewDrop({...newDrop, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 pl-4">Slug</label>
                      <input 
                        className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:outline-none transition-all"
                        value={newDrop.slug}
                        onChange={e => setNewDrop({...newDrop, slug: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <input 
                      type="file" 
                      accept=".zip" 
                      onChange={handleZipUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full py-12 border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                      <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-primary mb-4 transition-colors">cloud_upload</span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Arrastra el ZIP del Drop aquí</p>
                    </div>
                  </div>

                  {pendingAssets.length > 0 && (
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black uppercase text-slate-400">{pendingAssets.length} Archivos detectados</p>
                          {isUploading && <span className="text-primary font-black">{uploadProgress}%</span>}
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-4 custom-scrollbar">
                           {pendingAssets.map(a => (
                             <div key={a.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                               <span className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{a.filename}</span>
                               <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${
                                 a.type === 'preview' ? 'bg-jaci-pink/10 text-jaci-pink' : 
                                 a.type === 'print_ready' ? 'bg-jaci-green/10 text-jaci-green' : 'bg-primary/10 text-primary'
                               }`}>{a.type}</span>
                             </div>
                           ))}
                        </div>
                        
                        <button 
                          onClick={publishDrop}
                          disabled={isUploading}
                          className="w-full py-6 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all disabled:bg-slate-300"
                        >
                          {isUploading ? 'Subiendo contenido...' : 'PUBLICAR DROP'}
                        </button>
                     </div>
                  )}
                </div>

                <div className="w-full md:w-80 space-y-6">
                  <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest">Protocolo de Archivos</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                      El sistema detecta automáticamente los tipos basandose en carpetas:<br/>
                      - <span className="text-jaci-pink">/preview</span>: Imágenes para galería.<br/>
                      - <span className="text-jaci-green">/print</span>: PDFs para impresión.<br/>
                      - <span className="text-primary">Raíz</span>: Archivos maestros.
                    </p>
                  </div>
                </div>
              </div>
            </InteractionCard>
          </ScrollReveal>
        </div>

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
