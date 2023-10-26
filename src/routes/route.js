const express= require("express");
const router= express.Router();
const PdfController= require("../controllers/pdfController");

router.get("/get-pdf", PdfController.pdfGetting);

module.exports= router;