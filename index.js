import express, { json } from "express";
import cors from 'cors'

import { verify } from "./verify";
const app = express();

app.use(cors());
app.use(json());

app.post('/api/verify',verify);
app.get('/api/getVrcId',getVrcID);
app.get('/api/getTrust',getTrust);

app.listen(3000,()=>{
    console.log('server is running');
})
