import fs from 'fs';

import PDFDocument from 'pdfkit';

import { Client, CompanyInfo, Invoice, Project } from '@common/interfaces';

import { logger } from './logger';

export class InvoiceBuilder {
  private invoice: Invoice;
  private client: Client;
  private project: Project;
  private doc: typeof PDFDocument;
  private discount: number;
  private companyInfo: CompanyInfo;

  constructor(
    invoice: Invoice,
    client: Client,
    project: Project,
    discount: number,
    companyInfo: CompanyInfo,
  ) {
    this.invoice = invoice;
    this.client = client;
    this.project = project;
    this.doc = new PDFDocument({ margin: 50 });
    this.discount = discount;
    this.companyInfo = companyInfo;
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  private calcSubTotal(): number {
    return this.invoice.items.reduce((sum, item) => {
      return sum + item.hours * this.project.perHourRate.amount;
    }, 0);
  }

  async generate(outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const stream = fs.createWriteStream(outputPath);
        this.doc.pipe(stream);

        this.addHeader();
        this.addInvoiceInfo();
        this.addClientInfo();
        this.addItemsTable();
        this.addTotals();
        this.addPaymentInfo();
        this.addFooter();

        this.doc.end();

        stream.on('finish', () => {
          resolve();
        });

        stream.on('error', (err) => {
          reject(err);
        });
      } catch (error) {
        logger.error(`Error generating PDF invoice: ${error}`);
        reject(error);
      }
    });
  }

  private addHeader(): void {
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(this.companyInfo.name, 400, 50, { align: 'right' })
      .font('Helvetica')
      .text(this.companyInfo.address, { align: 'right' })
      .text(this.companyInfo.email, { align: 'right' })
      .text(this.companyInfo.phone, { align: 'right' });

    this.doc
      .moveDown(1)
      .strokeColor('#aaa')
      .lineWidth(1)
      .moveTo(50, this.doc.y)
      .lineTo(550, this.doc.y)
      .stroke();
  }

  private addInvoiceInfo(): void {
    const formattedDate = this.formatDate(this.invoice.date);
    let formattedDueDate = '';
    if (this.invoice.dueDate) {
      formattedDueDate = this.formatDate(this.invoice.dueDate);
    }

    this.doc
      .moveDown(1)
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('INVOICE', 50, undefined)
      .moveDown(0.5)
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(`Invoice Number: `, 50, undefined, { continued: true })
      .font('Helvetica')
      .text(this.invoice.id)
      .font('Helvetica-Bold')
      .text(`Project: `, { continued: true })
      .font('Helvetica')
      .text(this.project.name)
      .font('Helvetica-Bold')
      .text(`Date: `, { continued: true })
      .font('Helvetica')
      .text(formattedDate)
      .font('Helvetica-Bold')
      .text(`Due Date: `, { continued: true })
      .font('Helvetica')
      .text(formattedDueDate)
      .font('Helvetica-Bold')
      .text(`Status: `, { continued: true })
      .font('Helvetica')
      .text(this.invoice.status);

    this.doc.moveDown(1);
  }

  private addClientInfo(): void {
    this.doc
      .font('Helvetica-Bold')
      .text('Bill To:', 50, undefined)
      .font('Helvetica')
      .text(this.client.name)
      .text(this.client.address)
      .text(this.client.email);

    if (this.client.phone) {
      this.doc.text(this.client.phone);
    }

    this.doc.moveDown(1);
  }

  private addItemsTable(): void {
    const tableTop = this.doc.y + 10;
    const serialNoX = 50;
    const descriptionX = 100;
    const hoursX = 400;
    const rateX = 450;
    const amountX = 500;

    this.doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('#', serialNoX, tableTop)
      .text('Description', descriptionX, tableTop)
      .text('Hours', hoursX, tableTop, { width: 50, align: 'right' })
      .text('Rate', rateX, tableTop, { width: 50, align: 'right' })
      .text('Amount', amountX, tableTop, { width: 50, align: 'right' });

    this.doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(serialNoX, tableTop + 20)
      .lineTo(amountX + 50, tableTop + 20)
      .stroke();

    let y = tableTop + 30;
    let itemNumber = 1;

    this.invoice.items.forEach((item) => {
      const perHourRate = this.project.perHourRate.amount;
      const perHourRateCurrency = this.project.perHourRate.currency;

      const amount = item.hours * perHourRate;

      this.doc
        .font('Helvetica')
        .fontSize(10)
        .text(itemNumber.toString(), serialNoX, y)
        .text(item.description, descriptionX, y)
        .text(item.hours.toString(), hoursX, y, { width: 50, align: 'right' })
        .text(`${perHourRateCurrency}${perHourRate}`, rateX, y, { width: 50, align: 'right' })
        .text(`${perHourRateCurrency}${amount.toFixed(2)}`, amountX, y, {
          width: 50,
          align: 'right',
        });
      y += this.doc.heightOfString(item.description, { width: 300 }) + 10;
      itemNumber++;
    });

    this.doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(serialNoX, y)
      .lineTo(amountX + 50, y)
      .stroke();

    this.doc.y = y + 10;
  }

  private addTotals(): void {
    const subtotal = this.calcSubTotal();
    const taxRate = 0.18; // 18% GST
    const tax = subtotal * taxRate;
    const discountAmount = (this.discount / 100) * subtotal;
    const total = subtotal + tax - discountAmount;

    const totalX = 450;
    let y = this.doc.y + 10;

    this.doc
      .font('Helvetica')
      .fontSize(10)
      .text('Subtotal:', 350, y, { width: 100, align: 'right' })
      .text(`${this.project.perHourRate.currency} ${subtotal.toFixed(2)}`, totalX, y, {
        width: 100,
        align: 'right',
      });

    y += 20;

    this.doc
      .font('Helvetica')
      .text(`Tax (${taxRate * 100}%):`, 350, y, { width: 100, align: 'right' })
      .text(`${this.project.perHourRate.currency} ${tax.toFixed(2)}`, totalX, y, {
        width: 100,
        align: 'right',
      });
    y += 20;

    this.doc
      .text(`Discount (${this.discount}%):`, 350, y, { width: 100, align: 'right' })
      .text(`-${this.project.perHourRate.currency} ${discountAmount.toFixed(2)}`, totalX, y, {
        width: 100,
        align: 'right',
      });

    y += 20;

    this.doc
      .font('Helvetica-Bold')
      .text('Total:', 350, y, { width: 100, align: 'right' })
      .text(`${this.project.perHourRate.currency} ${total.toFixed(2)}`, totalX, y, {
        width: 100,
        align: 'right',
      });
  }

  private addPaymentInfo(): void {
    this.doc.moveDown(1);

    if (
      this.invoice.status === 'PAID' &&
      this.invoice.paymentInfo &&
      this.invoice.paymentInfo.amount
    ) {
      const paymentInfo = this.invoice.paymentInfo;

      this.doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Payment Information:', 50, undefined, { underline: true, align: 'left' })
        .moveDown(0.5);

      switch (paymentInfo.method) {
        case 'card':
          this.doc
            .fontSize(12)
            .text(`Payment Method: Card`)
            .text(`Card Type: ${paymentInfo.cardType}`)
            .text(`Last 4 Digits: ${paymentInfo.lastFourDigits}`);
          break;
        case 'cheque':
          this.doc
            .fontSize(12)
            .text(`Payment Method: Cheque`)
            .text(`Bank Name: ${paymentInfo.bankName}`)
            .text(`Cheque Number: ${paymentInfo.chequeNumber}`);
          break;
        case 'cash':
          this.doc.fontSize(12).text(`Cash Payment`);
          break;
        case 'upi':
          this.doc.fontSize(12).text(`Payment Method: UPI`).text(`UPI ID: ${paymentInfo.upiId}`);
          break;
        case 'bank':
          this.doc
            .fontSize(12)
            .text(`Payment Method: Bank Transfer`)
            .text(`Bank Name: ${paymentInfo.bankName}`);
          break;
        default:
          break;
      }

      // Format date if it's a Date object
      const paymentDate =
        paymentInfo.date instanceof Date ? this.formatDate(paymentInfo.date) : paymentInfo.date;

      this.doc
        .text(`Transaction ID: ${paymentInfo.transactionId}`)
        .text(`Date: ${paymentDate}`)
        .text(`Amount: ${paymentInfo?.amount?.currency} ${paymentInfo?.amount?.amount}`);
    } else {
      if (this.invoice.dueDate)
        this.doc
          .fontSize(12)
          .text(`Payment is due on ${this.formatDate(this.invoice.dueDate)}`, { align: 'center' });
    }

    this.doc.moveDown(1);
  }

  private addFooter(): void {
    const footerTop = this.doc.page.height - 150;

    this.doc
      .font('Helvetica')
      .fontSize(10)
      .text('Thank you for your business!', 50, footerTop, { align: 'center' });
  }
}
