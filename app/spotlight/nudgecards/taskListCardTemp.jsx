"use client";

import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";

const STORAGE_KEY = "asanetic_task_lists";

const DEFAULT_FORM = {
  title: "TASK LIST",
  subtitle: "Task list for Sept 2026",

  clientBoxLabel: "CARE PLAN FOR",
  clientName: "Olive Technical",
  clientTel: "",
  clientAddress: "",

  periodBoxLabel: "PLAN PERIOD",
  period: "September 2026",

  introNote: "Please review the tasks below and let us know if anything needs adjusting.",
  closingNote: "Tasks will be completed and confirmed by end of month · Invoice to follow separately",

  highlightLabel: "BUDGET",
  highlightValue: "KES 16,900",
  highlightLabel2: "",
  highlightValue2: "",

  footerText: "ASANETIC DIGITAL — TECHNOLOGY THAT GROWS BUSINESS",
  companyTel: "+254 710 766 390",
  companyWebsite: "www.asanetic.com",
  companyEmail: "jereasanya@gmail.com"
};

const DEFAULT_SECTIONS = [
  {
    label: "TASKS TO BE COMPLETED",
    rows: [
      { col1: "Homepage Update", col2: "" },
      { col1: "About Us Page", col2: "" },
      { col1: "Services Page", col2: "" },
      { col1: "Visitor Messages", col2: "" },
      { col1: "Contact Us Page", col2: "" },
      { col1: "Site Redesign", col2: "" },
      { col1: "SEO Update", col2: "" },
      { col1: "Gallery Addition", col2: "" }
    ]
  }
];

