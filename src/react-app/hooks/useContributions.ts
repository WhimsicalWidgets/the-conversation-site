import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Contribution, ToneType } from "../types";
import { generateUniqueSlug, extractFirstSentence } from "../utils";
import { updateConversationSlug } from "./useConversation";

export function useContributions(conversationId: string | undefined) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    const contributionsRef = collection(
      db,
      "conversations",
      conversationId,
      "contributions"
    );
    const q = query(contributionsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const contributionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Contribution[];
        setContributions(contributionsData);
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [conversationId]);

  return { contributions, loading, error };
}

export type CreateContributionParams = {
  conversationId: string;
  content: string;
  tone: ToneType | null;
  authorUid: string;
  authorDisplayName: string;
  conversationTitle?: string;
  currentSlug?: string | null;
};

export async function createContribution({
  conversationId,
  content,
  tone,
  authorUid,
  authorDisplayName,
  conversationTitle,
  currentSlug,
}: CreateContributionParams): Promise<void> {
  const contributionsRef = collection(
    db,
    "conversations",
    conversationId,
    "contributions"
  );

  const existingContributionsSnapshot = await getDocs(contributionsRef);
  const isFirstContribution = existingContributionsSnapshot.empty;

  await addDoc(contributionsRef, {
    content,
    tone,
    authorUid,
    authorDisplayName,
    createdAt: Timestamp.now(),
  });

  if (isFirstContribution && !currentSlug) {
    const baseText = conversationTitle || extractFirstSentence(content);
    const slug = await generateUniqueSlug(baseText, conversationId);
    await updateConversationSlug(conversationId, slug);
  }
}
