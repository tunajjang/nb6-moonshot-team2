import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger';

import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT } from '@lib';
import { errorHandler } from '@middlewares';
import router from '@routers';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