export default function TaskListCard() {
  const cardRef = useRef();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [sections, setSections] = useState(DEFAULT_SECTIONS);

  // 🔥 Saved task lists — same idea as payment request's saved
  // invoices: a keyed list in localStorage, searchable, click to
  // reload it back into the form.
  const [savedLists, setSavedLists] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setSavedLists(raw ? JSON.parse(raw) : []);
    } catch (err) {
      console.error("Failed to load saved task lists:", err);
      setSavedLists([]);
    }
  }, []);

  function persist(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error("Failed to save task lists:", err);
    }
    setSavedLists(list);
  }

  function saveCurrentList() {
    const id = activeId || `tl_${Date.now()}`;
    const record = {
      id,
      clientName: form.clientName || "Untitled",
      period: form.period || "",
      savedAt: new Date().toISOString(),
      form,
      sections
    };

    const existingIndex = savedLists.findIndex((l) => l.id === id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...savedLists];
      updated[existingIndex] = record;
    } else {
      updated = [record, ...savedLists];
    }

    persist(updated);
    setActiveId(id);
  }

  function loadList(id) {
    const record = savedLists.find((l) => l.id === id);
    if (!record) return;

    // Merge onto defaults so older saved lists (from before a field
    // existed, e.g. highlightLabel) don't leave any input's value
    // undefined — that's what flips a controlled input to uncontrolled.
    setForm({ ...DEFAULT_FORM, ...record.form });

    const normalizedSections =
      record.sections && record.sections.length
        ? record.sections.map((s) => ({
            label: s.label || "",
            rows: (s.rows || []).map((r) => ({
              col1: r.col1 || "",
              col2: r.col2 || ""
            }))
          }))
        : DEFAULT_SECTIONS;

    setSections(normalizedSections);
    setActiveId(record.id);
  }

  function deleteList(id, e) {
    e.stopPropagation();
    const updated = savedLists.filter((l) => l.id !== id);
    persist(updated);
    if (activeId === id) setActiveId(null);
  }

  function cloneCurrentList() {
    setActiveId(null);
  }

  const filteredLists = savedLists.filter((l) =>
    `${l.clientName} ${l.period}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function updateSectionLabel(sIndex, value) {
    const updated = [...sections];
    updated[sIndex] = { ...updated[sIndex], label: value };
    setSections(updated);
  }

  function addSection() {
    setSections([
      ...sections,
      { label: "NEW SECTION", rows: [{ col1: "", col2: "" }] }
    ]);
  }

  function removeSection(sIndex) {
    setSections(sections.filter((_, i) => i !== sIndex));
  }

  function updateRow(sIndex, rIndex, field, value) {
    const updated = [...sections];
    const rows = [...updated[sIndex].rows];
    rows[rIndex] = { ...rows[rIndex], [field]: value };
    updated[sIndex] = { ...updated[sIndex], rows };
    setSections(updated);
  }

  function addRow(sIndex) {
    const updated = [...sections];
    updated[sIndex] = {
      ...updated[sIndex],
      rows: [...updated[sIndex].rows, { col1: "", col2: "" }]
    };
    setSections(updated);
  }

  function removeRow(sIndex, rIndex) {
    const updated = [...sections];
    updated[sIndex] = {
      ...updated[sIndex],
      rows: updated[sIndex].rows.filter((_, i) => i !== rIndex)
    };
    setSections(updated);
  }

  function downloadImage() {
    if (!cardRef.current) return;

    toPng(cardRef.current, {
      cacheBust: true,
      useCORS: true,
      skipFonts: true,
      pixelRatio: 2
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `tasklist-${form.clientName || "client"}.png`;
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
          <h5>Edit Task List</h5>

          {/* 🔥 SAVED TASK LISTS */}
          <div className="border rounded p-2 mb-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0 text-muted">Saved Task Lists</h6>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={cloneCurrentList}
                type="button"
                title="Keep current content, save it as a new list instead of overwriting"
              >
                ⧉ Clone
              </button>
            </div>

            <input
              className="form-control form-control-sm mb-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client or period…"
            />

            <div style={{ maxHeight: "160px", overflowY: "auto" }}>
              {filteredLists.length === 0 && (
                <div className="text-muted small">No saved task lists yet.</div>
              )}

              {filteredLists.map((l) => (
                <div
                  key={l.id}
                  onClick={() => loadList(l.id)}
                  className={`d-flex justify-content-between align-items-center p-1 mb-1 rounded ${
                    activeId === l.id ? "bg-warning-subtle" : "bg-white"
                  }`}
                  style={{ cursor: "pointer", border: "1px solid #eee" }}
                >
                  <div className="small">
                    <div className="fw-bold">{l.clientName}</div>
                    <div className="text-muted">{l.period}</div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => deleteList(l.id, e)}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              className="btn btn-sm btn-dark w-100 mt-2"
              onClick={saveCurrentList}
              type="button"
            >
              💾 {activeId ? "Update Saved List" : "Save Task List"}
            </button>
          </div>

          <h6 className="mt-3 mb-2 text-muted">Title</h6>
          <input
            className="form-control mb-2"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Document title, e.g. TASK LIST"
          />
          <input
            className="form-control mb-2"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Subtitle under the title"
          />

          <h6 className="mt-3 mb-2 text-muted">Client Info</h6>
          <input
            className="form-control mb-2"
            name="clientBoxLabel"
            value={form.clientBoxLabel}
            onChange={handleChange}
            placeholder="Client box label, e.g. CARE PLAN FOR"
          />
          <input
            className="form-control mb-2"
            name="clientName"
            value={form.clientName}
            onChange={handleChange}
            placeholder="Client Name"
          />
          <input
            className="form-control mb-2"
            name="clientTel"
            value={form.clientTel}
            onChange={handleChange}
            placeholder="Client Tel (optional)"
          />
          <input
            className="form-control mb-2"
            name="clientAddress"
            value={form.clientAddress}
            onChange={handleChange}
            placeholder="Client Address (optional)"
          />

          <input
            className="form-control mb-2"
            name="periodBoxLabel"
            value={form.periodBoxLabel}
            onChange={handleChange}
            placeholder="Period box label, e.g. PLAN PERIOD"
          />
          <input
            className="form-control mb-2"
            name="period"
            value={form.period}
            onChange={handleChange}
            placeholder="Period e.g. September 2026"
          />

          <textarea
            className="form-control mb-3"
            name="introNote"
            value={form.introNote}
            onChange={handleChange}
            placeholder="Intro note, shown above the sections (optional)"
          />

          <h6 className="mt-3 mb-2 text-muted">Sections</h6>

          {sections.map((section, sIndex) => (
            <div className="border rounded p-2 mb-3" key={sIndex}>

              <div className="d-flex gap-2 mb-2">
                <input
                  className="form-control"
                  value={section.label}
                  onChange={(e) => updateSectionLabel(sIndex, e.target.value)}
                  placeholder="Section label, e.g. REQUIREMENTS FROM CLIENT"
                />
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeSection(sIndex)}
                  type="button"
                  title="Remove section"
                >
                  ✕
                </button>
              </div>

              {section.rows.map((row, rIndex) => (
                <div className="d-flex mb-2 gap-2" key={rIndex}>
                  <input
                    className="form-control"
                    value={row.col1}
                    onChange={(e) => updateRow(sIndex, rIndex, "col1", e.target.value)}
                    placeholder="Item"
                  />
                  <input
                    className="form-control"
                    value={row.col2}
                    onChange={(e) => updateRow(sIndex, rIndex, "col2", e.target.value)}
                    placeholder="Detail (optional)"
                  />
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeRow(sIndex, rIndex)}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => addRow(sIndex)}
                type="button"
              >
                + Add Row
              </button>
            </div>
          ))}

          <button
            className="btn btn-outline-dark btn-sm mb-3 w-100"
            onClick={addSection}
            type="button"
          >
            + Add Section
          </button>

          <h6 className="mt-3 mb-2 text-muted">Highlight Bar (optional)</h6>
          <div className="d-flex gap-2 mb-2">
            <input
              className="form-control"
              name="highlightLabel"
              value={form.highlightLabel}
              onChange={handleChange}
              placeholder="Label, e.g. BUDGET"
            />
            <input
              className="form-control"
              name="highlightValue"
              value={form.highlightValue}
              onChange={handleChange}
              placeholder="Value, e.g. KES 7,500"
            />
          </div>
          <div className="d-flex gap-2 mb-3">
            <input
              className="form-control"
              name="highlightLabel2"
              value={form.highlightLabel2}
              onChange={handleChange}
              placeholder="2nd label (optional), e.g. DUE"
            />
            <input
              className="form-control"
              name="highlightValue2"
              value={form.highlightValue2}
              onChange={handleChange}
              placeholder="2nd value (optional)"
            />
          </div>

          <textarea
            className="form-control mb-3"
            name="closingNote"
            value={form.closingNote}
            onChange={handleChange}
            placeholder="Closing note, shown below the sections (optional)"
          />

          <h6 className="mt-3 mb-2 text-muted">Footer</h6>
          <input
            className="form-control mb-2"
            name="footerText"
            value={form.footerText}
            onChange={handleChange}
            placeholder="Footer tagline"
          />
          <input
            className="form-control mb-2"
            name="companyTel"
            value={form.companyTel}
            onChange={handleChange}
            placeholder="Company phone"
          />
          <input
            className="form-control mb-2"
            name="companyWebsite"
            value={form.companyWebsite}
            onChange={handleChange}
            placeholder="Company website"
          />
          <input
            className="form-control mb-2"
            name="companyEmail"
            value={form.companyEmail}
            onChange={handleChange}
            placeholder="Company email"
          />

          {/* 🔥 DOWNLOAD BUTTON */}
          <button
            className="btn btn-dark w-100 mt-3"
            onClick={downloadImage}
            type="button"
          >
            Download PNG
          </button>

        </div>

        {/* RIGHT → CARD */}
        <div className="col-md-8 row justify-content-center">

          {/* 👇 ONLY THIS gets exported */}
          <div className="col-md-12 p-0 m-0" style={{ height: "auto", backgroundColor: "#fff" }}>

            <div ref={cardRef} className="elforge_mosy_invoice_v1" style={{ height: "auto", minHeight: 0, backgroundColor: "#fff" }}>
              <div className="elforge_mosy_invoice_card_v1" style={{ height: "auto", minHeight: 0 }}>

                {/* HEADER — reuses existing global classes */}
                <div className="elforge_header">
                  <div className="elforge_logo">
                    <img
                      src="/bm/logo/asaneticlogo.png"
                      style={{ width: "auto", height: "120px" }}
                    />
                  </div>

                  <div
                    className="elforge_contact h5 pr-3 pt-4"
                    style={{ borderRight: "15px solid #f4b400" }}
                  >
                    {form.companyTel}<br/>
                    {form.companyWebsite}<br/>
                    {form.companyEmail}
                  </div>
                </div>
                <hr style={{ borderColor: "#f4b400" }} />

                {/* TITLE — fully editable, nothing hardcoded */}
                <div className="elforge_mosy_title_v1 h1">{form.title}</div>
                {form.subtitle && (
                  <div className="elforge_tasklist_subtitle_v1">{form.subtitle}</div>
                )}

                {/* CLIENT / PERIOD — same box class as BILL TO / INVOICE DETAILS */}
                <div className="row m-0 p-0">
                  <div className="col-md-6 p-0 m-0">
                    <div className="elforge_mosy_box_v1">
                      <h5>{form.clientBoxLabel}</h5>
                      <div>{form.clientName}</div>
                      {form.clientTel && <div>Tel: {form.clientTel}</div>}
                      {form.clientAddress && <div>Address: {form.clientAddress}</div>}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="elforge_mosy_box_v1">
                      <h5>{form.periodBoxLabel}</h5>
                      <div>{form.period}</div>
                    </div>
                  </div>
                </div>

                {form.introNote && (
                  <div className="elforge_tasklist_note_v1">{form.introNote}</div>
                )}

                {/* SECTIONS — each one a labeled, two-column row list */}
                {sections.map((section, sIndex) => {
                  const validRows = section.rows.filter(
                    (r) => r.col1.trim() !== "" || r.col2.trim() !== ""
                  );

                  if (validRows.length === 0) return null;

                  return (
                    <div className="elforge_tasklist_section_v1" key={sIndex}>
                      <div className="elforge_tasklist_head_v1">{section.label}</div>

                      <div className="elforge_tasklist_rows_v1">
                        {validRows.map((row, rIndex) => (
                          <div
                            className="elforge_tasklist_row_v1"
                            key={rIndex}
                            style={!row.col2 ? { display: "block" } : undefined}
                          >
                            <div className="elforge_tasklist_col1_v1">{row.col1}</div>
                            {row.col2 && (
                              <div className="elforge_tasklist_col2_v1">{row.col2}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {form.highlightValue && (
                  <div
                    className="elforge_tasklist_highlight_v1"
                    style={
                      !form.highlightValue2
                        ? { justifyContent: "center", textAlign: "center" }
                        : undefined
                    }
                  >
                    <div>
                      {form.highlightLabel && (
                        <div className="elforge_tasklist_highlight_label_v1">
                          {form.highlightLabel}
                        </div>
                      )}
                      <div className="elforge_tasklist_highlight_value_v1">
                        {form.highlightValue}
                      </div>
                    </div>

                    {form.highlightValue2 && (
                      <div style={{ textAlign: "right" }}>
                        {form.highlightLabel2 && (
                          <div className="elforge_tasklist_highlight_value_v2_label">
                            {form.highlightLabel2}
                          </div>
                        )}
                        <div className="elforge_tasklist_highlight_value_v2">
                          {form.highlightValue2}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {form.closingNote && (
                  <div className="elforge_tasklist_note_v1 elforge_tasklist_note_bold_v1">
                    {form.closingNote}
                  </div>
                )}

                {/* FOOTER — reuses existing footer class, text is editable */}
                <div className="elforge_mosy_footer_v1">
                  {form.footerText}
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

      {/*
        Only the task-list-specific pieces need styling here.
        elforge_header / elforge_mosy_box_v1 / elforge_mosy_title_v1 /
        elforge_mosy_footer_v1 already exist in the global stylesheet
        from the payment cards — move these below into that same
        stylesheet whenever convenient, they don't need to live here.
      */}
      <style jsx>{`
        .elforge_mosy_invoice_v1,
        .elforge_mosy_invoice_card_v1 {
          height: auto !important;
          min-height: 0 !important;
        }

        .elforge_mosy_box_v1 {
          height: auto !important;
          min-height: 0 !important;
        }

        .elforge_mosy_title_v1 {
          color: #D49743;
        }

        .elforge_tasklist_subtitle_v1 {
          text-align: center;
          font-weight: 700;
          letter-spacing: 2px;
          color: rgb(0, 0, 0);
          font-size: 20px;
          margin-bottom: 20px;
        }
        .elforge_tasklist_section_v1 {
          border: 1px solid #eee0c0;
          border-radius: 14px;
          overflow: hidden;
          margin: 0 16px 18px 16px;
        }
        .elforge_tasklist_head_v1 {
          background: #fdf3e6;
          padding: 14px 22px;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: 0.5px;
        }
        .elforge_tasklist_rows_v1 {
          padding: 6px 22px 12px 22px;
        }
        .elforge_tasklist_row_v1 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: start;
          padding: 10px 0;
          border-bottom: 1px solid #f2ead6;
        }
        .elforge_tasklist_row_v1:last-child {
          border-bottom: none;
        }
        .elforge_tasklist_col1_v1 {
          font-weight: bold;
          font-size: 19.5px;
          color: #1e1e1e;
        }
        .elforge_tasklist_col2_v1 {
          font-weight: bold;
          font-size: 19.5px;
          color: #1e1e1e;
          text-align: left;
          padding-left: 14px;
        }
        .elforge_tasklist_note_v1 {
          text-align: start;
          font-weight: 700;
          font-size: 19.5px;
          color: #1e1e1e;
          padding: 0 30px 22px 30px;
        }
        .elforge_tasklist_highlight_v1 {
          background: linear-gradient(90deg, #1a1a1a 0%, #6b5323 55%, #cf9a3a 100%);
          border-radius: 14px;
          padding: 22px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 16px 18px 16px;
        }
        .elforge_tasklist_highlight_label_v1 {
          font-size: 13px;
          letter-spacing: 1.5px;
          color:rgb(255, 255, 255);
          margin-bottom: 6px;
        }
        .elforge_tasklist_highlight_value_v1 {
          font-size: 27px;
          font-weight: 800;
          color: #f6c752;
        }

        .elforge_tasklist_highlight_value_v2 {
          font-size: 27px;
          font-weight: 800;
          color:rgb(255, 255, 255);
        }

        .elforge_tasklist_highlight_value_v2_label{
          font-size: 14px;
          color:rgb(255, 255, 255);
        }

        .elforge_tasklist_note_bold_v1 {
          font-weight: 700;
          font-style: normal;
          color: #4a4a4a;
        }
      `}</style>
    </div>
  );
}
