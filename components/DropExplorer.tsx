
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DESIGN_SYSTEM } from '../types';
import { Magnetic, OptimizedImage } from './MotionPrimitives';
import { useDataCache } from '../App';

interface Asset {
  id: string;
  type: 'preview' | 'master' | 'print_ready' | 'zip_bundle';
  filename: string;
  mime_type: string;
  file_size: number;
  r2_key?: string;
  sort_order: number;
}

interface Drop {
  id: string;
  title: string;
  description: string;
  month: number;
  year: number;
  is_unlocked: boolean;
  assets: Asset[];
}

interface DropExplorerProps {
  dropId: string;
  onBack: () => void;
}

export const DropExplorer: React.FC<DropExplorerProps> = ({ dropId, onBack }) => {
  const [drop, setDrop] = useState<Drop | null>(null);
  const [loading, setLoading] = useState(true);
  const { cache, prefetch } = useDataCache();

  useEffect(() => {
    const fetchDrop = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/drops/${dropId}`);
        const data = await res.json();
        setDrop(data);
      } catch (e) {
        console.error("Failed to fetch drop:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDrop();
  }, [dropId]);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (!drop) return <div className="p-12 text-center text-slate-500">No se pudo cargar el contenido.</div>;

  const previews = drop.assets.filter(a => a.type === 'preview');
  const downloads = drop.assets.filter(a => a.type !== 'preview');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <div className="flex items-center gap-6 mb-12">
        <Magnetic pullStrength={0.2}>
          <button 
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </Magnetic>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">{drop.title}</h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mt-1">
            Recompensa de {drop.month}/{drop.year}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12">
        {/* Visual Explorer */}
        <div className="space-y-8">
          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200 overflow-hidden">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Galería de Previsualización</h2>
            <div className="columns-1 md:columns-2 gap-4 space-y-4">
              {previews.map((asset) => (
                <motion.div 
                  key={asset.id}
                  whileHover={{ scale: 1.02 }}
                  className="relative group rounded-2xl overflow-hidden shadow-sm"
                >
                  <OptimizedImage 
                    src={asset.r2_key ? `/api/assets/${asset.r2_key}` : `https://placehold.co/800x600?text=${asset.filename}`}
                    alt={asset.filename} 
                    className="w-full h-auto"
                    aspectRatio="aspect-auto"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-white text-[0.6rem] font-bold uppercase tracking-widest">Ver pantalla completa</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Downloads */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">download_for_offline</span>
              Tu Bóveda
            </h3>
            
            {!drop.is_unlocked && (
              <div className="space-y-4 mb-6">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-amber-800 text-[0.65rem] font-bold uppercase leading-relaxed text-center">
                    Este drop está bloqueado. Desbloquéalo para acceder a los archivos maestros.
                  </p>
                </div>
                
                <Magnetic pullStrength={0.1}>
                  <button 
                    onClick={async () => {
                      const res = await fetch(`/api/checkout/buy/${dropId}`, { method: 'POST' });
                      const data = await res.json();
                      if (data.init_point) window.location.href = data.init_point;
                    }}
                    className="w-full py-4 bg-primary text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.2em] shadow-button active:scale-95 transition-all mb-4"
                  >
                    Desbloquear Drop ($99 MXN)
                  </button>
                </Magnetic>

                <button 
                  onClick={async () => {
                    const res = await fetch(`/api/checkout/subscription`, { method: 'POST' });
                    const data = await res.json();
                    if (data.init_point) window.location.href = data.init_point;
                  }}
                  className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-full text-[0.65rem] font-black uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white active:scale-95 transition-all"
                >
                  Membresía JACI ($99/Mes)
                </button>
              </div>
            )}

            <div className="space-y-3">
              {downloads.map((asset) => (
                <a
                  key={asset.id}
                  href={drop.is_unlocked ? `/api/download/${asset.id}` : '#'}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all group ${
                    drop.is_unlocked 
                    ? 'border-slate-100 bg-slate-50 hover:bg-white hover:border-primary hover:shadow-lg active:scale-[0.98]' 
                    : 'border-slate-100 bg-slate-50/50 opacity-60 cursor-not-allowed'
                  }`}
                  aria-label={drop.is_unlocked ? `Descargar ${asset.filename}` : 'Contenido bloqueado'}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">
                        {asset.type === 'zip_bundle' ? 'folder_zip' : 'description'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[0.6rem] font-black uppercase tracking-widest text-slate-900 line-clamp-1">{asset.filename}</p>
                      <p className="text-[0.5rem] font-bold uppercase tracking-wider text-slate-400">
                        {asset.type === 'print_ready' ? 'Modo Impresión (CMYK)' : 'Archivo Maestro'} • {(asset.file_size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  {drop.is_unlocked ? (
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">download</span>
                  ) : (
                    <span className="material-symbols-outlined text-slate-300">lock</span>
                  )}
                </a>
              ))}
            </div>

            {drop.is_unlocked && (
              <Magnetic pullStrength={0.1}>
                <button 
                  onClick={() => {
                    const zip = drop.assets.find(a => a.type === 'zip_bundle');
                    if (zip) window.location.href = `/api/download/${zip.id}`;
                    else alert("ZIP no disponible aún.");
                  }}
                  className="w-full mt-8 py-4 bg-slate-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.2em] shadow-button active:scale-95 transition-all"
                >
                  Descargar Todo (ZIP)
                </button>
              </Magnetic>
            )}
          </div>
          
          <div className="bg-jaci-pink/5 rounded-[2rem] p-8 border border-jaci-pink/10">
            <h4 className="text-[0.6rem] font-black uppercase tracking-widest text-jaci-pink mb-2">Soporte Artístico</h4>
            <p className="text-[0.65rem] text-slate-500 leading-relaxed font-medium capitalize">
              Cada archivo en esta bóveda ha sido curado para garantizar la máxima fidelidad cromática. Los archivos "Print Ready" vienen en espacio de color CMYK Fogra39.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
