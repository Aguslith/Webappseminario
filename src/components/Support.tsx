import { motion } from 'motion/react';
import { HelpCircle, Mail, MessageSquare, Phone, ExternalLink, ShieldCheck, FileText } from 'lucide-react';
import { playClick } from '../lib/sounds';

export default function Support() {
  const contactMethods = [
    { 
      icon: MessageSquare, 
      title: 'Chat en Vivo', 
      desc: 'Habla con nuestro equipo de soporte técnico.',
      action: 'Iniciar Chat',
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      icon: Mail, 
      title: 'Correo Electrónico', 
      desc: 'Envíanos tus dudas a soporte@organiceditorial.com',
      action: 'Enviar Mail',
      color: 'bg-purple-50 text-purple-600'
    },
    { 
      icon: Phone, 
      title: 'Línea Directa', 
      desc: 'Atención telefónica de Lunes a Viernes (9:00 - 18:00)',
      action: 'Llamar Ahora',
      color: 'bg-green-50 text-green-600'
    }
  ];

  const faqs = [
    { q: '¿Cómo se calculan mis calorías diarias?', a: 'Utilizamos la fórmula de Harris-Benedict ajustada por tu nivel de actividad y metas personales.' },
    { q: '¿Mis datos están seguros?', a: 'Sí, utilizamos cifrado de extremo a extremo y cumplimos con las normativas de privacidad de datos.' },
    { q: '¿Puedo exportar mi historial?', a: '¡Próximamente! Estamos trabajando en una función de exportación a PDF y CSV.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex flex-col gap-4 text-center lg:text-left">
        <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-primary font-bold uppercase tracking-widest text-xs">
          <HelpCircle size={16} /> Centro de Ayuda
        </div>
        <h1 className="text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight">
          ¿En qué podemos <span className="text-secondary italic">ayudarte?</span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">
          Estamos aquí para asegurar que tu viaje hacia el bienestar sea perfecto. Encuentra respuestas o contáctanos directamente.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactMethods.map((method, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[2rem] editorial-shadow flex flex-col gap-4 border border-surface-container-low"
          >
            <div className={`w-12 h-12 rounded-2xl ${method.color} flex items-center justify-center`}>
              <method.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">{method.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{method.desc}</p>
            </div>
            <button 
              onClick={() => playClick()}
              className="mt-auto w-full py-3 rounded-xl bg-surface-container-highest text-on-surface font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
            >
              {method.action}
              <ExternalLink size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      <section className="bg-surface-container-low rounded-[2.5rem] p-8 lg:p-12 border border-surface-container-high">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          Preguntas Frecuentes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="font-bold text-primary flex items-start gap-2">
                <span className="opacity-30">#</span> {faq.q}
              </h4>
              <p className="text-on-surface-variant text-sm leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-surface-container-high hover:bg-surface-container-low transition-all group">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck size={20} />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">Privacidad y Seguridad</p>
            <p className="text-xs text-on-surface-variant">Conoce cómo protegemos tus datos.</p>
          </div>
        </button>
        <button className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-surface-container-high hover:bg-surface-container-low transition-all group">
          <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText size={20} />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">Términos y Condiciones</p>
            <p className="text-xs text-on-surface-variant">Reglas de uso de nuestra plataforma.</p>
          </div>
        </button>
      </footer>
    </div>
  );
}
