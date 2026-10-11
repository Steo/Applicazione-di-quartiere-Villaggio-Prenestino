import React, { useState, useEffect } from 'react';
import { HeartHandshake, Phone, User, X, Check, ShieldCheck } from 'lucide-react';

interface VolunteerContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalJoined: number;
  targetJoined?: number;
  defaultName?: string;
  defaultPhone?: string;
  onConfirm: (data: { nome: string; telefono: string; anonimo: boolean }) => void;
}

export const VolunteerContactModal: React.FC<VolunteerContactModalProps> = ({
  isOpen,
  onClose,
  title,
  totalJoined,
  targetJoined,
  defaultName = '',
  defaultPhone = '',
  onConfirm,
}) => {
  const [nome, setNome] = useState(defaultName);
  const [telefono, setTelefono] = useState(defaultPhone);

  useEffect(() => {
    if (isOpen) {
      setNome(defaultName);
      setTelefono(defaultPhone);
    }
  }, [isOpen, defaultName, defaultPhone]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      nome: nome.trim(),
      telefono: telefono.trim(),
      anonimo: false,
    });
  };

  const handleSkip = () => {
    onConfirm({
      nome: '',
      telefono: '',
      anonimo: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-scaleUp">
        {/* Header con colore associazione #781816 */}
        <div className="p-4 sm:p-5 text-white relative" style={{ backgroundColor: '#781816' }}>
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-black/20 transition"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <HeartHandshake className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Volontariato
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black leading-tight text-white">
            Ottimo, grazie per l'aiuto!
          </h2>
          <p className="text-xs text-white/80 mt-1 line-clamp-2">
            {title}
          </p>
        </div>

        {/* Counter informativo */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-950 font-semibold">
          <span>Partecipanti insieme a te:</span>
          <span className="font-bold bg-amber-200/90 px-2 py-0.5 rounded-full">
            {totalJoined + 1} {targetJoined ? `su ${targetJoined}` : 'persone'}
          </span>
        </div>

        {/* Form semplice */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Lascia nome e cellulare per essere ricontattato dall'associazione per l'attività:
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Nome o Soprannome:
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="es. Stefano D."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              Numero di Telefono:
            </label>
            <input
              type="tel"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="es. 333 1234567"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-start gap-1.5 text-[11px] text-slate-500 pt-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>I tuoi recapiti sono usati solo per questa attività.</span>
          </div>

          {/* Bottoni */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              Conferma e lascia recapito
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-2 px-3 text-slate-500 hover:text-slate-800 text-xs font-medium rounded-xl hover:bg-slate-100 transition"
            >
              Partecipa senza lasciare recapito
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
