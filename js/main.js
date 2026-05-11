/* ================================================
   Печь & Борщ — Логика корзины и заказа
   С интеграцией PocketBase CMS
   ================================================ */

// URL PocketBase — при деплое на сервер заменить на публичный адрес
const PB_URL = window.__PB_URL__ || 'https://cal-what-story-albany.trycloudflare.com';
let allProducts = [];
let siteSettings = {};
let pbAvailable = false;

/* ================================================
   Fallback-данные (используются если PocketBase недоступен)
   ================================================ */

const FALLBACK_SETTINGS = {
    promo_ticker: "🎁 АКЦИЯ: К первому заказу — литр фирменного клюквенного морса в ПОДАРОК! 🛵 Бесплатная доставка от 1500 ₽! 🔥 Готовим с любовью, как для себя! 🎁",
    hero_badge: "✨ Ручная работа с любовью",
    hero_title: "Печь & Борщ",
    hero_description: "Пельмени, вареники и блинчики ручной работы — как у бабушки, только с доставкой до двери. Натуральные продукты, шоковая заморозка, никаких консервантов.",
    stat_clients: "📦 500+",
    stat_clients_label: "Довольных клиентов",
    stat_delivery: "🛵 2 ч",
    stat_delivery_label: "Средняя доставка",
    stat_years: "🥇 3 года",
    stat_years_label: "На рынке",
    phone: "+7 929 842 98 91",
    footer_tagline: "Домашняя кулинария с доставкой до двери",
    footer_copyright: "© 2025 Все права защищены"
};

