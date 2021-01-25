
export interface FileModel {
    name: string;
    full_directory: string;
}

export interface ConditionModel {
    id: number;
    title: string;
    description: string;
    short_description: string;
    files: FileModel[];
}

export interface ProcessModel {
    id: number;
    title: string;
    description: string;
    short_description: string;
    files: FileModel[];
}

export interface SearchModel {
    category_id: number;
    title: string;
    subcategory_id: number;
    entity_id: number;
    article_id: number;
    category_name: string;
    subcategory_name: string;
    entity_name: string;
}

export interface Article {
    article_id: number;
    title: string;
    short_description: string;
    description: string
    sub_category_history_id: number;
    path: string;
    history_id: number;
    conditions: ConditionModel[];
    processes: ProcessModel[];
}

export interface SubcategoryArticles {
    sub_category_title: string;
    article_count: number;
    articles: Article[];
}

export interface SearchResponseDTO {
    message: string;
    result: Article[];
    status: boolean;
}