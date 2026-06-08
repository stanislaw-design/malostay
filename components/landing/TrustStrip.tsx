import { Home, Users, Waves, Sparkles, Car, Star } from 'lucide-react'

const items = [
  { icon: Home, text: '5 domków' },
  { icon: Users, text: 'do 8 osób' },
  { icon: Waves, text: 'Dolina Dunajca' },
  { icon: Sparkles, text: 'Sauna & Jacuzzi' },
  { icon: Car, text: 'Bezpłatny parking' },
  { icon: Star, text: '9.8 · 274 opinii' },
]

function Item({ icon: Icon, text }: { icon: typeof Home; text: string }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Icon size={14} className="text-charcoal/50" />
      <span className="text-[12px] tracking-[0.12em] text-charcoal/60 uppercase whitespace-nowrap">
        {text}
      </span>
    </div>
  )
}

export function TrustStrip() {
  return (
    <div className="bg-bone border-b border-mist overflow-hidden">
      {/* Mobile: marquee */}
      <div className="md:hidden flex py-4">
        <div className="marquee-track flex gap-8 px-4">
          {[...items, ...items].map((item, i) => (
            <Item key={i} icon={item.icon} text={item.text} />
          ))}
        </div>
      </div>

      {/* Desktop: static centered */}
      <div className="hidden md:flex items-center justify-center gap-8 px-6 py-4">
        {items.map((item, i) => (
          <Item key={i} icon={item.icon} text={item.text} />
        ))}
      </div>
    </div>
  )
}
