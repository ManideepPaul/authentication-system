import * as dotenv from 'dotenv'
dotenv.config()

import mongoose from "mongoose";

const { MONGODB_URL } = process.env;

const Connect = () => {
    mongoose.connect(MONGODB_URL, {
        // Connection settings
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log(`DB connected successfully`))
    .catch(error => {
        console.log(`DB connection failed`);
        console.log(error);
        process.exit(1);
    })
}

export default Connect;