import{ Schema, model, Types } from 'mongoose';
import { IProduct } from '../types/Interfaces';

const productSchema = new Schema<IProduct>({
    name: { type: String , required: true},
    qty: { type: Number, required: true},
    price: { type: Number, required: true },
    categories: [{ type: Types.ObjectId, ref: "Category" }] ,
}, { versionKey: false });

const Product = model<IProduct>('Product', productSchema);

export default Product
