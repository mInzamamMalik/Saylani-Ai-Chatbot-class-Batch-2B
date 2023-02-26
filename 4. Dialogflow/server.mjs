import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import moment from 'moment'
import momentTZ from 'moment-timezone';

const app = express()
app.use(express.json())
app.use(morgan('dev'))

const PORT = process.env.PORT || 5001;


const webhookRequest = {
    "responseId": "response-id",
    "session": "projects/project-id/agent/sessions/session-id",
    "queryResult": {
        "queryText": "End-user expression",
        "parameters": {
            "param-name0": "param-value",
            "param-name1": "param-value",
            "param-name2": "param-value"
        },
        "allRequiredParamsPresent": true,
        "fulfillmentText": "Response configured for matched intent",
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [
                        "Response configured for matched intent"
                    ]
                }
            }
        ],
        "outputContexts": [
            {
                "name": "projects/project-id/agent/sessions/session-id/contexts/context-name",
                "lifespanCount": 5,
                "parameters": {
                    "param-name": "param-value"
                }
            }
        ],
        "intent": {
            "name": "projects/project-id/agent/intents/intent-id",
            "displayName": "matched-intent-name"
        },
        "intentDetectionConfidence": 1,
        "diagnosticInfo": {},
        "languageCode": "en"
    },
    "originalDetectIntentRequest": {}
}

const pluck = (arr) => {
    const min = 0;
    const max = arr.length - 1;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return arr[randomNumber]
}

app.get("/ping", (req, res) => {
    res.send("ping back");
})

// [{
//     orderName: "malik",
//     pizzaSize: "large",
//     pizzaFlavour: "fajita",
//     qty: 2,
//     status: "inProgress"

// },
// {
//     orderName: "John",
//     pizzaSize: "small",
//     pizzaFlavour: "chilli",
//     qty: 1,
//     status: "delivered"
// }]





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


                let responseText = `you said ${params.qty} ${params.pizzaSize} ${params.pizzaFlavour} pizza, your pizza is on the way.`

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

app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`)
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