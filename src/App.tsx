/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Menu, 
  Settings, 
  Wifi, 
  Search, 
  XCircle, 
  RefreshCw, 
  MapPin, 
  Cpu, 
  Download,
  Link as LinkIcon,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface LogEntry {
  type: 'info' | 'error' | 'success' | 'command' | 'system';
  text: string;
  timestamp: string;
}

interface Software {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'connecting';
  type: 'System' | 'App' | 'Service';
}

// --- Constants ---
const INITIAL_SOFTWARE: Software[] = [
  { id: '1', name: 'Core Engine', status: 'online', type: 'System' },
  { id: '2', name: 'Wave Processor', status: 'online', type: 'Service' },
  { id: '3', name: 'Sunset Renderer', status: 'online', type: 'App' },
  { id: '4', name: 'Cloud Sync', status: 'offline', type: 'Service' },
  { id: '5', name: 'Drive Access', status: 'offline', type: 'System' },
];

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [connectedSoftware, setConnectedSoftware] = useState<string[]>([]);
  const [isSystemHalted, setIsSystemHalted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    addLog('system', 'Sunset Console v1.0.0 Initialized...');
    addLog('info', 'Type !connect to see available software.');
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // --- Logic ---
  const addLog = (type: LogEntry['type'], text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { type, text, timestamp }]);
  };

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    addLog('command', `> ${cmd}`);

    if (isSystemHalted && cleanCmd !== '!fix') {
      addLog('error', 'SYSTEM HALTED. Use !fix to restart.');
      return;
    }

    switch (cleanCmd) {
      case '!reload':
        addLog('info', 'Reloading application...');
        setTimeout(() => window.location.reload(), 1000);
        break;
      case '!fix':
        addLog('system', 'Restarting system services...');
        addLog('error', 'CRITICAL_ERROR: Memory leak detected at 0x004F2A');
        addLog('info', 'Patching kernel...');
        setTimeout(() => {
          setIsSystemHalted(false);
          addLog('success', 'System restored successfully.');
        }, 2000);
        break;
      case '!locate':
        addLog('info', 'Locating application origin...');
        addLog('system', 'Path: /root/user/drive/sunset_console/src/main.tsx');
        addLog('system', 'Origin: Cloud Run Instance (US-EAST1)');
        break;
      case '!ping':
        const latency = Math.floor(Math.random() * 50) + 10;
        addLog('success', `Pong! Latency: ${latency}ms. Connection stable.`);
        break;
      case '!find':
        if (connectedSoftware.length === 0) {
          addLog('error', 'No software connected. Use !connect first.');
        } else {
          addLog('info', `Searching system for ${connectedSoftware[0]}...`);
          setTimeout(() => addLog('success', 'Application found in active memory cluster.'), 1500);
        }
        break;
      case '!stoptask':
        addLog('error', 'Stopping all tasks...');
        setIsSystemHalted(true);
        break;
      case '!settings':
        if (connectedSoftware.length === 0) {
          addLog('error', 'Connect to a software to access its settings.');
        } else {
          setShowSettings(true);
          addLog('info', 'Opening settings panel...');
        }
        break;
      case '!connect':
        setIsMenuOpen(true);
        addLog('info', 'Scanning for available programs...');
        break;
      default:
        addLog('error', `Unknown command: ${cmd}. Type !connect for help.`);
    }
    setInputValue('');
  };

  const toggleConnection = (id: string) => {
    const isCurrentlyConnected = connectedSoftware.includes(id);
    setConnectedSoftware(prev => 
      isCurrentlyConnected ? prev.filter(i => i !== id) : [...prev, id]
    );
    const soft = INITIAL_SOFTWARE.find(s => s.id === id);
    if (soft) {
      addLog('success', `${isCurrentlyConnected ? 'Disconnected from' : 'Connected to'} ${soft.name}`);
    }
  };

  const downloadHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sunset Console - Public Download</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes wave {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        .wave-bg {
            background: linear-gradient(to bottom, #ff7e5f, #feb47b);
            overflow: hidden;
            position: relative;
        }
        .wave {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 200%;
            height: 100px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 40%;
            animation: wave 10s infinite linear;
        }
        .wave:nth-child(2) { animation-delay: -5s; opacity: 0.1; }
    </style>
</head>
<body class="bg-gray-900 text-white font-mono">
    <div id="root"></div>
    <script>
        const { useState, useEffect, useRef } = React;

        function App() {
            const [logs, setLogs] = useState([{ type: 'system', text: 'OFFLINE MODE INITIALIZED', timestamp: new Date().toLocaleTimeString() }]);
            const [input, setInput] = useState('');

            const handleCmd = (e) => {
                if (e.key === 'Enter') {
                    const newLog = { type: 'command', text: '> ' + input, timestamp: new Date().toLocaleTimeString() };
                    setLogs([...logs, newLog, { type: 'info', text: 'Command processed in offline mode.', timestamp: new Date().toLocaleTimeString() }]);
                    setInput('');
                }
            };

            return React.createElement('div', { className: 'h-screen flex flex-col wave-bg' },
                React.createElement('div', { className: 'wave' }),
                React.createElement('div', { className: 'wave' }),
                React.createElement('div', { className: 'flex-1 p-8 flex flex-col' },
                    React.createElement('div', { className: 'bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex-1 overflow-auto' },
                        logs.map((l, i) => React.createElement('div', { key: i, className: 'mb-2 text-sm' },
                            React.createElement('span', { className: 'opacity-50 mr-2' }, '[' + l.timestamp + ']'),
                            React.createElement('span', { className: l.type === 'error' ? 'text-red-400' : l.type === 'success' ? 'text-emerald-400' : 'text-white' }, l.text)
                        ))
                    ),
                    React.createElement('input', {
                        className: 'mt-4 bg-black/60 border border-white/20 rounded-xl p-4 outline-none focus:border-orange-400 transition-colors',
                        placeholder: 'Type command...',
                        value: input,
                        onChange: (e) => setInput(e.target.value),
                        onKeyDown: handleCmd
                    })
                )
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
    </script>
</body>
</html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PUBLICDOWNLOAD.HTML';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog('success', 'PUBLICDOWNLOAD.HTML generated and download started.');
  };

  return (
    <div className="relative h-screen w-full bg-[#1a1a2e] overflow-hidden font-mono selection:bg-orange-500/30">
      {/* --- Animated Sunset Background --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#ff7e5f] via-[#feb47b] to-[#1a1a2e] opacity-80" />
      
      {/* Waves */}
      <div className="absolute bottom-0 left-0 w-full h-64 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [-1000, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-50px] left-0 w-[4000px] h-64 bg-white/10 blur-3xl rounded-[40%] rotate-[-2deg]"
        />
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-80px] left-0 w-[4000px] h-64 bg-white/5 blur-2xl rounded-[45%] rotate-[1deg]"
        />
      </div>

      {/* --- Main UI Layout --- */}
      <div className="relative z-10 h-full flex flex-col p-4 md:p-8 gap-6">
        
        {/* Header */}
        <header className="flex items-center justify-between bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Terminal className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Sunset Console</h1>
              <p className="text-[10px] text-white/60 uppercase tracking-widest">System Operational • v1.0.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={downloadHTML}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all text-sm text-white"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download HTML</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Live</span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
          
          {/* --- Console Section --- */}
          <section className="flex-1 flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-bottom border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-4 text-xs text-white/40 uppercase tracking-widest">Terminal Output</span>
              </div>
              <Activity className="w-4 h-4 text-white/20" />
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar"
            >
              {logs.map((log, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className="flex gap-4 text-sm"
                >
                  <span className="text-white/30 shrink-0">[{log.timestamp}]</span>
                  <span className={`
                    ${log.type === 'error' ? 'text-red-400' : ''}
                    ${log.type === 'success' ? 'text-emerald-400' : ''}
                    ${log.type === 'command' ? 'text-orange-400 font-bold' : ''}
                    ${log.type === 'system' ? 'text-blue-400 italic' : ''}
                    ${log.type === 'info' ? 'text-white/80' : ''}
                  `}>
                    {log.text}
                  </span>
                </motion.div>
              ))}
              {isSystemHalted && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mt-4">
                  <AlertTriangle className="text-red-500 w-5 h-5" />
                  <span className="text-red-500 font-bold">SYSTEM HALTED. INPUT DISABLED.</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-black/20 border-t border-white/5">
              <div className="relative flex items-center">
                <span className="absolute left-4 text-orange-400 font-bold">$</span>
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommand(inputValue)}
                  disabled={isSystemHalted}
                  placeholder={isSystemHalted ? "System Halted..." : "Type command (e.g. !connect, !ping, !locate)..."}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-white placeholder:text-white/20 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>
          </section>

          {/* --- Menu Section --- */}
          <aside className={`
            fixed md:relative inset-0 md:inset-auto z-50 md:z-0
            w-full md:w-80 flex flex-col gap-6
            transition-transform duration-500
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          `}>
            {/* Mobile Overlay */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            <div className="relative z-10 h-full flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Menu className="text-orange-400 w-5 h-5" />
                  <h2 className="text-white font-bold uppercase tracking-widest text-sm">Software Hub</h2>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="md:hidden text-white/40 hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {INITIAL_SOFTWARE.map((soft) => (
                  <div 
                    key={soft.id}
                    className={`
                      p-4 rounded-2xl border transition-all cursor-pointer group
                      ${connectedSoftware.includes(soft.id) 
                        ? 'bg-orange-500/10 border-orange-500/30' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10'}
                    `}
                    onClick={() => toggleConnection(soft.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-white/40 uppercase font-bold">{soft.type}</span>
                      <div className={`w-2 h-2 rounded-full ${soft.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium">{soft.name}</h3>
                      <div className={`
                        p-2 rounded-lg transition-colors
                        ${connectedSoftware.includes(soft.id) ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40 group-hover:text-white'}
                      `}>
                        <LinkIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-white/5 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-white/40">Connected Nodes</span>
                  <span className="text-xs text-orange-400 font-bold">{connectedSoftware.length} / {INITIAL_SOFTWARE.length}</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(connectedSoftware.length / INITIAL_SOFTWARE.length) * 100}%` }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </div>
            </div>
          </aside>
        </main>

        {/* --- Connecting Points Visualization --- */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="flex items-center gap-8">
            <div className="w-4 h-4 rounded-full bg-orange-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            </div>
            <div className="h-[1px] w-32 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0" />
            <div className="w-4 h-4 rounded-full bg-orange-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            </div>
          </div>
        </div>

        {/* --- Settings Modal --- */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-[#1a1a2e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    <Settings className="text-orange-400 w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">System Settings</h2>
                  </div>
                  <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-xs text-white/40 uppercase font-bold mb-2 block">Connection Protocol</span>
                      <select className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-orange-500">
                        <option>WebSocket (Secure)</option>
                        <option>HTTP/2 Stream</option>
                        <option>UDP Broadcast</option>
                      </select>
                    </label>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <h4 className="text-white font-medium">Auto-Reconnect</h4>
                        <p className="text-xs text-white/40">Attempt recovery on signal loss</p>
                      </div>
                      <div className="w-12 h-6 bg-orange-500 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setShowSettings(false);
                      addLog('success', 'Settings updated successfully.');
                    }}
                    className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
