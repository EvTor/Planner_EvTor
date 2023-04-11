import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import connectToDb from './database/database.js';
import router from './routes/router.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);

app.listen(PORT, () => { console.log('Listening on port ' + PORT) });


connectToDb();
