import express from 'express';
import App from './src/services/ExpressApp';
import dbConnection from './src/services/Database';
import { PORT } from './src/config';

const StartServer = async () => {

    const app = express();

    await dbConnection()

    await App(app);

    app.listen(PORT, () => {
        console.log(`Listening to port 8000 ${PORT}`);
    })
}

StartServer();