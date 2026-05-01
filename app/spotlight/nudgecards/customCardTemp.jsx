"use client";

import { toPng } from "html-to-image";
import jsPDF from "jspdf";

import { useEffect, useRef, useState } from "react";
import {
  FaHeading,
  FaParagraph,
  FaListUl,
  FaTable,
  FaImage,
  FaMinus,
  FaColumns,
  FaBold, FaItalic, FaUnderline 
} from "react-icons/fa";

import { deleteUrlParam, mosyFormInputHandler, mosyScrollTo } from "../../MosyUtils/hiveUtils";
import { useRouter } from "next/navigation";

import {inteprateNudgefilesFormAction, nudgefilesProfileData, popDeleteDialog, sendNudgefilesFormAction} from "../nudgefiles/dataControl/customCardData"
import { useNudgefilesState } from "../nudgefiles/dataControl/NudgefilesStateManager";
import { closeMosyModal, MosyNotify } from "../../MosyUtils/ActionModals";
import { AddNewButton, DeleteButton, SubmitButtons } from "../UiControl/componentControl";
import MosySnackWidget from "../../MosyUtils/MosySnackWidget";

export default function CustomContentCard({ dataIn = {}, dataOut = {} }) {
  const [activeBlockIndex, setActiveBlockIndex] = useState(null);

  
  const cardRef = useRef();

  const initialContent = [
    { type: "title", text: "Task Report" },
    { type: "paragraph", text: "Progress update below." }
  ];

  const coreContent = {
    companyTel: "0710766390",
    companyWebsite: "www.asanetic.com",
    companyEmail: "jereasanya@gmail.com"
  };

  const [content, setContent] = useState(initialContent);


    const {
      showNavigationIsle = true,
      customQueryStr = "",
      backToList="./list",
      parentUseEffectKey = "",
      parentStateSetters=null,
      customProfileData={},
      hostParent="NudgefilesMainProfilePage",
      parentProfileItemId = "NudgefilesProfileTray"
      
    } = dataIn;
    
    //outgoing data to parent
    const {
      setChildDataOut = () => {},
      setChildDataOutSignature = () => {},
    } = dataOut;
    
    
    //set default state values
    const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
    
    //manage Nudgefiles states
    const [stateItem, stateItemSetters] = useNudgefilesState(settersOverrides);
    const nudge_filesNode = stateItem.nudgefilesNode
    
    // -- basic states --//
    const paramNudgefilesUptoken  = stateItem.nudgefilesUptoken
    const nudgefilesActionStatus = stateItem.nudgefilesActionStatus
    const snackMessage = stateItem.snackMessage
    const activeScrollId = stateItem.activeScrollId
    
    //const snackOnDone = stateItem.snackOnDone
    
    const localEventSignature = stateItem.localEventSignature
    
    const handleInputChange = mosyFormInputHandler(stateItemSetters.setNudgefilesNode);
    
    //use route navigation system
    const router = useRouter();
    
    //manage post form
    function postNudgefilesFormData(e) {
      
      MosyNotify({message: "Sending request",icon:"send"})
      
      sendNudgefilesFormAction(e, stateItemSetters, content).then(response=>{
        
        setChildDataOut({
          
          actionName : response.actionName,
          dataToken : response.newToken,
          actionsSource : "postNudgefilesFormData",
          setters :{
            
            childStateSetters: stateItemSetters,
            parentStateSetters: parentStateSetters
            
          }
          
        })
        
        //focus on this form on submission
        stateItemSetters.setActiveScrollId("NudgefilesProfileTray")
        mosyScrollTo(activeScrollId)
        
        closeMosyModal()
        
      })
      
    }
    
    useEffect(() => {
      
      nudgefilesProfileData(customQueryStr, stateItemSetters, router, customProfileData)
      
      mosyScrollTo(activeScrollId)
      
    }, [localEventSignature]);
    

    useEffect(() => {

      console.log("🔥 NODE:", nudge_filesNode);
    
      if (!nudge_filesNode) return;
    
      try {
    
        const record = nudge_filesNode; // ✅ FIX
    
        if (record?.content) {
    
          const parsedContent = JSON.parse(record.content);
    
          console.log("🔥 parsedContent:", parsedContent);
    
          if (Array.isArray(parsedContent)) {
            setContent(parsedContent);
          }
    
        }
    
      } catch (err) {
        console.error("Failed to parse content:", err);
      }
    
    }, [nudge_filesNode]);


  function downloadPNG(cardRef) {
    if (!cardRef.current) return;
  
    toPng(cardRef.current, {
      cacheBust: true,
      useCORS: true,
      skipFonts: true,
      pixelRatio: 2, 
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `document-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("PNG generation failed:", err);
      });
  }


function downloadPDF(cardRef) {
  if (!cardRef.current) return;

  
  toPng(cardRef.current, {
    cacheBust: true,
    useCORS: true,
    skipFonts: true,
    pixelRatio: 2, 
  }).then((dataUrl) => {

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4"
    });
    const img = new Image();
    img.src = dataUrl;

    img.onload = function () {
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (img.height * imgWidth) / img.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`document-${Date.now()}.pdf`);
    };

  });
}


  return (
    <form onSubmit={postNudgefilesFormData} encType="multipart/form-data" id="nudge_files_profile_form">

    <div className="row col-md-12 ">

      {/* LEFT */}
      <div className="col-md-5" style={{ overflow: "auto" , maxHeight: "80vh" }}>
      <BlockListEditor
        blocks={content}
        onChange={setContent}
      />
      </div>
      {/* RIGHT */}
      <div className="col-md-7" style={{ overflow: "auto" , maxHeight: "80vh" }}>
      <div className="elforge_nudge_card_crud_bar">

{/* LEFT: BACK */}
<div className="elforge_nudge_card_crud_left">
  <button type="button" onClick={() => {window.location.href = "../nudgefiles/list"}} className="elforge_nudge_card_crud_btn ghost">
    ← Back
  </button>
</div>

{/* CENTER: FILE ACTIONS */}
<div className="elforge_nudge_card_crud_group">

  <button type="button"
    className="elforge_nudge_card_crud_btn"
    onClick={() => downloadPNG(cardRef)}
  >
    ⬇ PNG
  </button>

  <button type="button"
    className="elforge_nudge_card_crud_btn"
    onClick={() => downloadPDF(cardRef)}
  >
    ⬇ PDF
  </button>

</div>

      {/* RIGHT: MAIN ACTIONS */}
      <div className="elforge_nudge_card_crud_group">

                <SubmitButtons
                src="NudgefilesMainProfilePage"
                tblName="nudge_files"
                extraClass="elforge_nudge_card_crud_btn"
                
                />
            {paramNudgefilesUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              extraClass="elforge_nudge_card_crud_btn danger mb-0 elforge_remove_mb_"
              src="NudgefilesMainProfilePage"
              tableName="nudge_files"
              uptoken={paramNudgefilesUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              className="elforge_nudge_card_crud_btn success"
              src="NudgefilesMainProfilePage"
              tableName="nudge_files"
              link="./customcontent"
              label="New File"
              icon="file-plus" />
            </>
          )}

      </div>

      </div>
        <CoreCard coreContent={coreContent} cardRef={cardRef}>
          <ContentRenderer 
            content={content} 
            onBlockClick={setActiveBlockIndex}
          />
        </CoreCard>
      </div>
      <section className="hive_control">
            <input type="hidden" id="nudge_files_dataNode" name="nudge_files_dataNode" value={paramNudgefilesUptoken}/>
            <input type="hidden" id="nudge_files_mosy_action" name="nudge_files_mosy_action" value={nudgefilesActionStatus}/>
          </section>
    </div>
      
      {/* snack notifications -- */}
      {snackMessage &&(
        <MosySnackWidget
        content={snackMessage}
        duration={5000}
        type="custom"
        onDone={() => {
          stateItemSetters.setSnackMessage("");
          stateItem.snackOnDone(); // Run whats inside onDone
          deleteUrlParam("snack_alert")
        }}
        
        />)}
        {/* snack notifications -- */}
    </form>
  );
}


function createBlock(type) 
{

  const map = {
    title: { type: "title", text: "New Title", level: 1 },
    paragraph: {
      type: "paragraph",
      text: "New paragraph...",
      bold: false,
      italic: false,
      underline: false,
      color: "#000000"
    },
    list: { type: "list", items: ["Item 1"] },
    table: {
      type: "table",
      headers: ["Column 1"],
      rows: [
        [
          [ { type: "paragraph", text: "Cell content..." } ]
        ]
      ],
      headerBg: "#f8f9fa",
      headerColor: "#000",
      borderColor: "#ddd",
      borderWidth: 1
    },
    image: {
      type: "image",
      url: "https://via.placeholder.com/400",
      width: "100%"
    },
    row: {
      type: "row",
      columns: [
        { width: 6, content: [] },
        { width: 6, content: [] }
      ]
    },
    spacer: { type: "spacer", height: 20 },
    divider: {
      type: "divider",
      color: "#f5a623",
      thickness: 3,
      style: "solid" // solid | dashed | dotted
    }
  };

  return map[type];

}

function CoreCard({ coreContent, children, cardRef }) {
  return (
<div
  ref={cardRef}
  className="p-4 m-0"
  style={{
    width: "690px",
    margin: "0 auto",
    background: "#ffffff"
  }}
>

  <div className="container-fluid p-0 m-0">

    <div className="row align-items-center m-0 p-0 ">

      <div className="col-4 p-0 m-0">
        <img
          src="/bm/logo/asaneticlogo.png"
          style={{ height: "130px" }}
        />
      </div>
      <div className="col-4 text-center"></div>

      <div className="elforge_contact h5 pr-3  pt-3" style={{height:"115px", borderRight:"15px solid #f4b400"}}>

          {coreContent.companyTel}<br />
          {coreContent.companyWebsite}<br />
          {coreContent.companyEmail}
      
      </div>

    </div>

  </div>

  <hr />

  {children}

</div>
  );
}

function ContentRenderer({ content = [] }) {
  return content.map((block, index) => {

    switch (block.type) {

      case "title":
        const Tag = `h${block.level || 1}`;
        return (
          <Tag key={index} style={applyStyle(block)}>
            {block.text}
          </Tag>
        );
        case "paragraph":
          return (
            <p key={index} style={{ ...applyStyle(block), whiteSpace: "pre-line", lineHeight: "35px" }}>
              {block.text}
            </p>
          );

        case "image":
          return (
            <img
              key={index}
              src={block.url}
              style={{ width: block.width || "100%" }}
            />
          );

        case "list":
        return (
          <ul key={index}>
            {block.items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );

        case "row":
          return (
            <div key={index} className="row">
              {block.columns.map((col, i) => (
                <div key={i} className={`col-md-${col.width}`}>
                  <ContentRenderer content={col.content} />
                </div>
              ))}
            </div>
          );
          case "table":
            return (
              <table
                key={index}
                style={{
                  width: "100%",
                  borderCollapse: "collapse"
                }}
              >
                <thead>
                  <tr>
                    {block.headers.map((h, i) => (
                      <th
                        key={i}
                        style={{
                          background: block.headerBg,
                          color: block.headerColor,
                          border: `${block.borderWidth}px solid ${block.borderColor}`,
                          padding: "8px"
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
          
                <tbody>
                  {block.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          style={{
                            border: `${block.borderWidth}px solid ${block.borderColor}`,
                            padding: "8px"
                          }}
                        >
                          <ContentRenderer content={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );

        case "spacer":
          return (
            <div
              key={index}
              style={{ height: `${block.height || 20}px` }}
            />
          );
          case "divider":
            return (
              <hr
                key={index}
                style={{
                  border: "none",
                  borderTop: `${block.thickness || 3}px ${block.style || "solid"} ${block.color || "#000"}`,
                  margin: "0px 0"
                }}
              />
            );
      default:
        return null;
    }

  });
}


function applyStyle(block) {
  return {
    fontWeight: block.bold ? "bold" : "normal",
    fontStyle: block.italic ? "italic" : "normal",
    textDecoration: block.underline ? "underline" : "none",
    color: block.color || "#000"
  };
}



function BlockListEditor({ blocks, onChange, moveAcross = null }){
  const [insertIndex, setInsertIndex] = useState(null);

  function updateBlock(index, field, value) {
    const copy = [...blocks];
    copy[index] = { ...copy[index], [field]: value };
    onChange(copy);
  }

  function addBlock(type) {
    onChange([...blocks, createBlock(type)]);
  }

  function removeBlock(index) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function insertBlockAt(index, type) {
    const copy = [...blocks];
    copy.splice(index, 0, createBlock(type));
    onChange(copy);
  }

  function handleAdd(type) {
    if (insertIndex !== null) {
      insertBlockAt(insertIndex, type);
      setInsertIndex(null);
    } else {
      addBlock(type);
    }
  }
    
  const safeBlocks = Array.isArray(blocks) ? blocks : [];

  return (
    <div>

      {/* Toolbar */}
<div className="elforge_toolbar_wrapper">
  <h5 className="px-3 pt-3 mb-2">Editor</h5>

  <div className="elforge_toolbar col-md-12">

    <button type="button" onClick={() => handleAdd("title")} className="elforge_tool_btn">
      <FaHeading />
    </button>

    <button type="button" onClick={() => handleAdd("paragraph")} className="elforge_tool_btn">
      <FaParagraph />
    </button>

    <button type="button" onClick={() => handleAdd("list")} className="elforge_tool_btn">
      <FaListUl />
    </button>

    <button type="button" onClick={() => handleAdd("table")} className="elforge_tool_btn">
      <FaTable />
    </button>

    <button type="button" onClick={() => handleAdd("image")} className="elforge_tool_btn">
      <FaImage />
    </button>

    <button type="button" onClick={() => handleAdd("divider")} className="elforge_tool_btn">
      <FaMinus />
    </button>

    <div className="elforge_toolbar_divider" />

    <button type="button" onClick={() => handleAdd("row")} className="elforge_tool_btn">
      <FaColumns />
    </button>

    <button type="button" onClick={() => handleAdd("spacer")} className="elforge_tool_btn">
      ↕️
    </button>

  </div>
</div>
      {/* Blocks */}

{safeBlocks.map((block, index) => (  <div key={index}>

    {/* INSERT ABOVE */}
    <div className={`elforge_insert_line ${insertIndex === index ? "active" : ""}`}>
    <button type="button" onClick={() => setInsertIndex(index)}>
      + Add here
    </button>
   </div>

   <div className="border p-2 mb-2">

{/* 🔥 MINI HEADER (ONLY inside columns) */}

{/* 🔥 NORMAL BLOCK UI */}
<BlockWrapper
  block={block}
  index={index}
  blocks={blocks}
  onChange={onChange}
  moveAcross={moveAcross}   //  THIS LINE FIXES IT
/>

</div>

  </div>
))}

    </div>
  );
}

function BlockEditor({ block, onChange }) {
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

  switch (block.type) {
    case "title":
      return (
        <>
          <input
            className="form-control mt-1"
            value={block.text}
            onChange={(e) =>
              onChange({ ...block, text: e.target.value })
            }
          />
      {mounted && (

            <div className="d-flex align-items-center gap-2">

            <input
            type="color"
            defaultValue={block.color || "#000000"}
            onChange={(e) =>
              onChange({ ...block, color: e.target.value })
            }
            className="elforge_color_picker"
            />

            <small>{block.color || "#000000"}</small>

            </div>
            )}
          <div className="d-flex gap-1 mt-2">
            {[1,2,3,4].map(lvl => (
              <button type="button"
                key={lvl}
                onClick={() => onChange({ ...block, level: lvl })}
                className={`elforge_format_btn ${block.level === lvl ? "active" : ""}`}
              >
                H{lvl}
              </button>
            ))}
          </div>
        </>
      );

      case "table":
        return (
<div className="elforge_table_editor">      
      <div className="elforge_table_toolbar">

{/* LEFT: ACTIONS */}
<div className="elforge_table_group">
  <button type="button"
    className="elforge_table_btn primary"
    onClick={() => {
      const newHeaders = [...block.headers, `Column ${block.headers.length + 1}`];

      const newRows = block.rows.map(row => [
        ...row,
        [createBlock("paragraph")]
      ]);

      onChange({ ...block, headers: newHeaders, rows: newRows });
    }}
  >
    + Column
  </button>

  <button type="button"
    className="elforge_table_btn"
    onClick={() => {
      const newRow = block.headers.map(() => [
        createBlock("paragraph")
      ]);

      onChange({ ...block, rows: [...block.rows, newRow] });
    }}
  >
    + Row
  </button>
</div>

{/* CENTER: COLORS */}
<div className="elforge_table_group">

  <div className="elforge_color_block">
    <span>Header</span>
    <input
      type="color"
      value={block.headerBg}
      onChange={(e) => onChange({ ...block, headerBg: e.target.value })}
    />
  </div>

  <div className="elforge_color_block">
    <span>Text</span>
    <input
      type="color"
      value={block.headerColor}
      onChange={(e) => onChange({ ...block, headerColor: e.target.value })}
    />
  </div>

  <div className="elforge_color_block">
    <span>Border</span>
    <input
      type="color"
      value={block.borderColor}
      onChange={(e) => onChange({ ...block, borderColor: e.target.value })}
    />
  </div>

</div>

{/* RIGHT: BORDER */}
<div className="elforge_table_group">
  <input
    type="range"
    min="0"
    max="5"
    value={block.borderWidth}
    onChange={(e) => onChange({ ...block, borderWidth: Number(e.target.value) })}
  />
</div>

</div>

<div className="elforge_table_headers">

  {block.headers.map((h, i) => (
    <div key={i} className="elforge_table_header_item">

      <input
        value={h}
        onChange={(e) => {
          const newHeaders = [...block.headers];
          newHeaders[i] = e.target.value;
          onChange({ ...block, headers: newHeaders });
        }}
      />

      <button type="button"
        className="elforge_header_delete"
        onClick={() => {
          if (block.headers.length <= 1) return;

          const newHeaders = block.headers.filter((_, idx) => idx !== i);
          const newRows = block.rows.map(row =>
            row.filter((_, idx) => idx !== i)
          );

          onChange({ ...block, headers: newHeaders, rows: newRows });
        }}
      >
        ✕
      </button>

    </div>
  ))}

</div>
            {/* 🔥 TABLE GRID EDITOR */}
            {block.rows.map((row, rowIndex) => (
              <div key={rowIndex} className=" mb-2 p-2">
      
      <div className="elforge_table_row_header">

        <span>Row {rowIndex + 1}</span>

        <button type="button"
          className="elforge_row_delete"
          onClick={() => {
            if (block.rows.length <= 1) return;

            const newRows = block.rows.filter((_, i) => i !== rowIndex);
            onChange({ ...block, rows: newRows });
          }}
        >
          Delete
        </button>

        </div>
                <div className="row m-0">
      
                  {row.map((cell, colIndex) => (
                    <div key={colIndex} className="col  p-2">
                    <BlockListEditor
                       blocks={Array.isArray(cell) ? cell : [cell]}
                        onChange={(newContent) => {
                          const newRows = block.rows.map((r, rIdx) => {
                            if (rIdx === rowIndex) {
                              return r.map((c, cIdx) =>
                                cIdx === colIndex ? newContent : c
                              );
                            }
                            return r;
                          });
      
                          onChange({ ...block, rows: newRows });
                        }}
                      />
      
                    </div>
                  ))}
      
                </div>
              </div>
            ))}
      
          </div>
        );      

      case "paragraph":
        return (
          <>
            <textarea
            style={{minHeight: '100px'}}
              className="form-control mt-1"
              value={block.text}
              onChange={(e) =>
                onChange({ ...block, text: e.target.value })
              }
            />
      
            <div className="d-flex gap-1 mt-2">
      
              <button type="button"
                onClick={() => onChange({ ...block, bold: !block.bold })}
                className={`elforge_format_btn ${block.bold ? "active" : ""}`}
              >
                <FaBold />
              </button>
      
              <button type="button"
                onClick={() => onChange({ ...block, italic: !block.italic })}
                className={`elforge_format_btn ${block.italic ? "active" : ""}`}
              >
                <FaItalic />
              </button>
      
              <button type="button"
                onClick={() => onChange({ ...block, underline: !block.underline })}
                className={`elforge_format_btn ${block.underline ? "active" : ""}`}
              >
                <FaUnderline />
              </button>
      
              {mounted && (

                <div className="d-flex align-items-center gap-2">

                <input
                type="color"
                defaultValue={block.color || "#000000"}
                onChange={(e) =>
                  onChange({ ...block, color: e.target.value })
                }
                className="elforge_color_picker"
                />

                <small>{block.color || "#000000"}</small>

                </div>
                )}
      
            </div>
          </>
        );
        case "divider":
          return (
            <div className="mt-2">
        
              {/* COLOR */}
              <div className="d-flex align-items-center gap-2 mb-2">
                <input
                  type="color"
                  value={block.color || "#000000"}
                  onChange={(e) =>
                    onChange({ ...block, color: e.target.value })
                  }
                />
                <small>{block.color}</small>
              </div>
        
              {/* THICKNESS */}
              <input
                type="range"
                min="1"
                max="10"
                value={block.thickness || 3}
                onChange={(e) =>
                  onChange({ ...block, thickness: Number(e.target.value) })
                }
                className="form-range"
              />
              <small>{block.thickness}px</small>
        
              {/* STYLE */}
              <select
                className="form-control mt-2"
                value={block.style || "solid"}
                onChange={(e) =>
                  onChange({ ...block, style: e.target.value })
                }
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
        
            </div>
          );
    case "image":
      return (
        <input
          className="form-control"
          value={block.url}
          onChange={(e) =>
            onChange({ ...block, url: e.target.value })
          }
        />
      );

      case "row":
  return (
    <div className="row">

      {block.columns.map((col, colIndex) => (

        <div key={colIndex} className="col-md-6 border p-2">

          <BlockListEditor
            blocks={col.content}

            onChange={(newContent) => {
              const newColumns = block.columns.map((c, i) =>
                i === colIndex ? { ...c, content: newContent } : c
              );

              onChange({ ...block, columns: newColumns });
            }}

            // 🔥 NEW PROP
            moveAcross={(innerIndex, direction) => {

              const targetColIndex =
                direction === "left" ? colIndex - 1 : colIndex + 1;

              if (targetColIndex < 0 || targetColIndex >= block.columns.length) return;

              const sourceCol = block.columns[colIndex];
              const targetCol = block.columns[targetColIndex];

              const blockToMove = sourceCol.content[innerIndex];

              const newColumns = block.columns.map((c, i) => {

                if (i === colIndex) {
                  return {
                    ...c,
                    content: c.content.filter((_, idx) => idx !== innerIndex)
                  };
                }

                if (i === targetColIndex) {
                  return {
                    ...c,
                    content: [...c.content, blockToMove]
                  };
                }

                return c;
              });

              onChange({ ...block, columns: newColumns });
            }}

          />

        </div>

      ))}

    </div>
  );

    default:
      return null;
  }
}

function BlockWrapper({ block, index, blocks, onChange, moveAcross }) {
  
  function updateBlock(updatedBlock) {
    const copy = [...blocks];
    copy[index] = updatedBlock;
    onChange(copy);
  }

  function removeBlock() {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function move(direction) {
    const copy = [...blocks];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= copy.length) return;
    [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
    onChange(copy);
  }

  function duplicateBlock() {
    const copy = [...blocks];
  
    // deep clone to avoid reference bugs
    const cloned = JSON.parse(JSON.stringify(copy[index]));
  
    copy.splice(index + 1, 0, cloned);
  
    onChange(copy);
  }

  return (
    <div className="mb-2 border p-2">
 
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center elforge_block_header">

        <small>{block.type}</small>

        <div className="d-flex gap-1">

{moveAcross && (
  <>
    <button type="button"
      onClick={() => moveAcross(index, "left")}
      className="elforge_btn_icon"
      title="Move to left column"
    >
      ←
    </button>
    <button type="button"
      onClick={() => moveAcross(index, "right")}
      className="elforge_btn_icon"
      title="Move to right column"
    >
      →
    </button>
  </>
)}

{/* 🔥 DUPLICATE BUTTON */}
<button type="button"
  onClick={duplicateBlock}
  className="elforge_btn_icon"
  title="Duplicate block"
>
  ⧉
</button>

<button type="button" onClick={() => move("up")} className="elforge_btn_icon">↑</button>
<button type="button" onClick={() => move("down")} className="elforge_btn_icon">↓</button>

<button type="button" onClick={removeBlock} className="elforge_btn_icon elforge_btn_delete">
  ✕
</button>

</div>


      </div>

      {/* ACTUAL BLOCK */}
      <BlockEditor block={block} onChange={updateBlock} />

    </div>
  );
}

async function saveNudgeFile(content) {
  const payload = buildPayload(content);

  try {
    const res = await fetch("/api/nudge_files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    console.log("Saved:", data);
  } catch (err) {
    console.error("Save failed:", err);
  }
}


function buildPayload(content) {
  return {
    title: "Reo temp",
    content: JSON.stringify(content), // 🔥 important
    created_at: "",
    updated_at: "",
    nudge_files_dataNode: "",
    nudge_files_mosy_action: "add_nudge_files"
  };
}