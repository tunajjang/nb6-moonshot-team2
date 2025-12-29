import { create } from 'superstruct';
import { Request, Response } from 'express';
import { projectMemberService, taskService } from '../services/task-service';
import { IdParamStruct, ProjectIdParamStruct } from '../superstructs/common-structs';
import {
  CreateTaskBodyStruct,
  GetTaskListParamsStruct,
  UpdateTaskBodyStruct,
} from '../superstructs/task-struct';

export async function createTask(req: Request, res: Response) {
  const { projectId } = create(req.params, ProjectIdParamStruct);
  console.log(req.body);
  const data = create(req.body, CreateTaskBodyStruct);
  //명세서에 나온 request구조가 post API에 필요한 request json 구조와 다름. service에서 이를 처리하는 함수가 필요

  if (!req.user) {
    throw console.error('unAuthorized');
  }

  const projectMember = await projectMemberService.getProjectMember(projectId, req.user.id);

  //이부분 projectMember 수정 필요
  //projectMember가 실제 존재하는지에 대한 확인이 필요. 이 형식은 임시변통일 뿐 구조상으로 문제가 많은 형태
  const result = await taskService.createTask(data, req.user, projectMember!);

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

export async function getTaskDebug(req: Request, res: Response) {
  const { taskId } = create(req.params, IdParamStruct);
  const result = await taskService.getTaskDebug(taskId);

  return res.send(result);
}
