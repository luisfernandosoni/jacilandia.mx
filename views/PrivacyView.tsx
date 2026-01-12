
import React from 'react';
import { ViewContainer, ScrollReveal, InteractionCard, GlassBadge } from '../components/MotionPrimitives';
import { DESIGN_SYSTEM } from '../types';

export const PrivacyView: React.FC = () => {
  return (
    <div className="w-full pb-32">
      <ViewContainer className="max-w-4xl">
        <div className="flex flex-col items-start mb-20">
          <ScrollReveal>
            <GlassBadge icon="gavel" colorClass="text-slate-900">Legal Xalapa</GlassBadge>
            <h1 className={DESIGN_SYSTEM.typography.h2 + " mt-6 mb-4"}>Aviso de Privacidad <span className="text-primary">Integral</span></h1>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">JACI | Monstruomentes Brillantes • Xalapa, Veracruz • Enero 2026</p>
          </ScrollReveal>
        </div>

        <div className="space-y-12">
          {/* Identidad */}
          <ScrollReveal delay={0.1}>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.slate[900]} className="!p-8 md:!p-12">
              <h2 className="text-2xl font-black font-display text-slate-900 mb-6 flex items-center gap-3">
                <span className="text-primary">1.</span> Identidad y Domicilio
              </h2>
              <p className="text-slate-600 font-body leading-relaxed text-lg">
                De conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, <strong>Jessica Gabriela Cadenas Carreño</strong> (en lo sucesivo, "JACI"), con domicilio para oír y recibir notificaciones legales en <strong>Av. Manuel Ávila Camacho 33, Centro, C.P. 91000, Xalapa, Veracruz</strong>, declara ser la responsable de la protección de sus datos personales.
              </p>
            </InteractionCard>
          </ScrollReveal>

          {/* Datos Recabados */}
          <ScrollReveal delay={0.2}>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.primary} className="!p-8 md:!p-12">
              <h2 className="text-2xl font-black font-display text-slate-900 mb-6 flex items-center gap-3">
                <span className="text-primary">2.</span> Datos Personales Recabados
              </h2>
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Categorías de Datos</h3>
                  <ul className="space-y-3 text-slate-600 font-body">
                    <li className="flex items-start gap-2"><span className="text-primary font-black">•</span> <strong>Identificación:</strong> Nombre completo, nombre de usuario (ID).</li>
                    <li className="flex items-start gap-2"><span className="text-primary font-black">•</span> <strong>Contacto:</strong> Correo electrónico, teléfono móvil de Veracruz.</li>
                    <li className="flex items-start gap-2"><span className="text-primary font-black">•</span> <strong>Fiscales:</strong> RFC, Régimen Fiscal (para facturación en México).</li>
                  </ul>
                </div>

                <div className="bg-jaci-pink-soft p-8 rounded-[2rem] border-2 border-jaci-pink/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-6xl text-jaci-pink">account_balance</span>
                  </div>
                  <h3 className="text-jaci-pink font-black font-display text-xl mb-4 uppercase tracking-tight">Cláusula de Deslinde Financiero</h3>
                  <p className="text-slate-700 font-body leading-relaxed">
                    <strong>JACI DECLARA QUE NO RECABA DATOS BANCARIOS.</strong> Operamos bajo un modelo de redirección segura a <strong>MercadoPago</strong>. JACI no tiene acceso a su número de tarjeta ni códigos CVV; únicamente recibe la confirmación del pago realizado en nuestra sede de Xalapa o vía digital.
                  </p>
                </div>
              </div>
            </InteractionCard>
          </ScrollReveal>

          {/* Finalidades */}
          <ScrollReveal delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-soft">
                <h2 className="text-xl font-black font-display text-slate-900 mb-6">Finalidades Primarias</h2>
                <ul className="space-y-4 text-sm text-slate-500 font-body">
                  <li>• Gestión de cuenta en jacilandia.mx</li>
                  <li>• Liberación de accesos digitales en Veracruz.</li>
                  <li>• Logística de envíos físicos en Xalapa.</li>
                  <li>• Emisión de CFDI (Facturación fiscal).</li>
                </ul>
              </div>
              <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-soft">
                <h2 className="text-xl font-black font-display text-slate-900 mb-6">Finalidades Secundarias</h2>
                <ul className="space-y-4 text-sm text-slate-500 font-body">
                  <li>• Envío de informativos y materiales JACI.</li>
                  <li>• Análisis de métricas locales de Xalapa.</li>
                  <li className="pt-4 italic">Negativa: Puede darse de baja usando el enlace "Unsubscribe".</li>
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Derechos ARCO */}
          <ScrollReveal delay={0.4}>
            <InteractionCard borderColor={DESIGN_SYSTEM.colors.purple} className="!p-8 md:!p-12">
              <h2 className="text-2xl font-black font-display text-slate-900 mb-6 flex items-center gap-3">
                <span className="text-primary">5.</span> Derechos ARCO
              </h2>
              <p className="text-slate-600 font-body leading-relaxed mb-8">
                Usted tiene derecho a Acceder, Rectificar, Cancelar y Oponerse al tratamiento de sus datos mediante correo a: <a href="mailto:hola@jacilandia.mx" className="text-primary font-black">hola@jacilandia.mx</a> o acudiendo a nuestra oficina en Xalapa.
              </p>
              <div className="flex flex-col gap-4 p-6 bg-jaci-purple-soft rounded-2xl border border-jaci-purple/10">
                <p className="text-xs font-black uppercase tracking-widest text-jaci-purple">Seguridad de Datos</p>
                <p className="text-slate-600 text-sm">Toda solicitud debe incluir copia digital de <strong>Identificación Oficial</strong> para validar su residencia y titularidad en el Estado de Veracruz.</p>
              </div>
            </InteractionCard>
          </ScrollReveal>

          {/* Footer del Aviso */}
          <ScrollReveal delay={0.5}>
            <div className="text-center p-12">
              <p className="text-slate-400 font-body text-sm text-balance">
                Cualquier modificación a este aviso estará disponible en <br/>
                <a href="https://www.jacilandia.mx" className="font-bold text-slate-900">https://www.jacilandia.mx</a> para la comunidad veracruzana.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </ViewContainer>
    </div>
  );
};
