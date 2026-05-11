import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Minus, Plus, Trash2, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { SAUCES, PB_URL, WEBHOOK_URL } from '../data/fallback';
import { GELENDZHIK_STREETS } from '../data/streets';

function formatPhone(value) {
  let val = value.replace(/\D/g, '');
  if (val.length === 0) val = '7';
  if (val[0] !== '7' && val[0] !== '8') val = '7' + val;
  if (val[0] === '8') val = '7' + val.substring(1);

  let formatted = '+7';
  if (val.length > 1) formatted += ' (' + val.substring(1, 4);
  if (val.length > 4) formatted += ') ' + val.substring(4, 7);
  if (val.length > 7) formatted += '-' + val.substring(7, 9);
  if (val.length > 9) formatted += '-' + val.substring(9, 11);

  return formatted.substring(0, 18);
}

function Stepper({ step }) {
  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <div className={`flex items-center gap-2 ${step === 1 ? 'text-navy' : 'text-gray-400'}`}>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-navy text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
        <span className="text-xs font-semibold hidden sm:inline">Заказ</span>
      </div>
      <div className={`w-8 h-[2px] ${step === 2 ? 'bg-navy' : 'bg-gray-200'}`} />
      <div className={`flex items-center gap-2 ${step === 2 ? 'text-navy' : 'text-gray-400'}`}>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-navy text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
        <span className="text-xs font-semibold hidden sm:inline">Доставка</span>
      </div>
    </div>
  );
}

