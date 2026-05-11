// Sync fallback data to PocketBase
const PB_URL = 'http://localhost:8090';

const FALLBACK_SETTINGS = {
  promo_ticker: "🎁 АКЦИЯ: К первому заказу — литр фирменного клюквенного морса в ПОДАРОК! 🛵 Бесплатная доставка от 1500 ₽!",
  hero_badge: "Натуральные продукты",
  hero_title: "Наши пельмени и вареники",
  hero_description: "Только натуральные продукты и ручная лепка для настоящего домашнего вкуса.",
  stat_clients: "500+",
  stat_clients_label: "Довольных клиентов",
  stat_delivery: "2 ч",
  stat_delivery_label: "Средняя доставка",
  stat_years: "3 года",
  stat_years_label: "На рынке",
  phone: "+7 929 842 98 91",
  footer_tagline: "Домашняя кулинария с доставкой до двери",
  footer_copyright: "© 2025 Все права защищены",
};

const FALLBACK_PRODUCTS = [
  { name: "Домашние пельмени", description: "Ручная лепка, свинина/говядина. 500 г.", price: 450, image: "/img/pelmenidom.jpeg", category: "meat", is_hit: true, sort_order: 1, composition: "Тесто: мука, вода, яйцо, соль. Начинка: свинина, говядина, лук, соль, перец.", preparation: "Вскипятить воду, посолить. Опустить пельмени. Варить 7–10 мин после всплытия. Подавать со сметаной." },
  { name: "Вареники с картошкой", description: "С жареным лучком и сливочным маслом. 500 г.", price: 320, image: "/img/vareniki.png", category: "meat", is_hit: false, sort_order: 2, composition: "Тесто: мука, вода, яйцо, соль. Начинка: картофель, лук жареный, масло сливочное, укроп.", preparation: "Варить 5–7 мин после всплытия. Подавать с жареным луком и сметаной." },
  { name: "Вареники с вишней", description: "Сладкие домашние вареники с сочной вишней. 500 г.", price: 390, image: "/img/vareniki vishnya.png", category: "desserts", is_hit: false, sort_order: 3, composition: "Тесто: мука, вода, яйцо, соль. Начинка: вишня свежемороженая, сахар.", preparation: "Варить 5 мин после всплытия. Подавать со сметаной или сгущёнкой." },
  { name: "Манты с говядиной", description: "Крупные манты ручной лепки (5 шт). 450 г.", price: 550, image: "https://images.unsplash.com/photo-1616895427217-5318221a3e79?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: false, sort_order: 4, composition: "Тесто: мука, вода, яйцо, соль. Начинка: говядина, лук, тыква, курдючный жир, зира.", preparation: "Готовить на пару в мантоварке 40–45 мин. Подавать со сметаной и чесноком." },
  { name: "Блинчики с творогом", description: "Нежные блинчики с фермерским творогом. 400 г.", price: 380, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80", category: "desserts", is_hit: false, sort_order: 5, composition: "Блины: мука, молоко, яйцо, сахар, соль, масло. Начинка: творог фермерский, сахар, ванилин.", preparation: "Разогреть на сковороде или в микроволновке 1–2 мин. Подавать со сметаной или вареньем." },
  { name: "Блины с мясом", description: "Сытные блинчики с обжаренным фаршем. 400 г.", price: 420, image: "https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: true, sort_order: 6, composition: "Блины: мука, молоко, яйцо, сахар, соль, масло. Начинка: говядина обжаренная, лук, соль, перец.", preparation: "Разогреть на сковороде 2–3 мин с каждой стороны. Подавать со сметаной." },
  { name: "Блинчики домашние", description: "Тонкие блинчики без начинки (10 шт). 350 г.", price: 200, image: "https://images.unsplash.com/photo-1761095596635-065d5e13b116?auto=format&fit=crop&w=400&q=80", category: "desserts", is_hit: false, sort_order: 7 },
  { name: "Сырники классические", description: "Толстенькие и в меру сладкие сырники. 350 г.", price: 420, image: "https://images.unsplash.com/photo-1675540212407-a67ab877c418?auto=format&fit=crop&w=400&q=80", category: "desserts", is_hit: false, sort_order: 8 },
  { name: "Пирожки с капустой", description: "Свежеиспеченные румяные пирожки (3 шт). 300 г.", price: 180, image: "https://images.unsplash.com/photo-1702742136650-339afaec9817?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: false, sort_order: 9 },
  { name: "Пирожки с мясом", description: "Запеченные в духовке, много начинки (3 шт). 300 г.", price: 240, image: "https://images.unsplash.com/photo-1702742136650-339afaec9817?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: false, sort_order: 10 },
  { name: "Пирожки с картошкой", description: "Мягкое тесто, картофель с укропом (3 шт). 300 г.", price: 180, image: "https://images.unsplash.com/photo-1702742136650-339afaec9817?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: false, sort_order: 11 },
  { name: "Чебуреки с мясом", description: "Сочные чебуреки с хрустящей корочкой (2 шт). 300 г.", price: 260, image: "https://images.unsplash.com/photo-1600289031464-74d374b64991?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: false, sort_order: 12 },
  { name: "Сосиска в тесте", description: "Классика детства. Воздушное тесто (2 шт). 250 г.", price: 160, image: "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: false, sort_order: 13 },
  { name: "Борщ домашний", description: "Наваристый борщ на говяжьем бульоне. 500 мл.", price: 350, image: "https://images.unsplash.com/photo-1611068120879-531d290f60d6?auto=format&fit=crop&w=400&q=80", category: "soups", is_hit: true, sort_order: 14, composition: "Говядина на кости, свёкла, капуста, картофель, морковь, лук, томатная паста, чеснок, лавровый лист, зелень.", preparation: "Довести до кипения. Подавать со сметаной и свежей зеленью. Отлично с чесночными пампушками." },
  { name: "Солянка мясная", description: "Сборная солянка с копченостями и маслинами. 500 мл.", price: 420, image: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=400&q=80", category: "soups", is_hit: false, sort_order: 15 },
  { name: "Куриная лапша", description: "Легкий супчик с домашней лапшой и курочкой. 500 мл.", price: 280, image: "https://images.unsplash.com/photo-1548943487-a2e4e43b485d?auto=format&fit=crop&w=400&q=80", category: "soups", is_hit: false, sort_order: 16 },
  { name: "Котлеты по-домашнему", description: "Свинина и говядина, обжаренные до корочки (2 шт). 250 г.", price: 350, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: false, sort_order: 17 },
  { name: "Котлеты куриные", description: "Нежные диетические котлетки из филе (2 шт). 250 г.", price: 320, image: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8dd?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: false, sort_order: 18 },
  { name: "Тефтели с подливкой", description: "Мясные ежики с рисом в томатном соусе. 350 г.", price: 360, image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: false, sort_order: 19 },
  { name: "Голубцы классические", description: "Свежая капуста, фарш и рис, тушеные в соусе. 400 г.", price: 380, image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: false, sort_order: 20 },
  { name: "Плов со свининой", description: "Рассыпчатый рис, много мяса и специй. 400 г.", price: 420, image: "https://images.unsplash.com/photo-1671048116810-6f885b2b35a5?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: true, sort_order: 21 },
  { name: "Макароны по-флотски", description: "Обжаренные с говяжьим фаршем и луком. 350 г.", price: 320, image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: false, sort_order: 22 },
  { name: "Картофельное пюре", description: "На натуральном молоке со сливочным маслом. 250 г.", price: 180, image: "https://images.unsplash.com/photo-1615486171434-2e9eb5a53e48?auto=format&fit=crop&w=400&q=80", category: "meat", is_hit: false, sort_order: 23 },
  { name: "Салат Оливье", description: "Тот самый праздничный вкус, с вареной колбасой. 300 г.", price: 280, image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=400&q=80", category: "desserts", is_hit: true, sort_order: 24 },
  { name: "Сельдь под шубой", description: "Классический слоеный салат с нежной селедочкой. 300 г.", price: 320, image: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=400&q=80", category: "desserts", is_hit: false, sort_order: 25 },
  { name: "Винегрет", description: "Постный салат с ароматным нерафинированным маслом. 300 г.", price: 220, image: "https://images.unsplash.com/photo-1604908177525-c6fa71391788?auto=format&fit=crop&w=400&q=80", category: "desserts", is_hit: false, sort_order: 26 },
  { name: "Крабовый салат", description: "С кукурузой, рисом и свежим огурчиком. 300 г.", price: 290, image: "https://images.unsplash.com/photo-1623366302587-bca8ebfc3661?auto=format&fit=crop&w=400&q=80", category: "desserts", is_hit: false, sort_order: 27 },
  { name: "Торт Медовик", description: "Тонкие медовые коржи и сметанный крем (1 порция). 150 г.", price: 250, image: "https://images.unsplash.com/photo-1624000961428-eeece184988b?auto=format&fit=crop&w=400&q=80", category: "desserts", is_hit: false, sort_order: 28 },
  { name: "Морс клюквенный", description: "Освежающий напиток из натуральных ягод. 1 литр.", price: 250, image: "https://images.unsplash.com/photo-1594579629306-07af17998d4a?auto=format&fit=crop&w=400&q=80", category: "desserts", is_hit: false, sort_order: 29 },
  { name: "Компот из сухофруктов", description: "Тот самый вкус из детства, в меру сладкий. 1 литр.", price: 200, image: "https://images.unsplash.com/photo-1595981234058-a9302bf97386?auto=format&fit=crop&w=400&q=80", category: "desserts", is_hit: false, sort_order: 30 },
];

async function sync() {
  console.log('🔄 Syncing site_settings...');

  // Get existing settings
  const settingsRes = await fetch(`${PB_URL}/api/collections/site_settings/records?perPage=200`);
  const settingsData = await settingsRes.json();
  const existingSettings = {};
  (settingsData.items || []).forEach(s => { existingSettings[s.key] = s.id; });

  for (const [key, value] of Object.entries(FALLBACK_SETTINGS)) {
    const id = existingSettings[key];
    if (id) {
      // Update
      await fetch(`${PB_URL}/api/collections/site_settings/records/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      console.log(`  ✓ Updated: ${key}`);
    } else {
      // Create
      await fetch(`${PB_URL}/api/collections/site_settings/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      console.log(`  + Created: ${key}`);
    }
  }

  console.log('\n🔄 Syncing products...');

  // Get existing products
  const productsRes = await fetch(`${PB_URL}/api/collections/products/records?perPage=200&sort=sort_order`);
  const productsData = await productsRes.json();
  const existingProducts = {};
  (productsData.items || []).forEach(p => { existingProducts[p.name] = p.id; });

  for (const product of FALLBACK_PRODUCTS) {
    const id = existingProducts[product.name];
    const payload = {
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      is_hit: product.is_hit || false,
      sort_order: product.sort_order,
    };
    if (product.composition) payload.composition = product.composition;
    if (product.preparation) payload.preparation = product.preparation;

    if (id) {
      await fetch(`${PB_URL}/api/collections/products/records/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(`  ✓ Updated: ${product.name}`);
    } else {
      await fetch(`${PB_URL}/api/collections/products/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(`  + Created: ${product.name}`);
    }
  }

  // Delete products not in fallback
  const fallbackNames = new Set(FALLBACK_PRODUCTS.map(p => p.name));
  for (const p of productsData.items || []) {
    if (!fallbackNames.has(p.name)) {
      await fetch(`${PB_URL}/api/collections/products/records/${p.id}`, { method: 'DELETE' });
      console.log(`  ✗ Deleted: ${p.name}`);
    }
  }

  console.log('\n✅ Sync complete!');
}

sync().catch(err => console.error('❌ Sync failed:', err));
