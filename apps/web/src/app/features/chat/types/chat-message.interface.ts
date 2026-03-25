import { Message } from '@einarinau/chat-types';

export type ChatMessage = Message | { role: 'contact_form'; content: string };