export default function CartModal({ isOpen, onClose, pbAvailable }) {
  const {
    items, selectedSauces, total, totalItems,
    changeQty, addSauce, changeSauceQty, clearCart, showToast,
  } = useCart();

  const [step, setStep] = useState(1);
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [intercom, setIntercom] = useState('');
  const [comment, setComment] = useState('');
  const [payment, setPayment] = useState('Перевод онлайн (СБП)');
  const [persons, setPersons] = useState(1);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [streetTouched, setStreetTouched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const modalRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const placemark = useRef(null);
  const geocodeTimer = useRef(null);

  const fullAddress = `г. Геленджик, ${street}${apartment ? ', кв. ' + apartment : ''}`;
  const streetValid = street.trim().length >= 5;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Init Yandex Map (only on step 2)
  useEffect(() => {
    if (!isOpen || step !== 2) return;
    const initMap = () => {
      if (!mapContainerRef.current || mapRef.current) return;
      const ymaps = window.ymaps;
      if (!ymaps) return;
      ymaps.ready(() => {
        if (mapRef.current) return;
        const map = new ymaps.Map(mapContainerRef.current, {
          center: [44.5622, 38.0848],
          zoom: 13,
          controls: ['zoomControl'],
        }, { suppressMapOpenBlock: true });
        mapRef.current = map;
      });
    };
    if (window.ymaps) {
      setTimeout(initMap, 100);
    } else {
      const interval = setInterval(() => {
        if (window.ymaps) { clearInterval(interval); initMap(); }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isOpen, step]);

  // Cleanup map on close
  useEffect(() => {
    if (!isOpen && mapRef.current) {
      mapRef.current.destroy();
      mapRef.current = null;
      placemark.current = null;
    }
  }, [isOpen]);

  // Geocode address on street change
  useEffect(() => {
    if (!street.trim() || !mapRef.current || !window.ymaps) return;
    clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(() => {
      const query = `Геленджик, ${street.trim()}`;
      window.ymaps.geocode(query, { results: 1, boundedBy: [[44.5, 37.9], [44.65, 38.2]] }).then(res => {
        const firstGeo = res.geoObjects.get(0);
        if (!firstGeo) return;
        const coords = firstGeo.geometry.getCoordinates();
        const map = mapRef.current;
        if (!map) return;
        if (placemark.current) {
          placemark.current.geometry.setCoordinates(coords);
        } else {
          placemark.current = new window.ymaps.Placemark(coords, {}, {
            preset: 'islands#darkBlueDeliveryIcon',
          });
          map.geoObjects.add(placemark.current);
        }
        map.setCenter(coords, 16, { duration: 300 });
      });
    }, 600);
    return () => clearTimeout(geocodeTimer.current);
  }, [street]);

  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = useCallback(async () => {
    if (totalItems === 0) {
      showToast('Сначала добавьте блюда в корзину!', 'error');
      return;
    }
    if (!streetValid) {
      showToast('Укажите улицу и номер дома', 'error');
      setStreetTouched(true);
      return;
    }
    if (phone.length < 18) {
      showToast('Введите корректный номер телефона', 'error');
      return;
    }

    setSubmitting(true);

    let text = '*НОВЫЙ ЗАКАЗ*\n\n';
    const itemsList = [];
    for (const [name, data] of Object.entries(items)) {
      text += `• ${name} — ${data.qty} шт.\n`;
      itemsList.push(`${name} x${data.qty}`);
    }

    const sauceEntries = Object.entries(selectedSauces);
    if (sauceEntries.length > 0) {
      text += '\n*Соусы:*\n';
      sauceEntries.forEach(([name, qty]) => { text += `• ${name} — ${qty} шт.\n`; });
    }

    const deliveryFee = total >= 1500 ? 0 : 100;
    const grandTotal = total + deliveryFee;

    const addressFull = fullAddress + (intercom ? `, домофон: ${intercom}` : '');
    text += `\n*Адрес:* ${addressFull}`;
    text += `\n*Доставка:* ${deliveryFee === 0 ? 'Бесплатно' : '100 ₽'}`;
    text += `\n*Оплата:* ${payment}`;
    text += `\n*Персон:* ${persons}`;
    text += `\n*Телефон:* ${phone}`;
    if (comment.trim()) text += `\n*Комментарий:* ${comment.trim()}`;
    text += `\n*ИТОГО:* ${grandTotal} ₽`;

    const orderData = {
      customer_name: 'Клиент',
      items: itemsList.join(', '),
      address: addressFull,
      phone,
      payment,
      persons: persons || 1,
      sauces: Object.entries(selectedSauces).map(([name, qty]) => `${name} x${qty}`).join(', '),
      total: grandTotal,
      status: 'new',
    };

    const promises = [
      fetch(WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify({ text }),
      }).catch(err => console.error('Telegram webhook error:', err)),
    ];

    if (pbAvailable) {
      promises.push(
        fetch(PB_URL + '/api/collections/orders/records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        }).catch(err => console.error('PocketBase order error:', err))
      );
    }

    try {
      await Promise.all(promises);
      showToast('Заказ оформлен! Мы скоро перезвоним.');
      clearCart();
      setStreet('');
      setApartment('');
      setIntercom('');
      setComment('');
      setPhone('');
      setStreetTouched(false);
      setPhoneTouched(false);
      setStep(1);
      onClose();
    } catch {
      showToast('Ошибка при отправке. Проверьте интернет.', 'error');
    } finally {
      setSubmitting(false);
    }
  }, [items, selectedSauces, fullAddress, intercom, comment, phone, payment, persons, total, totalItems, pbAvailable, streetValid, clearCart, onClose, showToast]);

  if (!isOpen) return null;

  const itemEntries = Object.entries(items);
  const deliveryFee = total >= 1500 ? 0 : 100;
  const grandTotal = total + deliveryFee;

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white w-full sm:max-w-[480px] sm:rounded-2xl max-h-full sm:max-h-[90vh] overflow-y-auto overflow-x-hidden scrollbar-hide animate-slide-up relative h-full sm:h-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h2 className="font-serif text-2xl font-bold text-gray-900">
                  {step === 1 ? 'Ваш заказ' : 'Доставка'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {step === 1 ? 'Доставка от 30 минут' : 'Куда привезти?'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <Stepper step={step} />
        </div>

        {/* ===== STEP 1: Order ===== */}
        {step === 1 && (
          <>
            {/* Cart items */}
            <div className="px-6 py-4">
              {itemEntries.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 mb-4">Корзина пока пуста.<br />Добавьте что-нибудь вкусное!</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-navy text-white font-semibold text-sm rounded-2xl hover:bg-navy-light transition-colors"
                  >
                    Перейти в меню
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {itemEntries.map(([name, data]) => (
                    <div key={name} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                        <p className="text-xs text-gray-400">{data.price} ₽ за шт.</p>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-1 py-1">
                        <button
                          onClick={() => changeQty(name, -1)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-navy hover:text-navy transition-colors"
                        >
                          {data.qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                        </button>
                        <span className="text-sm font-bold text-gray-900 min-w-[24px] text-center">
                          {data.qty}
                        </span>
                        <button
                          onClick={() => changeQty(name, 1)}
                          className="w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center hover:bg-navy-light transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sauces — only when cart has items */}
            {totalItems > 0 && (
              <div className="px-6 py-5 bg-gray-50 border-y border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Добавить к заказу</h3>
                <p className="text-sm text-gray-400 mb-4">Домашние соусы — по 50 ₽ каждый</p>
                <div className="space-y-2">
                  {SAUCES.map(sauce => {
                    const qty = selectedSauces[sauce.value] || 0;
                    return (
                      <div
                        key={sauce.value}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                          qty > 0 ? 'border-navy/30 bg-navy/5' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <span className="text-xl flex-shrink-0">{sauce.icon}</span>
                        <span className="text-sm font-medium text-gray-900 flex-1 min-w-0">{sauce.value}</span>
                        <span className="text-sm text-gray-400 flex-shrink-0">{sauce.price} ₽</span>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <button
                            onClick={() => changeSauceQty(sauce.value, -1)}
                            className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center hover:bg-navy-light transition-colors text-base font-bold"
                          >
                            −
                          </button>
                          <span className="text-sm font-bold text-gray-900 min-w-[20px] text-center">{qty}</span>
                          <button
                            onClick={() => changeSauceQty(sauce.value, 1)}
                            className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center hover:bg-navy-light transition-colors text-base font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 1 footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
              {totalItems > 0 && (
                <div className="mb-3 space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Заказ:</span>
                    <span className="font-medium text-gray-900">{total} ₽</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Доставка:</span>
                    {total >= 1500 ? (
                      <span className="font-medium text-green-600">Бесплатно</span>
                    ) : (
                      <span className="font-medium text-gray-900">{deliveryFee} ₽</span>
                    )}
                  </div>
                  {total > 0 && total < 1500 && (
                    <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-1.5">
                      Ещё {1500 - total} ₽ до бесплатной доставки
                    </p>
                  )}
                </div>
              )}
              <button
                onClick={() => setStep(2)}
                disabled={totalItems === 0}
                className="w-full py-4 bg-navy text-white font-bold text-base rounded-2xl hover:bg-navy-light transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                Перейти к доставке
              </button>
            </div>
          </>
        )}

        {/* ===== STEP 2: Delivery ===== */}
        {step === 2 && (
          <>
            <div className="px-6 py-4 space-y-4">
              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={() => setPhoneTouched(true)}
                  placeholder="+7 (___) ___-__-__"
                  maxLength={18}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base text-gray-900 placeholder:text-gray-300 outline-none transition-all ${
                    phoneTouched && phone.length > 0 && phone.length < 18
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10'
                  }`}
                />
                {phoneTouched && phone.length > 0 && phone.length < 18 && (
                  <p className="text-xs text-red-500 mt-1">Введите полный номер телефона (11 цифр)</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Город
                </label>
                <input
                  type="text"
                  value="Геленджик"
                  readOnly
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base text-gray-900 bg-gray-50 outline-none"
                />
              </div>

              {/* Street with autocomplete */}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Улица, дом
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={e => { setStreet(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => { setStreetTouched(true); setTimeout(() => setShowSuggestions(false), 150); }}
                  placeholder="напр. Луначарского 112"
                  autoComplete="off"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base text-gray-900 placeholder:text-gray-300 outline-none transition-all ${
                    streetTouched && !streetValid
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10'
                  }`}
                />
                {showSuggestions && street.trim().length >= 1 && (() => {
                  const q = street.trim().toLowerCase();
                  const matches = GELENDZHIK_STREETS.filter(s => s.toLowerCase().startsWith(q) || s.toLowerCase().includes(q)).slice(0, 5);
                  if (matches.length === 0) return null;
                  return (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                      {matches.map(s => (
                        <button
                          key={s}
                          type="button"
                          onMouseDown={() => { setStreet(s + ' '); setShowSuggestions(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-navy/5 hover:text-navy transition-colors"
                        >
                          ул. {s}
                        </button>
                      ))}
                    </div>
                  );
                })()}
                {streetTouched && !streetValid && (
                  <p className="text-xs text-red-500 mt-1">Укажите улицу и номер дома</p>
                )}
              </div>

              {/* Apt + Intercom */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Квартира
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={e => setApartment(e.target.value)}
                    placeholder="Кв."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-300 outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Домофон
                  </label>
                  <input
                    type="text"
                    value={intercom}
                    onChange={e => setIntercom(e.target.value)}
                    placeholder="Код (необяз.)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-300 outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all"
                  />
                </div>
              </div>

              {/* Map */}
              <div
                ref={mapContainerRef}
                className="w-full h-[140px] rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100"
              />

              {/* Persons + Payment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Персон
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPersons(p => Math.max(1, p - 1))}
                      disabled={persons <= 1}
                      className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-navy hover:text-navy transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span className="text-lg font-bold">−</span>
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={persons}
                      onChange={e => {
                        const v = parseInt(e.target.value);
                        if (!isNaN(v) && v >= 1) setPersons(v);
                        else if (e.target.value === '') setPersons(1);
                      }}
                      onBlur={() => { if (persons < 1) setPersons(1); }}
                      className="w-12 h-10 text-center border-2 border-gray-200 rounded-xl text-base font-bold text-gray-900 outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setPersons(p => p + 1)}
                      className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-navy hover:text-navy transition-colors"
                    >
                      <span className="text-lg font-bold">+</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Оплата
                  </label>
                  <select
                    value={payment}
                    onChange={e => setPayment(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all bg-white"
                  >
                    <option value="Перевод онлайн (СБП)">💳 СБП</option>
                    <option value="Наличными курьеру">💵 Наличные</option>
                  </select>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Комментарий
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Пожелания, уточнения (необязательно)"
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-300 outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all resize-none"
                />
              </div>
            </div>

            {/* Step 2 footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
              <div className="mb-3 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Заказ:</span>
                  <span className="font-medium text-gray-900">{total} ₽</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Доставка:</span>
                  {deliveryFee === 0 ? (
                    <span className="font-medium text-green-600">Бесплатно</span>
                  ) : (
                    <span className="font-medium text-gray-900">{deliveryFee} ₽</span>
                  )}
                </div>
                {total > 0 && total < 1500 && (
                  <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-1.5">
                    Ещё {1500 - total} ₽ до бесплатной доставки
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">Итого:</span>
                <span className="text-2xl font-bold text-gray-900">{grandTotal} ₽</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-4 bg-navy text-white font-bold text-base rounded-2xl hover:bg-navy-light transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {submitting ? 'Отправка...' : `Подтвердить заказ — ${grandTotal} ₽`}
              </button>
              <p className="text-[11px] text-gray-400 text-center mt-2 leading-relaxed">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <span className="text-navy underline">политикой конфиденциальности</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
