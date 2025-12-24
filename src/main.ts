import express from 'express';
import taskRouter from './routers/task-router';

const app = express();
const PORT = 3000;

app.use('/tasks', taskRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
