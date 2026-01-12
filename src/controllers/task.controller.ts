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
import { UnauthorizedError, validate } from '@lib';

export async function createTask(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('로그인이 필요한 서비스입니다');
  }

  const { projectId } = create(req.params, ProjectIdParamStruct);

  if (req.body.startYear) req.body.startYear = Number(req.body.startYear);
  if (req.body.startMonth) req.body.startMonth = Number(req.body.startMonth);
  if (req.body.startDay) req.body.startDay = Number(req.body.startDay);
  if (req.body.endYear) req.body.endYear = Number(req.body.endYear);
  if (req.body.endMonth) req.body.endMonth = Number(req.body.endMonth);
  if (req.body.endDay) req.body.endDay = Number(req.body.endDay);
  if (req.body.assigneeId) req.body.assigneeId = Number(req.body.assigneeId);

  if (req.body.tags && !Array.isArray(req.body.tags)) {
    req.body.tags = [req.body.tags];
  }

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const filenames = req.files.map((file: any) => file.filename);
    req.body.attachments = filenames;
  }

  if (req.body.attachments && !Array.isArray(req.body.attachments)) {
    req.body.attachments = [req.body.attachments];
  }

  const data = validate(req.body, CreateTaskBodyStruct);

  const createData = await taskService.createTask(data as any, req.user, projectId);
  const result = await taskService.getTask(createData.id, req.user);

  await taskService.assignTaskToUser(createData.id, req.user.id);
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
