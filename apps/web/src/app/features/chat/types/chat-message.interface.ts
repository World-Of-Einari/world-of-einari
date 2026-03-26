export interface ChatMessage {
  role: 'user' | 'assistant' | 'contact_form';
  content: string;
}
