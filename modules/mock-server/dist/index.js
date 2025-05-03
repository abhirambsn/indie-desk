"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_json_1 = __importDefault(require("./mockdata/users.json"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const db = new db_1.JSONFileBasedDB();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const JWT_SECRET = "super-secret-development-jwt-key";
app.get("/", (req, res) => {
    res.json({ message: "ok" }).status(200);
});
app.post("/api/v1/auth/token", (req, res) => {
    const credentials = req.body;
    const user = users_json_1.default.find((user) => user.username === credentials.username &&
        user.password === credentials.password);
    if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const payload = {
        username: user.username,
        roles: user.roles,
    };
    const currentTime = Math.floor(Date.now());
    console.log("[JWT] Not valid before", currentTime, new Date(currentTime).toISOString());
    console.log("[JWT] Current Time", new Date().toISOString());
    console.log("[JWT] Expires at", currentTime + 60 * 60 * 1000, new Date(currentTime + 60 * 60 * 1000).toISOString());
    const access_token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: Math.floor(currentTime) + 60 * 60 * 1000,
        issuer: "mock.auth.indie-desk.co",
        subject: user.username,
        notBefore: currentTime,
        audience: ["indie-desk.co", "localhost:4200"],
    });
    const refresh_token = jsonwebtoken_1.default.sign({
        username: user.username,
    }, JWT_SECRET, {
        expiresIn: Math.floor(currentTime) + 60 * 60 * 24 * 30 * 1000,
        issuer: "mock.auth.indie-desk.co",
        subject: user.username,
        audience: ["indie-desk.co", "localhost:4200"],
    });
    res.status(200).json({
        message: "ok",
        data: { access_token, refresh_token, expires_at: currentTime + 60 * 60 },
    });
});
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET, {
            issuer: "mock.auth.indie-desk.co",
            audience: ["indie-desk.co", "localhost:4200"],
            ignoreNotBefore: true,
        });
        if (payload instanceof String) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        req.user = payload;
    }
    catch (err) {
        console.error("[JWT] Error", err);
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    next();
};
app.get("/api/v1/auth/me", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const user = users_json_1.default.find((user) => user.username === username);
    if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    res.status(200).json({ message: "ok", data: user });
    return;
});
app.post("/api/v1/search", (req, res) => {
    const query = req.body.query;
    console.log("[SEARCH] Query", query);
    res.status(200).json({
        message: "ok",
        data: [
            { id: "1", body: "any" },
            { id: "2", body: "any" },
            { id: "3", body: "any" },
        ],
    });
    return;
});
app.get("/api/v1/clients", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const userClients = db.find("clients", { owner: username });
    res.status(200).json({ message: "ok", data: userClients });
    return;
});
app.post("/api/v1/clients", authMiddleware, (req, res) => {
    var _a, _b;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    let client = Object.assign(Object.assign({}, (_b = req.body) === null || _b === void 0 ? void 0 : _b.data), { owner: username, projects: [] });
    const insertedId = db.insert("clients", client);
    res.status(200).json({ message: "ok", data: Object.assign({ id: insertedId }, client) });
    return;
});
app.patch("/api/v1/clients/:id", authMiddleware, (req, res) => {
    var _a, _b;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const id = req.params.id;
    const clientCheck = db.find("clients", { id, owner: username });
    if (!clientCheck.length) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    const client = db.updateOne("clients", id, (_b = req.body) === null || _b === void 0 ? void 0 : _b.data);
    if (!client) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    res.status(200).json({ message: "ok", data: client });
    return;
});
app.delete("/api/v1/clients/:id", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const id = req.params.id;
    const clientCheck = db.find("clients", { id, owner: username });
    if (!clientCheck.length) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    db.remove("clients", id);
    res.status(204).send();
    return;
});
app.get("/api/v1/projects", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const projects = db.find("projects", { owner: username });
    res.status(200).json({ message: "ok", data: projects });
    return;
});
app.get("/api/v1/projects/:id", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const id = req.params.id;
    const project = db.find("projects", { id, owner: username });
    if (!project.length) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    res.status(200).json({ message: "ok", data: project });
    return;
});
app.post("/api/v1/projects", authMiddleware, (req, res) => {
    var _a, _b, _c;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    let project = Object.assign(Object.assign({}, (_b = req.body) === null || _b === void 0 ? void 0 : _b.data), { owner: username, tasks: [] });
    const client = db.find("clients", { id: (_c = project.client) === null || _c === void 0 ? void 0 : _c.id });
    if (!client.length) {
        res.status(404).json({ message: "Client not found" });
        return;
    }
    project.client = client[0];
    const insertedId = db.insert("projects", project);
    res.status(200).json({ message: "ok", data: Object.assign({ id: insertedId }, project) });
    return;
});
app.patch("/api/v1/projects/:id", authMiddleware, (req, res) => {
    var _a, _b;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const id = req.params.id;
    const projectCheck = db.find("projects", { id, owner: username });
    if (!projectCheck) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    const project = db.updateOne("projects", id, (_b = req.body) === null || _b === void 0 ? void 0 : _b.data);
    if (!project) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    res.status(200).json({ message: "ok", data: project });
    return;
});
app.delete("/api/v1/projects/:id", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const id = req.params.id;
    const projectCheck = db.find("projects", { id, owner: username });
    if (!projectCheck.length) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    db.remove("projects", id);
    res.status(204).send();
    return;
});
const generatePdfInvoice = (invoiceId) => {
    const invoiceData = db.find("invoices", { id: invoiceId });
    if (!invoiceData.length) {
        return;
    }
    const invoice = invoiceData[0];
    const doc = new pdfkit_1.default();
    const filePath = `${__dirname}/mockdata/invoices/${invoiceId}.pdf`;
    const stream = fs_1.default.createWriteStream(filePath);
    doc.pipe(stream);
    doc.rect(0, 0, 600, 100).fill("#F8F8F8");
    doc.fill("#000").fontSize(20).text(invoice.client.name, { align: "center" });
    doc.moveDown(2);
    doc.fillColor("#333").fontSize(12);
    doc.text(`Invoice ID: ${invoice.id}`);
    doc.text(`Date: ${invoice.date}`);
    doc.moveDown();
    doc.fontSize(14).text("Billed To:", { underline: true });
    doc.fontSize(12).text(invoice.client.name);
    doc.text(invoice.client.address);
    doc.text(invoice.client.phone);
    doc.moveDown();
    doc.moveDown();
    doc.fillColor("#000").fontSize(14).text("TASK", 50, 250);
    doc.text("RATE", 250, 250);
    doc.text("HOURS", 350, 250);
    doc.text("TOTAL", 450, 250);
    doc.moveDown();
    doc.moveTo(50, 265).lineTo(550, 265).stroke();
    doc.fillColor("#444").fontSize(12);
    invoice.items.forEach((item, index) => {
        const y = 280 + index * 25;
        doc.text(item.description, 50, y);
        doc.text(`${invoice.project.perHourRate.currency} ${invoice.project.perHourRate.amount}/hr`, 250, y);
        doc.text(`${item.hours}`, 350, y);
        doc.text(`${invoice.project.perHourRate.currency} ${invoice.project.perHourRate.amount * item.hours}`, 450, y);
    });
    doc.moveTo(50, 365).lineTo(550, 365).stroke();
    doc.moveDown(2);
    doc.fillColor("#000").fontSize(12);
    const subtotal = invoice.items.reduce((acc, item) => {
        return acc + invoice.project.perHourRate.amount * item.hours;
    }, 0);
    doc.text(`Subtotal: ${invoice.project.perHourRate.currency} ${subtotal}`, 400, 390);
    if (invoice.discount) {
        const discountAmount = (subtotal * invoice.discount) / 100;
        doc.text(`Discount (${invoice.discount}%): -${invoice.project.perHourRate.currency}${discountAmount}`, 400, 405);
        const total = subtotal - discountAmount;
        doc
            .fontSize(14)
            .text(`Total Due: ${invoice.project.perHourRate.currency} ${total}`, 400, 420, { underline: true });
    }
    doc.moveDown(3);
    doc.font("Courier-BoldOblique").fontSize(20).text("Thank you!", 50, 460);
    if (invoice.status === "PAID" && invoice.paymentInfo) {
        doc.fontSize(14).text("Payment Information:", { underline: true });
        switch (invoice.paymentInfo.method) {
            case "card":
                doc.fontSize(12).text(`Payment Method: Card`);
                doc.fontSize(12).text(`Card Type: ${invoice.paymentInfo.cardType}`);
                doc.text(`Last 4 Digits: ${invoice.paymentInfo.lastFourDigits}`);
                break;
            case "cheque":
                doc.fontSize(12).text(`Payment Method: Cheque`);
                doc.fontSize(12).text(`Bank Name: ${invoice.paymentInfo.bankName}`);
                doc
                    .fontSize(12)
                    .text(`Cheque Number: ${invoice.paymentInfo.chequeNumber}`);
                break;
            case "cash":
                doc.fontSize(12).text(`Cash Payment`);
                break;
            case "upi":
                doc.fontSize(12).text(`Payment Method: UPI`);
                doc.fontSize(12).text(`UPI ID: ${invoice.paymentInfo.upiId}`);
                break;
            case "bank":
                doc.fontSize(12).text(`Payment Method: Bank Transfer`);
                doc.fontSize(12).text(`Bank Name: ${invoice.paymentInfo.bankName}`);
                break;
            default:
                break;
        }
        doc.text(`Transaction ID: ${invoice.paymentInfo.transactionId}`);
        doc.text(`Date: ${invoice.paymentInfo.date}`);
        doc.text(`Amount: ${invoice.paymentInfo.amount.currency} ${invoice.paymentInfo.amount.amount}`);
    }
    else {
        doc
            .fontSize(12)
            .text(`Payment is due on ${invoice.dueDate}`, { align: "center" });
    }
    doc.fontSize(10).text("Thank you for your business!", { align: "center" });
    doc.moveDown();
    doc
        .fontSize(8)
        .text(`Generated by: ${invoice.generatedBy}`, { align: "center" });
    doc.end();
    stream.on("finish", () => {
        console.log(`Invoice ${invoiceId} generated and saved at ${filePath}`);
    });
};
app.post("/api/v1/invoices", authMiddleware, (req, res) => {
    var _a, _b, _c, _d;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    let invoice = Object.assign(Object.assign({}, (_b = req.body) === null || _b === void 0 ? void 0 : _b.data), { owner: username });
    const client = db.find("clients", { id: (_c = invoice.client) === null || _c === void 0 ? void 0 : _c.id });
    if (!client.length) {
        res.status(404).json({ message: "Client not found" });
        return;
    }
    invoice.client = client[0];
    const project = db.find("projects", { id: (_d = invoice.project) === null || _d === void 0 ? void 0 : _d.id });
    if (!project.length) {
        res.status(404).json({ message: "Project not found" });
        return;
    }
    invoice.project = project[0];
    const insertedId = db.insert("invoices", invoice);
    generatePdfInvoice(insertedId);
    res.status(200).json({ message: "ok", data: Object.assign({ id: insertedId }, invoice) });
    return;
});
app.get("/api/v1/invoices", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const invoices = db.find("invoices", { owner: username });
    res.status(200).json({ message: "ok", data: invoices });
    return;
});
app.get("/api/v1/invoices/:id", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const id = req.params.id;
    const invoice = db.find("invoices", { id, owner: username });
    if (!invoice) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    res.status(200).json({ message: "ok", data: invoice });
    return;
});
app.patch("/api/v1/invoices/:id", authMiddleware, (req, res) => {
    var _a, _b;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const id = req.params.id;
    const invoiceCheck = db.find("invoices", { id, owner: username });
    if (!invoiceCheck) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    const invoice = db.updateOne("invoices", id, (_b = req.body) === null || _b === void 0 ? void 0 : _b.data);
    if (!invoice) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    res.status(200).json({ message: "ok", data: invoice });
    return;
});
app.get("/api/v1/invoices/:id/pdf", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const id = req.params.id;
    const invoice = db.find("invoices", { id, owner: username });
    if (!invoice) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    const invoicePath = `${__dirname}/mockdata/invoices/${id}.pdf`;
    res.download(invoicePath, `invoice-${id}.pdf`);
    return;
});
const getTaskIdByProject = (project, existingIds) => {
    const initials = project.name
        .split(" ")
        .map((word) => word[0].toUpperCase())
        .join("");
    const existingNumbers = existingIds
        .filter((id) => id.startsWith(initials))
        .map((id) => parseInt(id.split("-")[1], 10))
        .filter((num) => !isNaN(num));
    const nextNumber = (existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0) + 1;
    return `${initials}-${nextNumber.toString().padStart(5, "0")}`;
};
app.post("/api/v1/:projectId/task", authMiddleware, (req, res) => {
    var _a, _b;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const projectId = req.params.projectId;
    const project = db.find("projects", { id: projectId, owner: username });
    if (!project) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    const existingIds = db
        .find("tasks", { project: projectId })
        .map((task) => task.id);
    const id = getTaskIdByProject(project[0], existingIds);
    let task = Object.assign(Object.assign({ id }, (_b = req.body) === null || _b === void 0 ? void 0 : _b.data), { project: projectId });
    const insertedId = db.insert("tasks", task, false);
    res.status(200).json({ message: "ok", data: Object.assign({ id: insertedId }, task) });
    return;
});
app.get("/api/v1/:projectId/task", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const projectId = req.params.projectId;
    const project = db.find("projects", { id: projectId, owner: username });
    if (!project) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    const tasks = db.find("tasks", { project: projectId });
    res.status(200).json({ message: "ok", data: tasks });
    return;
});
app.get("/api/v1/:projectId/task/:taskId", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const project = db.find("projects", { id: projectId, owner: username });
    if (!project) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    const task = db.find("tasks", { id: taskId, project: projectId });
    if (!task) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    res.status(200).json({ message: "ok", data: task });
    return;
});
app.patch("/api/v1/:projectId/task/:taskId", authMiddleware, (req, res) => {
    var _a, _b;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const project = db.find("projects", { id: projectId, owner: username });
    if (!project) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    const task = db.updateOne("tasks", taskId, (_b = req.body) === null || _b === void 0 ? void 0 : _b.data);
    if (!task) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    res.status(200).json({ message: "ok", data: task });
    return;
});
app.delete("/api/v1/:projectId/task/:taskId", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const project = db.find("projects", { id: projectId, owner: username });
    if (!project) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    db.remove("tasks", taskId);
    res.status(204).send();
    return;
});
app.post("/api/v1/ticket", authMiddleware, (req, res) => {
    var _a, _b;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    let ticket = Object.assign(Object.assign({}, (_b = req.body) === null || _b === void 0 ? void 0 : _b.data), { owner: username });
    const insertedId = db.insert("tickets", ticket);
    res.status(200).json({ message: "ok", data: Object.assign({ id: insertedId }, ticket) });
    return;
});
app.get("/api/v1/ticket", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const tickets = db.find("tickets", { owner: username });
    res.status(200).json({ message: "ok", data: tickets });
    return;
});
app.get("/api/v1/ticket/:ticketId", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const ticketId = req.params.ticketId;
    const ticket = db.find("tickets", { id: ticketId, owner: username });
    if (!ticket) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    res.status(200).json({ message: "ok", data: ticket });
    return;
});
app.patch("/api/v1/ticket/:ticketId", authMiddleware, (req, res) => {
    var _a, _b;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const ticketId = req.params.ticketId;
    const ticketCheck = db.find("tickets", { id: ticketId, owner: username });
    if (!ticketCheck) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    const ticket = db.updateOne("tickets", ticketId, (_b = req.body) === null || _b === void 0 ? void 0 : _b.data);
    if (!ticket) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    res.status(200).json({ message: "ok", data: ticket });
    return;
});
app.delete("/api/v1/ticket/:ticketId", authMiddleware, (req, res) => {
    var _a;
    const username = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.sub;
    const ticketId = req.params.ticketId;
    const ticketCheck = db.find("tickets", { id: ticketId, owner: username });
    if (!ticketCheck) {
        res.status(404).json({ message: "Not found" });
        return;
    }
    db.remove("tickets", ticketId);
    res.status(204).send();
    return;
});
app.post("/api/v1/auth", (req, res) => { });
app.post("/api/v1/auth/refresh", (req, res) => {
    var _a;
    const refreshToken = (_a = req.body) === null || _a === void 0 ? void 0 : _a.refresh_token;
    if (!refreshToken) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET, {
            issuer: "mock.auth.indie-desk.co",
            audience: ["indie-desk.co", "localhost:4200"],
            ignoreNotBefore: true,
        });
        if (payload instanceof String) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const userSearch = db.find("users", { username: payload.sub });
        if ((userSearch === null || userSearch === void 0 ? void 0 : userSearch.length) <= 0) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = userSearch[0];
        const newPayload = {
            username: user.username,
            roles: user.roles,
        };
        const currentTime = Math.floor(Date.now());
        const access_token = jsonwebtoken_1.default.sign(newPayload, JWT_SECRET, {
            expiresIn: Math.floor(currentTime) + 60 * 60 * 1000,
            issuer: "mock.auth.indie-desk.co",
            subject: user.username,
            notBefore: currentTime,
            audience: ["indie-desk.co", "localhost:4200"],
        });
        const refresh_token = jsonwebtoken_1.default.sign({
            username: user.username,
        }, JWT_SECRET, {
            expiresIn: Math.floor(currentTime) + 60 * 60 * 24 * 30 * 1000,
            issuer: "mock.auth.indie-desk.co",
            subject: user.username,
            audience: ["indie-desk.co", "localhost:4200"],
        });
        res.status(200).json({
            message: "ok",
            data: {
                access_token,
                refresh_token,
                expires_at: currentTime + 60 * 60,
            },
        });
        return;
    }
    catch (err) {
        console.error("[JWT] Error", err);
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
});
app.post("/api/v1/users", authMiddleware, (req, res) => { });
app.get("/api/v1/users", authMiddleware, (req, res) => { });
app.get("/api/v1/users/:userId", authMiddleware, (req, res) => { });
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
