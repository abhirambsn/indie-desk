/* eslint-disable @typescript-eslint/no-namespace */
import fs from 'fs';

import express, { Express, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import PDFDocument from 'pdfkit';

import users from './mockdata/users.json';
import { JSONFileBasedDB } from './db';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app: Express = express();
const db = new JSONFileBasedDB();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'mmmy-super-secret-f1-team-key-haha';

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'ok' }).status(200);
});

app.post('/api/v1/auth/token', (req: Request, res: Response) => {
  const credentials = req.body;

  const user = users.find(
    (user) => user.username === credentials.username && user.password === credentials.password,
  );
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const payload = {
    username: user.username,
    roles: user.roles,
  };
  const currentTime = Math.floor(Date.now());
  console.log('[JWT] Not valid before', currentTime, new Date(currentTime).toISOString());
  console.log('[JWT] Current Time', new Date().toISOString());
  console.log(
    '[JWT] Expires at',
    currentTime + 60 * 60 * 1000,
    new Date(currentTime + 60 * 60 * 1000).toISOString(),
  );
  const access_token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: Math.floor(currentTime) + 60 * 60 * 1000,
    issuer: 'auth.indie-desk.co',
    subject: user.username,
    notBefore: currentTime,
    audience: ['indie-desk.co', 'localhost:4200'],
  });

  const refresh_token = jwt.sign(
    {
      username: user.username,
    },
    JWT_SECRET,
    {
      expiresIn: Math.floor(currentTime) + 60 * 60 * 24 * 30 * 1000,
      issuer: 'mock.auth.indie-desk.co',
      subject: user.username,
      audience: ['indie-desk.co', 'localhost:4200'],
    },
  );

  res.status(200).json({
    message: 'ok',
    ...{ access_token, refresh_token, expires_at: currentTime + 60 * 60 },
  });
});

const getAuthMiddleware = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: 'auth.indie-desk.co',
      audience: 'indie-desk.co',
      ignoreNotBefore: true,
    });

    if (payload instanceof String) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    req.user = payload;
  } catch (err) {
    console.error('[JWT] Error', err);
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  next();
};

app.get('/api/v1/auth/me', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const user = users.find((user) => user.username === username);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  res.status(200).json({ message: 'ok', ...user });
});

app.post('/api/v1/search', (req: Request, res: Response) => {
  const query = req.body.query;
  console.log('[SEARCH] Query', query);
  res.status(200).json({
    message: 'ok',
    data: [
      { id: '1', body: 'any' },
      { id: '2', body: 'any' },
      { id: '3', body: 'any' },
    ],
  });
  return;
});

app.get('/api/v1/clients', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const userClients = db.find('clients', { owner: username });
  res.status(200).json({ message: 'ok', data: userClients });
  return;
});

app.post('/api/v1/clients', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const client = {
    ...req.body?.data,
    owner: username,
    projects: [],
  };
  const insertedId = db.insert('clients', client);
  res.status(200).json({ message: 'ok', data: { id: insertedId, ...client } });
  return;
});

app.patch('/api/v1/clients/:id', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  const clientCheck = db.find('clients', { id, owner: username });
  if (!clientCheck.length) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  const client = db.updateOne('clients', id, req.body?.data);
  if (!client) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  res.status(200).json({ message: 'ok', data: client });
  return;
});

app.delete('/api/v1/clients/:id', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  const clientCheck = db.find('clients', { id, owner: username });
  if (!clientCheck.length) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  db.remove('clients', id);
  res.status(204).send();
  return;
});

app.get('/api/v1/projects', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const projects = db.find('projects', { owner: username });
  res.status(200).json({ message: 'ok', data: projects });
});

app.get('/api/v1/projects/:id', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  const project = db.find('projects', { id, owner: username });
  if (!project.length) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  res.status(200).json({ message: 'ok', data: project });
});

app.post('/api/v1/projects', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const project = {
    ...req.body?.data,
    owner: username,
    tasks: [],
  };
  const client = db.find('clients', { id: project.client?.id });
  if (!client.length) {
    res.status(404).json({ message: 'Client not found' });
    return;
  }
  project.client = client[0];
  const insertedId = db.insert('projects', project);
  res.status(200).json({ message: 'ok', data: { id: insertedId, ...project } });
});

app.patch('/api/v1/projects/:id', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  const projectCheck = db.find('projects', { id, owner: username });
  if (!projectCheck) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  const project = db.updateOne('projects', id, req.body?.data);
  if (!project) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  res.status(200).json({ message: 'ok', data: project });
});

app.delete('/api/v1/projects/:id', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  const projectCheck = db.find('projects', { id, owner: username });
  if (!projectCheck.length) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  db.remove('projects', id);
  res.status(204).send();
});

