import { create } from 'superstruct';
import { Request, Response } from 'express';
import { taskService } from '../services/task-service';
import { IdParamStruct } from '../superstructs/common-structs';
import { CreateTaskBodyStruct, UpdateTaskBodyStruct } from '../superstructs/task-struct';

export async function createTask(req: Request, res: Response) {
  const data = create(req.body, CreateTaskBodyStruct);
  const result = await taskService.createTask(data, req.user);

  return res.send(result);
}

export async function updateTask(req: Request, res: Response) {
  const data = create(req.body, UpdateTaskBodyStruct);
  const { id } = create(req.params, IdParamStruct);

  const result = await taskService.updateTask(data, id, req.user);
  return res.send(result);
}

export async function deleteTask(req: Request, res: Response) {
  const { id } = create(req.params, IdParamStruct);
  const result = await taskService.deleteTask(id, req.user);

  return res.send(result);
}

export async function getTaskDebug(req: Request, res: Response) {
  const { id } = create(req.params, IdParamStruct);
  const result = await taskService.getTaskDebug(id);

  return res.send(result);
}
