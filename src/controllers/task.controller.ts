import { create } from 'superstruct';
import { Request, Response } from 'express';
import { taskService } from '@services';
import {
  IdParamStruct,
  ProjectIdParamStruct,
  CreateTaskBodyStruct,
  GetTaskListParamsStruct,
  UpdateTaskBodyStruct,
} from '@superstructs';
import { validate } from '@lib';

export async function createTask(req: Request, res: Response) {
  const { projectId } = create(req.params, ProjectIdParamStruct);

  const data = validate(req.body, CreateTaskBodyStruct);

  const createData = await taskService.createTask(data as any, req.user, projectId);
  const result = await taskService.getTask(createData.id, req.user);
  return res.send(result);
}

export async function getTaskById(req: Request, res: Response) {
  const { taskId } = validate(req.params, IdParamStruct);
  const result = await taskService.getTask(taskId, req.user);

  return res.send(result);
}

export async function getTaskList(req: Request, res: Response) {
  const { projectId } = validate(req.params, ProjectIdParamStruct);

  const params = create(req.query, GetTaskListParamsStruct);
  const result = await taskService.getTaskList(projectId, params, req.user);

  return res.send(result);
}

export async function updateTask(req: Request, res: Response) {
  const data = validate(req.body, UpdateTaskBodyStruct);
  const { taskId } = create(req.params, IdParamStruct);

  const updateData = await taskService.updateTask(data as any, taskId, req.user);
  const result = await taskService.getTask(updateData.id, req.user);
  return res.send(result);
}

export async function deleteTask(req: Request, res: Response) {
  const { taskId } = validate(req.params, IdParamStruct);
  const result = await taskService.deleteTask(taskId, req.user);

  return res.send(result);
}
