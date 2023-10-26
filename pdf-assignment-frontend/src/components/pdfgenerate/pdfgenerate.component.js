import React, { Component } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

import './pdfgenerate.component.css';

class PdfGenerate extends Component {
  state = {
    name: '',
    receiptId: 0,
    price1: 0,
    price2: 0,
  }

  handleChange = ({ target: { value, name }}) => this.setState({ [name]: value })

  createAndDownloadPdf = () => {
    axios
      .post('/create-pdf', this.state)
      .then(() => axios.get('/fetch-pdf/newPdf.pdf', { responseType: 'blob' }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
  
        saveAs(pdfBlob, 'newPdf.pdf');
      })
      .catch((error) => {
        console.error('Error creating or downloading the PDF:', error);
      });
  };

  render() {
    return (
      <div className="Pdf">
        <input type="text" placeholder="Name" name="name" onChange={this.handleChange}/>
        <input type="number" placeholder="Receipt ID" name="receiptId" onChange={this.handleChange} />
        <input type="number" placeholder="Price 1" name="price1" onChange={this.handleChange} />
        <input type="number" placeholder="Price 2" name="price2" onChange={this.handleChange} />
        <button onClick={this.createAndDownloadPdf}>Download PDF</button>
      </div>
    );
  }
}

export default PdfGenerate;