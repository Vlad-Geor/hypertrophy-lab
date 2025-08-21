import { HealthTarget } from "@ikigaidev/model";

type PaginationConfig = {
    totalPages: number;
    currentPage: number;
    visibleRange: number;
}

type PageFilterState = {
    targetFilter: HealthTarget | null;
    query?: string;
    pagination?: any;
}

export type SupplementState = {
    pageFilterState: PageFilterState;
}