import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface ToastProps {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ isOpen, message, type, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${
            type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
            'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
          }`}
        >
          {type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <p className="text-sm font-medium">{message}</p>
          <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
