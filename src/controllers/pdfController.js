const pdfSchema= require("../models/pdfModel");

const pdfGetting= async function(req,res) {
    try {
        let pdfGet= await pdfSchema.find({});
        res.status(201).send({status:true, data:pdfGet})
    } catch (err) {
        res.status(500).send({ msg: err.message });
    }
}

module.exports= {pdfGetting}