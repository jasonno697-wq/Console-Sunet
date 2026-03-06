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
  isGame?: boolean;
  canOverride?: boolean;
  downloadUrl?: string;
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
  { id: '4', name: 'Cloud Sync', status: 'online', type: 'Service' },
  { id: '5', name: 'Drive Access', status: 'online', type: 'System' },
  { id: 'sys-override', name: 'Restricted Game Engine', status: 'online', type: 'System', isGame: true, canOverride: true, downloadUrl: 'https://github.com/topics/game-engine' },
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
  { cmd: '!bypass', desc: 'Enhances system nodes for maximum effectiveness', icon: <Cpu className="w-4 h-4" /> },
  { cmd: '!bypassai', desc: 'Uses AI to analyze source and find patches', icon: <Activity className="w-4 h-4" /> },
  { cmd: '!clear', desc: 'Clears console history from past 12 hours', icon: <XCircle className="w-4 h-4" /> },
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
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [clearedLogs, setClearedLogs] = useState<LogEntry[]>([]);
  const [pendingBypassId, setPendingBypassId] = useState<string | null>(null);
  const [selectedSoftwareForDownload, setSelectedSoftwareForDownload] = useState<Software | null>(null);
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

  const openExternalSafely = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
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
            { id: 'app-1', name: 'Discord.exe', status: 'online', type: 'App', downloadUrl: 'https://discord.com/download' },
            { id: 'app-2', name: 'Spotify.exe', status: 'online', type: 'App', downloadUrl: 'https://www.spotify.com/download' },
            { id: 'proc-1', name: 'System Idle Process', status: 'online', type: 'Process' },
            { id: 'proc-2', name: 'Restricted Kernel Node', status: 'online', type: 'Process', canOverride: true, downloadUrl: 'https://kernel.org' },
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
        addLog('system', 'INJECTING KERNEL OVERRIDE PROTOCOLS...');
        addLog('system', '0x7FFD4A2B: MOV EAX, 1; INT 0x80; // FORCING ROOT ACCESS');
        setTimeout(() => {
          setIsBypassActive(prev => !prev);
          addLog('success', `DEADLY ENHANCEMENT MODE ${!isBypassActive ? 'ACTIVE' : 'OFFLINE'}. System nodes optimized for maximum lethality.`);
          if (!isBypassActive) addLog('error', 'WARNING: Kernel integrity compromised. System restrictions permanently bypassed.');
        }, 1500);
      },
      '!bypassai': () => {
        addLog('info', 'AI NEURAL NETWORK ANALYZING VULNERABILITIES...');
        addLog('info', 'Pattern matching: [Buffer Overflow, SQLi, RCE, Zero-Day]');
        
        setTimeout(() => {
          addLog('system', 'Deep-linking into kernel memory clusters...');
          addLog('info', 'AI analyzing data patterns in /src/App.tsx...');
          addLog('system', 'EXPLOIT IDENTIFIED: 0xDEADBEEF-CVE-2026');
          
          setTimeout(() => {
            addLog('success', 'AI Analysis Complete: Deadly exploit identified.');
            addLog('system', 'Patch ID: AI-DEADLY-992X-B');
            addLog('info', 'Activating AI-assisted kernel override...');
            setIsBypassActive(true);
            
            // Trigger a special AI download
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`AI-DEADLY SYSTEM EXPLOIT\nSource: Neural Analysis Engine\nTarget: Kernel Root Override\nStatus: VERIFIED\nTimestamp: ${new Date().toISOString()}`);
            link.download = `AI_DEADLY_EXPLOIT.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            addLog('success', 'AI-Deadly Exploit downloaded. System security completely dismantled.');
          }, 2000);
        }, 1500);
      },
      '!clear': () => {
        addLog('system', 'Purging console history from past 12 hours...');
        setClearedLogs(prev => [...prev, ...logs]);
        setLogs([]);
        setTimeout(() => {
          addLog('success', 'History purged. Use "Recover Version" in Software Hub to restore.');
        }, 1000);
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
    
    // If bypass is active, trigger override/enhancement logic instead of normal connection
    if (isBypassActive && !isCurrentlyConnected) {
      if (soft.downloadUrl) {
        addLog('system', `EXTRACTING EXTERNAL LINK FOR ${soft.name}...`);
        addLog('info', `Redirecting to external node: ${soft.downloadUrl}`);
        openExternalSafely(soft.downloadUrl);
        return;
      }
      setPendingBypassId(id);
      setShowBypassConfirm(true);
      return;
    }

    if (!isCurrentlyConnected && soft.name.toLowerCase().includes('google chrome')) {
      addLog('info', 'Chrome connection detected. Injecting site unblocking script...');
      setTimeout(() => {
        addLog('success', 'All restricted sites unblocked via Chrome proxy.');
      }, 1000);
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
    
    addLog('success', `${isCurrentlyConnected ? 'Disconnected from' : 'Connected to'} ${soft.name}${isForced ? ' (BYPASS ACTIVE - ENHANCED MODE)' : ''}`);
  };

  const handleOverrideDownload = (type: 'game' | 'code') => {
    if (!selectedSoftwareForDownload) return;
    
    const soft = selectedSoftwareForDownload;
    addLog('system', `OVERRIDE: Downloading ${type === 'game' ? 'Game Package' : 'Source Code'} for ${soft.name}...`);
    
    const link = document.createElement('a');
    const content = type === 'game' 
      ? `BINARY GAME DATA for ${soft.name}\nStatus: OVERRIDDEN\nTimestamp: ${new Date().toISOString()}`
      : `SOURCE CODE for ${soft.name}\nStatus: EXTRACTED\nTimestamp: ${new Date().toISOString()}`;
    
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    link.download = `${soft.name.replace(/\s+/g, '_')}_${type}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowDownloadModal(false);
    executeConnection(soft.id, true);
  };

  const recoverVersion = () => {
    if (clearedLogs.length === 0) {
      addLog('error', 'No history found in recovery buffer.');
      return;
    }
    addLog('system', 'Restoring console history from recovery buffer...');
    setLogs(prev => [...clearedLogs, ...prev]);
    setClearedLogs([]);
    addLog('success', 'History restored successfully.');
  };

  const downloadHTML = () => {
    const generatedAt = new Date().toISOString();

    const escapeHtml = (value: string) =>
      value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const softwareRows = softwareList
      .map(
        (soft) => `
          <tr>
            <td>${escapeHtml(soft.name)}</td>
            <td>${escapeHtml(soft.type)}</td>
            <td>${escapeHtml(soft.status)}</td>
            <td>${connectedSoftware.includes(soft.id) ? 'Connected' : 'Disconnected'}</td>
            <td>${soft.downloadUrl ? escapeHtml(soft.downloadUrl) : '—'}</td>
          </tr>`,
      )
      .join('');

    const logItems = logs
      .slice(-200)
      .map(
        (log) => `
        <li><strong>[${escapeHtml(log.timestamp)}]</strong> <em>${escapeHtml(log.type)}</em> - ${escapeHtml(log.text)}</li>`,
      )
      .join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sunset Console - Full System Export</title>
  <style>
    body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; margin: 2rem; background: #0b1020; color: #e6edf3; }
    h1, h2 { color: #f59e0b; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { border: 1px solid #2f3b54; padding: 0.5rem; text-align: left; vertical-align: top; }
    th { background: #141c2f; }
    code { background: #141c2f; padding: 0.1rem 0.3rem; border-radius: 4px; }
    .meta { color: #94a3b8; margin-bottom: 1rem; }
    ul { padding-left: 1.2rem; }
    li { margin-bottom: 0.35rem; }
  </style>
</head>
<body>
  <h1>Sunset Console - Full System Export</h1>
  <p class="meta">Generated: <code>${generatedAt}</code></p>

  <h2>System State</h2>
  <ul>
    <li>Bypass Active: <strong>${isBypassActive ? 'Yes' : 'No'}</strong></li>
    <li>System Halted: <strong>${isSystemHalted ? 'Yes' : 'No'}</strong></li>
    <li>Connected Software Count: <strong>${connectedSoftware.length}</strong></li>
    <li>Total Known Software: <strong>${softwareList.length}</strong></li>
  </ul>

  <h2>Software Inventory</h2>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Status</th>
        <th>Connection</th>
        <th>Download URL</th>
      </tr>
    </thead>
    <tbody>${softwareRows || '<tr><td colspan="5">No software found.</td></tr>'}</tbody>
  </table>

  <h2>Recent Logs (last ${Math.min(logs.length, 200)})</h2>
  <ul>${logItems || '<li>No logs captured.</li>'}</ul>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SUNSET_FULL_SYSTEM_EXPORT.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog('success', 'SUNSET_FULL_SYSTEM_EXPORT.html generated and download started.');
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
                      ${isBypassActive && soft.downloadUrl ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''}
                    `}
                    onClick={() => toggleConnection(soft.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-white/40 uppercase font-bold">{soft.type}</span>
                      <div className="flex items-center gap-2">
                        {soft.status === 'offline' && isBypassActive && (
                          <span className="text-[8px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold animate-pulse">BYPASSED</span>
                        )}
                        {isBypassActive && soft.downloadUrl && (
                          <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold animate-pulse">EXTERNAL NODE</span>
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
                        ${isBypassActive && soft.downloadUrl ? 'bg-red-600 text-white' : ''}
                      `}>
                        {isBypassActive && soft.downloadUrl ? <Download className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-white/5 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
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
                {clearedLogs.length > 0 && (
                  <button 
                    onClick={recoverVersion}
                    className="w-full py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Recover Version
                  </button>
                )}
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
                    <h2 className="text-2xl font-bold text-white mb-2">System Enhancement</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                      You are attempting to apply a performance override to this node. This will inject an optimization patch to increase effectiveness.
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
                      Apply Enhancement Patch
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

        {/* --- Download Choice Modal --- */}
        <AnimatePresence>
          {showDownloadModal && (
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
                className="w-full max-w-md bg-[#1a1a2e] border border-emerald-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]"
              >
                <div className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <Download className="text-emerald-500 w-10 h-10 animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Override Successful</h2>
                    <p className="text-white/60 text-sm leading-relaxed">
                      System restrictions for <span className="text-emerald-400 font-bold">{selectedSoftwareForDownload?.name}</span> have been lifted. Choose your download package.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleOverrideDownload('game')}
                      className="flex flex-col items-center gap-3 p-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl transition-all group"
                    >
                      <Activity className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-white uppercase tracking-widest">Download Game</span>
                    </button>
                    <button 
                      onClick={() => handleOverrideDownload('code')}
                      className="flex flex-col items-center gap-3 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-2xl transition-all group"
                    >
                      <Cpu className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-white uppercase tracking-widest">Download Code</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowDownloadModal(false)}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/40 text-xs font-bold rounded-2xl transition-all"
                  >
                    Cancel Override
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
