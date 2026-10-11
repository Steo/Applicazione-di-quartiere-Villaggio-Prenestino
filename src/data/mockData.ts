import { WpArticle, EventoQuartiere, RichiestaVolontariato, SegnalazioneCittadina, PropostaCittadina } from '../types';

export const INITIAL_NEWS: WpArticle[] = [
  {
    id: 101,
    titolo: 'Avvio lavori per il nuovo parco giochi inclusivo di Via Fosso dell\'Osa',
    estratto: 'Iniziati oggi gli interventi di riqualificazione dell\'area verde con l\'installazione di nuove giostre inclusive e panchine per le famiglie.',
    data: '08 Ott 2026',
    link: 'https://www.villaggioprenestino.it/parco-giochi-inclusivo',
    img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=700&q=80',
    autore: 'Comitato Direttivo',
  },
  {
    id: 102,
    titolo: 'Incontro pubblico con gli assessori del Municipio VI sulla viabilità',
    estratto: 'Assemblea partecipata giovedì prossimo per discutere del piano asfalti, illuminazione stradale e potenziamento delle linee bus del quartiere.',
    data: '04 Ott 2026',
    link: 'https://www.villaggioprenestino.it/incontro-viabilita-municipio-vi',
    img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=700&q=80',
    autore: 'Stefano De Prophetis',
  },
  {
    id: 103,
    titolo: 'Raccolta straordinaria coperte e generi di prima necessità per l\'inverno',
    estratto: 'Presso la sede dell\'associazione è attivo il punto di raccolta solidale per le famiglie in difficoltà del nostro quadrante.',
    data: '29 Set 2026',
    link: 'https://www.villaggioprenestino.it/raccolta-solidale-inverno',
    img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=700&q=80',
    autore: 'Gruppo Solidarietà',
  },
];

export const INITIAL_EVENTI: EventoQuartiere[] = [
  {
    id: 1,
    t: 'Giornata di Pulizia e Piantumazione al Parco delle Cerquete',
    p: 'Ritrovo con guanti e sacchi per liberare i sentieri, tagliare i rovi e mettere a dimora 15 nuovi lecci donati al quartiere. Merenda comunitaria offerta dall\'associazione!',
    d: '18',
    m: 'OTT',
    ora: '09:30',
    luogo: 'Ingresso Parco delle Cerquete, Via Prenestina',
    n: 14,
    target: 20,
  },
  {
    id: 2,
    t: 'Festa d\'Autunno e Castagnata di Quartiere',
    p: 'Pomeriggio di musica dal vivo, caldarroste, giochi in legno per i più piccoli e stand informativi sui progetti del Comitato di Quartiere.',
    d: '26',
    m: 'OTT',
    ora: '15:30',
    luogo: 'Piazza del Villaggio, Via Prenestina km 15',
    n: 32,
    target: 50,
  },
  {
    id: 3,
    t: 'Assemblea Cittadina: Progetto Ciclabile e Sicurezza Stradale',
    p: 'Discussione aperta con i residenti sulle istanze da presentare in Campidoglio e in Municipio VI relative all\'attraversamento pedonale di Via Fosso dell\'Osa.',
    d: '07',
    m: 'NOV',
    ora: '18:00',
    luogo: 'Sede Associazione Villaggio Prenestino',
    n: 19,
    target: 30,
  },
];

export const INITIAL_RICHIESTE: RichiestaVolontariato[] = [
  {
    id: 1,
    t: 'Sfregio e riverniciatura delle panchine del parco',
    w: 'Parco giochi Via Fosso dell\'Osa',
    desc: 'Cerchiamo 6 persone per carteggiare e ridipingere con vernice all\'acqua le 8 panchine rovinate dalle intemperie.',
    have: 4,
    need: 6,
    urgente: true,
  },
  {
    id: 2,
    t: 'Supporto gazebo e distribuzione caldarroste',
    w: 'Piazza del Villaggio',
    desc: 'Servono volontari per aiutarci ad allestire i gazebo e accogliere i residenti durante la festa di quartiere di fine mese.',
    have: 7,
    need: 10,
    urgente: false,
  },
  {
    id: 3,
    t: 'Assistenza anziani per la spesa e commissioni settimanali',
    w: 'Quadrante Villaggio Prenestino',
    desc: 'Un gruppo di vicini si sta organizzando per supportare 3 persone anziane sole nella consegna dei farmaci e della spesa pesante.',
    have: 3,
    need: 5,
    urgente: true,
  },
];

