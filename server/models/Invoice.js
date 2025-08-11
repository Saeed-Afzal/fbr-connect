// models/Invoice.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  HSCode: String,
  rate: Number,
  UOM: String,
  quantity: Number,
  sroScheduleNo: String,
  sroItemSerialNo: String,
});

const invoiceSchema = new mongoose.Schema(
  {
    InvType: String,
    InvDate: Date,
    InvNo: String,
    CompanyNTN: String,
    CompanyName: String,
    CompanyAddress: String,
    CompanyProvince: String,
    CustName: String,
    CustNTN: String,
    CustAddress: String,
    CustProvince: String,
    CustStatus: {
      type: String,
      enum: ["Registered", "Not Registered"],
    },
    SaleType: String,
    items: [itemSchema],

    // 👇 user who submitted the invoice
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
