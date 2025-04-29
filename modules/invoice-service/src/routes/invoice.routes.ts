import {
  getAuthMiddleware,
  InvoiceModel,
  logger,
  InvoiceBuilder,
  Client,
  Project,
} from 'indiedesk-common-lib';
import { Router, type Request, type Response } from 'express';

export const invoiceRouter = Router();
const jwtSecret = process.env.JWT_SECRET || 'supersecret';

invoiceRouter.post('', getAuthMiddleware(jwtSecret), async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const invoice = {
    ...req.body?.data,
    owner: username,
    generatedBy: username,
  };

  if (!invoice?.client || !invoice?.project) {
    logger.error('Client and Project are required');
    res.status(400).json({ message: 'Client and Project are required' });
    return;
  }

  const savedInvoice = await InvoiceModel.create(invoice);

  const fetchInvoice = await InvoiceModel.findById(savedInvoice._id)
    .populate({
      path: 'client',
      localField: 'client',
      foreignField: 'id',
    })
    .populate({
      path: 'project',
      localField: 'project',
      foreignField: 'id',
    });

  if (!fetchInvoice) {
    logger.error('Invoice not found');
    res.status(404).json({ message: 'Invoice not found' });
    return;
  }

  const invoiceGenerator = new InvoiceBuilder(
    fetchInvoice.toObject(),
    fetchInvoice.client as unknown as Client,
    fetchInvoice.project as unknown as Project,
    fetchInvoice.discount ?? 0,
    {
      name: 'Indie Desk',
      address: '123 Indie St, Indie City, IN 12345',
      phone: '+1 234 567 8900',
      email: 'contact@indiedesk.co',
      city: 'Indie City',
      state: 'IN',
      website: 'https://indiedesk.com',
      zip: '12345',
    },
  );

  const outputPath = `${__dirname}/../invoices/${savedInvoice.id}.pdf`;
  await invoiceGenerator.generate(outputPath);
  logger.info(`Invoice ${savedInvoice.id} created successfully`);
  res.status(201).json({ message: 'ok', data: savedInvoice });
  return;
});

invoiceRouter.get('', getAuthMiddleware(jwtSecret), async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const invoices = await InvoiceModel.find({ owner: username })
    .populate({
      path: 'client',
      localField: 'client',
      foreignField: 'id',
    })
    .populate({
      path: 'project',
      localField: 'project',
      foreignField: 'id',
    });
  res.status(200).json({ message: 'ok', data: invoices });
  return;
});

invoiceRouter.get('/:id', getAuthMiddleware(jwtSecret), async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  const invoice = await InvoiceModel.findOne({ id, owner: username })
    .populate({
      path: 'client',
      localField: 'client',
      foreignField: 'id',
    })
    .populate({
      path: 'project',
      localField: 'project',
      foreignField: 'id',
    });
  if (!invoice) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  res.status(200).json({ message: 'ok', data: invoice });
  return;
});

invoiceRouter.patch('/:id', getAuthMiddleware(jwtSecret), async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  try {
    const updatedInvoice = await InvoiceModel.findOneAndUpdate(
      { id, owner: username },
      { $set: req.body?.data },
      { new: true, runValidators: true },
    )
      .populate({
        path: 'client',
        localField: 'client',
        foreignField: 'id',
      })
      .populate({
        path: 'project',
        localField: 'project',
        foreignField: 'id',
      });
    if (!updatedInvoice) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const invoiceGenerator = new InvoiceBuilder(
      updatedInvoice.toObject(),
      updatedInvoice.client as unknown as Client,
      updatedInvoice.project as unknown as Project,
      updatedInvoice.discount,
      {
        name: 'Indie Desk',
        address: '123 Indie St, Indie City, IN 12345',
        phone: '+1 234 567 8900',
        email: 'contact@indiedesk.com',
        city: 'Indie City',
        state: 'IN',
        website: 'https://indiedesk.com',
        zip: '12345',
      },
    );
    const outputPath = `${__dirname}/../invoices/${updatedInvoice.id}.pdf`;
    await invoiceGenerator.generate(outputPath);
    logger.info(`Invoice ${updatedInvoice.id} updated successfully`);
    res.status(200).json({ message: 'ok', data: updatedInvoice });
  } catch (error) {
    logger.error(`Error updating invoice: ${error}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

invoiceRouter.get('/:id/pdf', getAuthMiddleware(jwtSecret), async (req: Request, res: Response) => {
  const username = req?.user?.sub;
  const id = req.params.id;
  const invoice = await InvoiceModel.findOne({ id, owner: username });
  if (!invoice) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  const invoicePath = `${__dirname}/../invoices/${id}.pdf`;
  res.download(invoicePath, `invoice-${id}.pdf`);
  return;
});
