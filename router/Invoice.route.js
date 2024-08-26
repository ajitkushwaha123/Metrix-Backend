import express from "express";
import { Invoice } from "../models/Invoice.model.js";
import ejs from "ejs";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import Auth from "../middleware/auth.js";

// Create Invoice

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const invoice = express();

invoice.post("/create" , Auth, async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
});

invoice.put("/edit/:id", Auth, async (req, res) => {
  const { userId } = req.user;
  // console.log("userId", userId);

  const invoiceId = req.params.id;

  let updatedInvoice = await Invoice.findOneAndUpdate(
    { _id: invoiceId },
    { $set: req.body },
    { new: true }
  );

  res.status(200).json({ invoice: updatedInvoice });
});


// Generate PDF
invoice.get("/pdf/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).send("Invoice not found");
    }

    // console.log("invoice", invoice);

    // const data = {
    //   createdAt: invoice.createdAt,
    //   retourantName: invoice.retourantName,
    //   clientName: invoice.clientName,
    //   clientAddress: invoice.clientAddress,
    //   billStatus: invoice.billStatus,
    //   clientPhone: invoice.clientPhone,
    //   totalAmount: invoice.totalAmount,
    //   tax: invoice.tax,
    //   items: invoice.items,
    // };

    ejs.renderFile("./templates/invoice.ejs", invoice, async (err, html) => {
      if (err) {
        console.error("Error rendering EJS template:", err);
        return res.status(500).send(err);
      }

      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({ format: "A4" });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.send(pdfBuffer);
      } catch (pdfError) {
        console.error("Error generating PDF:", pdfError);
        res.status(500).send(pdfError);
      }
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).send(error);
  }
});

invoice.get("/invoice/:id", async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return res.status(404).send("Invoice not found");
  }

  // console.log("invoice", invoice);

  const invoiceData = {
    createdAt: invoice.createdAt,
    restourantLogo:
      invoice.restourantLogo ||
      "data:image/svg+xml,%3csvg%20class='css-ze2te4%20css-qd6ojx'%20viewBox='0%200%20100%2087.4823698039547'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20transform='translate(-2.89139620338093,%20-8.991537183074797)%20scale(0.35260930129705087)'%20class='css-1e98oqk'%20fill='%23ffffff'%3e%3cg%3e%3cpath%20d='M64.3,132.1l78.8,136.5c1.2,2.2-0.3,5-2.9,5H83.6c-3.2,0-6.1-1.7-7.8-4.5L9.4,154c-1.6-2.7-1.6-6.2,0-8.9L26.8,115h0.1%20l21.5-37.2h-0.1l15.9-27.5c13.1-22.6,45.5-24,59.8-2.2c0.3,0.5,0.6,0.9,0.9,1.4l85.5,148c0.1,0.1,0.2,0.2,0.2,0.3%20c10.2,17.4,35.3,17.1,45.4-0.3l7.7-13.3c-11.6-0.6-22.1-6.9-27.9-17.1L157,30.5c-1.2-2.2,0.3-5,2.9-5h56.5c3.2,0,6.1,1.7,7.8,4.5%20l66.4,115c1.6,2.7,1.6,6.2,0,8.9l-7.7,13.3L243.8,235l-8.4,14.5c-13.1,22.6-45.7,23.6-59.5,1.4c-0.2-0.4-0.6-0.9-0.8-1.3l-85.5-148%20c-0.1-0.1-0.2-0.2-0.2-0.3c-10.2-17.3-35.3-17-45.3,0.3L36.3,115C48,115.6,58.5,122,64.3,132.1z'%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/svg%3e",
    restourantName: invoice.restourantName,
    customerName: invoice.customerName,
    customerPhone: invoice.customerPhone,
    restourantAddress: invoice.restourantAddress,
    billStatus: invoice.billStatus,
    paymentType: invoice.paymentType,
    orderType: invoice.orderType,
    orderNumber: invoice.orderNumber,
    orderDate: invoice.orderDate,
    orderTime: invoice.orderTime,
    items: invoice.items,
    restourantPhone: invoice.restourantPhone,
    tax: invoice.tax,
    discount: invoice.discount,
  };

  // console.log(invoiceData);

  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "../views", "invoice.ejs"),
      invoiceData
    );

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Get the height of the content
    const contentHeight = await page.evaluate(() => {
      return document.documentElement.scrollHeight;
    });

    const todayDate = new Date();
    const pdfPath = path.join(
      __dirname,
      "../public/Bill",
      `${todayDate.getTime()}.pdf`
    );

    await page.pdf({
      path: pdfPath,
      width: "4in",
      height: `${contentHeight + 30}px`, 
      printBackground: true,
      margin: { top: "10px", right: "10px", bottom: "10px", left: "10px" }, // Reduced margins
      scale: 1, 
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdfPath.length,
    });

    res.sendFile(pdfPath);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

