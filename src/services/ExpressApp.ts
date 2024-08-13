import express , { Application } from 'express';
import { AdminRoute, VandorRoute } from '../routes'
import path from 'path';
import bodyParser from 'body-parser';

export default async(app: Application) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true}))
    
    app.use(express.json());
 
    const imagePath = path.join(__dirname,'../images');
    
    app.use('/images', express.static(imagePath));
    
    app.use('/admin', AdminRoute);
    app.use('/vendor', VandorRoute)
    // app.use('/customer', CustomerRoute)
    // app.use('/delivery', DeliveryRoute);
    // app.use(ShoppingRoute);

    return app;

}