export interface Notification {
  id: number;
  created_at: string;
  message: string;
  is_read: boolean;
  sender: string;
  receiver: string;
  title: string;
  response?: string;
  updated_at?: string;
}