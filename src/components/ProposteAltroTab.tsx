import React, { useState } from 'react';
import { PropostaCittadina } from '../types';
import { NUMERI_UTILI } from '../data/mockData';
import {
  Lightbulb,
  ThumbsUp,
  Send,
  PhoneCall,
  MessageCircle,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

interface ProposteAltroTabProps {
  proposte: PropostaCittadina[];
  votedProposte: number[];
  onVoteProposta: (proposta: PropostaCittadina) => void;
  onSubmitProposta: (titolo: string) => Promise<void>;
}

export const ProposteAltroTab: React.FC<ProposteAltroTabProps> = ({
  proposte,
  votedProposte,
  onVoteProposta,
  onSubmitProposta,
}) => {
  const [nuovaIdea, setNuovaIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviataSuccesso, setInviataSuccesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuovaIdea.trim()) return;

    setLoading(true);
    try {
      await onSubmitProposta(nuovaIdea.trim());
      setInviataSuccesso(true);
      setNuovaIdea('');
      setTimeout(() => setInviataSuccesso(false), 3500);
    } catch {
      alert('Errore nell\'invio. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* SEZIONE 1: Proposte dei Cittadini */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            Idee per il quartiere
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Vota con un "Mi piace" o proponi la tua idea
          </p>
        </div>

        {/* Form Nuova Proposta */}
        <form onSubmit={handleSubmit} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <label className="block text-xs font-bold text-slate-800">
            Hai un'idea per Villaggio Prenestino?
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              required
              value={nuovaIdea}
              onChange={(e) => setNuovaIdea(e.target.value)}
              placeholder="es. Scambio libri al parco o piantare nuovi fiori"
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Proponi (+5 pts)
            </button>
          </div>
          {inviataSuccesso && (
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Proposta inviata! Verrà pubblicata dopo una rapida verifica.
            </p>
          )}
        </form>

        {/* Elenco Proposte */}
        <div className="space-y-2 pt-1">
          {proposte.map((p) => {
            const hasVoted = votedProposte.includes(p.id);

            return (
              <div
                key={p.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white transition flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {p.t}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-semibold mt-0.5 inline-block">
                    <strong className="text-slate-800">{p.v}</strong> cittadini d'accordo
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onVoteProposta(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    hasVoted
                      ? 'bg-amber-100 text-amber-950 border border-amber-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-amber-600 text-amber-600' : ''}`} />
                  {hasVoted ? 'Votato ✓' : 'Mi piace'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEZIONE 2: NUMERI UTILI */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            Numeri utili ed emergenze
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tocca per chiamare subito
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {NUMERI_UTILI.map((item, idx) => {
            const isWhatsapp = item.tipo === 'whatsapp';
            const cleanNumber = item.numero.replace(/\s+/g, '');

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 ${
                  item.tipo === 'urgente'
                    ? 'bg-rose-50/50 border-rose-200'
                    : isWhatsapp
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {item.nome}
                  </h4>
                  <span className="font-mono text-xs font-bold text-slate-700 block mt-0.5">
                    {item.numero}
                  </span>
                </div>

                <a
                  href={isWhatsapp ? 'https://wa.me/393330000000' : `tel:${cleanNumber}`}
                  target={isWhatsapp ? '_blank' : undefined}
                  rel={isWhatsapp ? 'noopener noreferrer' : undefined}
                  className={`p-2 rounded-xl text-white font-bold text-xs shrink-0 transition flex items-center justify-center ${
                    isWhatsapp
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : item.tipo === 'urgente'
                      ? 'bg-rose-600 hover:bg-rose-500'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                  title={isWhatsapp ? 'WhatsApp' : `Chiama ${item.nome}`}
                >
                  {isWhatsapp ? (
                    <MessageCircle className="w-4 h-4" />
                  ) : (
                    <PhoneCall className="w-4 h-4" />
                  )}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Info Associazione */}
      <footer className="text-center text-xs text-slate-500 py-2">
        <p>Comunità di Quartiere Villaggio Prenestino (Roma Municipio VI)</p>
        <p className="text-[11px] text-slate-400 mt-0.5">www.villaggioprenestino.it</p>
      </footer>
    </div>
  );
};
