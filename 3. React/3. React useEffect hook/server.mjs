import express from 'express';
import path from 'path';
import cors from 'cors'
import mongoose from 'mongoose';
import { exec } from 'child_process';


let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: Number,
    category: String,
    description: String,
    createdOn: { type: Date, default: Date.now }
});
const productModel = mongoose.model('products', productSchema);




const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5001;


app.post("/product", (req, res) => {

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
    },
        (err, saved) => {
            if (!err) {
                console.log(saved);

                res.send({
                    message: "your product is saved"
                })
            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })

})

app.get('/products', async (req, res) => {
    try {
        const data = await productModel.find({})
            // .select({description: 0, name: 0}) // projection
            .sort({ _id: -1 })
            .exec();

        res.send({
            message: "here is you todo list",
            data: data
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "server error"
        })
    }
})

app.get('/product/:id', (req, res) => {

    const id = req.params.id;

    productModel.findOne({ _id: id }, (err, data) => {
        if (!err) {

            if (data) {
                res.send({
                    message: "here is you product",
                    data: data
                })
            } else {
                res.status(404).send({
                    message: "product not found",
                })
            }

        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

app.put('/product/:id', async (req, res) => {

    const id = req.params.id;
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

    try {
        let data = await productModel.findByIdAndUpdate(id,
            {
                name: body.text,
                price: body.price,
                category: body.category,
                description: body.description
            },
            { new: true }
        ).exec();

        console.log('updated: ', data);

        res.send({
            message: "todo is updated successfully",
            data: data
        })

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }
})

app.delete('/products', (req, res) => {

    productModel.deleteMany({}, (err, data) => {
        if (!err) {
            res.send({
                message: "All Products has been deleted successfully",
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

app.delete('/product/:id', (req, res) => {

    const id = req.params.id;

    productModel.deleteOne({ _id: id }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "Product has been deleted successfully",
                })
            } else {
                res.send({
                    message: "No Product found with this id: " + id,
                })
            }


        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
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