const FALLBACK_PRODUCTS = [
    {"name":"Домашние пельмени","description":"Ручная лепка, свинина/говядина. 500 г.","price":450,"image":"img/pelmenidom.jpeg","category":"meat","is_hit":true,"sort_order":1,"composition":"Тесто: мука, вода, яйцо, соль. Начинка: свинина, говядина, лук, соль, перец.","preparation":"Вскипятить воду, посолить. Опустить пельмени. Варить 7–10 мин после всплытия. Подавать со сметаной."},
    {"name":"Вареники с картошкой","description":"С жареным лучком и сливочным маслом. 500 г.","price":320,"image":"img/vareniki.png","category":"meat","is_hit":false,"sort_order":2,"composition":"Тесто: мука, вода, яйцо, соль. Начинка: картофель, лук жареный, масло сливочное, укроп.","preparation":"Варить 5–7 мин после всплытия. Подавать с жареным луком и сметаной."},
    {"name":"Вареники с вишней","description":"Сладкие домашние вареники с сочной вишней. 500 г.","price":390,"image":"img/vareniki vishnya.png","category":"desserts","is_hit":false,"sort_order":3,"composition":"Тесто: мука, вода, яйцо, соль. Начинка: вишня свежемороженая, сахар.","preparation":"Варить 5 мин после всплытия. Подавать со сметаной или сгущёнкой."},
    {"name":"Манты с говядиной","description":"Крупные манты ручной лепки (5 шт). 450 г.","price":550,"image":"https://images.unsplash.com/photo-1616895427217-5318221a3e79?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":false,"sort_order":4,"composition":"Тесто: мука, вода, яйцо, соль. Начинка: говядина, лук, тыква, курдючный жир, зира.","preparation":"Готовить на пару в мантоварке 40–45 мин. Подавать со сметаной и чесноком."},
    {"name":"Блинчики с творогом","description":"Нежные блинчики с фермерским творогом. 400 г.","price":380,"image":"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80","category":"desserts","is_hit":false,"sort_order":5,"composition":"Блины: мука, молоко, яйцо, сахар, соль, масло. Начинка: творог фермерский, сахар, ванилин.","preparation":"Разогреть на сковороде или в микроволновке 1–2 мин. Подавать со сметаной или вареньем."},
    {"name":"Блины с мясом","description":"Сытные блинчики с обжаренным фаршем. 400 г.","price":420,"image":"https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":true,"sort_order":6,"composition":"Блины: мука, молоко, яйцо, сахар, соль, масло. Начинка: говядина обжаренная, лук, соль, перец.","preparation":"Разогреть на сковороде 2–3 мин с каждой стороны. Подавать со сметаной."},
    {"name":"Блинчики домашние","description":"Тонкие блинчики без начинки (10 шт). 350 г.","price":200,"image":"https://images.unsplash.com/photo-1761095596635-065d5e13b116?auto=format&fit=crop&w=400&q=80","category":"desserts","is_hit":false,"sort_order":7},
    {"name":"Сырники классические","description":"Толстенькие и в меру сладкие сырники. 350 г.","price":420,"image":"https://images.unsplash.com/photo-1675540212407-a67ab877c418?auto=format&fit=crop&w=400&q=80","category":"desserts","is_hit":false,"sort_order":8},
    {"name":"Пирожки с капустой","description":"Свежеиспеченные румяные пирожки (3 шт). 300 г.","price":180,"image":"https://images.unsplash.com/photo-1702742136650-339afaec9817?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":false,"sort_order":9},
    {"name":"Пирожки с мясом","description":"Запеченные в духовке, много начинки (3 шт). 300 г.","price":240,"image":"https://images.unsplash.com/photo-1702742136650-339afaec9817?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":false,"sort_order":10},
    {"name":"Пирожки с картошкой","description":"Мягкое тесто, картофель с укропом (3 шт). 300 г.","price":180,"image":"https://images.unsplash.com/photo-1702742136650-339afaec9817?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":false,"sort_order":11},
    {"name":"Чебуреки с мясом","description":"Сочные чебуреки с хрустящей корочкой (2 шт). 300 г.","price":260,"image":"https://images.unsplash.com/photo-1600289031464-74d374b64991?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":false,"sort_order":12},
    {"name":"Сосиска в тесте","description":"Классика детства. Воздушное тесто (2 шт). 250 г.","price":160,"image":"https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":false,"sort_order":13},
    {"name":"Борщ домашний","description":"Наваристый борщ на говяжьем бульоне. 500 мл.","price":350,"image":"https://images.unsplash.com/photo-1611068120879-531d290f60d6?auto=format&fit=crop&w=400&q=80","category":"soups","is_hit":true,"sort_order":14,"composition":"Говядина на кости, свёкла, капуста, картофель, морковь, лук, томатная паста, чеснок, лавровый лист, зелень.","preparation":"Довести до кипения. Подавать со сметаной и свежей зеленью. Отлично с чесночными пампушками."},
    {"name":"Солянка мясная","description":"Сборная солянка с копченостями и маслинами. 500 мл.","price":420,"image":"https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=400&q=80","category":"soups","is_hit":false,"sort_order":15},
    {"name":"Куриная лапша","description":"Легкий супчик с домашней лапшой и курочкой. 500 мл.","price":280,"image":"https://images.unsplash.com/photo-1548943487-a2e4e43b485d?auto=format&fit=crop&w=400&q=80","category":"soups","is_hit":false,"sort_order":16},
    {"name":"Котлеты по-домашнему","description":"Свинина и говядина, обжаренные до корочки (2 шт). 250 г.","price":350,"image":"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":false,"sort_order":17},
    {"name":"Котлеты куриные","description":"Нежные диетические котлетки из филе (2 шт). 250 г.","price":320,"image":"https://images.unsplash.com/photo-1598514982205-f36b96d1e8dd?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":false,"sort_order":18},
    {"name":"Тефтели с подливкой","description":"Мясные ежики с рисом в томатном соусе. 350 г.","price":360,"image":"https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":false,"sort_order":19},
    {"name":"Голубцы классические","description":"Свежая капуста, фарш и рис, тушеные в соусе. 400 г.","price":380,"image":"https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":false,"sort_order":20},
    {"name":"Плов со свининой","description":"Рассыпчатый рис, много мяса и специй. 400 г.","price":420,"image":"https://images.unsplash.com/photo-1671048116810-6f885b2b35a5?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":true,"sort_order":21},
    {"name":"Макароны по-флотски","description":"Обжаренные с говяжьим фаршем и луком. 350 г.","price":320,"image":"https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":false,"sort_order":22},
    {"name":"Картофельное пюре","description":"На натуральном молоке со сливочным маслом. 250 г.","price":180,"image":"https://images.unsplash.com/photo-1615486171434-2e9eb5a53e48?auto=format&fit=crop&w=400&q=80","category":"meat","is_hit":false,"sort_order":23},
    {"name":"Салат Оливье","description":"Тот самый праздничный вкус, с вареной колбасой. 300 г.","price":280,"image":"https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=400&q=80","category":"desserts","is_hit":true,"sort_order":24},
    {"name":"Сельдь под шубой","description":"Классический слоеный салат с нежной селедочкой. 300 г.","price":320,"image":"https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=400&q=80","category":"desserts","is_hit":false,"sort_order":25},
    {"name":"Винегрет","description":"Постный салат с ароматным нерафинированным маслом. 300 г.","price":220,"image":"https://images.unsplash.com/photo-1604908177525-c6fa71391788?auto=format&fit=crop&w=400&q=80","category":"desserts","is_hit":false,"sort_order":26},
    {"name":"Крабовый салат","description":"С кукурузой, рисом и свежим огурчиком. 300 г.","price":290,"image":"https://images.unsplash.com/photo-1623366302587-bca8ebfc3661?auto=format&fit=crop&w=400&q=80","category":"desserts","is_hit":false,"sort_order":27},
    {"name":"Торт Медовик","description":"Тонкие медовые коржи и сметанный крем (1 порция). 150 г.","price":250,"image":"https://images.unsplash.com/photo-1624000961428-eeece184988b?auto=format&fit=crop&w=400&q=80","category":"desserts","is_hit":false,"sort_order":28},
    {"name":"Морс клюквенный","description":"Освежающий напиток из натуральных ягод. 1 литр.","price":250,"image":"https://images.unsplash.com/photo-1594579629306-07af17998d4a?auto=format&fit=crop&w=400&q=80","category":"desserts","is_hit":false,"sort_order":29},
    {"name":"Компот из сухофруктов","description":"Тот самый вкус из детства, в меру сладкий. 1 литр.","price":200,"image":"https://images.unsplash.com/photo-1595981234058-a9302bf97386?auto=format&fit=crop&w=400&q=80","category":"desserts","is_hit":false,"sort_order":30}
];

