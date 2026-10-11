import React, { useState } from 'react';
import { WpPluginConfig } from '../types';
import {
  Download,
  Copy,
  Check,
  Globe,
  Key,
  ShieldCheck,
  Server,
  X,
  FileCode,
  BookOpen,
  ArrowRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface WpPluginPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: WpPluginConfig;
  onSaveConfig: (cfg: WpPluginConfig) => void;
  isLiveConnected: boolean;
  onTestConnection: () => Promise<boolean>;
}

export const WpPluginPanel: React.FC<WpPluginPanelProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  isLiveConnected,
  onTestConnection,
}) => {
  const [baseUrl, setBaseUrl] = useState(config.baseUrl);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [useLiveApi, setUseLiveApi] = useState(config.useLiveApi);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [mostraCodicePhp, setMostraCodicePhp] = useState(false);
  const [copiato, setCopiato] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
      useLiveApi,
    });
    setTestResult('Impostazioni salvate!');
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const ok = await onTestConnection();
      if (ok) {
        setTestResult('✅ Connessione riuscita con il plugin WordPress!');
      } else {
        setTestResult(
          '⚠️ Server raggiungibile ma il plugin non è ancora attivo su WordPress, oppure CORS da verificare. Usa la modalità simulata o installa il plugin ZIP.'
        );
      }
    } catch (e) {
      setTestResult('❌ Impossibile connettersi alle REST API. Verifica che il plugin sia attivo.');
    } finally {
      setTesting(false);
    }
  };

  const handleCopiaCodice = () => {
    fetch('/vp-quartiere/vp-quartiere.php')
      .then((r) => r.text())
      .then((txt) => {
        navigator.clipboard.writeText(txt);
        setCopiato(true);
        setTimeout(() => setCopiato(false), 3000);
      })
      .catch(() => {
        alert('Copia il file dal pacchetto ZIP scaricato.');
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 shrink-0 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold">
              WP
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                Plugin WordPress & Gestione Back-End
              </h2>
              <p className="text-xs text-slate-400">
                Pannello per l'amministratore (Stefano) - villaggioprenestino.it
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenuto scrollabile */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* BOX DOWNLOAD PRINCIPALE ZIP */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50/50 border-2 border-emerald-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white uppercase tracking-wider mb-1.5">
                Pronto per l'installazione
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Scarica il Plugin WordPress: <code className="text-emerald-800">vp-quartiere.zip</code>
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-md">
                Include i Custom Post Type per volontari, segnalazioni con foto, eventi, proposte e la tabella protetta con i recapiti telefonici.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
              <a
                href="/vp-quartiere.zip"
                download="vp-quartiere.zip"
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Scarica ZIP
              </a>
              <button
                onClick={handleCopiaCodice}
                className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                {copiato ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copiato ? 'Copiato!' : 'Copia PHP'}
              </button>
            </div>
          </div>

          {/* GUIDA PASSO-PASSO ERGONET */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Come installarlo sul tuo WordPress su Ergonet (3 minuti):
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 leading-relaxed">
              <li>
                Accedi all'amministrazione del tuo sito su{' '}
                <a
                  href="https://www.villaggioprenestino.it/wp-admin"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-emerald-700 underline"
                >
                  www.villaggioprenestino.it/wp-admin
                </a>
              </li>
              <li>
                Nel menu a sinistra vai su <strong>Plugin &gt; Aggiungi nuovo &gt; Carica plugin</strong>.
              </li>
              <li>
                Seleziona il file scaricato <strong>vp-quartiere.zip</strong> e clicca su <strong>Installa adesso</strong>, poi su <strong>Attiva plugin</strong>.
              </li>
              <li>
                Troverai subito nel menu laterale di WordPress le nuove voci:{' '}
                <strong>"Eventi Quartiere"</strong>, <strong>"Serve una Mano"</strong>,{' '}
                <strong>"Segnalazioni"</strong> e <strong>"Albo Volontari"</strong>.
              </li>
            </ol>
          </div>

          {/* CONFIGURAZIONE API & MODALITÀ DI FUNZIONAMENTO */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-600" />
              Modalità di Collegamento & Endpoint REST
            </h4>

            {/* Switch Live / Simulatore */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="block text-xs font-bold text-slate-900">
                  {useLiveApi ? '🟢 Modalità Online (Chiamate a WordPress)' : '🟡 Modalità Simulatore (Locale & Offline)'}
                </span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  {useLiveApi
                    ? 'L\'app invia e riceve i dati direttamente dalle API del tuo sito.'
                    : 'Usa i dati di memoria locale con salvataggio nel browser per testare ogni funzione.'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={useLiveApi}
                  onChange={(e) => setUseLiveApi(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Campi configurazione */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  URL Sito WordPress:
                </label>
                <input
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://www.villaggioprenestino.it"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  Chiave API (da Impostazioni WP):
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Chiave generata dal plugin"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            {testResult && (
              <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-800 border border-slate-200">
                {testResult}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Verifica in corso...' : 'Test Connessione API'}
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
              >
                Salva Configurazione
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Plugin Versione 1.2.0 (WordPress 5.8+)</span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 hover:text-slate-900"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
