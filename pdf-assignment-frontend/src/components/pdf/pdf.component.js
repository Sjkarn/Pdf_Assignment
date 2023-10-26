import { useEffect, useState } from "react";
import './pdf.component.css';
import axios from "axios";
import { pdfjs } from "react-pdf";
import { PdfViewComp } from "../pdfview/pdfview.component";
import PdfGenerate from "../pdfgenerate/pdfgenerate.component";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();

export function PdfComponent () {
    const [theme, setTheme] = useState("");
    const [title, setTitle] = useState("");
    const [file, setFile] = useState("");
    const [allImage, setAllImage] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    
    const getPdf = async () => {
        try {
            const result = await axios.get('http://localhost:3001/get-pdf');
            console.log(result.data.data);
            setAllImage(result.data.data);
        } catch (error) {
            console.error('Error fetching PDF:', error);
        }
    };
    useEffect(() => {
        getPdf();
    }, []);
    
    const submitImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);
        try {
            const result = await axios.post('http://localhost:3001/upload-pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(result);
            if (result.data.status === 'ok') {
                alert('Uploaded Successfully!!!');
            }
        } catch (error) {
            console.error('Error uploading PDF:', error);
        }
    };
    
    function handleThemeChange(e) {
        if(e.target.checked) {
            setTheme('dark-theme');
        }else {
            setTheme('');
        }
    }
    
    function handleTitleChange(e) {
        setTitle(e.target.value);
    }
    
    function handleFileChange(e) {
        setFile(e.target.files[0]);
    }

    const showPdf = (pdf) => {
        window.open(`http://localhost:3001/files/${pdf}`, "_blank", "noreferrer");
        // const pdfUrl = `http://localhost:3001/files/${pdf}`;
        // setPdfFile(pdfUrl);
      };
      

    return (
        <div className="pdf">
            <form className={theme} id="formStyle" onSubmit={submitImage}>
                <div className="form-switch">
                    <input type="checkbox" onChange={handleThemeChange} className="form-check-input" /> Dark Mode
                </div>
                <h4 className="bi bi-file-earmark-pdf mt-2"> Upload pdf in React</h4>
                <br />
                <input type="text" className="form-control" placeholder="Title" required onChange={handleTitleChange} />
                <br />
                <input type="file" className="form-control" accept="application/pdf" required onChange={handleFileChange} />
                <br />
                <button className="btn btn-dark" type="submit">Submit</button>
            </form>
            <div className="uploaded">
                <h4 className="upload">Upload PDF:</h4>
                <div className="output-div d-flex mt-3">
                    {allImage==null?"":allImage.map((data) => {
                        return (
                            <div key={data.title} className="inner-div ms-5 bi-file-earmark-pdf-fill">
                        <h6 className="title">Title: {data.title}</h6>
                        <button className="button" onClick={()=>showPdf(data.pdf)}>Show Pdf</button>
                    </div>
                        )
                    })}
                </div>
            </div>
            <PdfViewComp pdfFile={pdfFile || null}/>
            <PdfGenerate />
        </div>
    )
}