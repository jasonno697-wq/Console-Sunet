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
  type: 'System' | 'App' | 'Service' | 'Tab' | 'Process';
}

interface CommandDef {
  cmd: string;
  desc: string;
  icon: React.ReactNode;
}

// --- Constants ---
const DEFAULT_SOFTWARE: Software[] = [
  { id: '1', name: 'Core Engine', status: 'online', type: 'System' },
  { id: '2', name: 'Wave Processor', status: 'online', type: 'Service' },
  { id: '3', name: 'Sunset Renderer', status: 'online', type: 'App' },
  { id: '4', name: 'Cloud Sync', status: 'offline', type: 'Service' },
  { id: '5', name: 'Drive Access', status: 'offline', type: 'System' },
];

const COMMANDS: CommandDef[] = [
  { cmd: '!reload', desc: 'Reloads the application', icon: <RefreshCw className="w-4 h-4" /> },
  { cmd: '!fix', desc: 'Restarts app and pulls up bug error', icon: <Activity className="w-4 h-4" /> },
  { cmd: '!locate', desc: 'Locates app origin using drive', icon: <MapPin className="w-4 h-4" /> },
  { cmd: '!ping', desc: 'Pings the app to see if its working', icon: <Wifi className="w-4 h-4" /> },
  { cmd: '!find', desc: 'Finds the app in system clusters', icon: <Search className="w-4 h-4" /> },
  { cmd: '!stoptask', desc: 'Stops the app from working', icon: <XCircle className="w-4 h-4" /> },
  { cmd: '!settings', desc: 'Access connected software settings', icon: <Settings className="w-4 h-4" /> },
  { cmd: '!connect', desc: 'Shows menu to connect to programs', icon: <LinkIcon className="w-4 h-4" /> },
  { cmd: '!bypass', desc: 'Bypasses system restrictions for apps', icon: <Cpu className="w-4 h-4" /> },
  { cmd: '!bypassai', desc: 'Uses AI to analyze source and find patches', icon: <Activity className="w-4 h-4" /> },
];

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [softwareList, setSoftwareList] = useState<Software[]>(DEFAULT_SOFTWARE);
  const [connectedSoftware, setConnectedSoftware] = useState<string[]>([]);
  const [isSystemHalted, setIsSystemHalted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [showBypassConfirm, setShowBypassConfirm] = useState(false);
  const [pendingBypassId, setPendingBypassId] = useState<string | null>(null);
  const [isBypassActive, setIsBypassActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
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

    const handlers: Record<string, () => void> = {
      '!reload': () => {
        addLog('info', 'Reloading application...');
        setTimeout(() => window.location.reload(), 1000);
      },
      '!fix': () => {
        addLog('system', 'Restarting system services...');
        addLog('error', 'CRITICAL_ERROR: Memory leak detected at 0x004F2A');
        addLog('info', 'Patching kernel...');
        setTimeout(() => {
          setIsSystemHalted(false);
          addLog('success', 'System restored successfully.');
        }, 2000);
      },
      '!locate': () => {
        addLog('info', 'Initializing deep system scan...');
        addLog('system', 'Scanning Drive [C:] ...');
        setTimeout(() => {
          addLog('system', 'Scanning Drive [D:] ...');
          addLog('info', 'Found 5 software clusters in system drive.');
          addLog('success', 'Location confirmed: /system/root/sunset_console');
        }, 1000);
      },
      '!ping': () => {
        const latency = Math.floor(Math.random() * 50) + 10;
        addLog('success', `Pong! Latency: ${latency}ms. Connection stable.`);
      },
      '!find': () => {
        if (connectedSoftware.length === 0) {
          addLog('error', 'No software connected. Use !connect first.');
        } else {
          addLog('info', `Searching system for ${connectedSoftware[0]}...`);
          setTimeout(() => addLog('success', 'Application found in active memory cluster.'), 1500);
        }
      },
      '!stoptask': () => {
        addLog('error', 'Stopping all tasks...');
        setIsSystemHalted(true);
      },
      '!settings': () => {
        if (connectedSoftware.length === 0) {
          addLog('error', 'Connect to a software to access its settings.');
        } else {
          setShowSettings(true);
          addLog('info', 'Opening settings panel...');
        }
      },
      '!connect': () => {
        setIsMenuOpen(true);
        setIsScanning(true);
        addLog('info', 'Scanning system for active tabs, apps, and processes...');
        
        setTimeout(() => {
          const detectedItems: Software[] = [
            { id: 'tab-1', name: 'Google Search: "How to hack"', status: 'online', type: 'Tab' },
            { id: 'tab-2', name: 'YouTube: "Sunset Waves 24/7"', status: 'online', type: 'Tab' },
            { id: 'app-1', name: 'Discord.exe', status: 'online', type: 'App' },
            { id: 'app-2', name: 'Spotify.exe', status: 'online', type: 'App' },
            { id: 'proc-1', name: 'System Idle Process', status: 'online', type: 'Process' },
            { id: 'proc-2', name: 'Restricted Kernel Node', status: 'offline', type: 'Process' },
          ];
          
          setSoftwareList(prev => {
            const existingIds = new Set(prev.map(s => s.id));
            const newItems = detectedItems.filter(item => !existingIds.has(item.id));
            return [...prev, ...newItems];
          });
          
          setIsScanning(false);
          addLog('success', `Scan complete. Found ${detectedItems.length} new connectable nodes.`);
        }, 2000);
      },
      '!bypass': () => {
        addLog('system', 'Injecting bypass protocol into system buttons...');
        setTimeout(() => {
          setIsBypassActive(prev => !prev);
          addLog('success', `Bypass Mode ${!isBypassActive ? 'ENABLED' : 'DISABLED'}. System restrictions lifted. Forced download protocols active.`);
        }, 1500);
      },
      '!bypassai': () => {
        addLog('info', 'Initializing Neural Analysis Engine...');
        addLog('system', 'Scanning application source code for vulnerabilities...');
        
        setTimeout(() => {
          addLog('system', 'Deep-linking into kernel memory clusters...');
          addLog('info', 'AI analyzing data patterns in /src/App.tsx...');
          
          setTimeout(() => {
            addLog('success', 'AI Analysis Complete: Optimized patch identified.');
            addLog('system', 'Patch ID: AI-OPT-992X-B');
            addLog('info', 'Activating AI-assisted bypass...');
            setIsBypassActive(true);
            
            // Trigger a special AI download
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`AI-OPTIMIZED SYSTEM PATCH\nSource: Neural Analysis Engine\nTarget: Kernel Override\nStatus: VERIFIED\nTimestamp: ${new Date().toISOString()}`);
            link.download = `AI_OPTIMIZED_PATCH.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            addLog('success', 'AI-Optimized Patch downloaded. System restrictions permanently bypassed for this session.');
          }, 2000);
        }, 1500);
      }
    };

    if (handlers[cleanCmd]) {
      handlers[cleanCmd]();
    } else {
      addLog('error', `Unknown command: ${cmd}. Type !connect for help.`);
    }
    setInputValue('');
  };

  const toggleConnection = (id: string) => {
    const soft = softwareList.find(s => s.id === id);
    if (!soft) return;

    const isCurrentlyConnected = connectedSoftware.includes(id);
    
    // Check if software is offline and bypass is NOT active
    if (soft.status === 'offline' && !isBypassActive && !isCurrentlyConnected) {
      addLog('error', `Cannot connect to ${soft.name}. Software is OFFLINE. Use !bypass to override.`);
      return;
    }

    if (isBypassActive && soft.status === 'offline' && !isCurrentlyConnected) {
      setPendingBypassId(id);
      setShowBypassConfirm(true);
      return;
    }

    executeConnection(id);
  };

  const executeConnection = (id: string, isForced: boolean = false) => {
    const soft = softwareList.find(s => s.id === id);
    if (!soft) return;

    const isCurrentlyConnected = connectedSoftware.includes(id);

    if (isForced) {
      addLog('system', `FORCING DOWNLOAD: System Patch for ${soft.name}...`);
      const link = document.createElement('a');
      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`System Patch for ${soft.name}\nBypass Protocol Active\nTimestamp: ${new Date().toISOString()}`);
      link.download = `${soft.name.replace(/\s+/g, '_')}_patch.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setConnectedSoftware(prev => 
      isCurrentlyConnected ? prev.filter(i => i !== id) : [...prev, id]
    );
    
    addLog('success', `${isCurrentlyConnected ? 'Disconnected from' : 'Connected to'} ${soft.name}${isForced ? ' (BYPASS ACTIVE - FORCED DOWNLOAD)' : ''}`);
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
            const [showCmds, setShowCmds] = useState(false);

            const commands = [
                { cmd: '!reload', desc: 'Reloads the application' },
                { cmd: '!fix', desc: 'Restarts app and pulls up bug error' },
                { cmd: '!locate', desc: 'Locates app origin using drive' },
                { cmd: '!ping', desc: 'Pings the app to see if its working' },
                { cmd: '!find', desc: 'Finds the app in system clusters' },
                { cmd: '!stoptask', desc: 'Stops the app from working' },
                { cmd: '!settings', desc: 'Access connected software settings' },
                { cmd: '!connect', desc: 'Shows menu to connect to programs' },
                { cmd: '!bypass', desc: 'Bypasses system restrictions for apps' },
                { cmd: '!bypassai', desc: 'Uses AI to analyze source and find patches' }
            ];

            const handleCmd = (e) => {
                if (e.key === 'Enter') {
                    const newLog = { type: 'command', text: '> ' + input, timestamp: new Date().toLocaleTimeString() };
                    setLogs([...logs, newLog, { type: 'info', text: 'Command processed in offline mode.', timestamp: new Date().toLocaleTimeString() }]);
                    setInput('');
                }
            };

            return React.createElement('div', { className: 'h-screen flex flex-col wave-bg relative' },
                React.createElement('div', { className: 'wave' }),
                React.createElement('div', { className: 'wave' }),
                React.createElement('div', { className: 'flex-1 p-8 flex flex-col relative z-10' },
                    React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                        React.createElement('h1', { className: 'text-2xl font-bold' }, 'Sunset Console [Offline]'),
                        React.createElement('button', { 
                            onClick: () => setShowCmds(!showCmds),
                            className: 'px-4 py-2 bg-orange-500 rounded-xl font-bold'
                        }, 'Commands')
                    ),
                    React.createElement('div', { className: 'bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex-1 overflow-auto' },
                        logs.map((l, i) => React.createElement('div', { key: i, className: 'mb-2 text-sm' },
                            React.createElement('span', { className: 'opacity-50 mr-2' }, '[' + l.timestamp + ']'),
                            React.createElement('span', { className: l.type === 'error' ? 'text-red-400' : l.type === 'success' ? 'text-emerald-400' : 'text-white' }, l.text)
                        ))
                    ),
                    showCmds && React.createElement('div', { className: 'absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex items-center justify-center p-8' },
                        React.createElement('div', { className: 'bg-gray-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg' },
                            React.createElement('h2', { className: 'text-xl font-bold mb-4 text-orange-400' }, 'Commands'),
                            React.createElement('div', { className: 'grid grid-cols-1 gap-2 mb-6' },
                                commands.map(c => React.createElement('div', { key: c.cmd, className: 'flex justify-between border-b border-white/5 py-2' },
                                    React.createElement('span', { className: 'font-bold text-orange-400' }, c.cmd),
                                    React.createElement('span', { className: 'text-xs opacity-60' }, c.desc)
                                ))
                            ),
                            React.createElement('button', { 
                                onClick: () => setShowCmds(false),
                                className: 'w-full py-3 bg-white/10 rounded-xl'
                            }, 'Close')
                        )
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
              onClick={() => setIsMenuOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-sm text-white ${isBypassActive ? 'border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.3)] animate-pulse' : ''}`}
            >
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline">Software Hub</span>
            </button>
            {isBypassActive && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full"
              >
                <Cpu className="w-3 h-3 text-orange-400 animate-pulse" />
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-tighter">Bypass Active</span>
              </motion.div>
            )}
            <button 
              onClick={() => setShowCommands(true)}
              className={`flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl transition-all text-sm text-orange-400 font-bold ${isBypassActive ? 'animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.5)]' : ''}`}
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">Commands</span>
            </button>
            <button 
              onClick={downloadHTML}
              className={`flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all text-sm text-white ${isBypassActive ? 'border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : ''}`}
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
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      addLog('system', 'MANUAL OVERRIDE INITIATED...');
                      setTimeout(() => {
                        setIsBypassActive(prev => !prev);
                        addLog('success', `Security Override ${!isBypassActive ? 'ACTIVATED' : 'DEACTIVATED'}`);
                      }, 800);
                    }}
                    className={`p-2 rounded-lg border transition-all ${isBypassActive ? 'bg-orange-500 border-orange-400 text-white shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'}`}
                    title="Security Override"
                  >
                    <Cpu className={`w-4 h-4 ${isBypassActive ? 'animate-pulse' : ''}`} />
                  </button>
                  <button onClick={() => setIsMenuOpen(false)} className="md:hidden text-white/40 hover:text-white">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isScanning && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
                    <p className="text-xs text-white/40 animate-pulse uppercase tracking-widest">Scanning System...</p>
                  </div>
                )}
                {!isScanning && softwareList.map((soft) => (
                  <div 
                    key={soft.id}
                    className={`
                      p-4 rounded-2xl border transition-all cursor-pointer group
                      ${connectedSoftware.includes(soft.id) 
                        ? 'bg-orange-500/10 border-orange-500/30' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10'}
                      ${isBypassActive && soft.status === 'offline' ? 'border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : ''}
                    `}
                    onClick={() => toggleConnection(soft.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-white/40 uppercase font-bold">{soft.type}</span>
                      <div className="flex items-center gap-2">
                        {soft.status === 'offline' && isBypassActive && (
                          <span className="text-[8px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold animate-pulse">BYPASSED</span>
                        )}
                        <div className={`w-2 h-2 rounded-full ${soft.status === 'online' ? 'bg-emerald-500' : (isBypassActive ? 'bg-orange-500' : 'bg-red-500')}`} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium">{soft.name}</h3>
                      <div className={`
                        p-2 rounded-lg transition-colors
                        ${connectedSoftware.includes(soft.id) ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/40 group-hover:text-white'}
                        ${isBypassActive && soft.status === 'offline' ? 'bg-orange-500/20 text-orange-400' : ''}
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
                  <span className="text-xs text-orange-400 font-bold">{connectedSoftware.length} / {softwareList.length}</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(connectedSoftware.length / softwareList.length) * 100}%` }}
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

        {/* --- Commands Modal --- */}
        <AnimatePresence>
          {showCommands && (
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
                className="w-full max-w-2xl bg-[#1a1a2e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    <Terminal className="text-orange-400 w-6 h-6" />
                    <h2 className="text-xl font-bold text-white">Command Registry</h2>
                  </div>
                  <button onClick={() => setShowCommands(false)} className="text-white/40 hover:text-white">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {COMMANDS.map((c) => (
                    <div 
                      key={c.cmd}
                      className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group"
                      onClick={() => {
                        handleCommand(c.cmd);
                        setShowCommands(false);
                      }}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                          {c.icon}
                        </div>
                        <span className="text-orange-400 font-bold">{c.cmd}</span>
                      </div>
                      <p className="text-xs text-white/60">{c.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-white/5 border-t border-white/5 text-center">
                  <p className="text-xs text-white/40 italic">Tip: You can type these directly into the terminal console.</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Bypass Confirmation Modal --- */}
        <AnimatePresence>
          {showBypassConfirm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-md bg-[#1a1a2e] border border-orange-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.2)]"
              >
                <div className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto border border-orange-500/30">
                    <AlertTriangle className="text-orange-500 w-10 h-10 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Security Override</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                      You are attempting to force a connection to a restricted node. This will bypass kernel security and initiate a forced download of a system patch.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => {
                        if (pendingBypassId) {
                          executeConnection(pendingBypassId, true);
                        }
                        setShowBypassConfirm(false);
                        setPendingBypassId(null);
                      }}
                      className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20"
                    >
                      Force connection and download patch
                    </button>
                    <button 
                      onClick={() => {
                        setShowBypassConfirm(false);
                        setPendingBypassId(null);
                        addLog('info', 'Bypass connection cancelled by user.');
                      }}
                      className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/60 font-bold rounded-2xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
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
