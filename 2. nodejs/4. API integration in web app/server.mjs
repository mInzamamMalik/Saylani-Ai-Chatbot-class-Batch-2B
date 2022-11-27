import express from 'express';
import path from 'path';

const app = express()
const port = process.env.PORT || 5001;

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