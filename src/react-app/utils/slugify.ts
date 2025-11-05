import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractFirstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  if (match) {
    return match[0].trim();
  }
  const words = text.split(/\s+/).slice(0, 10);
  return words.join(" ");
}

export async function generateUniqueSlug(
  baseText: string,
  conversationId: string
): Promise<string> {
  let slug = slugify(baseText);
  
  if (slug.length === 0) {
    slug = "conversation";
  }
  
  if (slug.length > 60) {
    slug = slug.substring(0, 60);
  }

  let finalSlug = slug;
  let counter = 1;

  while (await slugExists(finalSlug, conversationId)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  return finalSlug;
}

async function slugExists(slug: string, excludeConversationId?: string): Promise<boolean> {
  const conversationsRef = collection(db, "conversations");
  const q = query(conversationsRef, where("slug", "==", slug));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return false;
  }
  
  if (excludeConversationId) {
    return snapshot.docs.some(doc => doc.id !== excludeConversationId);
  }
  
  return true;
}
