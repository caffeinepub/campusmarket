// Deterministic smart reply generation
import type { Message } from '../../../backend';

export function generateSmartReplies(messages: Message[], listingTitle: string): string[] {
  const lastMessage = messages[messages.length - 1];
  
  if (!lastMessage) {
    return [
      'Is this still available?',
      'Can we meet today?',
      'What\'s your best price?',
    ];
  }

  const content = lastMessage.content.toLowerCase();

  if (content.includes('price') || content.includes('cost') || content.includes('₹')) {
    return [
      'That works for me!',
      'Can you go lower?',
      'Let me think about it',
    ];
  }

  if (content.includes('meet') || content.includes('pickup') || content.includes('location')) {
    return [
      'Yes, that works!',
      'Can we meet at campus?',
      'What time is good for you?',
    ];
  }

  if (content.includes('condition') || content.includes('quality')) {
    return [
      'Sounds good!',
      'Can I see more photos?',
      'Any issues I should know about?',
    ];
  }

  return [
    'Yes, interested!',
    'Can we discuss the price?',
    'When can we meet?',
  ];
}
