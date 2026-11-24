# AutoSocial AI (frontend)

Public website for an n8n AI social media automation. Angular (standalone components) and Tailwind CSS.

## Run it

1. `cd frontend`
2. `npm install`
3. `ng serve`, then open `http://localhost:4200`

## Demo mode

`src/environments/environment.ts` has `demo: true`. In demo mode sign-in, plans, posts, accounts, payments, emails and publishing are simulated in the browser. Nothing real is posted or charged.

## Connecting the backend

Only these files need real calls: `auth.service.ts`, `posts.service.ts`, `accounts.service.ts`, `billing.service.ts`, `support.service.ts`. Use `core/api.service.ts` for requests. Then set `demo: false` and `apiUrl` in the environment files.

## Pages

Public: home, sign up, sign in, forgot and reset password, verify email, contact, privacy, terms.
Signed in: demo, plans, create post, bulk schedule (Business plan), posts, accounts, dashboard, settings, help.

## Plans

Starter $9, Creator $19, Business $49. A free account includes the demo only.