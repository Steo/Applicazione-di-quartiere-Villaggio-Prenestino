import React, { useState } from 'react';
import { EventoQuartiere, UserInteractions } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Share2,
  PlusCircle,
} from 'lucide-react';

interface EventiTabProps {
  eventi: EventoQuartiere[];
  interactions: UserInteractions;
  onRequestJoinEvento: (evento: EventoQuartiere) => void;
}

export const EventiTab: React.FC<EventiTabProps> = ({
  eventi,
  interactions,
  onRequestJoinEvento,
}) => {
  const [filtro, setFiltro] = useState<'tutti' | 'miei'>('tutti');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const eventiFiltrati = eventi.filter((ev) => {
    if (filtro === 'miei') {
      return interactions.eventiPartecipati.includes(ev.id);
    }
    return true;
  });

  const handleShare = (ev: EventoQuartiere) => {
    const text = `Partecipa a "${ev.t}" il ${ev.d} ${ev.m} alle ${ev.ora} a Villaggio Prenestino! Info sull'app: https://www.villaggioprenestino.it`;
    if (navigator.share) {
      navigator.share({ title: ev.t, text, url: 'https://www.villaggioprenestino.it' }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setToastMsg('Link invito copiato!');
      setTimeout(() => setToastMsg(null), 2500);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-xl text-xs font-bold animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Header compatto per mobile */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            Eventi in programma
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Conferma la tua presenza con un tocco
          </p>
        </div>

        {/* Filtri */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setFiltro('tutti')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filtro === 'tutti'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tutti ({eventi.length})
          </button>
          <button
            onClick={() => setFiltro('miei')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filtro === 'miei'
                ? 'bg-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            style={{ color: filtro === 'miei' ? '#781816' : undefined }}
          >
            I miei ({interactions.eventiPartecipati.length})
          </button>
        </div>
      </div>

      {/* Lista Eventi */}
      {eventiFiltrati.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
          Nessun evento presente in questa lista.
        </div>
      ) : (
        <div className="space-y-3">
          {eventiFiltrati.map((ev) => {
            const isAttending = interactions.eventiPartecipati.includes(ev.id);

            return (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-sm transition flex flex-col sm:flex-row gap-4 items-start"
              >
                {/* Data Calendario */}
                <div
                  className="w-14 sm:w-16 rounded-xl text-white text-center py-2.5 px-1 shadow-xs shrink-0"
                  style={{ backgroundColor: '#781816' }}
                >
                  <span className="block text-2xl font-black text-amber-300 leading-none">
                    {ev.d}
                  </span>
                  <span className="block text-[11px] font-bold tracking-wider uppercase text-white/90 mt-0.5">
                    {ev.m}
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {ev.t}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-semibold">
                    <span className="flex items-center gap-1 text-amber-800">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      Ore {ev.ora}
                    </span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      {ev.luogo}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {ev.p}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-600" />
                      <strong>{ev.n}</strong> confermati
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShare(ev)}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-200"
                        title="Condividi"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onRequestJoinEvento(ev)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          isAttending
                            ? 'bg-amber-100 text-amber-950 border border-amber-300'
                            : 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 shadow-xs'
                        }`}
                      >
                        {isAttending ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            Ci sarò (Annulla)
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-4 h-4" />
                            Ci sarò (+5 pts)
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
