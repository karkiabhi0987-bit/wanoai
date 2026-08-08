import {
  collection,
  doc,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface ChatMessageDoc {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Timestamp | null;
}

export interface ConversationDoc {
  id: string;
  title: string;
  updatedAt?: Timestamp | null;
  messageCount?: number;
}

function userConversationsCol(uid: string) {
  return collection(db, 'users', uid, 'conversations');
}

function messagesCol(uid: string, conversationId: string) {
  return collection(db, 'users', uid, 'conversations', conversationId, 'messages');
}

export async function createConversation(
  uid: string,
  title: string,
): Promise<string> {
  const ref = await addDoc(userConversationsCol(uid), {
    title,
    updatedAt: serverTimestamp(),
    messageCount: 0,
  });
  return ref.id;
}

export async function listConversations(uid: string): Promise<ConversationDoc[]> {
  const q = query(userConversationsCol(uid), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ConversationDoc, 'id'>) }));
}

export function watchConversations(
  uid: string,
  cb: (conversations: ConversationDoc[]) => void,
): () => void {
  const q = query(userConversationsCol(uid), orderBy('updatedAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ConversationDoc, 'id'>) })));
    },
    (err) => console.warn('watchConversations error:', err),
  );
}

export async function appendMessage(
  uid: string,
  conversationId: string,
  message: Omit<ChatMessageDoc, 'id' | 'createdAt'>,
): Promise<void> {
  await addDoc(messagesCol(uid, conversationId), {
    ...message,
    createdAt: serverTimestamp(),
  });
}

export async function listMessages(
  uid: string,
  conversationId: string,
): Promise<ChatMessageDoc[]> {
  const q = query(messagesCol(uid, conversationId), orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ChatMessageDoc, 'id'>) }));
}

export function watchMessages(
  uid: string,
  conversationId: string,
  cb: (messages: ChatMessageDoc[]) => void,
): () => void {
  const q = query(messagesCol(uid, conversationId), orderBy('createdAt', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ChatMessageDoc, 'id'>) })));
    },
    (err) => console.warn('watchMessages error:', err),
  );
}

export async function deleteConversationData(
  uid: string,
  conversationId: string,
): Promise<void> {
  // Delete messages first, then the conversation doc.
  const msgs = await getDocs(messagesCol(uid, conversationId));
  const batch = msgs.docs.map((m) => m.ref.delete());
  await Promise.all(batch);
  await doc(db, 'users', uid, 'conversations', conversationId).delete();
}
