import{ Schema, model, Types } from 'mongoose';
import { ICategory } from './CategoryModel';

interface IProduct {
    name: string;
    categories: ICategory[];
    qty: number;
    price: number;
}

const productSchema = new Schema<IProduct>({
    name: { type: String , required: true},
    qty: { type: Number, required: true},
    price: { type: Number, required: true },
    categories: [{ type: Types.ObjectId, ref: "Category" }] ,
}, { versionKey: false });

const Product = model<IProduct>('Product', productSchema);

export default Product
