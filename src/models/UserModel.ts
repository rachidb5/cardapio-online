import{ Schema, model } from 'mongoose';

interface IUser {
    userName: string;
    password: string;
}

const usersSchema = new Schema<IUser>({
    userName: { type: String },
    password: { type: String },
}, { versionKey: false });

const User = model<IUser>('User', usersSchema);


export default User
