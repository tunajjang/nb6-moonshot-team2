import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { PORT } from '@lib';
import { errorHandler } from '@middlewares';
import router from '@routers';

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
