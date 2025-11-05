import { useState, useCallback } from "react";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db } from "../firebase/config";
import { useAuth } from "./useAuth";

export function useCreateConversation() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createConversation = useCallback(async (): Promise<string> => {
    if (!user) {
      throw new Error("User must be authenticated to create a conversation");
    }

    setLoading(true);
    setError(null);

    try {
      const hashId = nanoid(12);
      const conversationRef = doc(db, "conversations", hashId);

      await setDoc(conversationRef, {
        title: "Untitled Conversation",
        slug: null,
        ownerUid: user.uid,
        ownerDisplayName: user.displayName || user.email || "Anonymous",
        participantRoles: { [user.uid]: "owner" },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return `/c/${hashId}`;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { createConversation, loading, error };
}
