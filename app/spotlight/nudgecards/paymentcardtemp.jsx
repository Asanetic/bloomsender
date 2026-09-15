"use client";

import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";

export default function PaymentRequestCard() {

  const cardRef = useRef();

  const [itemsTitle, setItemsTitle] = useState("Payment For : ");
  const [subtitle, setSubTitle] = useState("ITEMS INCLUDED");
  const [footnote, setFootnote] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceList, setInvoiceList] = useState([]);

  
  const [form, setForm] = useState({
    clientName: "Tropical Desserts Cafe",
    tel: "0706932793",
    address: "Nyali, Mombasa",
    ref: "TDC/APR/230426/001",
    date: "22 Apr 2026",
    amountLabel: "Total amount",
    amount: "KES 9,000",
    dueDateLabel: "Due Date",
    dueDate: "23 Apr 2026",
    accountNumber: "TROPICAL DESSERTS",
    paybill: "409 1961"
  });
  
  const [items, setItems] = useState([
    {
      description: "Website Design & Development",
      amount: "KES 9,000"
    }
  ]);
  
  function getInvoices() {
    return JSON.parse(
      localStorage.getItem("payment_requests") || "{}"
    );
  }
  
  function saveInvoice(
    nextForm,
    nextItems,
    nextItemsTitle,
    nextSubtitle,
    nextFootnote
  ) {
  
    if (!nextForm.ref) return;
  
    const invoices = getInvoices();
  
    invoices[nextForm.ref] = {
      form: nextForm,
      items: nextItems,
      itemsTitle: nextItemsTitle,
      subtitle: nextSubtitle,
      footnote: nextFootnote,
      clientName: nextForm.clientName,
      updatedAt: Date.now()
    };
  
    localStorage.setItem(
      "payment_requests",
      JSON.stringify(invoices)
    );
  }
  

  useEffect(function(){

    refreshInvoiceList();
  
  }, []);

  const filteredInvoices = invoiceList.filter(function(item){

    const q = searchTerm.toLowerCase();
  
    return (
      item.ref.toLowerCase().includes(q) ||
      item.clientName.toLowerCase().includes(q)
    );
  
  });

  function handleChange(e) {

    const updatedForm = {
      ...form,
      [e.target.name]: e.target.value
    };
  
    setForm(updatedForm);
  
    if (e.target.name === "ref") {
      return;
    }
  
    saveInvoice(
      updatedForm,
      items,
      itemsTitle,
      subtitle,
      footnote
    );
  }

  function handleRefBlur() {

    if (!form.ref) {
      return;
    }
  
    const confirmed = window.confirm(
      'Save invoice as "' + form.ref + '" ?'
    );
  
    if (!confirmed) {
      return;
    }
  
    saveInvoice(
      form,
      items,
      itemsTitle,
      subtitle,
      footnote
    );
  
    refreshInvoiceList();
  }
  
  
  function handleItemsTitleChange(value) {
  
    setItemsTitle(value);
  
    saveInvoice(
      form,
      items,
      value,
      subtitle,
      footnote
    );
  }
  
  function handleSubtitleChange(value) {
  
    setSubTitle(value);
  
    saveInvoice(
      form,
      items,
      itemsTitle,
      value,
      footnote
    );
  }

  function handleFootnoteChange(value) {

    setFootnote(value);

    saveInvoice(
      form,
      items,
      itemsTitle,
      subtitle,
      value
    );
  }
  
  function updateItem(index, field, value) {
  
    const updated = [...items];
  
    updated[index][field] = value;
  
    setItems(updated);
  
    saveInvoice(
      form,
      updated,
      itemsTitle,
      subtitle,
      footnote
    );
  }
  
  function addItemRow() {
  
    const updated = [
      ...items,
      {
        description: "",
        amount: ""
      }
    ];
  
    setItems(updated);
  
    saveInvoice(
      form,
      updated,
      itemsTitle,
      subtitle,
      footnote
    );
  }
  
  function removeItemRow(index) {
  
    const updated = items.filter(function(item, i) {
      return i !== index;
    });
  
    setItems(updated);
  
    saveInvoice(
      form,
      updated,
      itemsTitle,
      subtitle,
      footnote
    );
  }
  
  function loadInvoice(ref) {
  
    const invoices = getInvoices();
  
    const invoice = invoices[ref];
  
    if (!invoice) return;
  
    setForm(invoice.form);
    setItems(invoice.items || []);
    setItemsTitle(invoice.itemsTitle || "");
    setSubTitle(invoice.subtitle || "");
    setFootnote(invoice.footnote || "");
  }
  

  function refreshInvoiceList() {

    const invoices = getInvoices();
  
    const list = Object.keys(invoices)
      .map(function(ref){
  
        return {
          ref: ref,
          clientName: invoices[ref].clientName || "",
          updatedAt: invoices[ref].updatedAt || 0
        };
  
      })
      .sort(function(a,b){
  
        return b.updatedAt - a.updatedAt;
  
      });
  
    setInvoiceList(list);
  }


  
  const validItems = items.filter(function(item) {
  
    return (
      item.description.trim() !== "" ||
      item.amount.trim() !== ""
    );
  
  });

  function downloadImage() {

    if (!cardRef.current) {
      return;
    }
  
    toPng(cardRef.current, {
      cacheBust: true,
      useCORS: true,
      skipFonts: true,
      pixelRatio: 2
    })
    .then(function(dataUrl) {
  
      const link = document.createElement("a");
  
      link.download =
        "payment-" + form.clientName + ".png";
  
      link.href = dataUrl;
  
      link.click();
  
    })
    .catch(function(err) {
  
      console.error(
        "Image generation failed:",
        err
      );
  
    });
  
  }

  // 🔥 These four live in `form` (so handleChange/save/load keep
  // working the same way) but get their own explicit Label/Value
  // inputs below instead of falling into the generic mapped list —
  // same pattern as the task list's Highlight Bar section.
  const amountBadgeKeys = [
    "amountLabel",
    "amount",
    "dueDateLabel",
    "dueDate"
  ];

  return (
    // 🔥 Same fixed-height shell as the task list card: caps the
    // layout at the viewport so the form and the preview each get
    // their own scrollbar instead of one long page scroll. Swap
    // 100vh for e.g. "calc(100vh - 64px)" if this sits under a navbar.
    <div className="container-fluid p-0" style={{ height: "100vh" }}>

      <div className="row g-0" style={{ height: "100%" }}>

        {/* LEFT → FORM (scrolls on its own) */}
        <div
          className="col-md-4 p-3 border-end"
          style={{ height: "100%", overflowY: "auto" }}
        >
        <div className="position-relative">

            <input
              className="form-control mb-2"
              placeholder="Search Client or Ref"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm.trim() !== "" && (
              <div
                className="border bg-white shadow-sm"
                style={{
                  maxHeight: "250px",
                  overflowY: "auto"
                }}
              >

                {filteredInvoices.map(function(item){

                  return (

                    <div
                      key={item.ref}
                      className="p-2 border-bottom"
                      style={{
                        cursor: "pointer"
                      }}
                      onClick={function(){

                        loadInvoice(item.ref);

                        setSearchTerm("");

                      }}
                    >

                      <div>
                        <strong>{item.clientName}</strong>
                      </div>

                      <small className="text-muted">
                        {item.ref}
                      </small>

                    </div>

                  );

                })}

              </div>
            )}

            </div>
          <h5 className="p-3 border-top ">Edit Card</h5>
          <div className="mb-2">
            <input
              type="text"
              name="ref"
              value={form.ref || ""}
              onChange={handleChange}
              onBlur={handleRefBlur}
              className="form-control"
              placeholder="Reference Number"
            />
          </div>

          {Object.keys(form)
            .filter(function(key){
              return key !== "ref" && amountBadgeKeys.indexOf(key) === -1;
            })
            .map(function(key){

              return (
                <input
                  key={key}
                  type="text"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
              );

            })}
          <input
            className="form-control mb-2"
            value={itemsTitle}
            onChange={(e) =>
              handleItemsTitleChange(e.target.value)
            }
          />
          <input
            className="form-control mb-2"
            value={subtitle}
            onChange={(e) =>
              handleSubtitleChange(e.target.value)
            }
          />        

          {items.map((item, index) => (
            <div className="border p-2 mb-2" key={index}>

              <input
                className="form-control mb-2"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  updateItem(index, "description", e.target.value)
                }
              />

              <input
                className="form-control"
                placeholder="Amount"
                value={item.amount}
                onChange={(e) =>
                  updateItem(index, "amount", e.target.value)
                }
              />
          <button
            className="btn btn-sm btn-danger mt-2"
            onClick={() => removeItemRow(index)}
          >
            Remove
          </button>
            </div>
          ))}

          <button
            className="btn btn-outline-primary btn-sm"
            onClick={addItemRow}
          >
            + Add Row
          </button>

          {/* 🔥 AMOUNT BADGE — explicit label/value pairs, same
              pattern as the task list's Highlight Bar */}
          <h6 className="mt-3 mb-2 text-muted">Amount Badge</h6>
          <div className="d-flex gap-2 mb-2">
            <input
              className="form-control"
              name="amountLabel"
              value={form.amountLabel}
              onChange={handleChange}
              placeholder="Label, e.g. Total amount"
            />
            <input
              className="form-control"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Value, e.g. KES 9,000"
            />
          </div>
          <div className="d-flex gap-2 mb-3">
            <input
              className="form-control"
              name="dueDateLabel"
              value={form.dueDateLabel}
              onChange={handleChange}
              placeholder="Label, e.g. Due Date"
            />
            <input
              className="form-control"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              placeholder="Value, e.g. 23 Apr 2026"
            />
          </div>

          {/* 🔥 FOOTNOTE — shown just below the amount/due-date badge, optional */}
          <h6 className="mt-3 mb-2 text-muted">Footnote (optional)</h6>
          <textarea
            className="form-control mb-3"
            value={footnote}
            onChange={(e) => handleFootnoteChange(e.target.value)}
            placeholder="e.g. A 50% deposit secures your slot on our calendar"
          />

          {/* 🔥 DOWNLOAD BUTTON */}
          <button
            className="btn btn-dark w-100 mt-3"
            onClick={downloadImage}
          >
            Download PNG
          </button>

        </div>

        {/* RIGHT → CARD (scrolls on its own, independent of the form) */}
        <div
          className="col-md-8 p-3"
          style={{ height: "100%", overflowY: "auto" }}
        >
          <div className="row justify-content-center g-0">

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
                      <div> {form.clientName}</div>
                      {form.tel && <div> {form.tel}</div>}
                      {form.address && <div> {form.address}</div>}
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
                <h5 className="">{itemsTitle}</h5>
                </div>
                  {validItems.length > 0 && (
                    <div className="elforge_mosy_box_v1 pb-4">

                      <table className="table table-sm mb-0">
                        <thead>
                          <tr>
                            <th>
                              <h5><b>{subtitle}</b></h5>
                            </th>
                            <th width="120"></th>
                          </tr>
                        </thead>

                        <tbody>
                          {validItems.map((item, index) => (
                            <tr key={index}>
                              <td><h5>{item.description}</h5></td>
                              <td><h5>{item.amount}</h5></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                <div className="elforge_mosy_amount_bar_v1">
                  <div>
                    <div>{form.amountLabel}</div>
                    <div className="elforge_mosy_amount_v1 h1">
                      {form.amount}
                    </div>
                  </div>

                  <div className="">
                    <div>{form.dueDateLabel}</div>
                    <div className="h3">{form.dueDate}</div>
                  </div>
                </div>

                {/* 🔥 FOOTNOTE — optional, sits right under the amount badge */}
                {footnote && (
                  <div className="elforge_payment_footnote_v1">
                    {footnote}
                  </div>
                )}

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

      {/*
        elforge_payment_footnote_v1 is new — the rest of this card's
        classes (elforge_mosy_amount_bar_v1, elforge_mosy_box_v1, etc.)
        already live in the global stylesheet alongside the other
        payment-card classes. Move this one there too whenever
        convenient; it's kept local for now just like the task list
        card keeps its own new classes local.
      */}
      <style jsx>{`
        .elforge_payment_footnote_v1 {
          text-align: center;
          font-weight: 700;
          font-size: 20px;
          color: #6b5323;
          padding: 4px 30px 22px 30px;
        }
      `}</style>
    </div>
  );
}
