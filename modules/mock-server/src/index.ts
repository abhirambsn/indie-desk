import express, {Express, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import users from './mockdata/users.json';
import cors from 'cors';
import {JSONFileBasedDB} from "./db";

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

const JWT_SECRET = 'super-secret-development-jwt-key';

app.get('/', (req: Request, res: Response) => {
    res.json({message: "ok"}).status(200);
});

app.post('/api/v1/auth/token', (req: Request, res: Response) => {
    const credentials = req.body;

    const user = users.find((user) => user.username === credentials.username && user.password === credentials.password);
    if (!user) {
        res.status(401).json({message: 'Invalid credentials'});
        return;
    }
    const payload = {
        username: user.username,
        roles: user.roles
    }
    const currentTime = Math.floor(Date.now());
    console.log('[JWT] Not valid before', currentTime, new Date(currentTime).toISOString());
    console.log('[JWT] Current Time', new Date().toISOString());
    console.log('[JWT] Expires at', currentTime + (60*60*1000), new Date(currentTime + (60*60*1000)).toISOString());
    const access_token = jwt.sign(
        payload,
        JWT_SECRET,
        {
            expiresIn: Math.floor(currentTime) + (60*60*1000),
            issuer: 'mock.auth.indie-desk.co',
            subject: user.username,
            notBefore: currentTime,
            audience: ['indie-desk.co', 'localhost:4200']
        }
    )

    const refresh_token = jwt.sign(
        {
            username: user.username
        },
        JWT_SECRET,
        {
            expiresIn: Math.floor(currentTime) + (60*60*24*30*1000),
            issuer: 'mock.auth.indie-desk.co',
            subject: user.username,
            audience: ['indie-desk.co', 'localhost:4200']
        }
    )

    res.status(200).json({message: 'ok', data: {access_token, refresh_token, expires_at: currentTime + (60*60)}});
});

const authMiddleware = (req: Request, res: Response, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({message: 'Unauthorized'});
        return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({message: 'Unauthorized'});
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET, {
            issuer: 'mock.auth.indie-desk.co',
            audience: ['indie-desk.co', 'localhost:4200'],
            ignoreNotBefore: true
        });

        if (payload instanceof String) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        req.user = payload;
    } catch (err) {
        console.error('[JWT] Error', err);
        res.status(401).json({message: 'Unauthorized'});
        return;
    }

    next();
}

app.get('/api/v1/auth/me', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const user = users.find((user) => user.username === username);
    if (!user) {
        res.status(401).json({message: 'Unauthorized'});
        return;
    }

    res.status(200).json({message: 'ok', data: user});
    return;
});

app.post('/api/v1/search', (req: Request, res: Response) => {
   const query = req.body.query;
   console.log('[SEARCH] Query', query);
   res.status(200).json({
       message: 'ok',
       data: [
           {id: '1', body: 'any'},
           {id: '2', body: 'any'},
           {id: '3', body: 'any'},
       ]
   });
   return;
});

app.get('/api/v1/clients', authMiddleware, (req: Request, res: Response) => {
   const username = req?.user?.sub;
   // const clients: any[] = require('./mockdata/clients.json');
   // const userClients = clients.filter((client) => client.owner === username);
    const userClients = db.find('clients', {owner: username});
   res.status(200).json({message: 'ok', data: userClients});
   return;
});

app.post('/api/v1/clients', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    let client = {
        ...req.body?.data,
        owner: username,
        projects: []
    };
    const insertedId = db.insert('clients', client);
    res.status(200).json({message: 'ok', data: {id: insertedId, ...client}});
    return;
});

app.patch('/api/v1/clients/:id', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const id = req.params.id;
    const clientCheck = db.find('clients', {id, owner: username});
    if (!clientCheck) {
        res.status(404).json({message: 'Not found'});
        return;
    }

    const client = db.updateOne('clients', id, req.body?.data)
    if (!client) {
        res.status(404).json({message: 'Not found'});
        return;
    }
    res.status(200).json({message: 'ok', data: client});
    return;
});

