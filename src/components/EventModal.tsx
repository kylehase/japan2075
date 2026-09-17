import React from 'react';
import { MacroEvent, MacroEventChoice, Language } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';
import { AlertOctagon, Sparkles, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { soundEngine } from '../canvas/audio';

interface EventModalProps {
  event: MacroEvent;
  language: Language;
  onSelectChoice: (choice: MacroEventChoice) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  language,
  onSelectChoice,
}) => {
  const t = TRANSLATIONS[language];

  const severityStyles = {
    disaster: {
      header: 'from-rose-950 via-red-950 to-slate-950',
      icon: <AlertOctagon size={24} className="text-rose-400 animate-pulse" />,
      border: 'border-rose-500',
    },
    warning: {
      header: 'from-amber-950 via-yellow-950 to-slate-950',
      icon: <AlertTriangle size={24} className="text-amber-400" />,
      border: 'border-amber-500',
    },
    miracle: {
      header: 'from-cyan-950 via-teal-950 to-slate-950',
      icon: <Sparkles size={24} className="text-cyan-400 animate-bounce" />,
      border: 'border-cyan-500',
    },
    info: {
      header: 'from-blue-950 via-slate-950 to-indigo-950',
      icon: <Info size={24} className="text-sky-400" />,
      border: 'border-indigo-500',
    },
  };

  const severityKey = event.severity || 'warning';
  const style = severityStyles[severityKey];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn select-none font-mono-tech">
      <div className={`w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border ${style.border} bg-slate-900 text-slate-100`}>
        {/* Title Bar */}
        <div className={`bg-gradient-to-r ${style.header} text-white px-5 py-3.5 flex items-center gap-3 border-b border-slate-800`}>
          {style.icon}
          <div>
            <div className="text-[10px] text-amber-300 uppercase tracking-widest">
              {t.emergencyNotice} {event.year ? `• ${event.year}` : ''}
            </div>
            <h2 className="text-base font-bold tracking-wide font-digital leading-snug text-white">
              {event.title[language]}
            </h2>
          </div>
        </div>

        {/* Event Narrative Body */}
        <div className="p-5 bg-slate-950 flex flex-col gap-4 text-xs">
          {event.headline && (
            <div className="text-xs font-semibold text-amber-300/95 tracking-wide border-l-2 border-amber-400 pl-3 py-0.5">
              {event.headline[language]}
            </div>
          )}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-100 text-xs leading-relaxed shadow-inner">
            {event.description[language]}
          </div>

          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider font-digital flex items-center gap-1.5">
            <span>⚖️ {language === 'en' ? 'Prime Minister Decision Dilemma:' : '内閣総理大臣の決断と政策選択:'}</span>
          </div>

          {/* Choices List */}
          <div className="flex flex-col gap-3">
            {event.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectChoice(choice);
                }}
                className="p-3.5 rounded-xl text-left flex flex-col gap-1.5 bg-slate-900/90 hover:bg-slate-800 transition cursor-pointer group border border-slate-800 hover:border-indigo-400 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs group-hover:text-cyan-300 flex items-center gap-2">
                    <ArrowRight size={14} className="text-indigo-400 group-hover:translate-x-1 transition shrink-0" />
                    {choice.label[language]}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 pl-5 leading-relaxed">
                  {choice.description[language]}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
