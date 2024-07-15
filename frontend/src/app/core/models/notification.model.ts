export interface Notification {
  id: number;
  created_at: string;
  message: string;
  title: string;
  sender: { id: number, name: string }; 
  response?: string;
  is_read?: boolean;
  updated_at?: string;
}