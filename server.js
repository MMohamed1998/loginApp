import express from 'express'
import { dbConnection } from './databases/dbConnection.js'
import { bootstrap } from './src/bootstrap.js'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const port =process.env.PORT||5000
app.use(express.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
 });
 


bootstrap(app)
dbConnection()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))