import { Leaf, Hand, Snowflake, Heart } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Натуральные продукты',
    desc: 'Без консервантов и усилителей вкуса',
  },
  {
    icon: Hand,
    title: 'Ручная лепка',
    desc: 'Каждое изделие сделано вручную',
  },
  {
    icon: Snowflake,
    title: 'Шоковая заморозка',
    desc: 'Сохраняет вкус и пользу без консервантов',
  },
  {
    icon: Heart,
    title: 'Домашний вкус',
    desc: 'Рецепты, как у бабушки, с душой и любовью',
  },
];

export default function Features() {
  return (
    <section id="features" className="max-w-[1280px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
        {features.map((f) => (
          <div key={f.title} className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-navy/5 flex items-center justify-center">
              <f.icon className="w-6 h-6 text-navy" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">{f.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