invoice.get("/kot/:id", async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return res.status(404).send("Invoice not found");
  }

  // console.log("invoice", invoice);

  const invoiceData = {
    createdAt: invoice.createdAt,
    restourantLogo:
      invoice.restourantLogo ||
      "data:image/svg+xml,%3csvg%20class='css-ze2te4%20css-qd6ojx'%20viewBox='0%200%20100%2087.4823698039547'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20transform='translate(-2.89139620338093,%20-8.991537183074797)%20scale(0.35260930129705087)'%20class='css-1e98oqk'%20fill='%23ffffff'%3e%3cg%3e%3cpath%20d='M64.3,132.1l78.8,136.5c1.2,2.2-0.3,5-2.9,5H83.6c-3.2,0-6.1-1.7-7.8-4.5L9.4,154c-1.6-2.7-1.6-6.2,0-8.9L26.8,115h0.1%20l21.5-37.2h-0.1l15.9-27.5c13.1-22.6,45.5-24,59.8-2.2c0.3,0.5,0.6,0.9,0.9,1.4l85.5,148c0.1,0.1,0.2,0.2,0.2,0.3%20c10.2,17.4,35.3,17.1,45.4-0.3l7.7-13.3c-11.6-0.6-22.1-6.9-27.9-17.1L157,30.5c-1.2-2.2,0.3-5,2.9-5h56.5c3.2,0,6.1,1.7,7.8,4.5%20l66.4,115c1.6,2.7,1.6,6.2,0,8.9l-7.7,13.3L243.8,235l-8.4,14.5c-13.1,22.6-45.7,23.6-59.5,1.4c-0.2-0.4-0.6-0.9-0.8-1.3l-85.5-148%20c-0.1-0.1-0.2-0.2-0.2-0.3c-10.2-17.3-35.3-17-45.3,0.3L36.3,115C48,115.6,58.5,122,64.3,132.1z'%3e%3c/path%3e%3c/g%3e%3c/g%3e%3c/svg%3e",
    restourantName: invoice.restourantName,
    restourantAddress: invoice.restourantAddress,
    orderDate: invoice.orderDate,
    orderTime: invoice.orderTime,
    items: invoice.items,
    restourantPhone: invoice.restourantPhone,
    tax: invoice.tax,
    discount: invoice.discount,
  };

  // console.log(invoiceData);

  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "../views", "kot.ejs"),
      invoiceData
    );

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Get the height of the content
    const contentHeight = await page.evaluate(() => {
      return document.documentElement.scrollHeight;
    });

    const todayDate = new Date();
    const pdfPath = path.join(
      __dirname,
      "../public/Kot",
      `${todayDate.getTime()}.pdf`
    );

    await page.pdf({
      path: pdfPath,
      width: "4in",
      height: `${contentHeight}px`, // Adjusted to match content height
      printBackground: true,
      margin: { top: "10px", right: "10px", bottom: "10px", left: "10px" }, // Reduced margins
      scale: 1, // Slightly scale down the content
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdfPath.length,
    });

    res.sendFile(pdfPath);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});


export default invoice;
