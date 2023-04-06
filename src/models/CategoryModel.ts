import{ Schema, model, Types } from 'mongoose';

type Nullable<T> = T | null;

export interface ICategory {
    name: string;
    parent: Nullable<ICategory>;
}

const categorySchema = new Schema<ICategory>({
    name: { type: String , required: true},
    parent: { type: Types.ObjectId, ref: "Category" },
}, { versionKey: false });

const Category = model<ICategory>('Category', categorySchema);

export default Category;
