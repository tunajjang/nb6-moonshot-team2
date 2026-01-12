import { create } from 'superstruct';
import { Request, Response } from 'express';
import {
  SubTaskIdParamStruct,
  TaskIdParamsStruct,
  CreateSubTaskBodyStruct,
  UpdateSubTaskBodyStruct,
} from '@superstructs';
import { validate } from '@lib';
import { subTaskService } from '@services';

export async function createSubTask(req: Request, res: Response) {
  const { taskId } = create(req.params, TaskIdParamsStruct);

  const data = validate(req.body, CreateSubTaskBodyStruct);

  const createData = await subTaskService.createSubTask(data, req.user, taskId);
  const result = await subTaskService.getSubTask(createData.id, req.user);

  return res.send(result);
}

export async function getSubTaskList(req: Request, res: Response) {
  const { taskId } = validate(req.params, TaskIdParamsStruct);

  const result = await subTaskService.getSubTaskList(taskId, req.user);

  return res.send(result);
}

export async function getSubTaskById(req: Request, res: Response) {
  const { subTaskId } = validate(req.params, SubTaskIdParamStruct);
  const result = await subTaskService.getSubTask(subTaskId, req.user);

  return res.send(result);
}

export async function updateSubTask(req: Request, res: Response) {
  const data = validate(req.body, UpdateSubTaskBodyStruct);
  const { subTaskId } = create(req.params, SubTaskIdParamStruct);

  const updateData = await subTaskService.updateSubTask(data, req.user, subTaskId);
  const result = await subTaskService.getSubTask(updateData.id, req.user);

  return res.send(result);
}

export async function deleteSubTask(req: Request, res: Response) {
  const { subTaskId } = validate(req.params, SubTaskIdParamStruct);
  await subTaskService.deleteSubTask(subTaskId, req.user);

  return res.status(204).send();
}
