"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";

export default function PaymentAckCard() {

  const cardRef = useRef();

  const [form, setForm] = useState({
    clientName: "Tropical Desserts Cafe",
    tel: "0706932793",
    address: "Nyali, Mombasa",
    ref: "UD22PBMT12",
    paymentFor: "Web design services balance",
  
    amountPaid: "KES 10,000",
    datePaid: "April 2nd 2026",
    balance: "KES 9,000",
  
    paymentMode: "Mobile Money",
  
    companyTel: "0710766390",
    companyEmail: "jereasanya@gmail.com",
    companyWebsite: "www.asanetic.com"
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function downloadImage() {
    if (!cardRef.current) return;
    toPng(cardRef.current, {
      cacheBust: true,
      useCORS: true,
      skipFonts: true,
      pixelRatio: 2, 
    })
 
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `payment-${form.clientName}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Image generation failed:", err);
      });
  }

  return (
    <div className="container-fluid">

      <div className="row">

        {/* LEFT → FORM */}
        <div className="col-md-4 p-3 border-end">

          <h5>Edit Card</h5>

          {Object.keys(form).map((key) => (
            <div className="mb-2" key={key}>
              <input
                type="text"
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="form-control"
                placeholder={key}
              />
            </div>
          ))}

          {/* 🔥 DOWNLOAD BUTTON */}
          <button
            className="btn btn-dark w-100 mt-3"
            onClick={downloadImage}
          >
            Download PNG
          </button>

        </div>
        {/* RIGHT → CARD */}
        <div className="col-md-8  row justify-content-center">

          {/* 👇 ONLY THIS gets exported */}
          <div ref={cardRef} className="col-md-12 p-0 m-0">

        {/* RIGHT → CARD */}
        <div className="elforge_mosy_invoice_v1">
  <div className="elforge_mosy_invoice_card_v1">

    {/* HEADER */}
    <div className="elforge_header">
      <div className="elforge_logo">
        <img src="/bm/logo/asaneticlogo.png" style={{height:"120px"}}/>
      </div>

      <div className="elforge_contact h5 pr-3 pt-4" style={{borderRight:"15px solid #f4b400"}}>
        {form.companyTel}<br/>
        {form.companyWebsite}<br/>
        {form.companyEmail}
      </div>
    </div>

    <hr style={{borderColor:"#f4b400"}}/>

    {/* TITLE */}
    <div className="elforge_mosy_title_v1 h1">
      PAYMENT ACKNOWLEDGEMENT
    </div>

    {/* BILL + INVOICE */}
    <div className="row m-0 p-0">
      <div className="col-md-6 p-0">
        <div className="elforge_mosy_box_v1">
          <h5>BILL TO</h5>
          <div>Name: {form.clientName}</div>
          <div>Tel: {form.tel}</div>
          <div>Address: {form.address}</div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="elforge_mosy_box_v1">
          <h5>INVOICE DETAILS</h5>
          <div>Ref No: {form.ref}</div>
        </div>
      </div>
    </div>

    {/* PAYMENT FOR */}
    <div className="elforge_mosy_box_v1">
      <strong>PAYMENT FOR:</strong> {form.paymentFor}
    </div>

    {/* AMOUNT PAID */}
    <div className="elforge_ack_amount_bar_v1">
      <div>
        <div>AMOUNT PAID</div>
        <div className="elforge_ack_amount_v1">
          {form.amountPaid}
        </div>
      </div>

      <div>
        <div>DATE PAID</div>
        <div className="elforge_ack_amount_v1">
          {form.datePaid}
        </div>
      </div>
    </div>

    {/* BALANCE + MESSAGE */}
    <div className="elforge_balance_box_v1">
      <div className="elforge_balance_left_v1">
        <div className="h5">BALANCE</div>
        <div className="elforge_balance_amount_v1">
          {form.balance}
        </div>
      </div>

      <div className="elforge_balance_right_v1">
        <div className="fw-bold">Thank you for your business.</div>
        <small>
          We appreciate your trust and look forward to serving you again.
        </small>
      </div>
    </div>

    {/* PAYMENT MODE */}
    <div className="elforge_mosy_box_v1">
      <strong>PAYMENT MODE:</strong> {form.paymentMode}
    </div>

    {/* CONTACT ROW */}
    <div className="row m-0">
      <div className="col-md-6 elforge_contact_box_v1">
        EMAIL<br/>
        {form.companyEmail}
      </div>

      <div className="col-md-6 elforge_contact_box_v1">
        MOBILE<br/>
        {form.companyTel}
      </div>
    </div>

    {/* FOOTER STRIP */}
    <div className="elforge_ack_footer_v1">
      Thank you for choosing Asanetic Digital. <br/>
      <small>We value your trust and look forward to working with you.</small>
    </div>

  </div>
</div>
</div>
    </div>
      </div>

    </div>
  );
}