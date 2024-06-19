// export interface Notification {
//     id: number;
//     Details: string;
//     isRead: boolean;
//   }

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
  deleted_at?: string;
  isRead?: boolean;

}

