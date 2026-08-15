import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  key?: React.Key;
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />,
    error: <AlertCircle className="text-red-400 shrink-0" size={20} />,
    info: <Info className="text-blue-400 shrink-0" size={20} />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111] border border-white/10 px-5 py-3.5 rounded-xl shadow-2xl text-zinc-200 text-sm font-medium"
    >
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose} className="text-zinc-500 hover:text-white ml-2 transition-colors">
        <X size={16} />
      </button>
    </motion.div>
  );
}
