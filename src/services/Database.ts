import mongoose from 'mongoose'; 
import { MONGO_URI } from '../config';

export default async() => {

    try {
        await 
        mongoose.connect(MONGO_URI)
        .then(result => {
            console.log('Connected to MongoDB');
        })
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}