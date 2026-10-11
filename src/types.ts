export interface WpArticle {
  id: number;
  titolo: string;
  estratto: string;
  data: string;
  link: string;
  img: string;
  autore?: string;
}

export interface EventoQuartiere {
  id: number;
  t: string;           // Titolo
  p: string;           // Descrizione / Dettagli
  d: string;           // Giorno (es. "18")
  m: string;           // Mese (es. "OTT")
  ora: string;         // Orario (es. "10:30")
  luogo: string;       // Indirizzo / Luogo
  n: number;           // Numero partecipanti / volontari attuali
  target: number;      // Obiettivo volontari
}

export interface RichiestaVolontariato {
  id: number;
  t: string;           // Titolo attività (es. "Pulizia Parco Via Fosso dell'Osa")
  w: string;           // Dove
  desc: string;        // Descrizione di cosa serve fare
  have: number;        // Volontari attualmente aderiti
  need: number;        // Volontari necessari
  urgente?: boolean;
}

export type StatoSegnalazione = 1 | 2 | 3; // 1: Ricevuta, 2: Inoltrata al Municipio VI, 3: Risolta

export interface SegnalazioneCittadina {
  id: number;
  t: string;           // Titolo / Tipo problema
  w: string;           // Luogo / Indirizzo esatto
  desc: string;        // Descrizione
  s: StatoSegnalazione;// Stato
  ph: string[];        // Foto (URL o base64)
  data: string;        // Data
  cittadinoNome?: string;
  cittadinoTel?: string;
}

export interface PropostaCittadina {
  id: number;
  t: string;           // Titolo proposta
  v: number;           // Numero voti "Mi piace"
}

export interface CandidaturaVolontario {
  nome: string;
  telefono: string;
  attivita: string[];
  note?: string;
}

export interface UserInteractions {
  eventiPartecipati: number[];   // IDs degli eventi a cui ha aderito
  richiesteAderite: number[];    // IDs delle richieste a cui ha fatto "Ci sono"
  proposteVotate: number[];      // IDs delle proposte a cui ha messo like
  puntiCivici: number;           // Gamification punti
  token: string;                 // Token anonimo univoco per-device
  contattiSalvati?: {
    nome: string;
    telefono: string;
  };
}

export interface WpPluginConfig {
  baseUrl: string;
  apiKey: string;
  useLiveApi: boolean;
}
