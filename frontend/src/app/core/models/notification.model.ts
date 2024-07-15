export interface Notification {
  id: number;
  sender_id: number;
  receiver_id: number;
  sender: string;
  receiver: string;
  title: string;
  message: string;
  created_at: string;
  updated_at?: string;
  is_read?: boolean;
  response?: string;

}