/* ================================================
   Загрузка данных из PocketBase (с fallback)
   ================================================ */

async function loadSiteData() {
    try {
        // Проверяем доступность PocketBase
        const healthRes = await fetch(PB_URL + '/api/health', { signal: AbortSignal.timeout(3000) });
        if (!healthRes.ok) throw new Error('PocketBase unavailable');
        pbAvailable = true;

        // Загружаем настройки
        const settingsRes = await fetch(PB_URL + '/api/collections/site_settings/records?perPage=200');
        const settingsData = await settingsRes.json();
        siteSettings = {};
        (settingsData.items || []).forEach(s => { siteSettings[s.key] = s.value; });

        // Применяем настройки к странице
        applySiteSettings();

        // Загружаем продукты
        const productsRes = await fetch(PB_URL + '/api/collections/products/records?perPage=200&sortOrder=sort_order');
        const productsData = await productsRes.json();
        allProducts = productsData.items || [];

        // Рендерим каталог и слайдер
        renderCatalog(allProducts);
        renderHitsSlider(allProducts.filter(p => p.is_hit));
    } catch (err) {
        console.warn('PocketBase недоступен, используем fallback-данные:', err.message);
        // Fallback — используем встроенные данные
        siteSettings = FALLBACK_SETTINGS;
        allProducts = FALLBACK_PRODUCTS;
        applySiteSettings();
        renderCatalog(allProducts);
        renderHitsSlider(allProducts.filter(p => p.is_hit));
    }
}

