"use client";

import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";

const STORAGE_KEY = "asanetic_task_lists";

let idCounter = 0;
function makeId(prefix) {
  idCounter += 1;
  return `${prefix}_${Date.now()}_${idCounter}`;
}

const DEFAULT_FORM = {
  title: "TASK LIST",
  titleBold: true,
  subtitle: "Task list for Sept 2026",
  subtitleBold: true,

  logoUrl: "/bm/logo/asaneticlogo.png",

  clientBoxLabel: "CARE PLAN FOR",
  clientBoxLabelBold: true,
  clientName: "Olive Technical",
  clientNameBold: false,
  clientTel: "",
  clientTelBold: false,
  clientAddress: "",
  clientAddressBold: false,

  periodBoxLabel: "PLAN PERIOD",
  periodBoxLabelBold: true,
  period: "September 2026",
  periodBold: false,

  introNote: "Please review the tasks below and let us know if anything needs adjusting.",
  introNoteBold: true,
  closingNote: "Tasks will be completed and confirmed by end of month · Invoice to follow separately",
  closingNoteBold: true,

  highlightLabel: "BUDGET",
  highlightLabelBold: false,
  highlightValue: "KES 16,900",
  highlightValueBold: true,
  highlightLabel2: "",
  highlightLabel2Bold: false,
  highlightValue2: "",
  highlightValue2Bold: true,

  footerText: "ASANETIC DIGITAL — TECHNOLOGY THAT GROWS BUSINESS",
  footerTextBold: false,
  companyTel: "+254 710 766 390",
  companyWebsite: "www.asanetic.com",
  companyEmail: "jereasanya@gmail.com"
};

const DEFAULT_SECTIONS = [
  {
    id: "section_default",
    label: "TASKS TO BE COMPLETED",
    labelBold: true,
    rows: [
      { id: "row_1", col1: "Homepage Update", col2: "", col1Bold: true, col2Bold: true },
      { id: "row_2", col1: "About Us Page", col2: "", col1Bold: true, col2Bold: true },
      { id: "row_3", col1: "Services Page", col2: "", col1Bold: true, col2Bold: true },
      { id: "row_4", col1: "Visitor Messages", col2: "", col1Bold: true, col2Bold: true },
      { id: "row_5", col1: "Contact Us Page", col2: "", col1Bold: true, col2Bold: true },
      { id: "row_6", col1: "Site Redesign", col2: "", col1Bold: true, col2Bold: true },
      { id: "row_7", col1: "SEO Update", col2: "", col1Bold: true, col2Bold: true },
      { id: "row_8", col1: "Gallery Addition", col2: "", col1Bold: true, col2Bold: true }
    ]
  }
];

