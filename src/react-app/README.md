# React App Structure

The React application has been reorganized to support future feature development with routing, context providers, and a modular layout.

## Directory Structure

```
src/react-app
├── App.tsx
├── components
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── Header.css
│   └── Layout.css
├── hooks
│   └── index.ts
├── pages
│   ├── LandingPage.tsx
│   ├── ConversationWorkspacePage.tsx
│   ├── LandingPage.css
│   └── ConversationWorkspacePage.css
├── providers
│   ├── AppProviders.tsx
│   └── index.ts
├── styles
│   └── global.css
└── main.tsx
```

## Routing Overview

- `/` - Landing page placeholder
- `/c/:conversationIdOrSlug` - Conversation workspace placeholder

## Next Steps

- Implement real content for landing and workspace pages
- Add additional providers (auth, data fetching) within `AppProviders`
- Expand styles and components to support new features
