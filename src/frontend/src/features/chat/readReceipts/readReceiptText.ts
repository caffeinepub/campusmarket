// Helper to compute read receipt indicator
import type { Message, ChatThread } from '../../../backend';

export function getReadReceiptText(thread: ChatThread, currentUserPrincipal: string): string | null {
  if (thread.messages.length === 0) return null;

  const lastMessage = thread.messages[thread.messages.length - 1];
  const isCurrentUserSender = lastMessage.sender.toString() === currentUserPrincipal;

  if (!isCurrentUserSender) return null;

  const isBuyer = thread.buyer.toString() === currentUserPrincipal;
  const isRead = isBuyer ? lastMessage.read_by_seller : lastMessage.read_by_buyer;

  return isRead ? 'Seen' : null;
}
