import { getAuthMiddleware, ProjectModel, logger } from 'indiedesk-common-lib';
import { Router, type Request, type Response } from 'express';

export const projectRouter = Router();
const jwtSecret = process.env.JWT_SECRET || 'supersecret';

projectRouter.get('', getAuthMiddleware(jwtSecret), async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const projects = await ProjectModel.find({ owner: username }).populate({
    path: 'client',
    localField: 'client',
    foreignField: 'id',
  });
  res.status(200).json({ message: 'ok', data: projects });
});

projectRouter.get('/:id', getAuthMiddleware(jwtSecret), async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  const project = await ProjectModel.findOne({ id, owner: username }).populate({
    path: 'client',
    localField: 'client',
    foreignField: 'id',
  });
  if (!project) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  res.status(200).json({ message: 'ok', data: project });
});

projectRouter.post('', getAuthMiddleware(jwtSecret), async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const project = {
    ...req.body?.data,
    owner: username,
    tasks: [],
  };
  const savedProject = await ProjectModel.create(project);
  res.status(200).json({ message: 'ok', data: savedProject });
});

projectRouter.patch('/:id', getAuthMiddleware(jwtSecret), async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;

  try {
    const updatedProject = await ProjectModel.findOneAndUpdate(
      { id, owner: username },
      { $set: req.body?.data },
      { new: true },
    );
    if (!updatedProject) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.status(200).json({ message: 'ok', data: updatedProject });
  } catch (error) {
    logger.error(`Error updating project: ${error}`);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
});

projectRouter.delete('/:id', getAuthMiddleware(jwtSecret), async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  try {
    const deletedProject = await ProjectModel.findOneAndDelete({ id, owner: username });
    if (!deletedProject) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting project: ${error}`);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
});
