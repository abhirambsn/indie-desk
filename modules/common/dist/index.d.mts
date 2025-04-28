import { Request, Response } from 'express';
import mongoose from 'mongoose';

interface Amount {
    currency: string;
    amount: number;
}

declare enum ClientType {
    ORGANIZATION = "ORGANIZATION",
    INDIVIDUAL = "INDIVIDUAL"
}

declare enum InvoiceStatus {
    DRAFT = "DRAFT",
    SENT = "SENT",
    PAID = "PAID",
    VOID = "VOID",
    OVERDUE = "OVERDUE"
}

declare enum ProjectStatus {
    New = "NEW",
    Ongoing = "ONGOING",
    Completed = "COMPLETED",
    OnHold = "ON_HOLD",
    Canceled = "CANCELED"
}

interface Client {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    contact: string;
    owner: string;
    projects: Project[];
    type: ClientType;
}

interface Comment$1 {
    id: string;
    text: string;
    user: User;
    date: Date;
}

interface Column {
    field: string;
    header: string;
    customdeclareHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

interface Invoice {
    id: string;
    description: string;
    client?: Client;
    project?: Project;
    date: Date;
    items: InvoiceItem[];
    status: InvoiceStatus;
    generatedBy?: string;
    owner?: string;
    dueDate?: Date;
    paidDate?: Date;
    notes?: string;
    discount?: number;
    paymentInfo?: PaymentInfo;
}

interface InvoiceItem {
    id: string;
    description: string;
    hours: number;
}

interface Organization {
    id: string;
    name: string;
    users: User[];
}

interface PaymentInfo {
    method: 'card' | 'cheque' | 'cash' | 'upi' | 'bank';
    transactionId: string;
    date: Date;
    amount: Amount;
    bankName?: string;
    lastFourDigits?: string;
    cardType?: string;
    chequeNumber?: string;
    upiId?: string;
}

interface Project {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    owner: string;
    client: Client;
    perHourRate: Amount;
    status: ProjectStatus;
    description: string;
}

interface SidebarItem {
    id: string;
    icon: string;
    title: string;
    link: string;
    isButton: boolean;
    isActive?: boolean;
    roles?: string[];
}

interface SidebarSection {
    id: string;
    title: string;
    roles?: string[];
    children: SidebarItem[];
}

interface SupportTicket {
    id: string;
    title: string;
    description: string;
    project: Project;
    assignee: User;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
    comments: TicketComment[];
    attachments: TicketAttachment[];
    createdAt: Date;
    updatedAt: Date;
}

interface Task {
    id: string;
    title: string;
    description: string;
    project: Project;
    client?: Client;
    assignee: string;
    dueDate?: Date;
    status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    comments: Comment[];
    plannedHours: number;
}

interface TicketAttachment {
    id: string;
    url: string;
    type: string;
    timestamp: Date;
}

interface TicketComment {
    id: string;
    text: string;
    type: 'internal' | 'external';
    user: User;
    date: Date;
}

interface TicketFieldColumn {
    id: string;
    header: string;
    type: string;
    isRequired: boolean;
    isVisible: boolean;
    readonly: boolean;
    options?: {
        label: string;
        value: string;
    }[];
}

interface User {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    email: string;
    username: string;
    org: Organization;
    projects: Project[];
    project_id?: string;
    role?: string;
    password?: string;
    confirm_password?: string;
}

declare const logger: {
    info: (msg: string) => void;
    error: (msg: string) => void;
    warn: (msg: string) => void;
    debug: (msg: string) => void;
    log: (msg: string) => void;
};

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
declare const authMiddleware: (req: Request, res: Response, next: any) => void;

declare const ClientModel: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    type: "ORGANIZATION" | "INDIVIDUAL";
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    contact: string;
    projects: string[];
    owner: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    type: "ORGANIZATION" | "INDIVIDUAL";
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    contact: string;
    projects: string[];
    owner: string;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    type: "ORGANIZATION" | "INDIVIDUAL";
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    contact: string;
    projects: string[];
    owner: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    type: "ORGANIZATION" | "INDIVIDUAL";
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    contact: string;
    projects: string[];
    owner: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    type: "ORGANIZATION" | "INDIVIDUAL";
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    contact: string;
    projects: string[];
    owner: string;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    type: "ORGANIZATION" | "INDIVIDUAL";
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    contact: string;
    projects: string[];
    owner: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;

declare const InvoiceModel: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    date: NativeDate;
    owner: string;
    description: string;
    project: mongoose.Types.ObjectId;
    status: "DRAFT" | "SENT" | "PAID";
    generatedBy: string;
    dueDate: NativeDate;
    items: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        hours: number;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        id: string;
        description: string;
        hours: number;
    }> & {
        id: string;
        description: string;
        hours: number;
    }>;
    client?: {
        name: string;
        address: string;
    } | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    date: NativeDate;
    owner: string;
    description: string;
    project: mongoose.Types.ObjectId;
    status: "DRAFT" | "SENT" | "PAID";
    generatedBy: string;
    dueDate: NativeDate;
    items: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        hours: number;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        id: string;
        description: string;
        hours: number;
    }> & {
        id: string;
        description: string;
        hours: number;
    }>;
    client?: {
        name: string;
        address: string;
    } | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    date: NativeDate;
    owner: string;
    description: string;
    project: mongoose.Types.ObjectId;
    status: "DRAFT" | "SENT" | "PAID";
    generatedBy: string;
    dueDate: NativeDate;
    items: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        hours: number;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        id: string;
        description: string;
        hours: number;
    }> & {
        id: string;
        description: string;
        hours: number;
    }>;
    client?: {
        name: string;
        address: string;
    } | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    date: NativeDate;
    owner: string;
    description: string;
    project: mongoose.Types.ObjectId;
    status: "DRAFT" | "SENT" | "PAID";
    generatedBy: string;
    dueDate: NativeDate;
    items: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        hours: number;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        id: string;
        description: string;
        hours: number;
    }> & {
        id: string;
        description: string;
        hours: number;
    }>;
    client?: {
        name: string;
        address: string;
    } | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    date: NativeDate;
    owner: string;
    description: string;
    project: mongoose.Types.ObjectId;
    status: "DRAFT" | "SENT" | "PAID";
    generatedBy: string;
    dueDate: NativeDate;
    items: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        hours: number;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        id: string;
        description: string;
        hours: number;
    }> & {
        id: string;
        description: string;
        hours: number;
    }>;
    client?: {
        name: string;
        address: string;
    } | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    date: NativeDate;
    owner: string;
    description: string;
    project: mongoose.Types.ObjectId;
    status: "DRAFT" | "SENT" | "PAID";
    generatedBy: string;
    dueDate: NativeDate;
    items: mongoose.Types.DocumentArray<{
        id: string;
        description: string;
        hours: number;
    }, mongoose.Types.Subdocument<mongoose.Types.ObjectId, any, {
        id: string;
        description: string;
        hours: number;
    }> & {
        id: string;
        description: string;
        hours: number;
    }>;
    client?: {
        name: string;
        address: string;
    } | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;

