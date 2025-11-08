import express, { json } from "express";
import cors from 'cors'
import { VRChat } from "vrchat";

import { verify } from "./verify.js";
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/verify',verify);
// app.get('/api/getVrcId',getVrcID);
app.get('/api/getTrust',getTrust);

app.listen(3000,()=>{
    console.log('server is running');
})
