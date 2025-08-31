import { useState } from 'react';
import { AIResponse } from '../../shared/types/api';

export const useAI = () => {
  const [aiResponse, setAiResponse] = useState<string>('');

  async function askAi(query: string) {
    try {
      console.log('📤 Sending ai response');
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        body: JSON.stringify({ query }),
      });
      const data = (await response.json()) as AIResponse;
      const { message } = data;
      console.log('💽 data');
      console.log(data);
      setAiResponse(message);
    } catch (error) {
      console.log('Error getting AI repsonse');
      setAiResponse('');
    }
  }
  return {
    aiResponse,
    askAi,
  };
};