declare const ProjectModel: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    name: string;
    owner: string;
    client: mongoose.Types.ObjectId;
    status: "ONGOING" | "COMPLETED" | "CANCELLED" | "PENDING";
    startDate: NativeDate;
    endDate: NativeDate;
    tasks: string[];
    users: string[];
    perHourRate?: {
        amount: number;
        currency: string;
    } | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    name: string;
    owner: string;
    client: mongoose.Types.ObjectId;
    status: "ONGOING" | "COMPLETED" | "CANCELLED" | "PENDING";
    startDate: NativeDate;
    endDate: NativeDate;
    tasks: string[];
    users: string[];
    perHourRate?: {
        amount: number;
        currency: string;
    } | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    name: string;
    owner: string;
    client: mongoose.Types.ObjectId;
    status: "ONGOING" | "COMPLETED" | "CANCELLED" | "PENDING";
    startDate: NativeDate;
    endDate: NativeDate;
    tasks: string[];
    users: string[];
    perHourRate?: {
        amount: number;
        currency: string;
    } | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    name: string;
    owner: string;
    client: mongoose.Types.ObjectId;
    status: "ONGOING" | "COMPLETED" | "CANCELLED" | "PENDING";
    startDate: NativeDate;
    endDate: NativeDate;
    tasks: string[];
    users: string[];
    perHourRate?: {
        amount: number;
        currency: string;
    } | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    name: string;
    owner: string;
    client: mongoose.Types.ObjectId;
    status: "ONGOING" | "COMPLETED" | "CANCELLED" | "PENDING";
    startDate: NativeDate;
    endDate: NativeDate;
    tasks: string[];
    users: string[];
    perHourRate?: {
        amount: number;
        currency: string;
    } | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    name: string;
    owner: string;
    client: mongoose.Types.ObjectId;
    status: "ONGOING" | "COMPLETED" | "CANCELLED" | "PENDING";
    startDate: NativeDate;
    endDate: NativeDate;
    tasks: string[];
    users: string[];
    perHourRate?: {
        amount: number;
        currency: string;
    } | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;

