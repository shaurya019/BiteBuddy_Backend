import express from 'express'
import mongoose from 'mongoose';
import { AdminRoute, VandorRoute } from './src/routes'
import bodyParser from 'body-parser';
import { MONGO_URI } from './src/config';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/admin', AdminRoute);
app.use('/vandor', VandorRoute);

mongoose.connect(MONGO_URI)
  .then(result => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });

app.listen(8080, () => {
    console.clear();
    console.log("8080 listen...")
}
)