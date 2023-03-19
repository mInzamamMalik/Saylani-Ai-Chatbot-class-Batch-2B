import express from 'express';
import path from 'path';
import cors from 'cors'
import mongoose from 'mongoose';
import axios from 'axios'
import dialogflow from 'dialogflow';
import * as dotenv from 'dotenv'
import momentTZ from 'moment-timezone';
import morgan from "morgan"




dotenv.config()

let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: Number,
    category: String,
    description: String,
    createdOn: { type: Date, default: Date.now }
});
const productModel = mongoose.model('products', productSchema);

let messageSchema = new mongoose.Schema({
    query: { type: String, required: true },
    from: String,
    createdOn: { type: Date, default: Date.now }
});
const messageModel = mongoose.model('messages', messageSchema);




const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


const port = process.env.PORT || 5001;


app.post("/message", async (req, res) => {
    try {

        const body = req.body;
        if (!body.query) {
            res.status(400).send(` required parameter missing. example request body:
        {
            "query": "Hi",
        }`)
            return;
        }

        await messageModel
            .create({
                query: body.query,
                from: "user"
            })


        // TODO: send query to dialogflow and get chatbot response

        // let response = await axios.post(
        //     "https://dialogflow.googleapis.com/v2/projects/batch2helloworld-ogfk/agent/sessions/user123:detectIntent",
        //     {
        //         "queryInput": {
        //             "text": {
        //                 "text": body.query,
        //                 "languageCode": 'en-us'
        //             },
        //         }
        //     }
        // )

        const sessionClient = new dialogflow.SessionsClient();
        const sessionPath = sessionClient.sessionPath("batch2helloworld-ogfk", "user123");

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    // The query to send to the dialogflow agent
                    text: body.query,
                    // The language used by the client (en-US)
                    languageCode: 'en-US',
                },
            },
            
        };

        // Send request and log result
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        const result = responses[0].queryResult;

        console.log("responses: ", result.fulfillmentText);

        res.send({
            message: {
                text: result.fulfillmentText
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "server error"
        })
    }
})


app.post("/webhook", async (req, res) => {
    try {
        const body = req.body;

        const intentName = body.queryResult.intent.displayName
        const params = body.queryResult.parameters


        switch (intentName) {
            case 'Default Welcome Intent': {

                const currentTime = momentTZ.tz(moment(), "Asia/Karachi");
                const currentHour = +moment(currentTime).format('HH');
                console.log("currentHour: ", currentHour);

                let greeting = '';

                if (currentHour < 6) {
                    greeting = "good night"
                } else if (currentHour < 12) {
                    greeting = "good morning"
                } else if (currentHour < 15) {
                    greeting = "good afternoon"
                } else if (currentHour < 17) {
                    greeting = "good evening"
                } else {
                    greeting = "good night"
                }

                let responseText = pluck([
                    `${greeting}! welcome to Abc Pizza store, how can I help you?`,
                    "this is alternate response from webhook server",
                    "this is third response"
                ])

                console.log(responseText);

                res.send({
                    "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    responseText
                                ]
                            }
                        }
                    ]
                })


                break;
            }
            case 'newOrder': {

                console.log("collected params: ", params);
                console.log("collected params: ", params.person);

                const newOrder = new orderModel({
                    orderName: params.person.name,
                    pizzaSize: params.pizzaSize,
                    pizzaFlavour: params.pizzaFlavour,
                    qty: params.qty
                });
                const savedOrder = await newOrder.save();
                console.log(`New order added:`, savedOrder);


                let responseText = `you said ${params.qty} ${params.pizzaSize} ${params.pizzaFlavour} pizza, your pizza is on the way. would you like to have cold drink?`

                res.send({
                    "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    responseText
                                ]
                            }
                        }
                    ],
                    "outputContexts": [
                        {
                            "name": `${req.body.session}/contexts/coolDrinkAsk`,
                            "lifespanCount": 2,
                            "parameters": {
                                "param-name": "param-value"
                            }
                        }
                    ]
                })
                console.log("session: ", `${req.body.session}/contexts/coolDrinkAsk`);

                break;
            }
            case 'checkOrderStatus': {

                let responseText = '';

                const recentOrders = await orderModel.find({})
                    .sort({ createdOn: -1 })
                    .limit(15);

                let latestPendingOrders = []
                for (let i = 0; i < recentOrders.length; i++) {
                    if (recentOrders[i].status === 'pending') {
                        latestPendingOrders.push(recentOrders[i])
                    } else {
                        break
                    }
                }

                if (latestPendingOrders.length === 0) {

                    responseText =
                        `${recentOrders[0].orderName}, your order for ${recentOrders[0].qty} ${recentOrders[0].pizzaSize} ${recentOrders[0].pizzaFlavour} pizza is ${recentOrders[0].status} ${moment(recentOrders[0].createdOn).fromNow()}`

                } else {

                    responseText += `${latestPendingOrders[0].orderName}, you have ${latestPendingOrders.length} pending ${latestPendingOrders.length > 1 ? "orders." : "order"}`

                    latestPendingOrders.map((eachOrder, i) => {
                        if (latestPendingOrders.length > 1) {
                            responseText += ` order number ${i + 1},`
                        } else {
                            responseText += ` for`
                        }

                        responseText += ` ${eachOrder.qty} ${eachOrder.pizzaSize} ${eachOrder.pizzaFlavour} pizza,`
                    })

                    responseText += ` please be patient your order will be delivered soon.`
                }

                res.send({
                    "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    responseText
                                ]
                            }
                        }
                    ]
                })

                break;
            }
            default:
                res.send({
                    "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    "sorry webhook dont know answer for this intent"
                                ]
                            }
                        }
                    ]
                })
                break;
        }


    } catch (e) {
        console.error("Error adding order:", e);

        res.send({
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            "something is wrong in server, please try again"
                        ]
                    }
                }
            ]
        })
    }
})

let orderSchema = new mongoose.Schema({
    orderName: { type: String, required: true },
    pizzaSize: { type: String, required: true },
    pizzaFlavour: { type: String, required: true },
    qty: { type: Number, required: true },
    status: { type: String, default: "pending" }, // canceled, inProgress delivered
    createdOn: { type: Date, default: Date.now }
});
const orderModel = mongoose.model('orders', orderSchema);




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