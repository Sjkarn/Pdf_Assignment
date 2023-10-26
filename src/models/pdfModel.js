const mongoose= require("mongoose");

const pdfDetailsSchema= new mongoose.Schema ({
    pdf: String,
    title: String
},{ timestamps: true });

module.exports = mongoose.model("pdfDetails", pdfDetailsSchema);