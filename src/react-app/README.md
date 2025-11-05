# React App Structure

The React application includes routing, context providers, Firebase integration, and a modular layout.

## Directory Structure

```
src/react-app
├── App.tsx
├── components
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── Header.css
│   └── Layout.css
├── contexts
│   └── AuthContext.tsx
├── firebase
│   └── config.ts
├── hooks
│   ├── useAuth.ts
│   ├── useConversation.ts
│   ├── useContributions.ts
│   └── useCreateConversation.ts
├── pages
│   ├── LandingPage.tsx
│   ├── ConversationWorkspacePage.tsx
│   ├── LandingPage.css
│   └── ConversationWorkspacePage.css
├── providers
│   ├── AppProviders.tsx
│   └── AuthProvider.tsx
├── styles
│   └── global.css
└── main.tsx
```

## Routing Overview

- `/` - Landing page with sign-in and "Start a conversation" CTA
- `/c/:conversationIdOrSlug` - Conversation workspace (shows a success banner on creation)

## Firebase Auth + Firestore

- Auth is provided via `AuthProvider` and exposed through `useAuth()`
- Conversations are stored under `conversations/{hashId}`
- `useCreateConversation()` creates a new conversation for the signed-in user and navigates to the workspace

## Development

- Ensure `.env` is configured with Firebase keys (see project root README)
- Run `pnpm dev` to start the app
- Run tests with `pnpm test`