const generatePdfInvoice = (invoiceId: string) => {
  const invoiceData = db.find('invoices', { id: invoiceId });
  if (!invoiceData.length) {
    return;
  }

  const invoice = invoiceData[0] as Invoice;

  const doc = new PDFDocument();
  const filePath = `${__dirname}/mockdata/invoices/${invoiceId}.pdf`;
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.rect(0, 0, 600, 100).fill('#F8F8F8');
  doc.fill('#000').fontSize(20).text(invoice.client.name, { align: 'center' });
  doc.moveDown(2);

  doc.fillColor('#333').fontSize(12);
  doc.text(`Invoice ID: ${invoice.id}`);
  doc.text(`Date: ${invoice.date}`);
  doc.moveDown();

  doc.fontSize(14).text('Billed To:', { underline: true });
  doc.fontSize(12).text(invoice.client.name);
  doc.text(invoice.client.address);
  doc.text(invoice.client.phone);
  doc.moveDown();

  doc.moveDown();
  doc.fillColor('#000').fontSize(14).text('TASK', 50, 250);
  doc.text('RATE', 250, 250);
  doc.text('HOURS', 350, 250);
  doc.text('TOTAL', 450, 250);
  doc.moveDown();

  doc.moveTo(50, 265).lineTo(550, 265).stroke();
  doc.fillColor('#444').fontSize(12);
  invoice.items.forEach((item: InvoiceItem, index: number) => {
    const y = 280 + index * 25;
    doc.text(item.description, 50, y);
    doc.text(
      `${invoice.project.perHourRate.currency} ${invoice.project.perHourRate.amount}/hr`,
      250,
      y,
    );
    doc.text(`${item.hours}`, 350, y);
    doc.text(
      `${invoice.project.perHourRate.currency} ${invoice.project.perHourRate.amount * item.hours}`,
      450,
      y,
    );
  });
  doc.moveTo(50, 365).lineTo(550, 365).stroke();

  doc.moveDown(2);
  doc.fillColor('#000').fontSize(12);
  const subtotal = invoice.items.reduce((acc: number, item: InvoiceItem) => {
    return acc + invoice.project.perHourRate.amount * item.hours;
  }, 0);
  doc.text(`Subtotal: ${invoice.project.perHourRate.currency} ${subtotal}`, 400, 390);

  if (invoice.discount) {
    const discountAmount = (subtotal * invoice.discount) / 100;
    doc.text(
      `Discount (${invoice.discount}%): -${invoice.project.perHourRate.currency}${discountAmount}`,
      400,
      405,
    );
    const total = subtotal - discountAmount;
    doc.fontSize(14).text(`Total Due: ${invoice.project.perHourRate.currency} ${total}`, 400, 420, {
      underline: true,
    });
  }

  doc.moveDown(3);
  doc.font('Courier-BoldOblique').fontSize(20).text('Thank you!', 50, 460);

  if (invoice.status === 'PAID' && invoice.paymentInfo) {
    doc.fontSize(14).text('Payment Information:', { underline: true });

    switch (invoice.paymentInfo.method) {
      case 'card':
        doc.fontSize(12).text(`Payment Method: Card`);
        doc.fontSize(12).text(`Card Type: ${invoice.paymentInfo.cardType}`);
        doc.text(`Last 4 Digits: ${invoice.paymentInfo.lastFourDigits}`);
        break;
      case 'cheque':
        doc.fontSize(12).text(`Payment Method: Cheque`);
        doc.fontSize(12).text(`Bank Name: ${invoice.paymentInfo.bankName}`);
        doc.fontSize(12).text(`Cheque Number: ${invoice.paymentInfo.chequeNumber}`);
        break;
      case 'cash':
        doc.fontSize(12).text(`Cash Payment`);
        break;
      case 'upi':
        doc.fontSize(12).text(`Payment Method: UPI`);
        doc.fontSize(12).text(`UPI ID: ${invoice.paymentInfo.upiId}`);
        break;
      case 'bank':
        doc.fontSize(12).text(`Payment Method: Bank Transfer`);
        doc.fontSize(12).text(`Bank Name: ${invoice.paymentInfo.bankName}`);
        break;
      default:
        break;
    }
    doc.text(`Transaction ID: ${invoice.paymentInfo.transactionId}`);
    doc.text(`Date: ${invoice.paymentInfo.date}`);
    doc.text(`Amount: ${invoice.paymentInfo.amount.currency} ${invoice.paymentInfo.amount.amount}`);
  } else {
    doc.fontSize(12).text(`Payment is due on ${invoice.dueDate}`, { align: 'center' });
  }
  doc.fontSize(10).text('Thank you for your business!', { align: 'center' });
  doc.moveDown();

  doc.fontSize(8).text(`Generated by: ${invoice.generatedBy}`, { align: 'center' });
  doc.end();

  stream.on('finish', () => {
    console.log(`Invoice ${invoiceId} generated and saved at ${filePath}`);
  });
};