app.delete('/api/v1/clients/:id', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const id = req.params.id;
    const clientCheck = db.find('clients', {id, owner: username});
    if (!clientCheck) {
        res.status(404).json({message: 'Not found'});
        return;
    }

    db.remove('clients', id);
    res.status(204).send();
    return;
});

app.get('/api/v1/projects', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const projects = db.find('projects', {owner: username});
    res.status(200).json({message: 'ok', data: projects});
    return;
});

app.get('/api/v1/projects/:id', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const id = req.params.id;
    const project = db.find('projects', {id, owner: username});
    if (!project) {
        res.status(404).json({message: 'Not found'});
        return;
    }
    res.status(200).json({message: 'ok', data: project});
    return;
});

app.post('/api/v1/projects', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    let project = {
        ...req.body?.data,
        owner: username,
        tasks: []
    };
    const insertedId = db.insert('projects', project);
    res.status(200).json({message: 'ok', data: {id: insertedId, ...project}});
    return;
});

app.patch('/api/v1/projects/:id', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const id = req.params.id;
    const projectCheck = db.find('projects', {id, owner: username});
    if (!projectCheck) {
        res.status(404).json({message: 'Not found'});
        return;
    }

    const project = db.updateOne('projects', id, req.body?.data)
    if (!project) {
        res.status(404).json({message: 'Not found'});
        return;
    }
    res.status(200).json({message: 'ok', data: project});
    return;
});

app.delete('/api/v1/projects/:id', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const id = req.params.id;
    const projectCheck = db.find('projects', {id, owner: username});
    if (!projectCheck) {
        res.status(404).json({message: 'Not found'});
        return;
    }

    db.remove('projects', id);
    res.status(204).send();
    return;
});



app.post('/api/v1/invoices', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    let invoice = {
        ...req.body?.data,
        owner: username,
        items: []
    };
    const insertedId = db.insert('invoices', invoice);
    res.status(200).json({message: 'ok', data: {id: insertedId, ...invoice}});
    return;
});

app.get('/api/v1/invoices', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const invoices = db.find('invoices', {owner: username});
    res.status(200).json({message: 'ok', data: invoices});
    return;
});

app.get('/api/v1/invoices/:id', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const id = req.params.id;
    const invoice = db.find('invoices', {id, owner: username});
    if (!invoice) {
        res.status(404).json({message: 'Not found'});
        return;
    }
    res.status(200).json({message: 'ok', data: invoice});
    return;
});



app.post('/api/v1/:projectId/task', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const projectId = req.params.projectId;
    const project = db.find('projects', {id: projectId, owner: username});
    if (!project) {
        res.status(404).json({message: 'Not found'});
        return;
    }

    let task = {
        ...req.body?.data,
        project: projectId
    };
    const insertedId = db.insert('tasks', task);
    res.status(200).json({message: 'ok', data: {id: insertedId, ...task}});
    return;
});

app.get('/api/v1/:projectId/task', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const projectId = req.params.projectId;
    const project = db.find('projects', {id: projectId, owner: username});
    if (!project) {
        res.status(404).json({message: 'Not found'});
        return;
    }

    const tasks = db.find('tasks', {project: projectId});
    res.status(200).json({message: 'ok', data: tasks});
    return;
});

app.get('/api/v1/:projectId/task/:taskId', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const project = db.find('projects', {id: projectId, owner: username});
    if (!project) {
        res.status(404).json({message: 'Not found'});
        return;
    }

    const task = db.find('tasks', {id: taskId, project: projectId});
    if (!task) {
        res.status(404).json({message: 'Not found'});
        return;
    }

    res.status(200).json({message: 'ok', data: task});
    return;
});

app.patch('/api/v1/:projectId/task', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const project = db.find('projects', {id: projectId, owner: username});
    if (!project) {
        res.status(404).json({message: 'Not found'});
        return;
    }

    const task = db.updateOne('tasks', taskId, req.body?.data);
    if (!task) {
        res.status(404).json({message: 'Not found'});
        return;
    }

    res.status(200).json({message: 'ok', data: task});
    return;
});

