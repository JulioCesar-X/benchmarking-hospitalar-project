export interface TimelineItem {
    id: number;
    sender: string;
    sender_email: string;
    receiver: string;
    receiver_email: string;
    title: string;
    message: string;
    created_at: string;
    updated_at?: string;
    is_read: boolean;
    response?: string;
    newResponse?: string;
    expanded: boolean;
    type: 'received' | 'sent';
    highlighted?: boolean;  // Adicione esta linha
}