app.post('/api/v1/invoices', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const invoice = {
    ...req.body?.data,
    owner: username,
  };
  const client = db.find('clients', { id: invoice.client?.id });
  if (!client.length) {
    res.status(404).json({ message: 'Client not found' });
    return;
  }
  invoice.client = client[0];
  const project = db.find('projects', { id: invoice.project?.id });
  if (!project.length) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }
  invoice.project = project[0];
  const insertedId = db.insert('invoices', invoice);
  generatePdfInvoice(insertedId);
  res.status(200).json({ message: 'ok', data: { id: insertedId, ...invoice } });
  return;
});

app.get('/api/v1/invoices', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const invoices = db.find('invoices', { owner: username });
  res.status(200).json({ message: 'ok', data: invoices });
  return;
});

app.get('/api/v1/invoices/:id', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  const invoice = db.find('invoices', { id, owner: username });
  if (!invoice) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  res.status(200).json({ message: 'ok', data: invoice });
  return;
});

app.patch('/api/v1/invoices/:id', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  const invoiceCheck = db.find('invoices', { id, owner: username });
  if (!invoiceCheck) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  const invoice = db.updateOne('invoices', id, req.body?.data);
  if (!invoice) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  res.status(200).json({ message: 'ok', data: invoice });
  return;
});

app.get('/api/v1/invoices/:id/pdf', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  const invoice = db.find('invoices', { id, owner: username });
  if (!invoice) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  const invoicePath = `${__dirname}/mockdata/invoices/${id}.pdf`;
  res.download(invoicePath, `invoice-${id}.pdf`);
  return;
});

const getTaskIdByProject = (project: any, existingIds: string[]) => {
  const initials = project.name
    .split(' ')
    .map((word: any) => word[0].toUpperCase())
    .join('');

  const existingNumbers = existingIds
    .filter((id) => id.startsWith(initials))
    .map((id) => parseInt(id.split('-')[1], 10))
    .filter((num) => !isNaN(num));

  const nextNumber = (existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0) + 1;

  return `${initials}-${nextNumber.toString().padStart(5, '0')}`;
};
app.post('/api/v1/:projectId/task', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const projectId = req.params.projectId;
  const project = db.find('projects', { id: projectId, owner: username });
  if (!project) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  const existingIds = db.find('tasks', { project: projectId }).map((task) => task.id);
  const id = getTaskIdByProject(project[0], existingIds);

  const task = {
    id,
    ...req.body?.data,
    project: projectId,
  };
  const insertedId = db.insert('tasks', task, false);
  res.status(200).json({ message: 'ok', data: { id: insertedId, ...task } });
  return;
});

app.get('/api/v1/:projectId/task', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const projectId = req.params.projectId;
  const project = db.find('projects', { id: projectId, owner: username });
  if (!project) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  const tasks = db.find('tasks', { project: projectId });
  res.status(200).json({ message: 'ok', data: tasks });
  return;
});

app.get('/api/v1/:projectId/task/:taskId', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const projectId = req.params.projectId;
  const taskId = req.params.taskId;
  const project = db.find('projects', { id: projectId, owner: username });
  if (!project) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  const task = db.find('tasks', { id: taskId, project: projectId });
  if (!task) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  res.status(200).json({ message: 'ok', data: task });
  return;
});

app.patch('/api/v1/:projectId/task/:taskId', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const projectId = req.params.projectId;
  const taskId = req.params.taskId;
  const project = db.find('projects', { id: projectId, owner: username });
  if (!project) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  const task = db.updateOne('tasks', taskId, req.body?.data);
  if (!task) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  res.status(200).json({ message: 'ok', data: task });
  return;
});

app.delete('/api/v1/:projectId/task/:taskId', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const projectId = req.params.projectId;
  const taskId = req.params.taskId;
  const project = db.find('projects', { id: projectId, owner: username });
  if (!project) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  db.remove('tasks', taskId);
  res.status(204).send();
  return;
});

const getTicketIDFromProject = (project: any) => {
  // I need ID from the first letters of each word of the project name, along with an random number (minimum 5 digits can be prepended with zeroes)
  const initials = project.name
    .split(' ')
    .map((word: any) => word[0].toUpperCase())
    .join('');
  const randomNumber = Math.floor(Math.random() * 90000) + 10000; // Random number between 10000 and 99999
  return `${initials}${randomNumber}`;
};

app.post('/api/v1/tickets/:projectId', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const projectId = req.params.projectId;
  const project = db.findOne('projects', { id: projectId, owner: username });
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
  const insertedId = db.insert('tickets', ticket, false);
  res.status(200).json({ message: 'ok', data: { id: insertedId, ...ticket } });
});

