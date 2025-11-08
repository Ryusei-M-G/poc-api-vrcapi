import express from "express";

const app = express();



app.post('/api/verify',verify);
app.get('/api/getVrcId',getVrcID);
app.get('/api/getTrust',)

app.listen(3000,()=>{
    console.log('server is running');
})