app.delete('/api/v1/:projectId/task/:taskId', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const project = db.find('projects', {id: projectId, owner: username});
    if (!project) {
        res.status(404).json({message: 'Not found'});
        return;
    }

    db.remove('tasks', taskId);
    res.status(204).send();
    return;
});


app.post('/api/v1/ticket', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    let ticket = {
        ...req.body?.data,
        owner: username
    };
    const insertedId = db.insert('tickets', ticket);
    res.status(200).json({message: 'ok', data: {id: insertedId, ...ticket}});
    return;
});

app.get('/api/v1/ticket', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const tickets = db.find('tickets', {owner: username});
    res.status(200).json({message: 'ok', data: tickets});
    return;
});

app.get('/api/v1/ticket/:ticketId', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const ticketId = req.params.ticketId;
    const ticket = db.find('tickets', {id: ticketId, owner: username});
    if (!ticket) {
        res.status(404).json({message: 'Not found'});
        return;
    }
    res.status(200).json({message: 'ok', data: ticket});
    return;
});

app.patch('/api/v1/ticket/:ticketId', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const ticketId = req.params.ticketId;
    const ticketCheck = db.find('tickets', {id: ticketId, owner: username});
    if (!ticketCheck) {
        res.status(404).json({message: 'Not found'});
        return;
    }

    const ticket = db.updateOne('tickets', ticketId, req.body?.data)
    if (!ticket) {
        res.status(404).json({message: 'Not found'});
        return;
    }
    res.status(200).json({message: 'ok', data: ticket});
    return;
});

app.delete('/api/v1/ticket/:ticketId', authMiddleware, (req: Request, res: Response) => {
    const username = req?.user?.sub;
    const ticketId = req.params.ticketId;
    const ticketCheck = db.find('tickets', {id: ticketId, owner: username});
    if (!ticketCheck) {
        res.status(404).json({message: 'Not found'});
        return;
    }

    db.remove('tickets', ticketId);
    res.status(204).send();
    return;
});


app.post('/api/v1/auth', (req: Request, res: Response) => {

});

app.post('/api/v1/auth/refresh', (req: Request, res: Response) => {
    const refreshToken = req.body?.refresh_token;
    if (!refreshToken) {
        res.status(401).json({message: 'Unauthorized'});
        return;
    }

    try {
        const payload = jwt.verify(refreshToken, JWT_SECRET, {
            issuer: 'mock.auth.indie-desk.co',
            audience: ['indie-desk.co', 'localhost:4200'],
            ignoreNotBefore: true
        });

        if (payload instanceof String) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const userSearch = db.find('users', {username: payload.sub});

        if (userSearch?.length <= 0) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const user = userSearch[0];
        const newPayload = {
            username: user.username,
            roles: user.roles
        }

        const currentTime = Math.floor(Date.now());
        const access_token = jwt.sign(
            newPayload,
            JWT_SECRET,
            {
                expiresIn: Math.floor(currentTime) + (60*60*1000),
                issuer: 'mock.auth.indie-desk.co',
                subject: user.username,
                notBefore: currentTime,
                audience: ['indie-desk.co', 'localhost:4200']
            }
        )

        const refresh_token = jwt.sign(
            {
                username: user.username
            },
            JWT_SECRET,
            {
                expiresIn: Math.floor(currentTime) + (60*60*24*30*1000),
                issuer: 'mock.auth.indie-desk.co',
                subject: user.username,
                audience: ['indie-desk.co', 'localhost:4200']
            }
        )

        res.status(200).json({message: 'ok', data: {access_token, refresh_token, expires_at: currentTime + (60*60)}});
        return;
    } catch (err) {
        console.error('[JWT] Error', err);
        res.status(401).json({message: 'Unauthorized'});
        return;
    }
});


app.post('/api/v1/users', authMiddleware, (req: Request, res: Response) => {});

app.get('/api/v1/users', authMiddleware, (req: Request, res: Response) => {});

app.get('/api/v1/users/:userId', authMiddleware, (req: Request, res: Response) => {});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});