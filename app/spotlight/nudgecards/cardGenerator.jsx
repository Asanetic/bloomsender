"use client";

import { toPng } from "html-to-image";
import { useRef, useState } from "react";

export default function NudgeCardProfile() {
  const cardRef = useRef();

  const [form, setForm] = useState({
    client: "Trufinds Kargo",
    amount: "KES 17,000",
    message: "Payment received successfully",
    date: "April 27, 2026"
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function downloadImage() {
    if (!cardRef.current) return;

    toPng(cardRef.current, {
        cacheBust: true,
        useCORS: true,
        skipFonts: true
      })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "nudge-card.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Image generation failed:", err);
      });
  }

  return (
    <div className="row m-0 p-3">

      {/* LEFT - FORM */}
      <div className="col-md-4">
        <div className="card p-3 shadow-sm">

          <h5 className="mb-3">Card Details</h5>

          <input
            className="form-control mb-2"
            name="client"
            value={form.client}
            onChange={handleChange}
            placeholder="Client Name"
          />

          <input
            className="form-control mb-2"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
          />

          <input
            className="form-control mb-2"
            name="date"
            value={form.date}
            onChange={handleChange}
            placeholder="Date"
          />

          <textarea
            className="form-control mb-3"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
          />

          <button
            onClick={downloadImage}
            className="btn btn-dark w-100"
          >
            Download Card
          </button>

        </div>
      </div>

      {/* RIGHT - CARD PREVIEW */}
      <div className="col-md-8 d-flex justify-content-center align-items-center">

        <div
          ref={cardRef}
          style={{
            width: "600px",
            background: "#fff",
            padding: "0px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          }}
        >

<div className="elforge_card">

  {/* HEADER */}
  <div className="elforge_header">
    <div className="elforge_logo">
      Asan<span>etic</span>
    </div>

    <div className="elforge_contact">
      +254 704 881127<br/>
      www.asanetic.com<br/>
      jereasanya@gmail.com
    </div>
  </div>

  {/* TITLE */}
  <div className="elforge_title">
    PAYMENT REQUEST
  </div>

  {/* INFO SECTION */}
  <div className="elforge_section">

    <div className="elforge_box">
      <div className="elforge_label">BILL TO</div>
      Name: Trufinds Kargo<br/>
      Tel: +254 704 881127<br/>
      Address: Nairobi, Kenya
    </div>

    <div className="elforge_box">
      <div className="elforge_label">INVOICE DETAILS</div>
      Ref: TFK/230426/001<br/>
      Date: 22 Apr 2025
    </div>

  </div>

  {/* PAYMENT FOR */}
  <div className="elforge_box" style={{marginTop: "20px"}}>
    <strong>Payment for:</strong><br/>
    First installment payment for premium web design
  </div>

  {/* HIGHLIGHT */}
  <div className="elforge_highlight">
    <div>
      <div>Total Amount</div>
      <div className="elforge_amount">KES 17,000</div>
    </div>

    <div>
      <div>Date Due</div>
      <div className="elforge_amount">24 Apr 2026</div>
    </div>
  </div>

  {/* FOOTER */}
  <div className="elforge_footer">

    <div className="elforge_smallbox">
      Mpesa Paybill<br/>
      4091961<br/>
      trufindkargo.com
    </div>

    <div className="elforge_smallbox">
      Confirm payment to<br/>
      Asanetic Enterprises
    </div>

  </div>

</div>

        </div>

      </div>

    </div>
  );
}