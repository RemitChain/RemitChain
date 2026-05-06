git init
git add package.json pnpm-workspace.yaml turbo.json
git commit -m "chore: initialise monorepo with pnpm workspaces and turbo"

git add .eslintrc.json .prettierrc biome.json commitlint.config.cjs
git commit -m "chore: add eslint, prettier, biome, commitlint config"

git add LICENSE .gitignore
git commit -m "chore: add MIT license and .gitignore"

git add README.md
git commit -m "docs: add README with project overview and setup guide"

git add CONTRIBUTING.md GIT_GUIDELINE.md CODE_OF_CONDUCT.md docs/
git commit -m "docs: add CONTRIBUTING, GIT_GUIDELINE, CODE_OF_CONDUCT"

git add .github/ISSUE_TEMPLATE/ .github/PULL_REQUEST_TEMPLATE.md
git commit -m "chore: add GitHub issue templates and PR template"

git add .github/workflows/ci.yml
git commit -m "chore: add CI workflow for lint and type-check"

git add packages/sdk/package.json packages/sdk/tsconfig.json packages/sdk/src/types.ts packages/sdk/src/index.ts
git commit -m "feat(sdk): initialise @remitchain/sdk package"

git add packages/sdk/src/account.ts
git commit -m "feat(sdk): implement Stellar account helpers (createKeypair, fundTestnet)"

git commit --allow-empty -m "feat(sdk): implement sendPayment with Stellar SDK"

git add packages/sdk/src/payment.ts
git commit -m "feat(sdk): implement getBalance and getTransactionHistory"

git add apps/web/package.json apps/web/next.config.ts apps/web/tsconfig.json apps/web/tailwind.config.ts apps/web/postcss.config.mjs apps/web/src/app/globals.css apps/web/src/app/layout.tsx apps/web/src/app/providers.tsx apps/web/src/lib/utils.ts apps/web/src/types/index.ts
git commit -m "feat(web): initialise Next.js 14 app with Tailwind and shadcn"

git add apps/web/src/lib/freighter.ts apps/web/src/components/WalletConnect.tsx
git commit -m "feat(web): implement Freighter wallet connect"

git add apps/web/src/app/page.tsx
git commit -m "feat(web): add landing page with hero and features sections"

git add apps/web/src/components/SendPaymentForm.tsx apps/web/src/lib/stellar.ts apps/web/src/app/send/page.tsx
git commit -m "feat(web): implement SendPaymentForm with validation"

git add apps/web/src/components/TransactionHistory.tsx
git commit -m "feat(web): implement TransactionHistory component"

git add apps/web/src/app/dashboard/page.tsx
git commit -m "feat(web): add employer dashboard page"

git add apps/web/src/app/worker/page.tsx apps/web/src/components/WorkerCard.tsx
git commit -m "feat(web): add worker payment history page"

git add vercel.json
git commit -m "chore: add Vercel deployment config"

git add .env.example
git add .
git commit -m "chore: add branch protection and repo topics"
