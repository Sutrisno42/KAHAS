export interface SupllierModel {
    data: {
        id: number,
        name: string,
        phone: string,
        created_at: string,
        updated_at: string,
        deleted_at: string | null
    }
}
export interface ProductModel {
    data: {
        id: number;
        category_id: number;
        product_name: string;
        product_code: string;
        stock: number;
        price: number;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        category: {
            id: number;
            category_name: string;
            code: string;
            created_at: string;
            updated_at: string;
            deleted_at: string | null;
        };
        stock_opnames: any[];
    }
}
export interface SearchCriteria {
    page?: number;
    product_name?: string;
    category_id?: string;
    product_code?: string;
    arrange_by?: string;
    sort_by?: string;
}