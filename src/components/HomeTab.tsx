import React from 'react';
import {
  WpArticle,
  EventoQuartiere,
  RichiestaVolontariato,
  UserInteractions,
} from '../types';
import {
  Calendar,
  HeartHandshake,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Megaphone,
} from 'lucide-react';

interface HomeTabProps {
  news: WpArticle[];
  eventi: EventoQuartiere[];
  richieste: RichiestaVolontariato[];
  interactions: UserInteractions;
  onSelectTab: (tab: 'home' | 'eventi' | 'segnalazioni' | 'volontariato' | 'proposte') => void;
  onRequestJoinVolunteer: (richiesta: RichiestaVolontariato) => void;
  onRequestJoinEvento: (evento: EventoQuartiere) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  news,
  eventi,
  richieste,
  interactions,
  onSelectTab,
  onRequestJoinVolunteer,
  onRequestJoinEvento,
}) => {
  return (
    <div className="space-y-5 pb-20 animate-fadeIn">
      {/* Hero Banner Compatto & Leggibile */}
      <section
        className="rounded-3xl p-5 sm:p-7 text-white shadow-lg border border-black/10 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #781816 0%, #5a1210 100%)',
        }}
      >
        <div className="relative z-10 max-w-lg">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider mb-2">
            Il quartiere siamo noi
          </span>
          <h2 className="text-xl sm:text-2xl font-black leading-tight text-white tracking-tight">
            Partecipa alla vita di Villaggio Prenestino
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-white/90 leading-relaxed">
            Scopri le iniziative, dai una mano per le attività o segnala un problema nel quartiere.
          </p>

          {/* Bottoni Principali Arancioni */}
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={() => onSelectTab('segnalazioni')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Megaphone className="w-4 h-4" />
              Invia Segnalazione
            </button>
            <button
              onClick={() => onSelectTab('volontariato')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/25 transition flex items-center gap-1.5"
            >
              <HeartHandshake className="w-4 h-4 text-amber-300" />
              Diventa Volontario
            </button>
          </div>
        </div>
      </section>

      {/* SEZIONE: Ultime Notizie (Semplificato per mobile) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#781816' }} />
            Ultime notizie
          </h3>
          <a
            href="https://www.villaggioprenestino.it"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            Tutte le news <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {news.slice(0, 3).map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={art.img}
                    alt={art.titolo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-bold">
                    {art.data}
                  </span>
                </div>

                <div className="p-3.5">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {art.titolo}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {art.estratto}
                  </p>
                </div>
              </div>

              <div className="px-3.5 pb-3 pt-1">
                <a
                  href={art.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  Leggi sul sito <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SEZIONE: Volontariato: Serve una mano */}
      <section className="rounded-3xl p-4 sm:p-5 border border-amber-200/80 bg-amber-50/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl text-white flex items-center justify-center shadow-xs"
              style={{ backgroundColor: '#781816' }}
            >
              <HeartHandshake className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                Volontariato: serve una mano
              </h3>
              <p className="text-[11px] text-slate-600">
                Adesioni condivise in tempo reale
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('volontariato')}
            className="text-xs text-amber-800 font-bold flex items-center gap-0.5 hover:underline"
          >
            Vedi tutte <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {richieste.slice(0, 4).map((r) => {
            const hasJoined = interactions.richiesteAderite.includes(r.id);
            const percentage = Math.min(100, Math.round((r.have / Math.max(1, r.need)) * 100));

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {r.t}
                    </h4>
                    {r.urgente && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                        Urgente
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-amber-800 font-semibold flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                    {r.w}
                  </p>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {r.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1 font-semibold text-slate-700">
                    <span>
                      Volontari: <strong>{r.have}</strong> su {r.need}
                    </span>
                    <span className="text-amber-800 font-bold">{percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-2.5">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: '#781816',
                      }}
                    />
                  </div>

                  <button
                    onClick={() => onRequestJoinVolunteer(r)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      hasJoined
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200'
                        : 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 shadow-xs'
                    }`}
                  >
                    {hasJoined ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        Hai aderito! (Annulla)
                      </>
                    ) : (
                      <>
                        <HeartHandshake className="w-4 h-4" />
                        Ci sono anche io! (+10 pts)
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEZIONE: Prossimi Eventi */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            Prossimi eventi
          </h3>
          <button
            onClick={() => onSelectTab('eventi')}
            className="text-xs text-amber-800 font-bold flex items-center gap-0.5 hover:underline"
          >
            Tutti gli eventi <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {eventi.slice(0, 2).map((ev) => {
            const isAttending = interactions.eventiPartecipati.includes(ev.id);
            return (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex gap-3.5 items-start"
              >
                <div
                  className="shrink-0 w-14 rounded-xl text-white text-center py-2 px-1 shadow-xs"
                  style={{ backgroundColor: '#781816' }}
                >
                  <span className="block text-xl font-black leading-none text-amber-300">
                    {ev.d}
                  </span>
                  <span className="block text-[10px] font-bold tracking-wider mt-1 uppercase text-white/90">
                    {ev.m}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {ev.t}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" /> {ev.ora} •
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {ev.luogo}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-600" />
                      <strong>{ev.n}</strong> confermati
                    </span>
                    <button
                      onClick={() => onRequestJoinEvento(ev)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                        isAttending
                          ? 'bg-amber-100 text-amber-950 border border-amber-300'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      }`}
                    >
                      {isAttending ? 'Ci sarai ✓' : 'Ci sarò'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
