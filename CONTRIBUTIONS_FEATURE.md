# Contributions Feature Documentation

## Overview

This document describes the contributions feature that enables authenticated participants to add verbatim contributions with optional tone metadata and view the ordered conversation timeline. The system automatically generates a human-readable slug after the first contribution if one does not exist.

## Architecture

### Data Model

#### Conversations Collection
- Path: `conversations/{conversationId}`
- Fields:
  - `id` (string): Unique identifier
  - `title` (string): Conversation title
  - `slug` (string | null): Human-readable URL slug
  - `ownerUid` (string): Firebase Auth UID of owner
  - `createdAt` (Timestamp): Creation timestamp
  - `updatedAt` (Timestamp): Last update timestamp

#### Contributions Subcollection
- Path: `conversations/{conversationId}/contributions/{contributionId}`
- Fields:
  - `id` (string): Unique identifier
  - `content` (string): The verbatim contribution text (1-5000 characters)
  - `tone` (enum | null): One of: "neutral", "positive", "negative", "curious", "assertive"
  - `authorUid` (string): Firebase Auth UID of author
  - `authorDisplayName` (string): Display name of author
  - `createdAt` (Timestamp): Creation timestamp (immutable)

### Security Rules

Firestore security rules are defined in `firestore.rules`:

1. **Conversations**:
   - Read: Only conversation owner
   - Update: Only owner, and only for `slug` and `updatedAt` fields

2. **Contributions**:
   - Read: Only conversation owner
   - Create: Only conversation owner with valid data
   - Update/Delete: Denied (immutable after creation)

3. **Validation**:
   - Content must be non-empty string (1-5000 characters)
   - Tone must be null or one of the allowed values
   - Author UID must match authenticated user

### Components

#### ContributionList
- Location: `src/react-app/components/ContributionList.tsx`
- Displays contributions ordered by `createdAt` ascending
- Shows author, timestamp, content, and tone badge
- Handles loading and empty states

#### ContributionComposer
- Location: `src/react-app/components/ContributionComposer.tsx`
- Textarea input for contribution content
- Tone selector with chip-style buttons
- Client-side validation using Zod schema
- Disabled state for unauthenticated users
- Stores verbatim text (no trimming or normalization)

### Hooks

#### useAuth
- Location: `src/react-app/hooks/useAuth.ts`
- Returns current authenticated user and loading state

#### useConversation
- Location: `src/react-app/hooks/useConversation.ts`
- Fetches conversation data by ID
- Provides `updateConversationSlug` function

#### useContributions
- Location: `src/react-app/hooks/useContributions.ts`
- Real-time stream of contributions ordered by creation time
- Provides `createContribution` function

### Utilities

#### Slug Generation
- Location: `src/react-app/utils/slugify.ts`
- Functions:
  - `slugify(text)`: Converts text to URL-safe slug
  - `extractFirstSentence(text)`: Extracts first sentence or first 10 words
  - `generateUniqueSlug(baseText, conversationId)`: Creates unique slug with collision detection

### Validation

Zod schemas defined in `src/react-app/schemas/contribution.ts`:
- Content: 1-5000 characters
- Tone: null or one of the allowed enum values

## Slug Auto-Generation

When the first contribution is created:

1. Check if conversation has a slug
2. If not, generate slug from:
   - Conversation title (if available), OR
   - First sentence of contribution content
3. Verify uniqueness via Firestore query
4. Append numeric suffix if collision detected
5. Update conversation document with slug and new `updatedAt`

## Usage Example

```tsx
// In ConversationWorkspacePage
const { user } = useAuth();
const { conversation } = useConversation(conversationId);
const { contributions } = useContributions(conversationId);

await createContribution({
  conversationId,
  content: "This is my contribution",
  tone: "positive",
  authorUid: user.uid,
  authorDisplayName: user.displayName || "Anonymous",
  conversationTitle: conversation?.title,
  currentSlug: conversation?.slug,
});
```

## Environment Variables

Required Firebase configuration in `.env`:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Testing Considerations

To fully test this feature:

1. Set up Firebase project with authentication enabled
2. Create test conversations with owner UIDs
3. Test contribution creation with various tones
4. Verify slug generation on first contribution
5. Test uniqueness by creating conversations with similar titles
6. Verify contributions cannot be edited or deleted
7. Test validation edge cases (empty content, oversized content)

## Acceptance Criteria Met

✅ Owners can add contributions with verbatim storage
✅ Each contribution appears immediately with original text and tone label
✅ Contributions persist in Firestore and cannot be edited/deleted
✅ First contribution triggers slug auto-generation
✅ Slug is visible in workspace header
✅ Security rules reject invalid content and non-create mutations
✅ Composer hidden/disabled for unauthenticated users
✅ Contributions ordered by createdAt ascending
✅ Empty state shown when no contributions exist
✅ All build and type checks pass
