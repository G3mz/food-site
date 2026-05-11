export function flyToCart(startEl) {
  const cartBtn = document.getElementById('cart-btn');
  if (!cartBtn || !startEl) return;

  const startRect = startEl.getBoundingClientRect();
  const endRect = cartBtn.getBoundingClientRect();

  const flyer = document.createElement('div');
  flyer.textContent = '🛒';
  flyer.style.cssText = `
    position: fixed;
    z-index: 9999;
    left: ${startRect.left + startRect.width / 2}px;
    top: ${startRect.top + startRect.height / 2}px;
    font-size: 24px;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.2, 1, 0.3, 1);
    opacity: 1;
    transform: scale(1);
  `;
  document.body.appendChild(flyer);

  requestAnimationFrame(() => {
    flyer.style.left = `${endRect.left + endRect.width / 2}px`;
    flyer.style.top = `${endRect.top + endRect.height / 2}px`;
    flyer.style.opacity = '0';
    flyer.style.transform = 'scale(0.3)';
  });

  setTimeout(() => {
    flyer.remove();
    cartBtn.classList.add('animate-bounce-once');
    setTimeout(() => cartBtn.classList.remove('animate-bounce-once'), 400);
  }, 650);
}
