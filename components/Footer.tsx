
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-auto overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex flex-col items-center md:items-start">
              <img 
                src="https://assets.jacilandia.mx/LOGO_H_Color.png" 
                alt="JACI" 
                className="h-20 w-auto object-contain transition-all duration-300"
              />
            </div>
            <p className="text-gray-400 text-xs font-body mt-2">© 2026 JACI. Todos los derechos reservados.</p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-10">
            <a className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors cursor-pointer">Inicio</a>
            <a className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors cursor-pointer">Privacidad</a>
            <a className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors cursor-pointer">Contacto</a>
          </nav>
          
          <div className="flex gap-4">
            <a className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-primary hover:shadow-md transition-all duration-300">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-jaci-pink hover:shadow-md transition-all duration-300">
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