function applySiteSettings() {
    const s = siteSettings;
    if (s.promo_ticker) document.getElementById('promoTicker').textContent = s.promo_ticker;
    if (s.hero_badge) document.getElementById('heroBadge').textContent = s.hero_badge;
    if (s.hero_title) document.getElementById('heroTitle').textContent = s.hero_title;
    if (s.hero_description) document.getElementById('heroDesc').textContent = s.hero_description;
    if (s.stat_clients) document.getElementById('statClients').textContent = s.stat_clients;
    if (s.stat_clients_label) document.getElementById('statClientsLabel').textContent = s.stat_clients_label;
    if (s.stat_delivery) document.getElementById('statDelivery').textContent = s.stat_delivery;
    if (s.stat_delivery_label) document.getElementById('statDeliveryLabel').textContent = s.stat_delivery_label;
    if (s.stat_years) document.getElementById('statYears').textContent = s.stat_years;
    if (s.stat_years_label) document.getElementById('statYearsLabel').textContent = s.stat_years_label;
    if (s.phone) {
        const phoneEl = document.getElementById('footerPhone');
        phoneEl.textContent = s.phone;
        phoneEl.href = 'tel:' + s.phone.replace(/[^0-9+]/g, '');
        // Обновляем телефон в хедере
        const headerPhone = document.querySelector('.phone-btn');
        if (headerPhone) {
            headerPhone.href = 'tel:' + s.phone.replace(/[^0-9+]/g, '');
            headerPhone.innerHTML = '📞 ' + s.phone;
        }
    }
    if (s.footer_tagline) document.getElementById('footerTagline').innerHTML = s.footer_tagline.replace('с доставкой', '<br>с доставкой');
    if (s.footer_copyright) document.getElementById('footerCopyright').textContent = s.footer_copyright;
}

/* ================================================
   Рендер каталога из PocketBase
   ================================================ */

function renderCatalog(products) {
    const catalog = document.getElementById('menuCatalog');
    if (!products.length) {
        catalog.innerHTML = '<div class="cart-empty">Меню пока пустое</div>';
        return;
    }
    catalog.innerHTML = products.map((p, idx) => {
        const hitBadge = p.is_hit ? '<div class="badge-hit">🔥 Хит продаж</div>' : '';
        const imgSrc = p.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80';
        const category = p.category || 'all';
        const comp = (p.composition || '').replace(/"/g, '&quot;');
        const prep = (p.preparation || '').replace(/"/g, '&quot;');
        return `
            <div class="card food-item" data-category="${category}" data-idx="${idx}" onclick="openProductModal(${idx})">
                ${hitBadge}
                <img src="${imgSrc}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'">
                <div class="card-content">
                    <h3 class="card-title">${p.name}</h3>
                    <p class="card-desc">${p.description}</p>
                    <div class="card-price">${p.price} ₽</div>
                    <button class="btn-add" onclick="event.stopPropagation(); addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price})">В корзину</button>
                </div>
            </div>
        `;
    }).join('');
}

/* ================================================
   Слайдер хитов продаж (динамический)
   ================================================ */

let currentSlide = 0;
let sliderInterval = null;
let slides = [];
const track = document.getElementById('hitsTrack');
const dotsContainer = document.getElementById('hitsDots');

function renderHitsSlider(hitProducts) {
    if (!hitProducts.length) {
        document.getElementById('hitsSlider').style.display = 'none';
        return;
    }

    track.innerHTML = hitProducts.map(p => {
        const imgSrc = p.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80';
        return `
            <div class="hits-slide" data-name="${p.name}" data-price="${p.price}">
                <div class="hits-slide-bg" style="background-image: url('${imgSrc}')"></div>
                <div class="hits-slide-overlay"></div>
                <div class="hits-slide-content">
                    <span class="hits-badge">🔥 Хит продаж</span>
                    <h2 class="hits-title">${p.name}</h2>
                    <p class="hits-desc">${p.description}</p>
                    <div class="hits-price">${p.price} ₽</div>
                    <button class="hits-cart-btn" onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price})">В корзину</button>
                </div>
            </div>
        `;
    }).join('');

    // Обновляем ссылки на слайды
    slides = document.querySelectorAll('.hits-slide');

    // Создаём точки навигации
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slides.length; i++) {
        let dot = document.createElement('div');
        dot.className = 'hits-dot' + (i === 0 ? ' active' : '');
        dot.onclick = function() { goToSlide(i); };
        dotsContainer.appendChild(dot);
    }

    slides[0].classList.add('active');
    startAutoSlide();
}

function goToSlide(index) {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');

    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    slides[currentSlide].classList.add('active');

    let dots = dotsContainer.querySelectorAll('.hits-dot');
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === currentSlide);
    }
}

