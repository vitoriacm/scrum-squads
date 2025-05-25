import express from 'express';
import cors from 'cors';
import squadRouter from './routes/scrumsquadroutes';

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(squadRouter);    

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
