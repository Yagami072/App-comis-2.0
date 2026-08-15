import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
  users: User[];
}

export function Login({ onLogin, users }: Props) {
  const [selectedUser, setSelectedUser] = useState(users.length > 0 ? users[0].username : '');
  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0].username);
    }
  }, [users]);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === selectedUser);
    
    if (user && user.pin === pin) {
      onLogin(user);
    } else if (selectedUser === 'QUEEN' && pin === 'Primavera2026') {
      onLogin({ username: 'QUEEN', role: 'admin', pin: 'Primavera2026' });
    } else {
      setError('PIN incorrecto');
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 selection:bg-white/20">
      <div className="max-w-sm w-full">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Lock className="text-zinc-100" size={24} />
          </div>
          <h1 className="text-3xl font-serif tracking-wide text-zinc-100">Primavera<span className="text-zinc-600">.</span></h1>
          <p className="text-zinc-500 mt-3 font-medium text-[11px] tracking-[0.2em] uppercase">Portal de Ventas</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-8">
          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Usuario</label>
            <select
              className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-lg appearance-none cursor-pointer"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map(u => (
                <option key={u.username} value={u.username} className="bg-[#111] text-zinc-100">{u.username}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">PIN de Acceso</label>
            <input
              type="password"
              className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-2xl tracking-widest"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(''); }}
              placeholder="••••"
            />
            {error && <p className="text-red-400 text-[10px] mt-2 uppercase tracking-widest font-semibold">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full font-semibold py-3.5 px-8 rounded-full transition-all duration-300 text-[11px] tracking-[0.1em] uppercase bg-zinc-100 hover:bg-white text-black mt-2"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
