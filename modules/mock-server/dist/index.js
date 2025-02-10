"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_json_1 = __importDefault(require("./mockdata/users.json"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const JWT_SECRET = 'super-secret-development-jwt-key';
app.get('/', (req, res) => {
    res.json({ message: "ok" }).status(200);
});
app.post('/api/v1/auth/token', (req, res) => {
    const credentials = req.body;
    const user = users_json_1.default.find((user) => user.username === credentials.username && user.password === credentials.password);
    if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const payload = {
        username: user.username,
        roles: user.roles
    };
    const currentTime = Math.floor(Date.now());
    console.log('[JWT] Not valid before', currentTime, new Date(currentTime).toISOString());
    console.log('[JWT] Current Time', new Date().toISOString());
    console.log('[JWT] Expires at', currentTime + (60 * 60 * 1000), new Date(currentTime + (60 * 60 * 1000)).toISOString());
    const access_token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: Math.floor(currentTime) + (60 * 60 * 1000),
        issuer: 'mock.auth.indie-desk.co',
        subject: user.username,
        notBefore: currentTime,
        audience: ['indie-desk.co', 'localhost:4200']
    });
    const refresh_token = jsonwebtoken_1.default.sign({
        username: user.username
    }, JWT_SECRET, {
        expiresIn: Math.floor(currentTime) + (60 * 60 * 24 * 30 * 1000),
        issuer: 'mock.auth.indie-desk.co',
        subject: user.username,
        audience: ['indie-desk.co', 'localhost:4200']
    });
    res.status(200).json({ message: 'ok', data: { access_token, refresh_token, expires_at: currentTime + (60 * 60) } });
});
const authMiddleware = (req, res, next) => {
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
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET, {
            issuer: 'mock.auth.indie-desk.co',
            audience: ['indie-desk.co', 'localhost:4200'],
            ignoreNotBefore: true
        });
        if (payload instanceof String) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        req.user = payload;
    }
    catch (err) {
        console.error('[JWT] Error', err);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    next();
};
app.get('/api/v1/auth/me', authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const user = users_json_1.default.find((user) => user.username === username);
    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    res.status(200).json({ message: 'ok', data: user });
    return;
});
app.post('/api/v1/search', (req, res) => {
    const query = req.body.query;
    console.log('[SEARCH] Query', query);
    res.status(200).json({
        message: 'ok',
        data: [
            { id: '1', body: 'any' },
            { id: '2', body: 'any' },
            { id: '3', body: 'any' },
        ]
    });
    return;
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
