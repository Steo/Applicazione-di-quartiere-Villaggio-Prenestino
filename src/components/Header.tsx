import React from 'react';
import { Award } from 'lucide-react';
import { UserInteractions } from '../types';
import { LogoCdq } from './LogoCdq';

interface HeaderProps {
  interactions: UserInteractions;
}

export const Header: React.FC<HeaderProps> = ({ interactions }) => {
  const getLivello = (pts: number) => {
    if (pts < 30) return 'Nuovo Vicino';
    if (pts < 80) return 'Vicino Attivo';
    if (pts < 150) return 'Pilastro';
    return 'Custode';
  };

  return (
    <header
      className="sticky top-0 z-30 text-white shadow-md border-b border-black/10"
      style={{ backgroundColor: '#781816' }}
    >
      <div className="max-w-4xl mx-auto px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-2.5">
        {/* Logo ufficiale bianco dell'associazione */}
        <div className="min-w-0 flex items-center">
          <LogoCdq className="h-10 sm:h-11" />
        </div>

        {/* Punti Civici (Gamification amichevole) */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            title={`Hai ${interactions.puntiCivici} punti civici! Livello: ${getLivello(interactions.puntiCivici)}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/20 hover:bg-black/30 border border-white/15 text-amber-300 text-xs font-semibold cursor-help transition shadow-xs"
          >
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold tracking-tight">{interactions.puntiCivici}</span>
            <span className="text-white/80 font-normal text-[11px]">pts</span>
          </div>
        </div>
      </div>
    </header>
  );
};
