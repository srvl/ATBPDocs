import { Search } from './Search'

const icon = (d) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)

const sections = [
  {
    href: '/plans/budget-plus-plans-and-prices',
    title: 'Plans',
    desc: 'Budget+ and Premium+ plans, RAM sizes, server splits, backups and Discord bot hosting.',
    icon: icon(<><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M7 7h.01M7 17h.01" /></>)
  },
  {
    href: '/billing/payment-methods',
    title: 'Account & Billing',
    desc: 'GCash, Maya and bank payments, renewals, upgrades, refunds and cancellations.',
    icon: icon(<><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 10h19M6 15h4" /></>)
  },
  {
    href: '/games/terraria/connecting',
    title: 'Games',
    desc: 'Setup guides for Minecraft, Hytale, Palworld, Terraria and the other games we host.',
    icon: icon(<><path d="M6 11h4M8 9v4M15 12h.01M18 10h.01" /><path d="M17.3 5H6.7a4 4 0 0 0-3.96 3.43l-.7 4.9A3 3 0 0 0 7.2 15.6L9 14h6l1.8 1.6a3 3 0 0 0 5.16-2.27l-.7-4.9A4 4 0 0 0 17.3 5Z" /></>)
  },
  {
    href: '/using_the_panel/basic-controls',
    title: 'Server Panel',
    desc: 'Console, file manager, SFTP, schedules, sub-users, databases and backups.',
    icon: icon(<><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></>)
  },
  {
    href: '/running_a_server/updating',
    title: 'Guides',
    desc: 'Server software, worlds, plugins, mods, modpacks, optimisation and troubleshooting.',
    icon: icon(<><path d="M4 19.5V5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2Zm0 0A2 2 0 0 0 6 22h13" /><path d="M9 7h6M9 11h4" /></>)
  },
  {
    href: '/general/getting-support',
    title: 'About ATBP',
    desc: 'Support, our Singapore location and hardware, domains and our terms.',
    icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>)
  }
]

export function Landing() {
  return (
    <div className="atbp-landing" data-pagefind-ignore="all">
      <section className="atbp-hero">
        <h1 className="atbp-hero-title">
          What can we <span>help with?</span>
        </h1>
        <p className="atbp-hero-sub">
          Guides and policies for ATBP Hosting game servers, hosted in Singapore.
        </p>
        <div className="atbp-hero-search">
          <Search placeholder="Search the docs..." />
        </div>
      </section>
      <section className="atbp-grid">
        {sections.map((s) => (
          <a key={s.href} href={s.href} className="atbp-card">
            <span className="atbp-card-icon">{s.icon}</span>
            <span className="atbp-card-title">{s.title}</span>
            <span className="atbp-card-desc">{s.desc}</span>
          </a>
        ))}
      </section>
      <p className="atbp-help">
        Can't find it? Open a ticket on our{' '}
        <a href="https://discord.atbphosting.com" target="_blank" rel="noreferrer">Discord server</a>.
      </p>
    </div>
  )
}
