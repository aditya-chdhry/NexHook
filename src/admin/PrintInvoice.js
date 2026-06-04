import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvoices } from './adminData';
import './PrintInvoice.css';

const numberToWords = (num) => {
  const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

  if ((num = num.toString()).length > 9) return 'overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return; let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim();
};

export default function PrintInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  
  useEffect(() => {
    getInvoices().then(data => {
      const found = data.find(i => i.id === id);
      if (found) setInvoice(found);
    });
  }, [id]);

  if (!invoice) return <div style={{padding: 40}}>Loading invoice...</div>;

  const total = Number(invoice.amount) || 0;
  const base = total / 1.18;
  const igst = total - base;

  return (
    <div className="print-invoice-page">
      <div className="invoice-a4">
        
        {/* HEADER */}
        <div className="inv-header-block">
          <h1 className="inv-title">Invoice</h1>
          
          <div className="inv-top-row">
            <div className="inv-logo-box">
              <svg viewBox="0 0 24 24" fill="#1181C9"><path d="M4 4h4v16H4V4zm12 0h4v16h-4V4z"/><path d="M4 4l16 16v-4L4 4z"/></svg>
              <div className="inv-logo-text">NexHook</div>
            </div>
            
            <div className="inv-company-details">
              <div className="inv-company-name">NexHook Services</div>
              <p className="inv-p">Agra,</p>
              <p className="inv-p">Uttar Pradesh, India - 282007</p>
              <p className="inv-p" style={{marginTop:8}}>Email: <strong>info@nexhook.in</strong></p>
              <p className="inv-p">Phone: <strong>+91 96255 91763</strong></p>
            </div>
            
            <div className="inv-billed-to">
              <h4>Billed To</h4>
              <div className="inv-billed-name">{invoice.client}</div>
              <p className="inv-p">{invoice.email}</p>
            </div>
          </div>
          
          <div className="inv-meta-row">
            <div className="inv-meta-col">
              <h5>Invoice No</h5>
              <p>{invoice.id}</p>
            </div>
            <div className="inv-meta-col">
              <h5>Invoice Date</h5>
              <p>{invoice.date}</p>
            </div>
            <div className="inv-meta-col">
              <h5>Due Date</h5>
              <p>{invoice.dueDate}</p>
            </div>
            <div className="inv-meta-col">
              <h5>Country Of Supply</h5>
              <p>India</p>
            </div>
            <div className="inv-meta-col">
              <h5>Place Of Supply</h5>
              <p>Haryana (06)</p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="inv-body">
          <table className="inv-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th style={{textAlign:'center'}}>GST Rate</th>
                <th style={{textAlign:'center'}}>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>IGST</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1.</td>
                <td>{invoice.items || 'Web Development Services'}</td>
                <td style={{textAlign:'center'}}>18%</td>
                <td style={{textAlign:'center'}}>1</td>
                <td>₹{base.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td>₹{base.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td>₹{igst.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td>₹{total.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
              </tr>
            </tbody>
          </table>

          <div className="inv-bottom">
            <div>
              <h4 className="inv-section-title">Bank Details</h4>
              <div className="inv-bank-row"><span>Account Name</span> <strong>Aditya Singh Chaudhary</strong></div>
              <div className="inv-bank-row"><span>Account Number</span> <strong>3111000100366815</strong></div>
              <div className="inv-bank-row"><span>IFSC</span> <strong>PUNB0311100</strong></div>
              <div className="inv-bank-row"><span>Account Type</span> <strong>Savings</strong></div>
              <div className="inv-bank-row"><span>Bank</span> <strong>Punjab National Bank</strong></div>
            </div>

            <div className="inv-qr">
              <h4 className="inv-section-title" style={{textAlign:'center'}}>Scan to Pay via UPI</h4>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=8533904534@ptsbi&pn=Aditya&am=${total}&cu=INR`} alt="UPI QR" />
              <p>Maximum of 1 lakh can be transferred<br/>via upi in a single day</p>
              <strong style={{fontSize:'0.85rem'}}>8533904534@ptsbi</strong>
            </div>

            <div>
              <div className="inv-summary-row"><span>Amount</span> <strong>₹{base.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</strong></div>
              <div className="inv-summary-row"><span>IGST</span> <strong>₹{igst.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</strong></div>
              <div className="inv-summary-row"><span>Discounts</span> <strong>₹0.00</strong></div>
              
              <div className="inv-total-box">
                <span>Total (INR)</span>
                <span>₹{total.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
              </div>

              <div className="inv-words">
                <h5>TOTAL (IN WORDS) :</h5>
                <p>{numberToWords(Math.floor(total))} Rupees Only</p>
              </div>

              <div className="inv-signature">
                <div className="inv-sign-img">Aditya Chaudhary</div>
                <p>Authorised Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="print-controls">
        <button className="back-btn" onClick={() => navigate('/admin/invoices')}>← Back</button>
        <button className="print-btn" onClick={() => window.print()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print / Download PDF
        </button>
      </div>
    </div>
  );
}
