import express from 'express';

const app = express()
const port = 3000

app.get('/water', (req, res) => {
    console.log(`${req.ip} is asking for water`)
    res.send('Here is some water for you')
})
app.get('/food', (req, res) => {
    console.log(`${req.ip} is asking for food`)
    res.send('Here is some food for you')
})
//  172.16.19.78:3000/water

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})