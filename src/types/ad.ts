export interface Ad {
    id: string;
    image_url: string;
    link: string | null;
    alt: string;
    variant: 'horizontal' | 'vertical' | 'inline' | 'sticky';
    is_active: boolean;
    priority: number;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    created_by: string | null;
}

export interface AdStats {
    ad_id: string;
    views: number;
    clicks: number;
    dismisses: number;
    ctr: number;
}
