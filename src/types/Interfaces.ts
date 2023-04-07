type Nullable<T> = T | null;

export interface ICategory {
    name: string;
    parent: Nullable<ICategory>;
}

export interface IProduct {
    name: string;
    categories: ICategory[];
    qty: number;
    price: number;
}