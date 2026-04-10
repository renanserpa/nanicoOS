# Suggested Commands for Nanico OS Cockpit

## Local Development
```bash
cd /Users/serpa/Developer/Projects

# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Linting
npm run lint
```

## Git
```bash
# Current branch: feat/nanico-cockpit-v1
git status
git add .
git commit -m "message"
git push origin feat/nanico-cockpit-v1

# Pull updates
git pull origin feat/nanico-cockpit-v1
```

## Vercel
```bash
# Login/setup (if not already done)
vercel login
vercel link

# Deploy to Vercel
vercel deploy --prod

# Check deployment logs
vercel logs
```

## Environment
- `.env.local` contains: `ADMIN_PASSWORD`, `AUTH_SECRET`
- Password is: `nanico-2026!`
- Changes to `.env.local` require server restart
