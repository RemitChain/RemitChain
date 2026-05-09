import {
  ArrowRight,
  Blocks,
  Clock3,
  Code2,
  Globe2,
  Landmark,
  MonitorSmartphone,
  ShieldCheck,
  Users2,
  Wallet2,
  Zap,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { SUPPORTED_COUNTRIES } from '@/types';

export const metadata: Metadata = {
  title: 'AfriWage - Pay Your African Team',
  description:
    'Send USDC via Stellar directly to local bank accounts or mobile money wallets in Africa with near-zero fees and instant settlement.',
};

const navLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'Flow', href: '#flow' },
  { label: 'Countries', href: '#countries' },
  { label: 'Developers', href: '#developers' },
];

const stats = [
  { value: '< 5s', label: 'Avg settlement time' },
  { value: '~$0.0001', label: 'Network fee per transfer' },
  { value: '8+', label: 'African payout corridors' },
  { value: '99%+', label: 'Operational visibility' },
];

const features = [
  {
    icon: Zap,
    title: 'Instant settlement',
    description:
      'USDC payroll settles on Stellar in seconds instead of multi-day wire transfer windows.',
  },
  {
    icon: Globe2,
    title: 'Local currency delivery',
    description:
      'Workers receive value through local payout rails across NGN, GHS, KES, ZAR, TZS, UGX, XOF, and XAF corridors.',
  },
  {
    icon: ShieldCheck,
    title: 'Verifiable by default',
    description:
      'Every payment can be checked on-chain, with clean proof-of-payment flows for employers and workers.',
  },
  {
    icon: Wallet2,
    title: 'Treasury-first operations',
    description:
      'The dashboard is structured around funding state, payout readiness, and worker settlement confidence.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Responsive operator flow',
    description:
      'Desktop gets a control-room rail while mobile keeps sticky actions and bottom navigation.',
  },
  {
    icon: Code2,
    title: 'Open SDK and app',
    description:
      'The monorepo includes the web app plus @AfriWage/sdk for reusable Stellar payroll helpers.',
  },
];

const flowSteps = [
  'Employer funds treasury in USDC and reviews worker payout readiness.',
  'AfriWage routes the payroll instruction through the Stellar network.',
  'Settlement completes in seconds with a visible transaction record.',
  'Local payout rails handle delivery into the worker’s preferred corridor.',
];

const platformFacts = [
  { label: 'Frontend', value: 'Next.js 14 App Router' },
  { label: 'Language', value: 'TypeScript strict mode' },
  { label: 'Network', value: 'Stellar testnet' },
  { label: 'Asset', value: 'USDC' },
  { label: 'Wallet', value: 'Freighter' },
  { label: 'Data', value: 'Horizon API + React Query' },
];

const faqs = [
  {
    question: 'Which countries are represented in the product?',
    answer:
      'The current codebase exposes payout corridors for Nigeria, Ghana, Kenya, South Africa, Tanzania, Uganda, Senegal, and Cameroon.',
  },
  {
    question: 'What wallets work with AfriWage today?',
    answer:
      'The implemented wallet flow in this repo is built around the Freighter browser extension for Stellar accounts.',
  },
  {
    question: 'Is the current app on mainnet or testnet?',
    answer:
      'This project is currently wired for Stellar testnet. The README, environment defaults, and SDK constants all point to testnet infrastructure.',
  },
  {
    question: 'What is included for developers?',
    answer:
      'The repository includes the Next.js frontend, worker portal, dashboard flows, and a standalone SDK package with Stellar account and payment helpers.',
  },
];

