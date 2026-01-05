import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/30 backdrop-blur-sm border-t border-gray-100 mt-auto overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-12 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <img 
              src="https://raw.githubusercontent.com/soniglf/JACIResources/84c35cf151659486d49458cee28c1f353f42f47d/LOGO_H_Color.png" 
              alt="JACI" 
              className="h-12 w-auto object-contain opacity-80"
            />
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">© 2024 JACI. Todos los derechos reservados.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-300">
              <span className="material-symbols-outlined text-sm">public</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-300">
              <span className="material-symbols-outlined text-sm">photo_camera</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};