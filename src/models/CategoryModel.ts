import{ Schema, model, Types } from 'mongoose';
import { ICategory } from '../types/Interfaces';

const categorySchema = new Schema<ICategory>({
    name: { type: String , required: true},
    parent: { type: Types.ObjectId, ref: "Category" },
}, { versionKey: false });

const Category = model<ICategory>('Category', categorySchema);

export default Category;