function changeSlide(direction) {
    goToSlide(currentSlide + direction);
    resetAutoSlide();
}

function startAutoSlide() {
    sliderInterval = setInterval(function() {
        goToSlide(currentSlide + 1);
    }, 8000);
}

function resetAutoSlide() {
    clearInterval(sliderInterval);
    startAutoSlide();
}

let sliderEl = document.getElementById('hitsSlider');
sliderEl.addEventListener('mouseenter', function() {
    clearInterval(sliderInterval);
});
sliderEl.addEventListener('mouseleave', function() {
    startAutoSlide();
});

/* ================================================
   Плавный скролл
   ================================================ */

function smoothScrollTo(elementId) {
    let target = document.getElementById(elementId);
    let targetPos = target.getBoundingClientRect().top + window.pageYOffset;
    let startPos = window.pageYOffset;
    let distance = targetPos - startPos;
    let duration = 1200;
    let startTime = null;

    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(currentTime) {
        if (!startTime) startTime = currentTime;
        let elapsed = currentTime - startTime;
        let progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startPos + distance * easeInOutCubic(progress));
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

/* ================================================
   Корзина
   ================================================ */

let cart = {};

function addToCart(itemName, itemPrice) {
    if (cart[itemName]) {
        cart[itemName].qty++;
    } else {
        cart[itemName] = { price: itemPrice, qty: 1 };
    }
    updateCartWidget();
    alert("✅ " + itemName + " добавлено в корзину!");
}

function updateCartWidget() {
    let totalItems = 0;
    let totalPrice = 0;
    for (let item in cart) {
        totalItems += cart[item].qty;
        totalPrice += cart[item].price * cart[item].qty;
    }
    document.getElementById('cart-total-items').innerText = totalItems;
    document.getElementById('cart-total-price').innerText = totalPrice;
    updateTotal();
    updateMobileCartBadge();
}

document.querySelector('.cart-widget').onclick = function() {
    renderCartItems();
    document.getElementById('cartModal').style.display = 'flex';
};
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function renderCartItems() {
    let list = document.getElementById('cart-items-list');
    list.innerHTML = '';
    if (Object.keys(cart).length === 0) {
        list.innerHTML = '<div class="cart-empty">Корзина пока пуста.<br>Добавьте что-нибудь вкусное!</div>';
    } else {
        for (let item in cart) {
            list.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item}</span>
                        <span class="cart-item-price-each">${cart[item].price} ₽ за шт.</span>
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeQty('${item}', -1)">−</button>
                        <span>${cart[item].qty}</span>
                        <button class="qty-btn" onclick="changeQty('${item}', 1)">+</button>
                    </div>
                </div>
            `;
        }
    }
    updateTotal();
}

function changeQty(item, change) {
    cart[item].qty += change;
    if (cart[item].qty <= 0) delete cart[item];
    updateCartWidget();
    renderCartItems();
}

function updateTotal() {
    let total = 0;
    for (let item in cart) {
        total += cart[item].price * cart[item].qty;
    }
    let sauces = document.querySelectorAll('.sauce-cb:checked');
    total += sauces.length * 50;
    document.getElementById('modal-total-price').innerText = total;
}

// Маска для номера телефона РФ
let phoneInput = document.getElementById('phoneInput');
phoneInput.addEventListener('input', function(e) {
    let val = this.value.replace(/\D/g, '');
    if (val.length === 0) val = '7';
    if (val[0] !== '7' && val[0] !== '8') val = '7' + val;
    if (val[0] === '8') val = '7' + val.substring(1);

    let formatted = '+7';
    if (val.length > 1) formatted += ' (' + val.substring(1, 4);
    if (val.length > 4) formatted += ') ' + val.substring(4, 7);
    if (val.length > 7) formatted += '-' + val.substring(7, 9);
    if (val.length > 9) formatted += '-' + val.substring(9, 11);

    this.value = formatted.substring(0, 18);
});

/* ================================================
   Отправка заказа (Telegram + PocketBase)
   ================================================ */

function sendToTelegram() {
    if (Object.keys(cart).length === 0) {
        alert('Сначала добавьте блюда в корзину!');
        return;
    }

    let address = document.getElementById('addressInput').value;
    if (address.trim() === '') {
        alert('Пожалуйста, укажите адрес доставки.');
        return;
    }

    let phone = phoneInput.value;
    if (phone.length < 18) {
        alert('Пожалуйста, введите корректный номер телефона полностью.');
        return;
    }

    let payment = document.getElementById('paymentInput').value;

    let submitBtn = document.querySelector('.btn-submit');
    let originalText = submitBtn.innerText;
    submitBtn.innerText = 'Отправка... ⏳';
    submitBtn.disabled = true;

    // Формируем текст для Телеграма
    let text = '🔔 *НОВЫЙ ЗАКАЗ*\n\n';
    let itemsList = [];
    for (let item in cart) {
        text += `▪️ ${item} — ${cart[item].qty} шт.\n`;
        itemsList.push(item + ' x' + cart[item].qty);
    }

    let sauces = document.querySelectorAll('.sauce-cb:checked');
    let saucesList = [];
    if (sauces.length > 0) {
        text += '\n🧂 *Доп. Соусы:*\n';
        sauces.forEach(s => {
            text += `▪️ ${s.value}\n`;
            saucesList.push(s.value);
        });
    }

    text += `\n📍 *Адрес:* ${address}`;
    text += `\n💳 *Оплата:* ${payment}`;
    text += `\n🍽 *Персон:* ${document.getElementById('personCount').value}`;
    text += `\n📞 *Телефон:* ${phone}`;
    text += `\n💰 *ИТОГО:* ${document.getElementById('modal-total-price').innerText} ₽`;

    const totalSum = parseInt(document.getElementById('modal-total-price').innerText);

    // Сохраняем заказ в PocketBase
    const orderData = {
        items: itemsList.join(', '),
        address: address,
        phone: phone,
        payment: payment,
        persons: parseInt(document.getElementById('personCount').value) || 1,
        sauces: saucesList.join(', '),
        total: totalSum,
        status: 'new'
    };

    // Отправляем в PocketBase + Telegram параллельно
    const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxJp_sdu6UNZcm1TyikZGaW7N-D_iJmveTlPaFh1stzIGIH-jELW0a_PRkahKl4SHok/exec';

    const promises = [
        fetch(WEBHOOK_URL, {
            method: 'POST',
            body: JSON.stringify({ text: text })
        }).catch(err => console.error('Telegram webhook error:', err))
    ];

    // PocketBase — только если доступен
    if (pbAvailable) {
        promises.push(
            fetch(PB_URL + '/api/collections/orders/records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            }).catch(err => console.error('PocketBase order error:', err))
        );
    }

    Promise.all(promises)
    .then(() => {
        alert('✅ Заказ успешно оформлен! Мы скоро вам перезвоним.');
        cart = {};
        document.getElementById('addressInput').value = '';
        updateCartWidget();
        closeCart();
    })
    .catch(error => {
        alert('❌ Ошибка при отправке. Пожалуйста, проверьте интернет.');
    })
    .finally(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    });
}

/* ================================================
   Фильтры категорий и поиск
   ================================================ */

let currentCategory = 'all';

function setCategory(category, btnElement) {
    currentCategory = category;

    let buttons = document.getElementsByClassName('filter-btn');
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    btnElement.classList.add('active');

    filterMenu();
}

function filterMenu() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let items = document.getElementsByClassName('food-item');

    for (let i = 0; i < items.length; i++) {
        let title = items[i].getElementsByClassName('card-title')[0].innerText.toLowerCase();
        let itemCategory = items[i].getAttribute('data-category') || 'all';

        let matchesSearch = title.includes(input);
        let matchesCategory = (currentCategory === 'all' || itemCategory === currentCategory);

        if (matchesSearch && matchesCategory) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
}

/* ================================================
   Мобильная навигация
   ================================================ */

let burgerBtn = document.getElementById('mobileBurger');
let mobileOverlay = document.getElementById('mobileMenuOverlay');
let mobileCloseBtn = document.getElementById('mobileMenuClose');
let mobileBackBtn = document.getElementById('mobileMenuBack');
let mobileMenuCartBtn2 = document.getElementById('mobileMenuCartBtn');

function openMobileMenu() {
    mobileOverlay.style.display = 'flex';
    mobileOverlay.offsetHeight;
    mobileOverlay.classList.add('open');
    burgerBtn.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileOverlay.classList.remove('open');
    burgerBtn.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function() {
        if (!mobileOverlay.classList.contains('open')) {
            mobileOverlay.style.display = '';
        }
    }, 300);
}

function closeMobileMenuAndScroll(sectionId) {
    closeMobileMenu();
    setTimeout(function() {
        smoothScrollTo(sectionId);
    }, 100);
}

burgerBtn.addEventListener('click', function() {
    if (mobileOverlay.classList.contains('open')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
});

mobileCloseBtn.addEventListener('click', closeMobileMenu);
mobileBackBtn.addEventListener('click', closeMobileMenu);

if (mobileMenuCartBtn2) {
    mobileMenuCartBtn2.addEventListener('click', function() {
        closeMobileMenu();
        setTimeout(function() {
            renderCartItems();
            document.getElementById('cartModal').style.display = 'flex';
        }, 150);
    });
}

let mobileCartBtn = document.getElementById('mobileCartBtn');
if (mobileCartBtn) {
    mobileCartBtn.addEventListener('click', function() {
        renderCartItems();
        document.getElementById('cartModal').style.display = 'flex';
    });
}

function updateMobileCartBadge() {
    let badge = document.getElementById('mobileCartBadge');
    let mobileCount = document.getElementById('cart-total-items-mobile');
    let totalItems = 0;
    for (let item in cart) {
        totalItems += cart[item].qty;
    }
    if (badge) {
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    if (mobileCount) {
        mobileCount.innerText = totalItems;
    }
}

/* ================================================
   Свайп для слайдера (тач-устройства)
   ================================================ */

let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

sliderEl.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    clearInterval(sliderInterval);
}, { passive: true });

sliderEl.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;

    let diffX = touchStartX - touchEndX;
    let diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            changeSlide(1);
        } else {
            changeSlide(-1);
        }
    }

    startAutoSlide();
}, { passive: true });

/* ================================================
   Модалка подробностей товара
   ================================================ */

function openProductModal(idx) {
    const p = allProducts[idx];
    if (!p) return;

    const imgSrc = p.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
    document.getElementById('pmImage').src = imgSrc;
    document.getElementById('pmImage').alt = p.name;
    document.getElementById('pmTitle').textContent = p.name;
    document.getElementById('pmDesc').textContent = p.description;
    document.getElementById('pmPrice').textContent = p.price + ' ₽';

    // Хит продаж
    const hitBadge = document.getElementById('pmHitBadge');
    hitBadge.classList.toggle('visible', !!p.is_hit);

    // Состав
    const compSection = document.getElementById('pmCompositionSection');
    if (p.composition) {
        compSection.classList.remove('hidden');
        document.getElementById('pmComposition').textContent = p.composition;
    } else {
        compSection.classList.add('hidden');
    }

    // Приготовление
    const prepSection = document.getElementById('pmPreparationSection');
    if (p.preparation) {
        prepSection.classList.remove('hidden');
        document.getElementById('pmPreparation').textContent = p.preparation;
    } else {
        prepSection.classList.add('hidden');
    }

    // Кнопка «В корзину»
    document.getElementById('pmCartBtn').onclick = function() {
        addToCart(p.name, p.price);
    };

    document.getElementById('productModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeProductModal(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('productModal').classList.remove('open');
    document.body.style.overflow = '';
}

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeProductModal();
});

/* ================================================
   Инициализация — загружаем данные из PocketBase
   ================================================ */

loadSiteData();