declare const TaskModel: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    project: mongoose.Types.ObjectId;
    status: "COMPLETED" | "OPEN" | "IN_PROGRESS" | "BLOCKED";
    title: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description?: string | null | undefined;
    plannedHours?: number | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    project: mongoose.Types.ObjectId;
    status: "COMPLETED" | "OPEN" | "IN_PROGRESS" | "BLOCKED";
    title: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description?: string | null | undefined;
    plannedHours?: number | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    project: mongoose.Types.ObjectId;
    status: "COMPLETED" | "OPEN" | "IN_PROGRESS" | "BLOCKED";
    title: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description?: string | null | undefined;
    plannedHours?: number | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    project: mongoose.Types.ObjectId;
    status: "COMPLETED" | "OPEN" | "IN_PROGRESS" | "BLOCKED";
    title: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description?: string | null | undefined;
    plannedHours?: number | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    project: mongoose.Types.ObjectId;
    status: "COMPLETED" | "OPEN" | "IN_PROGRESS" | "BLOCKED";
    title: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description?: string | null | undefined;
    plannedHours?: number | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    project: mongoose.Types.ObjectId;
    status: "COMPLETED" | "OPEN" | "IN_PROGRESS" | "BLOCKED";
    title: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description?: string | null | undefined;
    plannedHours?: number | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;

declare const SupportTicketModel: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    owner: string;
    project: mongoose.Types.ObjectId;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    title: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description?: string | null | undefined;
    assignee?: string | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    owner: string;
    project: mongoose.Types.ObjectId;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    title: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description?: string | null | undefined;
    assignee?: string | null | undefined;
}, {}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    owner: string;
    project: mongoose.Types.ObjectId;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    title: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description?: string | null | undefined;
    assignee?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    owner: string;
    project: mongoose.Types.ObjectId;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    title: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description?: string | null | undefined;
    assignee?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    owner: string;
    project: mongoose.Types.ObjectId;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    title: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description?: string | null | undefined;
    assignee?: string | null | undefined;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    owner: string;
    project: mongoose.Types.ObjectId;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    title: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description?: string | null | undefined;
    assignee?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;

declare const TicketCommentModel: mongoose.Model<{
    id: string;
    date: NativeDate;
    type: "internal" | "public";
    text: string;
    ticketId: string;
    projectId: string;
    username: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    id: string;
    date: NativeDate;
    type: "internal" | "public";
    text: string;
    ticketId: string;
    projectId: string;
    username: string;
}, {}> & {
    id: string;
    date: NativeDate;
    type: "internal" | "public";
    text: string;
    ticketId: string;
    projectId: string;
    username: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    id: string;
    date: NativeDate;
    type: "internal" | "public";
    text: string;
    ticketId: string;
    projectId: string;
    username: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    id: string;
    date: NativeDate;
    type: "internal" | "public";
    text: string;
    ticketId: string;
    projectId: string;
    username: string;
}>, {}> & mongoose.FlatRecord<{
    id: string;
    date: NativeDate;
    type: "internal" | "public";
    text: string;
    ticketId: string;
    projectId: string;
    username: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;

export { type Amount, type Client, ClientModel, type Column, type Comment$1 as Comment, type ExportColumn, type Invoice, type InvoiceItem, InvoiceModel, type Organization, type PaymentInfo, type Project, ProjectModel, type SidebarItem, type SidebarSection, type SupportTicket, SupportTicketModel, type Task, TaskModel, type TicketAttachment, type TicketComment, TicketCommentModel, type TicketFieldColumn, type User, authMiddleware, logger };
