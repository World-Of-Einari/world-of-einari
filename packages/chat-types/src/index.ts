export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestBody {
  message?: string;
  history?: Message[];
  contactForm?: {
    name: string;
    email: string;
    message: string;
  };
}
