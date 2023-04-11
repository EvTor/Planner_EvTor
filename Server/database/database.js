import mongoose from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();

const PASSWORD_DB = process.env.PASSWORD_DB;
const DB_PATH = `mongodb+srv://CalendarEvTor:${PASSWORD_DB}@calendarfirst.bnbtwaq.mongodb.net/?retryWrites=true&w=majority`;

//Connect to MongoDB
async function connectToDB() {
    await mongoose.connect(DB_PATH, { useNewUrlParser: true })
        .then(console.log('Connected to MoongoDB'))
        .catch(error => console.error('Cannot connect to MongoDB', error));
}

export default connectToDB;


