import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import connectToDb from './database/database.js';
import router from './routes/router.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
dotenv.config();
app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_URL
}));
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', router);
const start = ()=>{
    try{
        app.listen(PORT, () => { console.log('Listening on port ' + PORT) });
    }
    catch (e) {
        console.log(e)
    }
}
start();
connectToDb();
