import {
  getAuthMiddleware,
  TicketCommentModel,
  SupportTicketModel,
  logger,
  ProjectModel,
  getTicketIDFromProject,
} from 'indiedesk-common-lib';
import { Router, type Request, type Response } from 'express';

export const ticketRouter = Router();
const jwtSecret = process.env.JWT_SECRET || 'supersecret';

ticketRouter.post('', getAuthMiddleware(jwtSecret), async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const projectId = req.params.projectId;
  const project = await ProjectModel.findOne({ id: projectId, owner: username });
  if (!project) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  const ticket = {
    ...req.body,
    owner: username,
    id: getTicketIDFromProject(project),
    project,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const savedTicket = await SupportTicketModel.create(ticket);
  res.status(200).json({ message: 'ok', data: savedTicket });
});

ticketRouter.get('', getAuthMiddleware(jwtSecret), async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const projectId = req.params.projectId;
  const tickets = await SupportTicketModel.find({ owner: username, 'project.id': projectId });
  res.status(200).json({ message: 'ok', data: tickets });
});

ticketRouter.get(
  '/:ticketId',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const projectId = req.params.projectId;
    const ticketId = req.params.ticketId;
    const ticket = await SupportTicketModel.findOne({
      id: ticketId,
      owner: username,
      'project.id': projectId,
    });
    if (!ticket) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.status(200).json({ message: 'ok', data: ticket });
  },
);

ticketRouter.patch(
  '/:ticketId',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const ticketId = req.params.ticketId;
    const projectId = req.params.projectId;
    try {
      const updatedTicket = await SupportTicketModel.findOneAndUpdate(
        { id: ticketId, owner: username, 'project.id': projectId },
        { $set: req.body?.data },
        { new: true, runValidators: true },
      );
      if (!updatedTicket) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.status(200).json({ message: 'ok', data: updatedTicket });
      return;
    } catch (error) {
      logger.error(`Error updating ticket: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  },
);

ticketRouter.patch(
  '/:ticketId/comments',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const ticketId = req.params.ticketId;
    const projectId = req.params.projectId;
    const ticketCheck = await SupportTicketModel.findOne({
      id: ticketId,
      owner: username,
      'project.id': projectId,
    });
    if (!ticketCheck) {
      res.status(404).json({ message: 'Ticket Not found' });
      return;
    }

    const comment = req.body;
    const savedComment = await TicketCommentModel.create({
      ...comment,
      ticketId,
      projectId,
      username,
      date: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'ok',
      data: savedComment,
    });
  },
);

ticketRouter.get(
  '/:ticketId/comments',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const ticketId = req.params.ticketId;
    const projectId = req.params.projectId;

    const comments = await TicketCommentModel.find({ ticketId, projectId });
    res.status(200).json({ message: 'ok', data: comments });
    return;
  },
);

ticketRouter.delete(
  '/:ticketId',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const ticketId = req.params.ticketId;
    const projectId = req.params.projectId;
    try {
      await SupportTicketModel.findOneAndDelete({
        id: ticketId,
        owner: username,
        'project.id': projectId,
      });
      if (!ticketId) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting ticket: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  },
);
