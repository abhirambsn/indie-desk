import { authMiddleware, ClientModel, logger } from 'indiedesk-common-lib';
import { Router, type Request, type Response } from 'express';

export const clientRouter = Router();

clientRouter.get('', authMiddleware, async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  if (!username) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const userClients = await ClientModel.find({ owner: username });
  res.status(200).json({ message: 'ok', data: userClients });
});

clientRouter.post('', authMiddleware, async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const client = {
    ...req.body?.data,
    owner: username,
    projects: [],
  };
  const newClient = await ClientModel.create(client);
  res.status(200).json({ message: 'ok', data: newClient });
});

clientRouter.patch('/:id', authMiddleware, async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  if (!req.body?.data) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    const updatedClient = await ClientModel.findOneAndUpdate(
      { id, owner: username },
      req.body?.data,
      { new: true },
    );
    res.status(200).json({ message: 'ok', data: updatedClient });
  } catch (err) {
    console.error('[Client] Error', err);
    res.status(404).json({ message: 'Client not found' });
  }
});

clientRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  try {
    await ClientModel.findOneAndDelete({ id, owner: username });
    res.status(204).send();
  } catch (err) {
    logger.error(`[Client] Error: ${err}`);
    res.status(404).json({ message: 'Not found' });
  }
});
