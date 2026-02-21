// Single AI provider abstraction with deterministic fallback
import { useIsAIAssistEnabled } from '../../../api/aiAssist';

export interface AIEnhancement {
  title?: string;
  description?: string;
  suggestedPrice?: number;
  tags?: string[];
}

export function useAIProvider() {
  const { data: aiEnabled } = useIsAIAssistEnabled();

  const enhanceListing = async (title: string, description: string, category: string): Promise<AIEnhancement> => {
    if (!aiEnabled) {
      // Deterministic fallback
      return {
        title: title.trim() ? `${title} - ${category}` : '',
        description: description.trim() ? `${description}\n\nCondition: Well-maintained` : '',
      };
    }

    // TODO: When AI is enabled, call Chutes API here
    return {
      title: `Enhanced: ${title}`,
      description: `${description}\n\nAI-enhanced description coming soon.`,
    };
  };

  return {
    aiEnabled: !!aiEnabled,
    enhanceListing,
  };
}
