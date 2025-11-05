# React + Vite + Hono + Cloudflare Workers

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/vite-react-template)

This template provides a minimal setup for building a React application with TypeScript and Vite, designed to run on Cloudflare Workers. It features hot module replacement, ESLint integration, and the flexibility of Workers deployments.

![React + TypeScript + Vite + Cloudflare Workers](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/fc7b4b62-442b-4769-641b-ad4422d74300/public)

<!-- dash-content-start -->

🚀 Supercharge your web development with this powerful stack:

- [**React**](https://react.dev/) - A modern UI library for building interactive interfaces
- [**Vite**](https://vite.dev/) - Lightning-fast build tooling and development server
- [**Hono**](https://hono.dev/) - Ultralight, modern backend framework
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - Edge computing platform for global deployment

### ✨ Key Features

- 🔥 Hot Module Replacement (HMR) for rapid development
- 📦 TypeScript support out of the box
- 🛠️ ESLint configuration included
- ⚡ Zero-config deployment to Cloudflare's global network
- 🎯 API routes with Hono's elegant routing
- 🔄 Full-stack development setup
- 🔎 Built-in Observability to monitor your Worker

Get started in minutes with local development or deploy directly via the Cloudflare dashboard. Perfect for building modern, performant web applications at the edge.

<!-- dash-content-end -->

## Getting Started

To start a new project with this template, run:

```bash
pnpm create cloudflare@latest -- --template=cloudflare/templates/vite-react-template
```

A live deployment of this template is available at:
[https://react-vite-template.templates.workers.dev](https://react-vite-template.templates.workers.dev)

## Development

Install dependencies:

```bash
pnpm install
```

Start the development server with:

```bash
pnpm dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Production

Build your project for production:

```bash
pnpm build
```

Preview your build locally:

```bash
pnpm preview
```

Deploy your project to Cloudflare Workers:

```bash
pnpm build && pnpm deploy
```

Monitor your workers:

```bash
pnpm exec wrangler tail
```

## Firebase Setup and Conversation Flow

This app integrates Firebase Auth and Firestore to enable authenticated users to start a new conversation from the landing page and jump into its workspace.

### 1. Configure environment variables

Copy `.env.example` to `.env` and fill in your Firebase project settings:

```
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 2. Security rules

Initial Firestore rules are in `firestore.rules` and allow:
- create on `conversations/{hashId}` only for authenticated users where `ownerUid == request.auth.uid`
- get/read on conversations for the owner
- everything else is denied by default (with limited allowances for owner contributions)

Deploy rules with the Firebase CLI (manual step):

```
firebase deploy --only firestore:rules
```

Or use the helper script which prints the command:

```
pnpm run rules:deploy
```

### 3. Starting a conversation

- Sign in using the header or the landing page CTA (Google sign-in popup)
- Click "Start a conversation" on the landing page
- A Firestore document will be created at `conversations/{hashId}` with:
  - title: "Untitled Conversation"
  - slug: null
  - ownerUid, ownerDisplayName
  - participantRoles: { [uid]: "owner" }
  - createdAt, updatedAt
- You will be redirected to `/c/{hashId}?created=1` and see a brief success banner in the workspace

### 4. Testing

Run the test suite and lints:

```
pnpm lint
pnpm test
```

A lightweight Landing page test ensures the correct CTA appears based on authentication state.

