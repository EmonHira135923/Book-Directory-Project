import express, { type Express, type Request, type Response } from 'express';
import cors from "cors";

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Book Directory Project Running!');
});


export default app;