export const INITIAL_SEGNALAZIONI: SegnalazioneCittadina[] = [
  {
    id: 1,
    t: 'Profonda buca all\'incrocio con Via Fosso dell\'Osa',
    w: 'Via Fosso dell\'Osa angolo Via Prenestina',
    desc: 'Asfalto ceduto dopo le ultime piogge, pericoloso soprattutto per scooteristi e ciclisti la sera.',
    s: 2, // Inoltrata al Municipio VI
    ph: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    ],
    data: '10/10/2026',
    cittadinoNome: 'Marco R.',
  },
  {
    id: 2,
    t: 'Tre lampioni spenti nel vialetto pedonale del parco',
    w: 'Parco delle Cerquete',
    desc: 'Illuminazione pubblica assente da 4 giorni, la zona rimane completamente al buio dalle 19 in poi.',
    s: 2, // Inoltrata
    ph: [
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    ],
    data: '07/10/2026',
    cittadinoNome: 'Anonimo',
  },
  {
    id: 3,
    t: 'Rimozione rami caduti sul marciapiede completata',
    w: 'Via Roccaravindola',
    desc: 'Intervento completato dalla squadra giardini dopo la segnalazione inviata tramite l\'app!',
    s: 3, // Risolta
    ph: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    ],
    data: '02/10/2026',
    cittadinoNome: 'Laura B.',
  },
];

export const INITIAL_PROPOSTE: PropostaCittadina[] = [
  {
    id: 1,
    t: 'Installazione di una casetta per il bookcrossing (scambio libri gratuito) nel parco',
    v: 47,
  },
  {
    id: 2,
    t: 'Richiesta di un dosso o dissuasore di velocità in Via Fosso dell\'Osa',
    v: 83,
  },
  {
    id: 3,
    t: 'Creazione di un orto sociale didattico curato insieme ai ragazzi delle scuole',
    v: 62,
  },
];

export const TAGS_ATTIVITA_VOLONTARIATO = [
  'Cura del verde e parchi',
  'Assistenza anziani e fragili',
  'Eventi e feste di quartiere',
  'Raccolta beni e solidarietà',
  'Decoro urbano e pittura',
  'Doposcuola e attività bimbi',
  'Comunicazione e foto/social',
  'Logistica e piccoli lavori manuali',
];

export const NUMERI_UTILI = [
  {
    nome: 'Numero Unico Emergenze',
    numero: '112',
    descr: 'Carabinieri, Polizia, Vigili del Fuoco, Emergenza Sanitaria',
    tipo: 'urgente',
  },
  {
    nome: 'Polizia Locale Roma Capitale - Municipio VI',
    numero: '06 6769 6250',
    descr: 'Gruppo VI Tor Bella Monaca - Viabilità, soste, pronto intervento',
    tipo: 'locale',
  },
  {
    nome: 'Stazione Carabinieri Tor Bella Monaca',
    numero: '06 2043 1400',
    descr: 'Presidio territoriale Arma dei Carabinieri',
    tipo: 'locale',
  },
  {
    nome: 'AMA Roma - Segnalazione Rifiuti & Ingombranti',
    numero: '06 0606',
    descr: 'ChiamaRoma 060606 per rifiuti abbandonati e pulizia strade',
    tipo: 'servizi',
  },
  {
    nome: 'Guardia Medica Notturna e Festivi',
    numero: '06 58526811',
    descr: 'Continuità assistenziale ASL Roma 2',
    tipo: 'sanita',
  },
  {
    nome: 'Canale WhatsApp Comitato di Quartiere',
    numero: '+39 333 000 0000',
    descr: 'Iscriviti per ricevere avvisi urgenti, notizie e incontri',
    tipo: 'whatsapp',
  },
];
