export interface TimelineItem {
    id: number;
    created_at: string;
    detail: string;
    expanded: boolean;
    is_read: boolean;
    sender: string;
    sender_email?: string;
    receiver?: string;
    receiver_email?: string;
    title: string;
    response?: string;
    updated_at?: string;
    type: 'received' | 'sent';
    newResponse?: string;
}