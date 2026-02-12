
import React, { useEffect } from 'react';
import { ViewState, VIEW_THEMES } from '../types';

interface MetaProps {
  view: ViewState;
  title?: string;
  description?: string;
}

export const Meta: React.FC<MetaProps> = ({ view, title, description }) => {
  const baseTitle = "JACI | Monstruomentes Brillantes";
  const viewTitle = title || (view === ViewState.HOME ? baseTitle : `${view} | JACI`);
  const viewDescription = description || "Potenciamos las mentes de los niños a través del juego y el neurodesarrollo en Xalapa, Veracruz.";
  
  useEffect(() => {
    document.title = viewTitle;
    
    // Manage dynamic meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', viewDescription);
    updateMeta('og:title', viewTitle, true);
    updateMeta('og:description', viewDescription, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', window.location.href, true);
    updateMeta('theme-color', VIEW_THEMES[view].primary);
    
    // Cleanup/reset to defaults is handled by next view's Meta mount
  }, [view, viewTitle, viewDescription]);

  return null;
};
