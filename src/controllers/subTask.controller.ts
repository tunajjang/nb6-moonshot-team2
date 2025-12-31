import { create } from 'superstruct';
import { Request, Response } from 'express';
import { TaskIdParamsStruct } from '../superstructs/common.structs';
import { CreateSubTaskBodyStruct } from '../superstructs/subTask.struct';

export async function createSubTask(req: Request, res: Response) {
  const { taskId } = create(req.params, TaskIdParamsStruct);
  const { data } = create(req.params, CreateSubTaskBodyStruct);
}
