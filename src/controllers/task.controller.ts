import { create } from 'superstruct';
import { Request, Response } from 'express';
import { projectMemberService, taskService } from '../services/task.service';
import { IdParamStruct, ProjectIdParamStruct } from '../superstructs/common.structs';
import {
  CreateTaskBodyStruct,
  GetTaskListParamsStruct,
  UpdateTaskBodyStruct,
} from '../superstructs/task.superstruct';  
import { UnauthorizedError } from '@/lib';

export async function createTask(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('로그인이 필요합니다.');
  }

  const { projectId } = create(req.params, ProjectIdParamStruct);
  console.log(req.body);
  const data = create(req.body, CreateTaskBodyStruct);

  const result = await taskService.createTask(data, req.user, projectId);

  return res.send(result);
}

export async function getTaskById(req: Request, res: Response) {
  const { taskId } = create(req.params, IdParamStruct);
  const result = await taskService.getTask(taskId, req.user);

  return res.send(result);
}

export async function getTaskList(req: Request, res: Response) {
  const params = create(req.params, GetTaskListParamsStruct);
  const result = await taskService.getTaskList(params, req.user);

  return res.send(result);
}

export async function updateTask(req: Request, res: Response) {
  const data = create(req.body, UpdateTaskBodyStruct);
  const { taskId } = create(req.params, IdParamStruct);

  const result = await taskService.updateTask(data, taskId, req.user);
  return res.send(result);
}

export async function deleteTask(req: Request, res: Response) {
  const { taskId } = create(req.params, IdParamStruct);
  const result = await taskService.deleteTask(taskId, req.user);

  return res.send(result);
}
