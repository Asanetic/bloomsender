"use client";

import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";

export default function PaymentRequestCard() {

  const cardRef = useRef();

  const [itemsTitle, setItemsTitle] = useState("Payment For : ");
  const [subtitle, setSubTitle] = useState("ITEMS INCLUDED");
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceList, setInvoiceList] = useState([]);

  
  const [form, setForm] = useState({
    clientName: "Tropical Desserts Cafe",
    tel: "0706932793",
    address: "Nyali, Mombasa",
    ref: "TDC/APR/230426/001",
    date: "22 Apr 2026",
    amount: "KES 9,000",
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
    nextSubtitle
  ) {
  
    if (!nextForm.ref) return;
  
    const invoices = getInvoices();
  
    invoices[nextForm.ref] = {
      form: nextForm,
      items: nextItems,
      itemsTitle: nextItemsTitle,
      subtitle: nextSubtitle,
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
      subtitle
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
      subtitle
    );
  
    refreshInvoiceList();
  }
  
  
  function handleItemsTitleChange(value) {
  
    setItemsTitle(value);
  
    saveInvoice(
      form,
      items,
      value,
      subtitle
    );
  }
  
  function handleSubtitleChange(value) {
  
    setSubTitle(value);
  
    saveInvoice(
      form,
      items,
      itemsTitle,
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
      subtitle
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
      subtitle
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
      subtitle
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

  return (
    <div className="container-fluid">

      <div className="row">

        {/* LEFT → FORM */}
        <div className="col-md-4 p-3 border-end">
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
              return key !== "ref";
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