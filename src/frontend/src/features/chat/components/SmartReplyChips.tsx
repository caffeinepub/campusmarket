// Smart reply chips UI component
import { Button } from '@/components/ui/button';
import { generateSmartReplies } from '../smartReplies/deterministicReplies';
import type { Message } from '../../../backend';

interface SmartReplyChipsProps {
  messages: Message[];
  listingTitle: string;
  onSelectReply: (reply: string) => void;
  disabled?: boolean;
}

export function SmartReplyChips({ messages, listingTitle, onSelectReply, disabled }: SmartReplyChipsProps) {
  const replies = generateSmartReplies(messages, listingTitle);

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {replies.map(reply => (
        <Button
          key={reply}
          variant="outline"
          size="sm"
          onClick={() => onSelectReply(reply)}
          disabled={disabled}
          className="text-xs"
        >
          {reply}
        </Button>
      ))}
    </div>
  );
}