// 🔥 Uncontrolled-on-purpose: the DOM node's text is only synced from
// `value` when `resetKey` changes (loading a different saved list).
// Typing never re-renders the node from React state, so the caret
// never jumps mid-edit. `onChange` only fires on blur.
function EditableField({
  value,
  onChange,
  resetKey,
  placeholder,
  bold,
  onToggleBold,
  multiline = false,
  className = ""
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  function handleBlur() {
    const text = ref.current ? ref.current.textContent : "";
    if (!text.trim() && ref.current) {
      // Browsers often leave a stray <br> behind after clearing all
      // text, which would permanently defeat the CSS :empty placeholder.
      ref.current.innerHTML = "";
    }
    if (text !== (value || "")) onChange(text);
  }

  return (
    <div className={`tlc-editable-field-wrap ${className}`}>
      <div
        ref={ref}
        className={`tlc-editable-field ${multiline ? "multiline" : ""}`}
        style={{ fontWeight: bold ? 700 : 400 }}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        data-placeholder={placeholder}
      />
      {onToggleBold && (
        <button
          type="button"
          className={`tlc-bold-toggle-btn ${bold ? "active" : ""}`}
          onClick={onToggleBold}
          title="Toggle bold"
        >
          B
        </button>
      )}
    </div>
  );
}

function CollapsibleSection({ title, defaultOpen = true, extra, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="tlc-collapsible-section mb-3 border rounded">
      <div className="tlc-collapsible-header" onClick={() => setOpen((o) => !o)}>
        <span className="tlc-collapsible-title">{title}</span>
        {extra && (
          <span
            className="tlc-collapsible-header-right"
            onClick={(e) => e.stopPropagation()}
          >
            {extra}
          </span>
        )}
        <span className={`tlc-chevron ${open ? "open" : ""}`}>▾</span>
      </div>
      {open && <div className="tlc-collapsible-body">{children}</div>}
    </div>
  );
}

export default function TaskListCard() {
  const cardRef = useRef();
  const logoInputRef = useRef(null);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [sections, setSections] = useState(DEFAULT_SECTIONS);

  // 🔥 Saved task lists — same idea as payment request's saved
  // invoices: a keyed list in localStorage, searchable, click to
  // reload it back into the form.
  const [savedLists, setSavedLists] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔥 Bumped whenever a different saved list is loaded, so every
  // EditableField resyncs its DOM text from the freshly loaded state.
  const [loadVersion, setLoadVersion] = useState(0);

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
            id: s.id || makeId("section"),
            label: s.label || "",
            labelBold: s.labelBold !== undefined ? s.labelBold : true,
            rows: (s.rows || []).map((r) => ({
              id: r.id || makeId("row"),
              col1: r.col1 || "",
              col2: r.col2 || "",
              col1Bold: r.col1Bold !== undefined ? r.col1Bold : true,
              col2Bold: r.col2Bold !== undefined ? r.col2Bold : true
            }))
          }))
        : DEFAULT_SECTIONS;

    setSections(normalizedSections);
    setActiveId(record.id);
    setLoadVersion((v) => v + 1);
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

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function toggleFormBold(name) {
    setForm((f) => ({ ...f, [name]: !f[name] }));
  }

  function handleLogoChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, logoUrl: reader.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function updateSectionLabel(sIndex, value) {
    const updated = [...sections];
    updated[sIndex] = { ...updated[sIndex], label: value };
    setSections(updated);
  }

  function toggleSectionLabelBold(sIndex) {
    const updated = [...sections];
    updated[sIndex] = { ...updated[sIndex], labelBold: !updated[sIndex].labelBold };
    setSections(updated);
  }

  function addSection() {
    setSections([
      ...sections,
      {
        id: makeId("section"),
        label: "NEW SECTION",
        labelBold: true,
        rows: [{ id: makeId("row"), col1: "", col2: "", col1Bold: true, col2Bold: true }]
      }
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

  function toggleRowBold(sIndex, rIndex, field) {
    const updated = [...sections];
    const rows = [...updated[sIndex].rows];
    rows[rIndex] = { ...rows[rIndex], [field]: !rows[rIndex][field] };
    updated[sIndex] = { ...updated[sIndex], rows };
    setSections(updated);
  }

  function addRow(sIndex) {
    const updated = [...sections];
    updated[sIndex] = {
      ...updated[sIndex],
      rows: [...updated[sIndex].rows, { id: makeId("row"), col1: "", col2: "", col1Bold: true, col2Bold: true }]
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
    // 🔥 Fixed-height shell so the two columns below can each own
    // their own scrollbar instead of the whole page scrolling as
    // one block. Adjust the 100vh offset if this sits under a navbar
    // (e.g. "calc(100vh - 64px)").
    <div className="container-fluid p-0" style={{ height: "100vh" }}>
      <div className="row g-0" style={{ height: "100%" }}>

        {/* LEFT → FORM (scrolls on its own) */}
        <div
          className="col-md-4 p-3 border-end"
          style={{ height: "100%", overflowY: "auto" }}
        >
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

          <CollapsibleSection title="Title">
            <EditableField
              value={form.title}
              onChange={(v) => setField("title", v)}
              resetKey={loadVersion}
              bold={form.titleBold}
              onToggleBold={() => toggleFormBold("titleBold")}
              placeholder="Document title, e.g. TASK LIST"
              className="mb-2"
            />
            <EditableField
              value={form.subtitle}
              onChange={(v) => setField("subtitle", v)}
              resetKey={loadVersion}
              bold={form.subtitleBold}
              onToggleBold={() => toggleFormBold("subtitleBold")}
              placeholder="Subtitle under the title"
            />
          </CollapsibleSection>

          <CollapsibleSection title="Client & Period Info">
            <EditableField
              value={form.clientBoxLabel}
              onChange={(v) => setField("clientBoxLabel", v)}
              resetKey={loadVersion}
              bold={form.clientBoxLabelBold}
              onToggleBold={() => toggleFormBold("clientBoxLabelBold")}
              placeholder="Client box label, e.g. CARE PLAN FOR"
              className="mb-2"
            />
            <EditableField
              value={form.clientName}
              onChange={(v) => setField("clientName", v)}
              resetKey={loadVersion}
              bold={form.clientNameBold}
              onToggleBold={() => toggleFormBold("clientNameBold")}
              placeholder="Client Name"
              className="mb-2"
            />
            <EditableField
              value={form.clientTel}
              onChange={(v) => setField("clientTel", v)}
              resetKey={loadVersion}
              bold={form.clientTelBold}
              onToggleBold={() => toggleFormBold("clientTelBold")}
              placeholder="Client Tel (optional)"
              className="mb-2"
            />
            <EditableField
              value={form.clientAddress}
              onChange={(v) => setField("clientAddress", v)}
              resetKey={loadVersion}
              bold={form.clientAddressBold}
              onToggleBold={() => toggleFormBold("clientAddressBold")}
              placeholder="Client Address (optional)"
              className="mb-2"
            />

            <EditableField
              value={form.periodBoxLabel}
              onChange={(v) => setField("periodBoxLabel", v)}
              resetKey={loadVersion}
              bold={form.periodBoxLabelBold}
              onToggleBold={() => toggleFormBold("periodBoxLabelBold")}
              placeholder="Period box label, e.g. PLAN PERIOD"
              className="mb-2"
            />
            <EditableField
              value={form.period}
              onChange={(v) => setField("period", v)}
              resetKey={loadVersion}
              bold={form.periodBold}
              onToggleBold={() => toggleFormBold("periodBold")}
              placeholder="Period e.g. September 2026"
              className="mb-2"
            />

            <EditableField
              value={form.introNote}
              onChange={(v) => setField("introNote", v)}
              resetKey={loadVersion}
              bold={form.introNoteBold}
              onToggleBold={() => toggleFormBold("introNoteBold")}
              placeholder="Intro note, shown above the sections (optional)"
              multiline
            />
          </CollapsibleSection>

          <h6 className="mt-3 mb-2 text-muted">Sections</h6>

          {sections.map((section, sIndex) => (
            <CollapsibleSection
              key={section.id}
              title={
                <div onClick={(e) => e.stopPropagation()}>
                  <EditableField
                    value={section.label}
                    onChange={(v) => updateSectionLabel(sIndex, v)}
                    resetKey={loadVersion}
                    bold={section.labelBold}
                    onToggleBold={() => toggleSectionLabelBold(sIndex)}
                    placeholder="Section label, e.g. REQUIREMENTS FROM CLIENT"
                  />
                </div>
              }
              extra={
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeSection(sIndex)}
                  type="button"
                  title="Remove section"
                >
                  ✕
                </button>
              }
            >
              {section.rows.map((row, rIndex) => (
                <div className="tlc-row-item-block border rounded p-2 mb-2" key={row.id}>
                  <div className="d-flex justify-content-end mb-1">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeRow(sIndex, rIndex)}
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                  <EditableField
                    value={row.col1}
                    onChange={(v) => updateRow(sIndex, rIndex, "col1", v)}
                    resetKey={loadVersion}
                    bold={row.col1Bold}
                    onToggleBold={() => toggleRowBold(sIndex, rIndex, "col1Bold")}
                    placeholder="Item"
                    className="mb-2"
                  />
                  <EditableField
                    value={row.col2}
                    onChange={(v) => updateRow(sIndex, rIndex, "col2", v)}
                    resetKey={loadVersion}
                    bold={row.col2Bold}
                    onToggleBold={() => toggleRowBold(sIndex, rIndex, "col2Bold")}
                    placeholder="Detail (optional)"
                  />
                </div>
              ))}

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => addRow(sIndex)}
                type="button"
              >
                + Add Row
              </button>
            </CollapsibleSection>
          ))}

          <button
            className="btn btn-outline-dark btn-sm mb-3 w-100"
            onClick={addSection}
            type="button"
          >
            + Add Section
          </button>

          <CollapsibleSection title="Highlights & Closing Note">
            <div className="mb-2">
              <EditableField
                value={form.highlightLabel}
                onChange={(v) => setField("highlightLabel", v)}
                resetKey={loadVersion}
                bold={form.highlightLabelBold}
                onToggleBold={() => toggleFormBold("highlightLabelBold")}
                placeholder="Label, e.g. BUDGET"
                className="mb-2"
              />
              <EditableField
                value={form.highlightValue}
                onChange={(v) => setField("highlightValue", v)}
                resetKey={loadVersion}
                bold={form.highlightValueBold}
                onToggleBold={() => toggleFormBold("highlightValueBold")}
                placeholder="Value, e.g. KES 7,500"
              />
            </div>
            <div className="mb-2">
              <EditableField
                value={form.highlightLabel2}
                onChange={(v) => setField("highlightLabel2", v)}
                resetKey={loadVersion}
                bold={form.highlightLabel2Bold}
                onToggleBold={() => toggleFormBold("highlightLabel2Bold")}
                placeholder="2nd label (optional), e.g. DUE"
                className="mb-2"
              />
              <EditableField
                value={form.highlightValue2}
                onChange={(v) => setField("highlightValue2", v)}
                resetKey={loadVersion}
                bold={form.highlightValue2Bold}
                onToggleBold={() => toggleFormBold("highlightValue2Bold")}
                placeholder="2nd value (optional)"
              />
            </div>

            <EditableField
              value={form.closingNote}
              onChange={(v) => setField("closingNote", v)}
              resetKey={loadVersion}
              bold={form.closingNoteBold}
              onToggleBold={() => toggleFormBold("closingNoteBold")}
              placeholder="Closing note, shown below the sections (optional)"
              multiline
            />
          </CollapsibleSection>

          <CollapsibleSection title="Footer">
            <EditableField
              value={form.footerText}
              onChange={(v) => setField("footerText", v)}
              resetKey={loadVersion}
              bold={form.footerTextBold}
              onToggleBold={() => toggleFormBold("footerTextBold")}
              placeholder="Footer tagline"
            />
          </CollapsibleSection>

          <div className="alert alert-light border small text-muted mt-2">
            The logo and the phone / website / email in the header are now
            edited directly on the card preview on the right — click the
            logo to replace it, click the text to edit it.
          </div>

          {/* 🔥 DOWNLOAD BUTTON */}
          <button
            className="btn btn-dark w-100 mt-3"
            onClick={downloadImage}
            type="button"
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
            <div className="col-md-12 p-0 m-0" style={{ height: "auto", backgroundColor: "#fff" }}>

              <div ref={cardRef} className="elforge_mosy_invoice_v1" style={{ height: "auto", minHeight: 0, backgroundColor: "#fff" }}>
                <div className="elforge_mosy_invoice_card_v1" style={{ height: "auto", minHeight: 0 }}>

                  {/* HEADER — logo + contact block are edited directly here */}
                  <div className="elforge_header">
                    <div
                      className="elforge_logo elforge_logo_editable"
                      onClick={() => logoInputRef.current && logoInputRef.current.click()}
                      title="Click to change logo"
                    >
                      <img
                        src={form.logoUrl}
                        alt="Logo"
                        style={{ width: "auto", height: "120px" }}
                      />
                      <div className="elforge_logo_overlay">Change Logo</div>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleLogoChange}
                      />
                    </div>

                    <div
                      className="elforge_contact h5 pr-3 pt-4 elforge_contact_editable"
                      style={{ borderRight: "15px solid #f4b400" }}
                    >
                      <EditableField
                        value={form.companyTel}
                        onChange={(v) => setField("companyTel", v)}
                        resetKey={loadVersion}
                        placeholder="Phone"
                      />
                      <EditableField
                        value={form.companyWebsite}
                        onChange={(v) => setField("companyWebsite", v)}
                        resetKey={loadVersion}
                        placeholder="Website"
                      />
                      <EditableField
                        value={form.companyEmail}
                        onChange={(v) => setField("companyEmail", v)}
                        resetKey={loadVersion}
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <hr style={{ borderColor: "#f4b400" }} />

                  {/* TITLE — fully editable, nothing hardcoded */}
                  <div className="elforge_mosy_title_v1 h1" style={{ fontWeight: form.titleBold ? 700 : 400 }}>{form.title}</div>
                  {form.subtitle && (
                    <div className="elforge_tasklist_subtitle_v1" style={{ fontWeight: form.subtitleBold ? 700 : 400 }}>{form.subtitle}</div>
                  )}

                  {/* CLIENT / PERIOD — same box class as BILL TO / INVOICE DETAILS */}
                  <div className="row m-0 p-0">
                    <div className="col-md-6 p-0 m-0">
                      <div className="elforge_mosy_box_v1">
                        <h5 style={{ fontWeight: form.clientBoxLabelBold ? 700 : 400 }}>{form.clientBoxLabel}</h5>
                        <div style={{ fontWeight: form.clientNameBold ? 700 : 400 }}>{form.clientName}</div>
                        {form.clientTel && <div style={{ fontWeight: form.clientTelBold ? 700 : 400 }}>{form.clientTel}</div>}
                        {form.clientAddress && <div style={{ fontWeight: form.clientAddressBold ? 700 : 400 }}>{form.clientAddress}</div>}
                      </div>
                    </div>


                    <div className="col-md-6">
                      <div className="elforge_mosy_box_v1">
                        <h5 style={{ fontWeight: form.periodBoxLabelBold ? 700 : 400 }}>{form.periodBoxLabel}</h5>
                        <div style={{ fontWeight: form.periodBold ? 700 : 400 }}>{form.period}</div>
                      </div>
                    </div>
                  </div>

                  {form.introNote && (
                    <div className="elforge_tasklist_note_v1" style={{ fontWeight: form.introNoteBold ? 700 : 400 }}>{form.introNote}</div>
                  )}

                  {/* SECTIONS — each one a labeled, two-column row list */}
                  {sections.map((section, sIndex) => {
                    const validRows = section.rows.filter(
                      (r) => r.col1.trim() !== "" || r.col2.trim() !== ""
                    );

                    if (validRows.length === 0) return null;

                    return (
                      <div className="elforge_tasklist_section_v1" key={section.id}>
                        <div className="elforge_tasklist_head_v1" style={{ fontWeight: section.labelBold ? 800 : 400 }}>{section.label}</div>

                        <div className="elforge_tasklist_rows_v1">
                          {validRows.map((row) => (
                            <div
                              className="elforge_tasklist_row_v1"
                              key={row.id}
                              style={!row.col2 ? { display: "block" } : undefined}
                            >
                              <div className="elforge_tasklist_col1_v1" style={{ fontWeight: row.col1Bold ? 700 : 400 }}>{row.col1}</div>
                              {row.col2 && (
                                <div className="elforge_tasklist_col2_v1" style={{ fontWeight: row.col2Bold ? 700 : 400 }}>{row.col2}</div>
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
                          <div className="elforge_tasklist_highlight_label_v1" style={{ fontWeight: form.highlightLabelBold ? 700 : 400 }}>
                            {form.highlightLabel}
                          </div>
                        )}
                        <div className="elforge_tasklist_highlight_value_v1" style={{ fontWeight: form.highlightValueBold ? 800 : 400 }}>
                          {form.highlightValue}
                        </div>
                      </div>

                      {form.highlightValue2 && (
                        <div style={{ textAlign: "right" }}>
                          {form.highlightLabel2 && (
                            <div className="elforge_tasklist_highlight_value_v2_label" style={{ fontWeight: form.highlightLabel2Bold ? 700 : 400 }}>
                              {form.highlightLabel2}
                            </div>
                          )}
                          <div className="elforge_tasklist_highlight_value_v2" style={{ fontWeight: form.highlightValue2Bold ? 800 : 400 }}>
                            {form.highlightValue2}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {form.closingNote && (
                    <div className="elforge_tasklist_note_v1 elforge_tasklist_note_bold_v1" style={{ fontWeight: form.closingNoteBold ? 700 : 400 }}>
                      {form.closingNote}
                    </div>
                  )}

                  {/* FOOTER — reuses existing footer class, text is editable */}
                  <div className="elforge_mosy_footer_v1" style={{ fontWeight: form.footerTextBold ? 700 : 400 }}>
                    {form.footerText}
                  </div>

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
      `}</style>
      <style jsx global>{`
        .elforge_tasklist_subtitle_v1 {
          text-align: center;
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
          font-size: 19.5px;
          color: #1e1e1e;
        }
        .elforge_tasklist_col2_v1 {
          font-size: 19.5px;
          color: #1e1e1e;
          text-align: left;
          padding-left: 14px;
        }
        .elforge_tasklist_note_v1 {
          text-align: start;
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
          color: #f6c752;
        }

        .elforge_tasklist_highlight_value_v2 {
          font-size: 27px;
          color:rgb(255, 255, 255);
        }

        .elforge_tasklist_highlight_value_v2_label{
          font-size: 14px;
          color:rgb(255, 255, 255);
        }

        .elforge_tasklist_note_bold_v1 {
          font-style: normal;
          color: #4a4a4a;
        }

        /* ---- Left panel: collapsible sections ---- */
        .tlc-collapsible-section {
          overflow: hidden;
        }
        .tlc-collapsible-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: #f8f9fa;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          user-select: none;
        }
        .tlc-collapsible-title {
          flex: 1;
          min-width: 0;
        }
        .tlc-collapsible-header-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tlc-chevron {
          transition: transform 0.15s ease;
          font-size: 12px;
          flex-shrink: 0;
        }
        .tlc-chevron.open {
          transform: rotate(180deg);
        }
        .tlc-collapsible-body {
          padding: 10px;
          background: #fff;
        }
        .tlc-row-item-block {
          background: #fbfbfb;
        }

        /* ---- Left panel: contentEditable fields ---- */
        .tlc-editable-field-wrap {
          display: flex;
          align-items: stretch;
          gap: 6px;
        }
        .tlc-editable-field {
          flex: 1;
          min-width: 0;
          border: 1px solid #ced4da;
          border-radius: 4px;
          padding: 6px 8px;
          background: #fff;
          outline: none;
          font-size: 14px;
          min-height: 34px;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .tlc-editable-field:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
        }
        .tlc-editable-field:empty:before {
          content: attr(data-placeholder);
          color: #8a8a8a;
        }
        .tlc-editable-field.multiline {
          min-height: 70px;
        }
        .tlc-bold-toggle-btn {
          border: 1px solid #ced4da;
          background: #fff;
          border-radius: 4px;
          width: 32px;
          flex-shrink: 0;
          font-weight: 700;
          cursor: pointer;
        }
        .tlc-bold-toggle-btn.active {
          background: #212529;
          color: #fff;
          border-color: #212529;
        }

        /* ---- Card header: logo + contact edited in place ---- */
        .elforge_logo_editable {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }
        .elforge_logo_overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          opacity: 0;
          transition: opacity 0.15s ease;
          border-radius: 4px;
        }
        .elforge_logo_editable:hover .elforge_logo_overlay {
          opacity: 1;
        }
        .elforge_contact_editable .tlc-editable-field-wrap {
          display: block;
        }
        .elforge_contact_editable .tlc-editable-field {
          border: 1px solid transparent;
          border-radius: 4px;
          padding: 2px 4px;
          background: transparent;
          min-height: unset;
          font: inherit;
          color: inherit;
        }
        .elforge_contact_editable .tlc-editable-field:hover,
        .elforge_contact_editable .tlc-editable-field:focus {
          border-color: rgba(0, 0, 0, 0.25);
          background: rgba(0, 0, 0, 0.04);
        }
        .elforge_contact_editable .tlc-editable-field:empty:before {
          color: rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </div>
  );
}
