import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, Timestamp, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Conversation } from "../types";

export function useConversation(conversationIdOrSlug: string | undefined) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if (!conversationIdOrSlug) {
      setLoading(false);
      return;
    }

    const fetchConversation = async () => {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);
        setPermissionDenied(false);

        // First, try to fetch by document ID
        const conversationRef = doc(db, "conversations", conversationIdOrSlug);
        const conversationDoc = await getDoc(conversationRef);

        if (conversationDoc.exists()) {
          setConversation({
            id: conversationDoc.id,
            ...conversationDoc.data(),
          } as Conversation);
        } else {
          // If not found by ID, try querying by slug
          const conversationsRef = collection(db, "conversations");
          const q = query(conversationsRef, where("slug", "==", conversationIdOrSlug));
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            setConversation({
              id: doc.id,
              ...doc.data(),
            } as Conversation);
          } else {
            setNotFound(true);
            setError(new Error("Conversation not found"));
          }
        }
      } catch (err) {
        const errorMessage = (err as Error).message || "";
        if (errorMessage.includes("permission-denied") || errorMessage.includes("Missing or insufficient permissions")) {
          setPermissionDenied(true);
          setError(new Error("You don't have permission to view this conversation"));
        } else {
          setError(err as Error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationIdOrSlug]);

  return { conversation, loading, error, notFound, permissionDenied };
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

export async function updateConversationTitle(
  conversationId: string,
  title: string
): Promise<void> {
  const conversationRef = doc(db, "conversations", conversationId);
  await updateDoc(conversationRef, {
    title,
    updatedAt: Timestamp.now(),
  });
}
