import {
  getAuthMiddleware,
  TaskModel,
  getTaskIdByProject,
  ProjectModel,
  logger,
} from 'indiedesk-common-lib';
import { Router, type Request, type Response } from 'express';

export const taskRouter = Router();
const jwtSecret = process.env.JWT_SECRET || 'supersecret';

taskRouter.post(
  '/api/v1/:projectId/task',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const projectId = req.params.projectId;
    const project = await ProjectModel.findOne({ id: projectId });
    if (!project) {
      res.status(404).json({ message: 'Project Not found' });
      return;
    }

    const existingIdMap = await TaskModel.find({ project: projectId });
    const existingIds = existingIdMap.map((task) => task.id);
    const id = getTaskIdByProject(project, existingIds);

    const task = {
      id,
      ...req.body?.data,
      project: projectId,
    };
    const savedTask = await TaskModel.create(task);
    res.status(200).json({ message: 'ok', data: savedTask });
    return;
  },
);

taskRouter.get(
  '/api/v1/:projectId/task',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const projectId = req.params.projectId;

    const tasks = await TaskModel.find({ project: projectId }).populate({
      path: 'project',
      localField: 'project',
      foreignField: 'id',
    });
    res.status(200).json({ message: 'ok', data: tasks });
    return;
  },
);

taskRouter.get(
  '/api/v1/:projectId/task/:taskId',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    const task = await TaskModel.find({ id: taskId, project: projectId });
    if (!task) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    res.status(200).json({ message: 'ok', data: task });
    return;
  },
);

taskRouter.patch(
  '/:projectId/:taskId',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    try {
      const updatedTask = await TaskModel.findOneAndUpdate(
        { id: taskId, project: projectId },
        { $set: req.body?.data },
        { new: true, runValidators: true },
      );
      if (!updatedTask) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.status(200).json({ message: 'ok', data: updatedTask });
    } catch (error) {
      logger.error(`Error updating task: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  },
);

taskRouter.delete(
  '/:projectId/:taskId',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    try {
      await TaskModel.findOneAndDelete({ id: taskId, project: projectId });
      res.status(204).send();
      return;
    } catch (error) {
      logger.error(`Error deleting task: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  },
);
