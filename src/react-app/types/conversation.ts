import { Timestamp } from "firebase/firestore";

export type ToneType = "neutral" | "positive" | "negative" | "curious" | "assertive";

export type Contribution = {
  id: string;
  content: string;
  tone: ToneType | null;
  authorUid: string;
  authorDisplayName: string;
  createdAt: Timestamp;
};

export type Conversation = {
  id: string;
  title: string;
  slug: string | null;
  ownerUid: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
