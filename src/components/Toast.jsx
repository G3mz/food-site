import { CheckCircle, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast } = useCart();
  if (!toast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] toast-enter">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold ${
        toast.type === 'error'
          ? 'bg-red-600 text-white'
          : 'bg-navy text-white'
      }`}>
        {toast.type === 'error'
          ? <XCircle className="w-5 h-5 flex-shrink-0" />
          : <CheckCircle className="w-5 h-5 flex-shrink-0" />
        }
        {toast.message}
      </div>
    </div>
  );
}
