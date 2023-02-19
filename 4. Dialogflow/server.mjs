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
//     pizzaFlavours: "fajita",
//     qty: 2,
//     status: "inProgress"

// },
// {
//     orderName: "John",
//     pizzaSize: "small",
//     pizzaFlavours: "chilli",
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

                let responseText = `you said ${params.qty} ${params.pizzaSize} ${params.pizzaFlavours} pizza, your pizza is on the way, this reply came from webhook server.`

                res.send({
                    "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    responseText,
                                    "this is alternate response from webhook server"
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
        console.log(e);
        res.status(500).send({
            message: "server error"
        })
    }
})

app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`)
})










let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: Number,
    category: String,
    description: String,
    createdOn: { type: Date, default: Date.now }
});
const productModel = mongoose.model('products', productSchema);



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