import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";
import cors from "cors";
import squadRouter from "./routes/scrumsquadroutes";
import dailyRouter from "./routes/daily.routes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(squadRouter);
app.use("/api/daily", dailyRouter);

app.use(express.static(path.join(__dirname, "../public")));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
