import express, {Express, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import users from './mockdata/users.json';
import clients from './mockdata/clients.json';
import cors from 'cors';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const app: Express = express();
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
   const userClients = clients.filter((client) => client.owner === username);
   res.status(200).json({message: 'ok', data: userClients});
   return;
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});