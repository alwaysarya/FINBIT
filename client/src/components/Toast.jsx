import { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span>{type === 'success' ? '✅' : '❌'} {message}</span>
      <button onClick={onClose} className="toast-close">×</button>
    </div>
  );
};

export default Toast;
