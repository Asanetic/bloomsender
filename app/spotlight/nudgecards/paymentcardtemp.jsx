"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";

export default function PaymentRequestCard() {

  const cardRef = useRef();

  const [form, setForm] = useState({
    clientName: "Tropical Desserts Cafe",
    tel: "0706932793",
    address: "Nyali, Mombasa",
    ref: "TDC/APR/230426/001",
    date: "22 Apr 2026",
    paymentFor: "Web design services balance",
    amount: "KES 9,000",
    dueDate: "23 Apr 2026",
    accountNumber: "TROPICAL DESSERTS",
    paybill: "409 1961"
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

            <div className="elforge_mosy_invoice_v1">
              <div className="elforge_mosy_invoice_card_v1">

                    {/* HEADER */}
                    <div className="elforge_header">
                      <div className="elforge_logo">
                        <img src="/bm/logo/asaneticlogo.png" style={{width:"auto", height:"150px"}}/>
                      </div>

                      <div className="elforge_contact h5 pr-3 pt-4" style={{height:"150px",borderRight:"15px solid #f4b400"}}>
                        +254 710 766 390<br/>
                        www.asanetic.com<br/>
                        jereasanya@gmail.com
                      </div>
                    </div>
                    <hr style={{borderColor:"#f4b400"}}/>
                <div className="elforge_mosy_title_v1 h1">
                  PAYMENT REQUEST
                </div>

                <div className="row m-0 p-0 ">
                  <div className="col-md-6 p-0 m-0 ">
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
                      <div>Ref: {form.ref}</div>
                      <div>Date: {form.date}</div>
                    </div>
                  </div>
                </div>

                <div className="elforge_mosy_box_v1">
                  <strong>Payment for:</strong> {form.paymentFor}
                </div>

                <div className="elforge_mosy_amount_bar_v1">
                  <div>
                    <div>Total amount</div>
                    <div className="elforge_mosy_amount_v1 h1">
                      {form.amount}
                    </div>
                  </div>

                  <div className="">
                    <div>Due Date</div>
                    <div className="h3">{form.dueDate}</div>
                  </div>
                </div>

                <div className="elforge_mosy_mpesa_v1 row justify-content-center m-0 p-0 ">
                  <h5 className="col-md-12">M-PESA PAYBILL</h5>

                  <div className="elforge_mosy_paybill_v1 py-1">
                    {form.paybill.split("").map((d, i) => (
                      <div key={i} className="elforge_mosy_digit_v1 h1">
                        <div className="h1 px-3">{d}</div>
                      </div>
                    ))}
                  </div>
                  <h5 className="col-md-12">ACCOUNT NUMBER</h5>

                  <div className="elforge_mosy_account_v1 h3 py-3 border border-warning my-2 col-md-10">
                    {form.accountNumber}
                  </div>

                </div>
                <div className="elforge_confirm_bar_v1">

                <div className="elforge_confirm_left_v1">
                  ✔
                </div>

                <div>
                  <div className="small">CONFIRMATION SHOULD READ</div>
                  <div className="fw-bold h4">
                    PAID TO: <span className="text-danger">ASANETIC ENTERPRISES</span>
                  </div>
                </div>

                </div>                
                {/* TRUST SIGNALS */}
                <div className="elforge_trust_section_v1">

                  <div className="text-center mb-2 fw-bold">
                    WHY TRUST US
                  </div>

                  <div className="row m-0 text-center">

                    <div className="col-md-4 elforge_trust_item_v1">
                      <div className="elforge_trust_icon_v1">🛡️</div>
                      <div className="fw-bold">TRUST</div>
                      <small>
                        We are a registered business committed to transparency and integrity.
                      </small>
                    </div>

                    <div className="col-md-4 elforge_trust_item_v1 border-start border-end">
                      <div className="elforge_trust_icon_v1">🏅</div>
                      <div className="fw-bold">QUALITY</div>
                      <small>
                        We deliver high quality services that meet and exceed expectations.
                      </small>
                    </div>

                    <div className="col-md-4 elforge_trust_item_v1">
                      <div className="elforge_trust_icon_v1">🎯</div>
                      <div className="fw-bold">RESULTS</div>
                      <small>
                        We focus on delivering measurable results that drive your success.
                      </small>
                    </div>

                  </div>

                </div>
                <div className="elforge_mosy_footer_v1">
                  WE WILL SEND YOU PAYMENT ACKNOWLEDGEMENT AS PROOF OF TRANSACTION 
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}