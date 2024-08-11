import express from 'express'
import { AdminRoute, VandorRoute } from './src/routes'
import bodyParser from 'body-parser';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use('/admin', AdminRoute);
app.use('/vandor', VandorRoute);

app.listen(8080, () => {
    console.clear();
    console.log("8080 listen...")
}
)