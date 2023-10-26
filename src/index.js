const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const pdf = require('html-pdf');
const route = require("./routes/route.js");
const pdfSchema = require("./models/pdfModel.js");
const pdfTemplate = require('../documents/index.js');
const app = express();
const fs = require('fs');
const path = require('path');

const pdfDirectory = './pdfs';
if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory);
}

mongoose.set("strictQuery", true);

app.use("/files", express.static("files"));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

mongoose.connect("mongodb+srv://SAURABH:Soa4GdK4yRvlVN5i@cluster0.umtgp.mongodb.net/PDF-Task-DB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
})
    .then(() => console.log("MongoDB is connected..."))
    .catch((err) => console.log(err));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./files");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.options('*', cors());

app.post("/upload-pdf", upload.single("file"), async (req, res) => {
    console.log(req.file);
    const title = req.body.title;
    const fileName = req.file.filename;
    try {
        await pdfSchema.create({ title: title, pdf: fileName });
        res.send({ status: "ok" });
    } catch (error) {
        res.json({ status: error });
    }
});

app.post('/create-pdf', (req, res) => {
    const htmlContent = pdfTemplate(req.body);
    const pdfFilePath = `${pdfDirectory}/result.pdf`;

    pdf.create(htmlContent, {}).toFile(pdfFilePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while generating the PDF.');
        } else {
            res.download(pdfFilePath, 'result.pdf', (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('An error occurred while downloading the PDF.');
                }
            });
        }
    });
});

app.get('/fetch-pdf/:filename', (req, res) => {
    const pdfFileName = req.params.filename;
    const pdfFilePath = path.join(__dirname, pdfDirectory, pdfFileName);

    if (fs.existsSync(pdfFilePath)) {
        res.download(pdfFilePath, 'newPdf.pdf');
    } else {
        res.status(404).send('PDF not found');
    }
});

app.use("/", route);

app.listen(process.env.PORT || 3001, function () {
    console.log("Express app running on PORT" + " " + (process.env.PORT || 3001));
});