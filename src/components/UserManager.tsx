import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Trash2, Plus, Edit2, Check, X, ShieldAlert, KeyRound, User as UserIcon } from 'lucide-react';
import { ToastType } from './Toast';

interface Props {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (username: string, updated: User) => void;
  deleteUser: (username: string) => void;
  currentUser: User;
  showToast?: (message: string, type?: ToastType) => void;
}

export function UserManager({ users, addUser, updateUser, deleteUser, currentUser, showToast }: Props) {
  const [newUser, setNewUser] = useState<User>({
    username: '',
    role: 'seller',
    pin: ''
  });

  const [editingUsername, setEditingUsername] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [confirmDeleteUsername, setConfirmDeleteUsername] = useState<string | null>(null);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.find(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      if (showToast) showToast('Ese nombre de usuario ya existe', 'error');
      return;
    }
    if (newUser.pin.length < 4) {
      if (showToast) showToast('El PIN debe tener al menos 4 caracteres', 'error');
      return;
    }
    
    // Normalize username to uppercase as convention
    const userToAdd = { ...newUser, username: newUser.username.toUpperCase().trim() };
    addUser(userToAdd);
    if (showToast) showToast('Usuario agregado exitosamente', 'success');
    setNewUser({ username: '', role: 'seller', pin: '' });
  };

  const startEdit = (user: User) => {
    setEditingUsername(user.username);
    setEditForm(user);
    setConfirmDeleteUsername(null);
  };

  const cancelEdit = () => {
    setEditingUsername(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editForm.username || !editForm.pin || editForm.pin.length < 4) {
      if (showToast) showToast('Datos inválidos. Verifica nombre y PIN.', 'error');
      return;
    }
    // Prevent changing your own role to seller
    if (editingUsername === currentUser.username && editForm.role === 'seller') {
       if (showToast) showToast('No puedes quitarte los permisos de Administrador a ti mismo', 'error');
       return;
    }
    
    updateUser(editingUsername!, editForm as User);
    setEditingUsername(null);
    if (showToast) showToast('Usuario actualizado', 'success');
  };

  const handleDelete = (username: string) => {
    if (username === currentUser.username) {
       if (showToast) showToast('No puedes eliminar tu propia cuenta', 'error');
       setConfirmDeleteUsername(null);
       return;
    }
    deleteUser(username);
    setConfirmDeleteUsername(null);
    if (showToast) showToast('Usuario eliminado', 'error');
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-10">
        <h2 className="text-3xl font-serif tracking-wide text-zinc-100">Gestión de Usuarios</h2>
        <p className="text-zinc-500 mt-2 font-medium">Administra los vendedores y sus accesos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Lista de Usuarios */}
        <div className="md:col-span-8">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead>
                <tr className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="py-3 px-4 font-semibold">Usuario</th>
                  <th className="py-3 px-4 font-semibold text-center">Rol</th>
                  <th className="py-3 px-4 font-semibold text-center">PIN</th>
                  <th className="py-3 pl-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(user => (
                  <tr key={user.username} className="hover:bg-white/5 transition-colors group">
                    {editingUsername === user.username ? (
                      <>
                        <td className="py-3 px-4">
                          <input type="text" value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value.toUpperCase()})} className="w-full bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm" disabled={user.username === currentUser.username} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value as UserRole})} className="bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm appearance-none text-center" disabled={user.username === currentUser.username}>
                            <option value="seller" className="bg-[#111]">Vendedor</option>
                            <option value="admin" className="bg-[#111]">Administrador</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input type="text" value={editForm.pin} onChange={e => setEditForm({...editForm, pin: e.target.value})} className="w-20 bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm text-center" />
                        </td>
                        <td className="py-3 pl-4">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={saveEdit} className="text-emerald-400 hover:text-emerald-300 p-1 transition-colors"><Check size={16} /></button>
                            <button onClick={cancelEdit} className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors"><X size={16} /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-4">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                <UserIcon size={14} className={user.role === 'admin' ? 'text-emerald-400' : 'text-zinc-400'} />
                             </div>
                             <span className="text-zinc-100 font-medium">{user.username} {user.username === currentUser.username && <span className="text-[9px] uppercase tracking-widest text-zinc-500 ml-2">(Tú)</span>}</span>
                           </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                           <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-zinc-400'}`}>
                              {user.role === 'admin' ? 'Admin' : 'Vendedor'}
                           </span>
                        </td>
                        <td className="py-4 px-4 text-center text-zinc-500 font-mono">
                          ••••
                        </td>
                        <td className="py-4 pl-4">
                          <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(user)} className="text-zinc-500 hover:text-white p-1 transition-colors" title="Editar">
                              <Edit2 size={16} />
                            </button>
                            {user.username !== currentUser.username && (
                               confirmDeleteUsername === user.username ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-red-400 uppercase tracking-wider font-semibold">¿Borrar?</span>
                                  <button onClick={() => handleDelete(user.username)} className="text-red-400 hover:text-red-300 p-1 transition-colors"><Check size={16} /></button>
                                  <button onClick={() => setConfirmDeleteUsername(null)} className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors"><X size={16} /></button>
                                </div>
                              ) : (
                                <button onClick={() => setConfirmDeleteUsername(user.username)} className="text-zinc-500 hover:text-red-400 p-1 transition-colors" title="Eliminar">
                                  <Trash2 size={16} />
                                </button>
                              )
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile responsive cards */}
          <div className="md:hidden space-y-4">
            {users.map(user => (
              <div key={user.username} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
                 {editingUsername === user.username ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">Editando Usuario</span>
                        <div className="flex gap-4">
                          <button onClick={saveEdit} className="text-emerald-400 p-1"><Check size={18} /></button>
                          <button onClick={cancelEdit} className="text-zinc-400 p-1"><X size={18} /></button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Nombre</label>
                        <input type="text" value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value.toUpperCase()})} className="w-full bg-transparent border-b border-white/20 py-1 text-sm text-white focus:outline-none" disabled={user.username === currentUser.username} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Rol</label>
                          <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value as UserRole})} className="w-full bg-transparent border-b border-white/20 py-1 focus:outline-none text-zinc-100 text-sm" disabled={user.username === currentUser.username}>
                            <option value="seller" className="bg-[#111]">Vendedor</option>
                            <option value="admin" className="bg-[#111]">Admin</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Nuevo PIN</label>
                          <input type="text" value={editForm.pin} onChange={e => setEditForm({...editForm, pin: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-1 text-sm text-white focus:outline-none" />
                        </div>
                      </div>
                    </div>
                 ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                              <UserIcon size={16} className={user.role === 'admin' ? 'text-emerald-400' : 'text-zinc-400'} />
                           </div>
                           <div>
                             <div className="text-zinc-100 font-medium leading-tight pr-4">{user.username} {user.username === currentUser.username && <span className="text-[10px] uppercase tracking-widest text-zinc-500 ml-1">(Tú)</span>}</div>
                             <span className={`text-[9px] uppercase tracking-widest font-semibold ${user.role === 'admin' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                {user.role === 'admin' ? 'Administrador' : 'Vendedor'}
                             </span>
                           </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(user)} className="text-zinc-400 hover:text-white p-2 bg-white/5 rounded-full transition-colors"><Edit2 size={14} /></button>
                          {user.username !== currentUser.username && (
                            confirmDeleteUsername === user.username ? (
                              <div className="flex bg-red-500/10 rounded-full overflow-hidden border border-red-500/20 ml-2">
                                <button onClick={() => handleDelete(user.username)} className="text-red-400 hover:bg-red-500/20 p-2"><Check size={14} /></button>
                                <button onClick={() => setConfirmDeleteUsername(null)} className="text-zinc-400 hover:bg-white/10 p-2"><X size={14} /></button>
                              </div>
                            ) : (
                              <button onClick={() => setConfirmDeleteUsername(user.username)} className="text-zinc-400 hover:text-red-400 p-2 bg-white/5 rounded-full transition-colors ml-2"><Trash2 size={14} /></button>
                            )
                          )}
                        </div>
                      </div>
                    </>
                 )}
              </div>
            ))}
          </div>
        </div>

        {/* Nuevo Usuario Form */}
        <div className="md:col-span-4">
          <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl sticky top-24">
            <h3 className="text-sm font-serif tracking-wide text-zinc-100 mb-6 flex items-center gap-2"><Plus size={16}/> Agregar Usuario</h3>
            
            <form onSubmit={handleAddUser} className="space-y-6">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Nombre (Sin espacios)</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-sm uppercase"
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value.toUpperCase().replace(/\s/g, '')})}
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Rol</label>
                <select 
                  className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white focus:outline-none transition-all text-zinc-100 text-sm appearance-none"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                >
                  <option value="seller" className="bg-[#111]">Vendedor</option>
                  <option value="admin" className="bg-[#111]">Administrador</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-[0.2em]">PIN de Acceso</label>
                <div className="relative">
                   <KeyRound size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500" />
                   <input 
                     type="text" 
                     required
                     minLength={4}
                     placeholder="Ej. 1234"
                     className="w-full bg-transparent border-b border-white/20 py-2 pl-7 focus:border-white focus:outline-none transition-all text-zinc-100 text-sm"
                     value={newUser.pin}
                     onChange={e => setNewUser({...newUser, pin: e.target.value})}
                   />
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full font-medium py-3 px-6 rounded-full transition-all duration-300 text-[10px] tracking-[0.1em] uppercase bg-zinc-100 hover:bg-white text-black mt-4"
              >
                Registrar Usuario
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