function Surface({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] border border-[#eadfce] bg-white shadow-[0_22px_50px_rgba(16,32,51,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f6efe6] text-[#102033]">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-8rem] h-96 w-96 rounded-full bg-[#f2b94b]/18 blur-3xl" />
        <div className="absolute right-[-10rem] top-20 h-[28rem] w-[28rem] rounded-full bg-[#1f8f55]/12 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-[#e97b63]/10 blur-3xl" />
      </div>

      <nav className="sticky top-0 z-40 border-b border-[#e7dccb] bg-[#f6efe6]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#102033] text-white">
              <span className="font-display text-lg font-semibold">A</span>
            </div>
            <div>
              <p className="font-display text-lg font-semibold">AfriWage</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[#8c7760]">Payroll operations</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-[#637085] transition-colors hover:text-[#102033]">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/worker"
              className="hidden rounded-full border border-[#d8cebe] bg-white px-4 py-2.5 text-sm font-semibold text-[#102033] sm:inline-flex"
            >
              Worker portal
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-[#1f8f55] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(31,143,85,0.24)]"
            >
              Launch dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-16">
          <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Surface className="overflow-hidden bg-[linear-gradient(135deg,#102033_0%,#18324c_54%,#1f8f55_160%)] p-7 text-white sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/72">
                <Clock3 className="h-4 w-4" />
                Live on Stellar testnet
              </div>
              <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Run African payroll from one calm, visible operations system.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/76 sm:text-lg">
                AfriWage helps global employers send USDC over Stellar, manage treasury,
                track worker readiness, and route value into local African payout corridors.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-full bg-white px-5 py-3 font-semibold text-[#102033]"
                >
                  Open operations dashboard
                </Link>
                <Link
                  href="/worker"
                  className="rounded-full border border-white/16 px-5 py-3 font-semibold text-white"
                >
                  Open worker portal
                </Link>
              </div>
            </Surface>

            <Surface className="bg-[#fff8ef] p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8c7760]">Operator snapshot</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-[24px] bg-white p-5 shadow-[0_10px_30px_rgba(16,32,51,0.05)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#637085]">Treasury available</p>
                      <p className="mt-2 font-display text-3xl font-semibold text-[#102033]">$124,500</p>
                    </div>
                    <div className="rounded-2xl bg-[#dff3e8] p-3 text-[#1f8f55]">
                      <Landmark className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-[#eadfce] bg-white p-5">
                    <p className="text-sm text-[#637085]">Workers ready</p>
                    <p className="mt-2 font-display text-2xl font-semibold text-[#102033]">184</p>
                    <p className="mt-2 text-sm text-[#637085]">Across active corridors</p>
                  </div>
                  <div className="rounded-[24px] border border-[#eadfce] bg-white p-5">
                    <p className="text-sm text-[#637085]">Avg settlement</p>
                    <p className="mt-2 font-display text-2xl font-semibold text-[#102033]">4.1s</p>
                    <p className="mt-2 text-sm text-[#637085]">From approval to confirmation</p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#eadfce] bg-[#102033] p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/56">Next action</p>
                  <p className="mt-3 font-display text-2xl font-semibold">Send today&apos;s payroll batch</p>
                  <p className="mt-2 text-sm text-white/72">28 contractors are queued for disbursement.</p>
                </div>
              </div>
            </Surface>
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6 lg:px-8" id="platform">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <Surface key={stat.label} className="p-6">
                <p className="font-display text-3xl font-semibold text-[#102033]">{stat.value}</p>
                <p className="mt-2 text-sm text-[#637085]">{stat.label}</p>
              </Surface>
            ))}
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8c7760]">Platform</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-[#102033]">
                Designed around what payroll operators actually do
              </h2>
              <p className="mt-4 text-base leading-7 text-[#637085]">
                The landing page now matches the product itself: treasury-first, operational, and
                deliberately structured around payment confidence rather than generic startup sections.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <Surface key={feature.title} className="p-7">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff3e8] text-[#1f8f55]">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-[#102033]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#637085]">{feature.description}</p>
                </Surface>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8" id="countries">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8c7760]">Corridors</p>
                <h2 className="mt-3 font-display text-4xl font-semibold text-[#102033]">
                  Supported payout corridors
                </h2>
                <p className="mt-4 text-base leading-7 text-[#637085]">
                  The current product model exposes eight African countries and local currencies for off-ramp flows.
                </p>
              </div>
              <Surface className="bg-[#fff8ef] px-6 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#8c7760]">Active</p>
                <p className="mt-2 font-display text-3xl font-semibold text-[#102033]">8 corridors</p>
              </Surface>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {SUPPORTED_COUNTRIES.map((country) => (
                <Surface key={country.code} className="p-6 text-center">
                  <div className="text-4xl leading-none">{country.flag}</div>
                  <p className="mt-4 font-semibold text-[#102033]">{country.name}</p>
                  <p className="mt-1 font-mono text-sm text-[#1f8f55]">{country.currency}</p>
                </Surface>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8" id="flow">
          <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1fr_0.95fr]">
            <Surface className="p-7 sm:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8c7760]">Flow</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-[#102033]">
                Settlement flow, without ambiguity
              </h2>
              <div className="mt-8 space-y-5">
                {flowSteps.map((step, index) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#102033] text-sm font-semibold text-white">
                      0{index + 1}
                    </div>
                    <p className="pt-2 text-sm leading-7 text-[#637085]">{step}</p>
                  </div>
                ))}
              </div>
            </Surface>

            <Surface className="overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#fff7ec_100%)] p-7 sm:p-8">
              <div className="flex items-center gap-3 text-[#8c7760]">
                <Blocks className="h-5 w-5" />
                <p className="text-xs uppercase tracking-[0.18em]">Operational model</p>
              </div>
              <div className="mt-6 space-y-4 font-mono text-sm leading-7 text-[#102033]">
                <div className="rounded-[22px] border border-[#eadfce] bg-white px-5 py-4">[Employer Treasury]</div>
                <div className="pl-6 text-[#637085]">| send USDC payroll</div>
                <div className="rounded-[22px] border border-[#eadfce] bg-white px-5 py-4">[Stellar Network]</div>
                <div className="pl-6 text-[#637085]">| settle in 3 to 5 seconds</div>
                <div className="rounded-[22px] border border-[#eadfce] bg-white px-5 py-4">[Anchor / Off-ramp Rail]</div>
                <div className="pl-6 text-[#637085]">| deliver to local account or wallet</div>
                <div className="rounded-[22px] border border-[#eadfce] bg-white px-5 py-4">[Worker Destination]</div>
              </div>
            </Surface>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8" id="developers">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8c7760]">Developers</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-[#102033]">
                Developer-ready from the first commit
              </h2>
              <p className="mt-4 text-base leading-7 text-[#637085]">
                The repository already contains the app, worker portal, payment flows, and SDK foundations needed to ship.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <Surface className="p-7 sm:p-8">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {platformFacts.map((fact) => (
                    <div key={fact.label} className="rounded-[22px] bg-[#fff8ef] p-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#8c7760]">{fact.label}</p>
                      <p className="mt-2 font-semibold text-[#102033]">{fact.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[22px] border border-[#eadfce] p-5">
                    <Users2 className="h-5 w-5 text-[#1f8f55]" />
                    <p className="mt-4 font-semibold text-[#102033]">App routes</p>
                    <p className="mt-2 text-sm leading-6 text-[#637085]">Dashboard, wallet, send, worker, transactions, and settings flows are present.</p>
                  </div>
                  <div className="rounded-[22px] border border-[#eadfce] p-5">
                    <Blocks className="h-5 w-5 text-[#1f8f55]" />
                    <p className="mt-4 font-semibold text-[#102033]">SDK</p>
                    <p className="mt-2 text-sm leading-6 text-[#637085]">Helpers for balances, trustlines, payments, and account operations are already available.</p>
                  </div>
                  <div className="rounded-[22px] border border-[#eadfce] p-5">
                    <Code2 className="h-5 w-5 text-[#1f8f55]" />
                    <p className="mt-4 font-semibold text-[#102033]">Open source</p>
                    <p className="mt-2 text-sm leading-6 text-[#637085]">Use the existing UI and SDK as a base for deeper payroll automation.</p>
                  </div>
                </div>
              </Surface>

              <Surface className="bg-[#102033] p-7 text-white sm:p-8">
                <p className="text-xs uppercase tracking-[0.18em] text-white/56">Start here</p>
                <h3 className="mt-3 font-display text-3xl font-semibold">Move straight into the product.</h3>
                <p className="mt-4 text-sm leading-7 text-white/72">
                  The visual system now stays consistent from landing page to dashboard, so handoff feels like entering the same product rather than switching contexts.
                </p>
                <div className="mt-8 space-y-3">
                  <Link href="/dashboard" className="flex items-center justify-between rounded-[20px] border border-white/12 px-4 py-3 font-semibold text-white">
                    <span>Open dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/worker" className="flex items-center justify-between rounded-[20px] border border-white/12 px-4 py-3 font-semibold text-white">
                    <span>Open worker portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href="https://github.com/AfriWage/AfriWage" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-[20px] border border-white/12 px-4 py-3 font-semibold text-white">
                    <span>GitHub repository</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </Surface>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8c7760]">FAQ</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-[#102033]">
                Answers grounded in the current repo
              </h2>
            </div>

            <div className="mt-10 space-y-4">
              {faqs.map((faq, index) => (
                <details key={faq.question} className="overflow-hidden rounded-[24px] border border-[#eadfce] bg-white px-6" open={index === 0}>
                  <summary className="cursor-pointer list-none py-5 font-semibold text-[#102033]">
                    {faq.question}
                  </summary>
                  <div className="pb-5 text-sm leading-7 text-[#637085]">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e7dccb] bg-[#fffaf2] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold text-[#102033]">AfriWage</p>
            <p className="mt-2 text-sm text-[#637085]">Borderless payroll for African teams, built on Stellar testnet infrastructure.</p>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-[#637085]">
            <Link href="/dashboard" className="hover:text-[#102033]">Dashboard</Link>
            <Link href="/worker" className="hover:text-[#102033]">Worker Portal</Link>
            <a href="https://github.com/AfriWage/AfriWage" target="_blank" rel="noopener noreferrer" className="hover:text-[#102033]">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
