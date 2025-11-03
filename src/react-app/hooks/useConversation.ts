import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Conversation } from "../types";

export function useConversation(conversationId: string | undefined) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    const fetchConversation = async () => {
      try {
        setLoading(true);
        const conversationRef = doc(db, "conversations", conversationId);
        const conversationDoc = await getDoc(conversationRef);

        if (conversationDoc.exists()) {
          setConversation({
            id: conversationDoc.id,
            ...conversationDoc.data(),
          } as Conversation);
        } else {
          setError(new Error("Conversation not found"));
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId]);

  return { conversation, loading, error };
}

export async function updateConversationSlug(
  conversationId: string,
  slug: string
): Promise<void> {
  const conversationRef = doc(db, "conversations", conversationId);
  await updateDoc(conversationRef, {
    slug,
    updatedAt: Timestamp.now(),
  });
}
