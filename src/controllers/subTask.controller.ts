import { create } from 'superstruct';
import { Request, Response } from 'express';
import { SubTaskIdParamStruct, TaskIdParamsStruct } from '../superstructs/common.structs';
import { CreateSubTaskBodyStruct, UpdateSubTaskBodyStruct } from '../superstructs/subTask.struct';
import { validate } from '@/lib/taskStructValidate';
import { subTaskService } from '@/services/subTask.service';

export async function createSubTask(req: Request, res: Response) {
  const { taskId } = create(req.params, TaskIdParamsStruct);

  const data = validate(req.body, CreateSubTaskBodyStruct);

  const result = await subTaskService.createSubTask(data, req.user, taskId);

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

  const result = await subTaskService.updateSubTask(data, req.user, subTaskId);
  return res.send(result);
}

export async function deleteSubTask(req: Request, res: Response) {
  const { subTaskId } = validate(req.params, SubTaskIdParamStruct);
  const result = await subTaskService.deleteSubTask(subTaskId, req.user);

  return res.send(result);
}