app.get('/api/v1/tickets/:projectId', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const projectId = req.params.projectId;
  const tickets = db.find('tickets', { owner: username, 'project.id': projectId });
  res.status(200).json({ message: 'ok', data: tickets });
});

app.get('/api/v1/tickets/:projectId/:ticketId', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const projectId = req.params.projectId;
  const ticketId = req.params.ticketId;
  const ticket = db.find('tickets', { id: ticketId, owner: username, 'project.id': projectId });
  if (!ticket) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  res.status(200).json({ message: 'ok', data: ticket });
});

app.patch('/api/v1/tickets/:projectId/:ticketId', getAuthMiddleware, (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const ticketId = req.params.ticketId;
  const projectId = req.params.projectId;
  const ticketCheck = db.find('tickets', {
    id: ticketId,
    owner: username,
    'project.id': projectId,
  });
  if (!ticketCheck) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  const ticket = db.updateOne('tickets', ticketId, req.body?.data);
  if (!ticket) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  res.status(200).json({ message: 'ok', data: ticket });
});

app.patch(
  '/api/v1/tickets/:projectId/:ticketId/comments',
  getAuthMiddleware,
  (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const ticketId = req.params.ticketId;
    const projectId = req.params.projectId;
    const ticketCheck = db.find('tickets', {
      id: ticketId,
      owner: username,
      'project.id': projectId,
    });
    if (!ticketCheck) {
      res.status(404).json({ message: 'Ticket Not found' });
      return;
    }

    const user = db.findOne('users', { username });
    if (!user) {
      res.status(404).json({ message: 'User Not found' });
      return;
    }

    delete user.password;
    delete user.roles;

    const comment = req.body;
    const commentId = db.insert('ticket-comments', {
      ...comment,
      ticketId,
      projectId,
      user,
      date: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'ok',
      data: {
        id: commentId,
        ...comment,
        ticketId,
        projectId,
        user,
        date: new Date().toISOString(),
      },
    });
  },
);

app.get(
  '/api/v1/tickets/:projectId/:ticketId/comments',
  getAuthMiddleware,
  (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const ticketId = req.params.ticketId;
    const projectId = req.params.projectId;
    const ticketCheck = db.find('tickets', {
      id: ticketId,
      owner: username,
      'project.id': projectId,
    });
    if (!ticketCheck) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const comments = db.find('ticket-comments', { ticketId, projectId });
    res.status(200).json({ message: 'ok', data: comments });
    return;
  },
);

app.delete(
  '/api/v1/tickets/:projectId/:ticketId',
  getAuthMiddleware,
  (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const ticketId = req.params.ticketId;
    const projectId = req.params.projectId;
    const ticketCheck = db.find('tickets', {
      id: ticketId,
      owner: username,
      'project.id': projectId,
    });
    if (!ticketCheck) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    db.remove('tickets', ticketId);
    res.status(204).send();
  },
);

app.post('/api/v1/auth', (req: Request, res: Response) => {});

app.post('/api/v1/auth/refresh', (req: Request, res: Response) => {
  const refreshToken = req.body?.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET, {
      issuer: 'mock.auth.indie-desk.co',
      audience: ['indie-desk.co', 'localhost:4200'],
      ignoreNotBefore: true,
    });

    if (payload instanceof String) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userSearch = db.find('users', { username: payload.sub });

    if (userSearch?.length <= 0) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = userSearch[0];
    const newPayload = {
      username: user.username,
      roles: user.roles,
    };

    const currentTime = Math.floor(Date.now());
    const access_token = jwt.sign(newPayload, JWT_SECRET, {
      expiresIn: Math.floor(currentTime) + 60 * 60 * 1000,
      issuer: 'mock.auth.indie-desk.co',
      subject: user.username,
      notBefore: currentTime,
      audience: ['indie-desk.co', 'localhost:4200'],
    });

    const refresh_token = jwt.sign(
      {
        username: user.username,
      },
      JWT_SECRET,
      {
        expiresIn: Math.floor(currentTime) + 60 * 60 * 24 * 30 * 1000,
        issuer: 'mock.auth.indie-desk.co',
        subject: user.username,
        audience: ['indie-desk.co', 'localhost:4200'],
      },
    );

    res.status(200).json({
      message: 'ok',
      data: {
        access_token,
        refresh_token,
        expires_at: currentTime + 60 * 60,
      },
    });
    return;
  } catch (err) {
    console.error('[JWT] Error', err);
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
});

app.post('/api/v1/users', getAuthMiddleware, (req: Request, res: Response) => {});

app.get('/api/v1/users', getAuthMiddleware, (req: Request, res: Response) => {});

app.get('/api/v1/users/:userId', getAuthMiddleware, (req: Request, res: Response) => {});

app.listen(3002, () => {
  console.log('Server is running on port 3000');
});
