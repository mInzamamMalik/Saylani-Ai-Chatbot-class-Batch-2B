import express from 'express';
import path from 'path';
import cors from 'cors'
import mongoose from 'mongoose';




let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: Number,
    category: String,
    description: String,
    createdOn: { type: Date, default: Date.now }
});
const productModel = mongoose.model('products', productSchema);




const app = express()
// app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5001;


app.post("/product", () => {

    const body = req.body;
    if (
        !body.name ||
        !body.price ||
        !body.category ||
        !body.description
    ) {
        res.status(400).send(` required parameter missing. example request body:
        {
            "name": "value",
            "price": "value",
            "category": "value",
            "description": "value"
        }`)
        return;
    }


    productModel.create({
        name: body.name,
        price: body.price,
        category: body.category,
        description: body.description,
    })




})



app.get('/weather', (req, res) => {

    console.log(`${req.ip} is asking for weather`)

    res.send({
        city: "karachi",
        temp_c: 26,
        humidity: 72,
        max_temp_c: 31,
        min_temp_c: 19
    })
})

const __dirname = path.resolve();
app.get('/', express.static(path.join(__dirname, "/web/index.html")));
app.use('/', express.static(path.join(__dirname, "/web")));


//  172.16.19.78:3000/water

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



/////////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = 'mongodb+srv://dbuser:dbpassword@cluster0.gq9n2zr.mongodb.net/abcdatabase?retryWrites=true&w=majority';
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////