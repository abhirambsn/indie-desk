import {
  getAuthMiddleware,
  TicketCommentModel,
  SupportTicketModel,
  logger,
  ProjectModel,
  getTicketIDFromProject,
} from 'indiedesk-common-lib';
import { Router, type Request, type Response } from 'express';

import { AuthService } from '../service/auth.service';

export const ticketRouter = Router();
const jwtSecret = process.env.JWT_SECRET || 'supersecret';
const authService = new AuthService();

const appendUserDataToComments = async (comments: any[], token: string) => {
  const commentsWithUser = await Promise.all(
    comments.map(async (comment) => {
      const updatedComment: any = { ...comment.toObject() };
      if (comment.username) {
        updatedComment.user = await authService.getUserById(comment.username, token);
      }
      return updatedComment;
    }),
  );
  return commentsWithUser;
};

ticketRouter.post(
  '/:projectId',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const projectId = req.params.projectId;
    const project = await ProjectModel.findOne({ id: projectId });
    if (!project) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    const ticket = {
      ...req.body,
      owner: username,
      id: getTicketIDFromProject(project),
      project: projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const savedTicket = await SupportTicketModel.create(ticket);
    res.status(200).json({ message: 'ok', data: savedTicket });
  },
);

ticketRouter.get(
  '/:projectId',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const projectId = req.params.projectId;
    const tickets = await SupportTicketModel.find({ project: projectId }).populate({
      path: 'project',
      localField: 'project',
      foreignField: 'id',
      populate: {
        path: 'client',
        localField: 'client',
        foreignField: 'id',
      },
    });
    const token = req.headers.authorization?.split(' ')[1];
    tickets.forEach(async (ticket) => {
      if (ticket.assignee) {
        ticket.assignee = await authService.getUserById(ticket.assignee, token as string);
      }
    });
    res.status(200).json({ message: 'ok', data: tickets });
  },
);

ticketRouter.get(
  '/:projectId/:ticketId',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const projectId = req.params.projectId;
    const ticketId = req.params.ticketId;
    const ticket = await SupportTicketModel.findOne({
      id: ticketId,
      project: projectId,
    }).populate({
      path: 'project',
      localField: 'project',
      foreignField: 'id',
      populate: {
        path: 'client',
        localField: 'client',
        foreignField: 'id',
      },
    });
    if (!ticket) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.status(200).json({ message: 'ok', data: ticket });
  },
);

ticketRouter.patch(
  '/:projectId/:ticketId',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const ticketId = req.params.ticketId;
    const projectId = req.params.projectId;
    try {
      const updatedTicket = await SupportTicketModel.findOneAndUpdate(
        { id: ticketId, 'project.id': projectId },
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
  '/:projectId/:ticketId/comments',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const ticketId = req.params.ticketId;
    const projectId = req.params.projectId;
    const ticketCheck = await SupportTicketModel.findOne({
      id: ticketId,
      project: projectId,
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
  '/:projectId/:ticketId/comments',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const ticketId = req.params.ticketId;
    const projectId = req.params.projectId;

    const comments = await TicketCommentModel.find({ ticketId, projectId });
    const token = req.headers.authorization?.split(' ')[1];
    const commentsWithUser = await appendUserDataToComments(comments, token as string);
    res.status(200).json({ message: 'ok', data: commentsWithUser });
    return;
  },
);

ticketRouter.delete(
  '/:projectId/:ticketId',
  getAuthMiddleware(jwtSecret),
  async (req: Request, res: Response) => {
    const ticketId = req.params.ticketId;
    const projectId = req.params.projectId;
    try {
      await SupportTicketModel.findOneAndDelete({
        id: ticketId,
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
