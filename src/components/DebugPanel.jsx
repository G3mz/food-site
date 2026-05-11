import { useState } from 'react';
import { X, AlertTriangle, ServerCrash, WifiOff, ShieldX, Construction, PackageX } from 'lucide-react';

const ERROR_SCREENS = [
  {
    id: '404',
    label: '404 — Не найдено',
    icon: <PackageX className="w-12 h-12 text-navy/30" />,
    title: 'Страница не найдена',
    desc: 'Такой страницы не существует. Возможно, она была удалена или вы перешли по неверной ссылке.',
    code: '404',
  },
  {
    id: '500',
    label: '500 — Ошибка сервера',
    icon: <ServerCrash className="w-12 h-12 text-red-300" />,
    title: 'Ошибка сервера',
    desc: 'Что-то пошло не так на нашей стороне. Попробуйте обновить страницу или зайдите позже.',
    code: '500',
  },
  {
    id: 'offline',
    label: 'Нет соединения',
    icon: <WifiOff className="w-12 h-12 text-amber-300" />,
    title: 'Нет подключения к интернету',
    desc: 'Проверьте соединение с интернетом и попробуйте ещё раз.',
    code: 'Offline',
  },
  {
    id: '403',
    label: '403 — Доступ запрещён',
    icon: <ShieldX className="w-12 h-12 text-navy/30" />,
    title: 'Доступ запрещён',
    desc: 'У вас нет прав для просмотра этой страницы.',
    code: '403',
  },
  {
    id: 'maintenance',
    label: 'Тех. работы',
    icon: <Construction className="w-12 h-12 text-amber-400" />,
    title: 'Технические работы',
    desc: 'Сайт временно недоступен — мы обновляем систему. Скоро вернёмся!',
    code: '🔧',
  },
  {
    id: 'empty',
    label: 'Пустой каталог',
    icon: <PackageX className="w-12 h-12 text-gray-300" />,
    title: 'Товары не найдены',
    desc: 'В данный момент каталог пуст. Попробуйте зайти позже — мы скоро добавим новые позиции.',
    code: '∅',
  },
];

export default function DebugPanel({ isOpen, onClose }) {
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[520px] rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="font-serif text-xl font-bold text-gray-900">Debug Panel</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!preview ? (
          /* List of error screens */
          <div className="px-6 py-4 space-y-2">
            <p className="text-xs text-gray-400 mb-3">Нажмите для предпросмотра экрана ошибки:</p>
            {ERROR_SCREENS.map(screen => (
              <button
                key={screen.id}
                onClick={() => setPreview(screen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-navy hover:bg-navy/5 transition-all text-left"
              >
                <span className="text-lg font-mono font-bold text-navy/60 w-10 text-center flex-shrink-0">
                  {screen.code}
                </span>
                <span className="text-sm font-medium text-gray-700">{screen.label}</span>
              </button>
            ))}
          </div>
        ) : (
          /* Preview of selected error screen */
          <div className="px-6 py-8">
            <button
              onClick={() => setPreview(null)}
              className="text-sm text-navy font-semibold mb-6 hover:underline"
            >
              ← Назад к списку
            </button>
            <div className="flex flex-col items-center text-center py-8">
              {preview.icon}
              <span className="text-6xl font-mono font-bold text-gray-200 mt-4">{preview.code}</span>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mt-4">{preview.title}</h3>
              <p className="text-sm text-gray-500 mt-3 max-w-sm leading-relaxed">{preview.desc}</p>
              <button className="mt-6 px-6 py-3 bg-navy text-white font-semibold text-sm rounded-2xl hover:bg-navy-light transition-colors">
                На главную
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
