export interface AddIncomeBody {
    product_id: number;
    amount: number;
    product_title: string;
}


export interface CreateIncomeBody {
    product_id: number;
    amount: number;
    user_id: number;
}