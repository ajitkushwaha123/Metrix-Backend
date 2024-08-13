import express from "express";
import { Invoice } from "../models/Invoice.model.js";
import ejs from "ejs";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
// import { promisify } from "util";

// Create Invoice

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const invoice = express();

invoice.post("/create", async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Generate PDF
invoice.get("/pdf/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).send("Invoice not found");
    }

    console.log("invoice", invoice);

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

  console.log("invoice", invoice);

  const invoiceData = {
    createdAt: invoice.createdAt,
    restourantLogo : invoice.restourantLogo,
    retourantName: invoice.retourantName,
    customerName: invoice.customerName,
    customerPhone : invoice.customerPhone,
    restourantAddress: invoice.restourantAddress,
    billStatus: invoice.billStatus,
    customerPhone: invoice.customerPhone,
    paymentType: invoice.paymentType,
    orderType: invoice.orderType,
    orderNumber: invoice.orderNumber,
    orderDate : invoice.orderDate,
    orderTime : invoice.orderTime,
    items: invoice.items,
    restourantPhone : invoice.restourantPhone,
    tax: invoice.tax,
  };

  console.log(invoiceData);

  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "../views", "invoice.ejs"),
      invoiceData
    );

    const browser = await puppeteer.launch();
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
