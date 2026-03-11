import { useState, useRef, useCallback, useEffect } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wdth,wght@0,75..100,400..700;1,75..100,400..700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F9FAFB;
    --surface: #FFFFFF;
    --surface-2: #F3F4F6;
    --border: #E5E7EB;
    --border-strong: #D1D5DB;
    --text-primary: #111827;
    --text-secondary: #6B7280;
    --text-tertiary: #9CA3AF;
    --blue: #2563EB;
    --blue-light: #EFF6FF;
    --blue-mid: #BFDBFE;
    --blue-dark: #1D4ED8;
    --green: #059669;
    --green-light: #ECFDF5;
    --amber: #D97706;
    --amber-light: #FFFBEB;
    --red: #DC2626;
    --red-light: #FEF2F2;
    --purple: #7C3AED;
    --purple-light: #F5F3FF;
    --teal: #0D9488;
    --teal-light: #F0FDFA;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
    --shadow-lg: 0 12px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
    --shadow-xl: 0 24px 64px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08);
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 14px;
    --radius-xl: 20px;
    --font-sans: 'Instrument Sans', system-ui, sans-serif;
    --font-serif: 'Lora', Georgia, serif;
    --transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body { font-family: var(--font-sans); background: var(--bg); color: var(--text-primary); }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }

  .app-shell {
    display: grid;
    grid-template-rows: 52px 1fr;
    grid-template-columns: 260px 1fr 380px;
    height: 100vh;
    overflow: hidden;
    background: var(--bg);
  }

  /* ─ Topbar ─ */
  .topbar {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 16px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    z-index: 100;
  }

  .logo-mark {
    width: 30px; height: 30px;
    background: var(--blue);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .logo-mark svg { color: white; }

  .app-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.3px;
    margin-right: 4px;
  }

  .topbar-divider {
    width: 1px; height: 20px;
    background: var(--border);
    margin: 0 6px;
    flex-shrink: 0;
  }

  .course-name-input {
    font-family: var(--font-sans);
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text-primary);
    background: none;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    padding: 4px 8px;
    outline: none;
    transition: var(--transition);
    max-width: 220px;
  }
  .course-name-input:hover { border-color: var(--border); background: var(--surface-2); }
  .course-name-input:focus { border-color: var(--blue); background: var(--blue-light); }

  .spacer { flex: 1; }

  .btn-icon {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    flex-shrink: 0;
  }
  .btn-icon:hover { background: var(--surface-2); color: var(--text-primary); }
  .btn-icon:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn-icon:disabled:hover { background: none; }

  .btn {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: var(--font-sans);
    font-size: 12.5px;
    font-weight: 600;
    border-radius: var(--radius-sm);
    padding: 5px 12px;
    border: none;
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .btn-ghost {
    background: none;
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover { background: var(--surface-2); color: var(--text-primary); border-color: var(--border-strong); }

  .btn-primary {
    background: var(--blue);
    color: white;
  }
  .btn-primary:hover { background: var(--blue-dark); }

  .btn-success {
    background: var(--green-light);
    color: var(--green);
    border: 1px solid #A7F3D0;
  }
  .btn-success:hover { background: #D1FAE5; }

  .save-indicator {
    display: flex; align-items: center; gap: 4px;
    font-size: 11.5px; color: var(--text-tertiary);
  }

  .save-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--green);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  /* ─ Left Sidebar ─ */
  .sidebar-left {
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sidebar-header {
    padding: 14px 16px 10px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .sidebar-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
    margin-bottom: 8px;
  }

  .search-box {
    display: flex; align-items: center; gap: 7px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 6px 10px;
  }

  .search-box input {
    background: none; border: none; outline: none;
    font-family: var(--font-sans);
    font-size: 12.5px;
    color: var(--text-primary);
    width: 100%;
  }
  .search-box input::placeholder { color: var(--text-tertiary); }

  .sidebar-scroll { flex: 1; overflow-y: auto; padding: 10px 0; }

  .tree-section { margin-bottom: 2px; }

  .tree-module {
    display: flex; align-items: center; gap: 7px;
    padding: 6px 16px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    user-select: none;
  }
  .tree-module:hover { background: var(--surface-2); }

  .tree-module-icon {
    width: 16px; height: 16px;
    border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .tree-lesson {
    display: flex; align-items: center; gap: 7px;
    padding: 5px 16px 5px 38px;
    font-size: 12.5px;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: 0;
    transition: var(--transition);
    border-left: 2px solid transparent;
    position: relative;
  }
  .tree-lesson:hover { background: var(--surface-2); color: var(--text-primary); }
  .tree-lesson.active {
    background: var(--blue-light);
    color: var(--blue);
    border-left-color: var(--blue);
    font-weight: 600;
  }

  .lesson-status {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-left: auto;
  }

  .sidebar-footer {
    padding: 10px 12px;
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }

  .btn-add-module {
    width: 100%;
    display: flex; align-items: center; gap: 6px;
    padding: 7px 10px;
    font-size: 12px; font-weight: 600;
    color: var(--blue);
    background: var(--blue-light);
    border: 1px dashed var(--blue-mid);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
  }
  .btn-add-module:hover { background: #DBEAFE; }

  /* ─ Editor Panel ─ */
  .editor-panel {
    background: var(--bg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid var(--border);
  }

  .editor-toolbar {
    display: flex; align-items: center; gap: 8px;
    padding: 0 20px;
    height: 44px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .lesson-breadcrumb {
    display: flex; align-items: center; gap: 4px;
    font-size: 12px; color: var(--text-tertiary);
  }
  .lesson-breadcrumb b { color: var(--text-primary); font-weight: 600; }
  .lesson-breadcrumb span { color: var(--text-tertiary); }

  .block-count-badge {
    display: inline-flex; align-items: center;
    font-size: 11px; font-weight: 600;
    color: var(--text-tertiary);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 99px;
    padding: 2px 8px;
  }

  .editor-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 28px 24px 80px;
  }

  /* ─ Block Card ─ */
  .block-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-lg);
    margin-bottom: 10px;
    transition: border-color 0.15s, box-shadow 0.15s;
    position: relative;
    overflow: visible;
  }
  .block-card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }
  .block-card.drag-over { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-light); }
  .block-card.dragging { opacity: 0.4; }

  .block-header {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 14px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
  .block-card.collapsed .block-header {
    border-bottom: none;
    border-radius: var(--radius-lg);
  }

  .drag-handle {
    color: var(--text-tertiary);
    cursor: grab;
    display: flex; align-items: center;
    padding: 2px;
    border-radius: 4px;
    transition: var(--transition);
  }
  .drag-handle:hover { color: var(--text-secondary); background: var(--surface-2); }
  .drag-handle:active { cursor: grabbing; }

  .block-type-chip {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 99px;
    flex-shrink: 0;
  }

  .block-actions {
    display: flex; align-items: center; gap: 1px;
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .block-card:hover .block-actions { opacity: 1; }

  .block-action-btn {
    width: 26px; height: 26px;
    display: flex; align-items: center; justify-content: center;
    background: none; border: none;
    border-radius: 5px;
    color: var(--text-tertiary);
    cursor: pointer;
    transition: var(--transition);
  }
  .block-action-btn:hover { background: var(--surface-2); color: var(--text-primary); }
  .block-action-btn.danger:hover { background: var(--red-light); color: var(--red); }

  .block-body { padding: 14px 16px; }

  /* ─ Inputs ─ */
  .field-group { margin-bottom: 12px; }
  .field-label {
    font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.07em;
    color: var(--text-tertiary);
    margin-bottom: 5px;
    display: block;
  }

  .text-input, .textarea-input, .select-input {
    font-family: var(--font-sans);
    font-size: 13.5px;
    color: var(--text-primary);
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 8px 11px;
    width: 100%;
    outline: none;
    transition: var(--transition);
    line-height: 1.5;
  }
  .text-input:focus, .textarea-input:focus, .select-input:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px var(--blue-light);
  }
  .text-input::placeholder, .textarea-input::placeholder { color: var(--text-tertiary); }
  .textarea-input { resize: vertical; min-height: 72px; }
  .select-input { cursor: pointer; }

  /* ─ Block Previews ─ */
  .preview-title { font-family: var(--font-serif); font-size: 28px; font-weight: 700; line-height: 1.25; color: var(--text-primary); }
  .preview-heading { font-size: 20px; font-weight: 700; line-height: 1.3; color: var(--text-primary); border-bottom: 2px solid var(--blue); padding-bottom: 6px; }
  .preview-subheading { font-size: 16px; font-weight: 600; color: var(--text-secondary); }
  .preview-paragraph { font-size: 14px; line-height: 1.75; color: var(--text-primary); }
  .preview-quote {
    border-left: 3px solid var(--blue);
    padding: 8px 16px;
    background: var(--blue-light);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    font-style: italic;
    font-size: 14.5px;
    color: var(--blue-dark);
    font-family: var(--font-serif);
  }

  .callout-box {
    display: flex; gap: 12px;
    padding: 12px 14px;
    border-radius: var(--radius-md);
    font-size: 13.5px;
    line-height: 1.6;
  }
  .callout-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  .callout-content { flex: 1; }
  .callout-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }

  .callout-note { background: var(--blue-light); border: 1px solid var(--blue-mid); }
  .callout-note .callout-label { color: var(--blue); }
  .callout-note .callout-content { color: #1E40AF; }

  .callout-highlight { background: var(--amber-light); border: 1px solid #FDE68A; }
  .callout-highlight .callout-label { color: var(--amber); }
  .callout-highlight .callout-content { color: #92400E; }

  .callout-warning { background: var(--red-light); border: 1px solid #FECACA; }
  .callout-warning .callout-label { color: var(--red); }
  .callout-warning .callout-content { color: #991B1B; }

  .callout-tip { background: var(--green-light); border: 1px solid #A7F3D0; }
  .callout-tip .callout-label { color: var(--green); }
  .callout-tip .callout-content { color: #065F46; }

  .callout-summary { background: var(--purple-light); border: 1px solid #DDD6FE; }
  .callout-summary .callout-label { color: var(--purple); }
  .callout-summary .callout-content { color: #4C1D95; }

  .callout-key-concept { background: var(--teal-light); border: 1px solid #99F6E4; }
  .callout-key-concept .callout-label { color: var(--teal); }
  .callout-key-concept .callout-content { color: #134E4A; }

  .preview-formula {
    background: #1E293B;
    color: #E2E8F0;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 14px;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    letter-spacing: 0.05em;
  }

  .quiz-block {
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }
  .quiz-header {
    padding: 10px 14px;
    font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    display: flex; align-items: center; gap: 6px;
  }
  .quiz-body { padding: 14px; }
  .quiz-question { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 10px; line-height: 1.5; }
  .quiz-option {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    margin-bottom: 7px;
    font-size: 13.5px;
    cursor: pointer;
    transition: var(--transition);
  }
  .quiz-option:hover { border-color: var(--blue); background: var(--blue-light); }
  .quiz-option.correct { border-color: var(--green); background: var(--green-light); }
  .option-radio {
    width: 16px; height: 16px;
    border-radius: 50%;
    border: 2px solid var(--border-strong);
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }

  .divider-preview { border: none; border-top: 1.5px solid var(--border); margin: 4px 0; }

  .media-placeholder {
    background: var(--surface-2);
    border: 2px dashed var(--border-strong);
    border-radius: var(--radius-md);
    padding: 32px 20px;
    text-align: center;
    color: var(--text-tertiary);
    font-size: 13px;
  }

  .flashcard-preview {
    perspective: 1000px;
    height: 120px;
  }
  .flashcard-inner {
    background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
    border: 1.5px solid var(--blue-mid);
    border-radius: var(--radius-lg);
    height: 100%;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    text-align: center;
    font-size: 14px; color: var(--blue-dark); font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    position: relative;
  }
  .flashcard-inner:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
  .flashcard-hint { position: absolute; bottom: 8px; right: 10px; font-size: 11px; color: var(--text-tertiary); font-weight: 400; }

  .accordion-preview { border: 1.5px solid var(--border); border-radius: var(--radius-md); overflow: hidden; }
  .accordion-item { border-bottom: 1px solid var(--border); }
  .accordion-item:last-child { border-bottom: none; }
  .accordion-trigger {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 11px 14px;
    font-size: 13.5px; font-weight: 600; color: var(--text-primary);
    background: none; border: none; cursor: pointer; text-align: left;
    transition: var(--transition);
  }
  .accordion-trigger:hover { background: var(--surface-2); }
  .accordion-content { padding: 10px 14px 12px; font-size: 13px; color: var(--text-secondary); border-top: 1px solid var(--border); background: var(--surface-2); line-height: 1.6; }

  .tabs-preview {}
  .tabs-nav { display: flex; border-bottom: 1.5px solid var(--border); gap: 0; }
  .tab-btn {
    padding: 8px 14px; font-size: 13px; font-weight: 500; background: none; border: none;
    color: var(--text-tertiary); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1.5px;
    transition: var(--transition);
  }
  .tab-btn.active { color: var(--blue); border-bottom-color: var(--blue); font-weight: 600; }
  .tab-content { padding: 12px 14px; font-size: 13.5px; color: var(--text-primary); line-height: 1.6; }

  .timeline-preview { padding: 4px 0; }
  .timeline-item { display: flex; gap: 14px; margin-bottom: 14px; position: relative; }
  .timeline-item:last-child { margin-bottom: 0; }
  .timeline-dot-col { display: flex; flex-direction: column; align-items: center; }
  .timeline-dot {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--blue); color: white;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; flex-shrink: 0;
  }
  .timeline-line { width: 1.5px; flex: 1; background: var(--border); margin-top: 4px; }
  .timeline-content { padding-top: 4px; }
  .timeline-title { font-size: 13.5px; font-weight: 700; color: var(--text-primary); }
  .timeline-date { font-size: 11.5px; color: var(--text-tertiary); margin-top: 1px; }
  .timeline-desc { font-size: 13px; color: var(--text-secondary); margin-top: 4px; line-height: 1.5; }

  .steps-preview { display: flex; flex-direction: column; gap: 10px; }
  .step-item { display: flex; gap: 12px; align-items: flex-start; }
  .step-num {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--blue); color: white;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; flex-shrink: 0;
  }
  .step-content { padding-top: 4px; }
  .step-title { font-size: 13.5px; font-weight: 700; color: var(--text-primary); }
  .step-desc { font-size: 13px; color: var(--text-secondary); margin-top: 2px; line-height: 1.5; }

  /* ─ Add Block Button ─ */
  .add-block-row {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 10px;
    padding: 0 2px;
  }
  .add-block-line { flex: 1; height: 1px; background: var(--border); }

  .btn-add-block {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: var(--font-sans);
    font-size: 12px; font-weight: 600;
    color: var(--blue);
    background: var(--blue-light);
    border: 1px solid var(--blue-mid);
    border-radius: 99px;
    padding: 5px 14px;
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
  }
  .btn-add-block:hover { background: #DBEAFE; border-color: var(--blue); box-shadow: var(--shadow-sm); }

  /* ─ Block Picker Modal ─ */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(17, 24, 39, 0.5);
    backdrop-filter: blur(4px);
    z-index: 500;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

  .modal-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    width: 660px;
    max-height: 80vh;
    overflow: hidden;
    display: flex; flex-direction: column;
    animation: slideUp 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .modal-header {
    padding: 18px 20px 12px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .modal-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; }
  .modal-search {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface-2);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    padding: 8px 12px;
  }
  .modal-search input {
    flex: 1; background: none; border: none; outline: none;
    font-family: var(--font-sans); font-size: 13.5px; color: var(--text-primary);
  }
  .modal-search input::placeholder { color: var(--text-tertiary); }

  .modal-body { flex: 1; overflow-y: auto; padding: 14px 20px 20px; }

  .block-category-label {
    font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em;
    color: var(--text-tertiary);
    padding: 10px 0 6px;
    display: flex; align-items: center; gap: 6px;
  }
  .block-category-label::after {
    content: '';
    flex: 1; height: 1px;
    background: var(--border);
  }

  .block-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 4px; }

  .block-pick-btn {
    display: flex; flex-direction: column; align-items: flex-start; gap: 3px;
    padding: 10px 11px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    text-align: left;
  }
  .block-pick-btn:hover { border-color: var(--blue); background: var(--blue-light); }
  .block-pick-btn:hover .block-pick-icon { background: var(--blue); color: white; }
  .block-pick-icon {
    width: 28px; height: 28px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    background: var(--surface-2);
    color: var(--text-secondary);
    transition: var(--transition);
  }
  .block-pick-label { font-size: 12px; font-weight: 600; color: var(--text-primary); line-height: 1.2; }
  .block-pick-desc { font-size: 10.5px; color: var(--text-tertiary); line-height: 1.3; }

  /* ─ Right Preview ─ */
  .preview-panel {
    background: var(--bg);
    display: flex; flex-direction: column;
    overflow: hidden;
  }

  .preview-topbar {
    display: flex; align-items: center; gap: 8px;
    padding: 0 16px;
    height: 44px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .preview-title-bar { font-size: 12px; font-weight: 600; color: var(--text-secondary); }

  .live-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em;
    color: var(--green);
    background: var(--green-light);
    border: 1px solid #A7F3D0;
    border-radius: 99px;
    padding: 2px 8px;
  }
  .live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); animation: pulse-dot 2s infinite; }

  .preview-device-btns { display: flex; gap: 2px; margin-left: auto; }

  .preview-scroll {
    flex: 1; overflow-y: auto;
    padding: 0;
  }

  .preview-browser-chrome {
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
    padding: 8px 12px;
    display: flex; align-items: center; gap: 6px;
  }
  .chrome-dots { display: flex; gap: 4px; }
  .chrome-dot { width: 8px; height: 8px; border-radius: 50%; }
  .chrome-url { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 3px 8px; font-size: 10.5px; color: var(--text-tertiary); }

  .preview-content { padding: 28px 28px 60px; background: white; min-height: 100%; }

  /* ─ Theme Panel ─ */
  .theme-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    padding: 10px;
    width: 200px;
    z-index: 300;
    animation: slideUp 0.15s ease;
  }

  .theme-option {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 13px; font-weight: 500;
    color: var(--text-primary);
    transition: var(--transition);
    border: none; background: none; width: 100%; text-align: left;
  }
  .theme-option:hover { background: var(--surface-2); }
  .theme-option.active { background: var(--blue-light); color: var(--blue); font-weight: 700; }
  .theme-swatch { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0; }

  /* ─ AI Panel ─ */
  .ai-panel {
    position: absolute;
    top: 52px; right: 0;
    width: 340px; height: calc(100vh - 52px);
    background: var(--surface);
    border-left: 1px solid var(--border);
    z-index: 200;
    display: flex; flex-direction: column;
    box-shadow: var(--shadow-xl);
    animation: slideInRight 0.2s ease;
  }

  @keyframes slideInRight {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .ai-header {
    padding: 16px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .ai-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: linear-gradient(135deg, #EDE9FE, #DDD6FE);
    color: var(--purple);
    border: 1px solid #C4B5FD;
    border-radius: 99px;
    font-size: 10.5px; font-weight: 700;
    padding: 3px 9px;
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 6px;
  }

  .ai-body { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; }

  .ai-prompt-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .ai-chip {
    font-size: 12px; font-weight: 500;
    padding: 5px 11px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 99px;
    cursor: pointer; color: var(--text-secondary);
    transition: var(--transition);
    white-space: nowrap;
  }
  .ai-chip:hover { background: var(--purple-light); color: var(--purple); border-color: #DDD6FE; }

  .ai-result {
    background: linear-gradient(135deg, var(--purple-light), #F5F3FF);
    border: 1px solid #DDD6FE;
    border-radius: var(--radius-md);
    padding: 12px 14px;
    font-size: 13px; line-height: 1.65; color: #4C1D95;
  }

  .ai-footer {
    padding: 12px 14px;
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }

  .ai-input-row {
    display: flex; gap: 7px;
  }
  .ai-input {
    flex: 1;
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--text-primary);
    background: var(--surface-2);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 8px 11px;
    outline: none;
    transition: var(--transition);
  }
  .ai-input:focus { border-color: var(--purple); box-shadow: 0 0 0 3px var(--purple-light); }

  .btn-ai {
    background: var(--purple);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    padding: 8px 14px;
    font-family: var(--font-sans);
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
    display: flex; align-items: center; gap: 5px;
  }
  .btn-ai:hover { background: #6D28D9; }
  .btn-ai:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ─ Export Modal ─ */
  .export-modal .modal-card { width: 480px; }
  .export-option {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    margin-bottom: 7px;
    background: var(--surface);
  }
  .export-option:hover { border-color: var(--blue); background: var(--blue-light); }
  .export-option.selected { border-color: var(--blue); background: var(--blue-light); }
  .export-icon {
    width: 36px; height: 36px; border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
    background: var(--surface-2);
  }
  .export-info .export-name { font-size: 13.5px; font-weight: 700; color: var(--text-primary); }
  .export-info .export-desc { font-size: 12px; color: var(--text-tertiary); margin-top: 1px; }

  /* ─ Media Library ─ */
  .media-library {
    position: fixed; inset: 0;
    z-index: 600;
    background: rgba(17,24,39,0.6);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
  }
  .media-card {
    background: var(--surface);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    width: 760px; max-height: 85vh;
    display: flex; flex-direction: column;
    overflow: hidden;
    animation: slideUp 0.2s ease;
  }

  /* Utility */
  .flex { display: flex; }
  .items-center { align-items: center; }
  .gap-8 { gap: 8px; }
  .mt-auto { margin-top: auto; }
  .text-sm { font-size: 12.5px; }
  .text-muted { color: var(--text-tertiary); }
  .font-semibold { font-weight: 600; }
  .w-full { width: 100%; }

  /* Skeleton */
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, var(--border) 25%, var(--surface-2) 50%, var(--border) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }

  /* Tooltip */
  .has-tooltip { position: relative; }
  .tooltip {
    position: absolute; bottom: calc(100% + 5px); left: 50%; transform: translateX(-50%);
    background: var(--text-primary); color: white;
    font-size: 11px; font-weight: 500;
    padding: 4px 8px; border-radius: 5px;
    white-space: nowrap; pointer-events: none;
    opacity: 0; transition: opacity 0.1s;
    z-index: 999;
  }
  .has-tooltip:hover .tooltip { opacity: 1; }
`;

// ─── SVG Icons ─────────────────────────────────────────────────────────────
const Ic = ({ name, size = 14, color }) => {
  const paths = {
    logo: <><rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    undo: <path d="M9 14 4 9l5-5M4 9h11a6 6 0 010 12h-1" fill="none"/>,
    redo: <path d="M15 14l5-5-5-5M19 9H8A6 6 0 008 21h1" fill="none"/>,
    save: <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8" fill="none"/>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none"/><circle cx="12" cy="12" r="3" fill="none"/></>,
    palette: <><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" fill="none"/></>,
    ai: <><path d="M12 2a2 2 0 012 2c0 1.1-.9 2-2 2s-2-.9-2-2a2 2 0 012-2z"/><path d="M12 20a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2zM20 12a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2zM4 12a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2z" fill="none"/><path d="M12 6v4M12 14v4M6 12h4M14 12h4" stroke-width="2" fill="none"/></>,
    settings: <><circle cx="12" cy="12" r="3" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" fill="none"/></>,
    export: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" fill="none"/></>,
    drag: <><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/></>,
    trash: <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" fill="none"/>,
    copy: <path d="M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8l-4-4H8zm4 0v4h4M12 12v6M9 15h6" fill="none"/>,
    chevronDown: <path d="M6 9l6 6 6-6" fill="none"/>,
    chevronRight: <path d="M9 18l6-6-6-6" fill="none"/>,
    chevronUp: <path d="M18 15l-6-6-6 6" fill="none"/>,
    arrowUp: <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
    arrowDown: <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" fill="none"/><circle cx="8.5" cy="8.5" r="1.5" fill="none"/><polyline points="21 15 16 10 5 21" fill="none"/></>,
    video: <><polygon points="23 7 16 12 23 17 23 7" fill="none"/><rect x="1" y="5" width="15" height="14" rx="2" fill="none"/></>,
    audio: <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM21 16a3 3 0 11-6 0 3 3 0 016 0z" fill="none"/>,
    file: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6" fill="none"/>,
    link: <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" fill="none"/>,
    check: <polyline points="20 6 9 17 4 12" fill="none"/>,
    search: <><circle cx="11" cy="11" r="8" fill="none"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    sparkles: <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75L5 3z"/></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" fill="none"/></>,
    monitor: <><rect x="2" y="3" width="20" height="14" rx="2" fill="none"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    bookOpen: <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" fill="none"/>,
    folder: <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" fill="none"/>,
    play: <polygon points="5 3 19 12 5 21 5 3" fill="none"/>,
    quote: <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm10 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="none"/>,
    minus: <line x1="5" y1="12" x2="19" y2="12"/>,
    info: <><circle cx="12" cy="12" r="10" fill="none"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    alertTriangle: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="none"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none"/>,
    lightbulb: <path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" fill="none"/>,
    bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" fill="none"/>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none"/>,
    hash: <><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></>,
    code: <><polyline points="16 18 22 12 16 6" fill="none"/><polyline points="8 6 2 12 8 18" fill="none"/></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" fill="none"/><polyline points="2 17 12 22 22 17" fill="none"/><polyline points="2 12 12 17 22 12" fill="none"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" fill="none"/><rect x="14" y="3" width="7" height="7" fill="none"/><rect x="14" y="14" width="7" height="7" fill="none"/><rect x="3" y="14" width="7" height="7" fill="none"/></>,
    menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    type: <><polyline points="4 7 4 4 20 4 20 7" fill="none"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color || "currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

// ─── Data ────────────────────────────────────────────────────────────────────
const BLOCK_CATEGORIES = [
  {
    label: "Text", icon: "type", color: "#6B7280",
    blocks: [
      { type: "title", label: "Title", desc: "Main lesson title", icon: "type", emoji: "Tt" },
      { type: "heading", label: "Heading", desc: "H2 section header", icon: "hash", emoji: "H2" },
      { type: "subheading", label: "Subheading", desc: "H3 subsection", icon: "hash", emoji: "H3" },
      { type: "paragraph", label: "Paragraph", desc: "Body text", icon: "menu", emoji: "¶" },
      { type: "quote", label: "Quote", desc: "Pull quote", icon: "quote", emoji: "❝" },
      { type: "divider", label: "Divider", desc: "Visual separator", icon: "minus", emoji: "—" },
    ]
  },
  {
    label: "Media", icon: "image", color: "#0284C7",
    blocks: [
      { type: "image", label: "Image", desc: "Single image", icon: "image", emoji: "🖼" },
      { type: "gallery", label: "Gallery", desc: "Image collection", icon: "grid", emoji: "⊞" },
      { type: "video", label: "Video", desc: "Upload or URL", icon: "video", emoji: "▶" },
      { type: "audio", label: "Audio", desc: "Audio player", icon: "audio", emoji: "♫" },
      { type: "animation", label: "Animation", desc: "GIF or Lottie", icon: "zap", emoji: "✨" },
    ]
  },
  {
    label: "Callouts", icon: "info", color: "#D97706",
    blocks: [
      { type: "highlight", label: "Highlight", desc: "Important info", icon: "star", emoji: "★" },
      { type: "note", label: "Note", desc: "Additional context", icon: "info", emoji: "ℹ" },
      { type: "warning", label: "Warning", desc: "Caution notice", icon: "alertTriangle", emoji: "⚠" },
      { type: "tip", label: "Tip", desc: "Helpful hint", icon: "lightbulb", emoji: "💡" },
      { type: "summary", label: "Summary", desc: "Key takeaways", icon: "bookOpen", emoji: "📋" },
      { type: "key_concept", label: "Key Concept", desc: "Core concept", icon: "bookmarks", emoji: "🔑" },
    ]
  },
  {
    label: "Knowledge", icon: "code", color: "#059669",
    blocks: [
      { type: "definition", label: "Definition", desc: "Term + meaning", icon: "bookmark", emoji: "📖" },
      { type: "formula", label: "Formula", desc: "Math or code", icon: "code", emoji: "</>" },
    ]
  },
  {
    label: "Interactive", icon: "sparkles", color: "#7C3AED",
    blocks: [
      { type: "mcq", label: "Multiple Choice", desc: "Quiz question", icon: "check", emoji: "☑" },
      { type: "truefalse", label: "True / False", desc: "Binary question", icon: "check", emoji: "T/F" },
      { type: "flashcard", label: "Flashcard", desc: "Flip card", icon: "layers", emoji: "🃏" },
      { type: "accordion", label: "Accordion", desc: "Collapsible list", icon: "chevronDown", emoji: "≡" },
      { type: "tabs", label: "Tabs", desc: "Tabbed sections", icon: "grid", emoji: "⊟" },
      { type: "timeline", label: "Timeline", desc: "Chronological flow", icon: "menu", emoji: "⟶" },
      { type: "steps", label: "Step Process", desc: "Numbered steps", icon: "layers", emoji: "①" },
    ]
  },
  {
    label: "Documents", icon: "file", color: "#9CA3AF",
    blocks: [
      { type: "pdf", label: "PDF Viewer", desc: "Embed PDF", icon: "file", emoji: "📄" },
      { type: "download", label: "File Download", desc: "Downloadable file", icon: "download", emoji: "⬇" },
      { type: "external_link", label: "External Link", desc: "Web link card", icon: "link", emoji: "🔗" },
    ]
  },
];

const ALL_BLOCK_TYPES = BLOCK_CATEGORIES.flatMap(c => c.blocks.map(b => ({ ...b, category: c.label })));

const createBlock = (type) => {
  const base = { id: `b_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, type, collapsed: false };
  const defs = {
    title: { text: "Welcome to This Lesson" },
    heading: { text: "Introduction to the Topic" },
    subheading: { text: "What You Will Learn" },
    paragraph: { text: "This lesson explores the foundational concepts that every learner should understand. We will cover key ideas, practical applications, and examples." },
    quote: { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    divider: {},
    image: { url: "", alt: "", caption: "" },
    gallery: { images: [] },
    video: { url: "", caption: "" },
    audio: { url: "", title: "Lecture Audio" },
    animation: { url: "", type: "gif" },
    highlight: { text: "This is a critical point that learners should remember." },
    note: { text: "Remember to review the supplementary materials provided for this section." },
    warning: { text: "Skipping this section may affect your understanding of later topics." },
    tip: { text: "Use the flashcards at the end to reinforce your learning." },
    summary: { text: "In this section, we covered the key concepts of the topic, explored practical applications, and reviewed real-world examples." },
    key_concept: { title: "Core Principle", text: "Every effective learning experience is built on clear objectives, meaningful content, and active engagement." },
    definition: { term: "Learning Objective", text: "A clear statement that describes what the learner should be able to do after completing the instructional content." },
    formula: { code: "f(x) = ax² + bx + c", language: "math" },
    mcq: { question: "Which of the following best describes a learning objective?", options: ["A list of topics to cover", "A measurable statement of expected outcomes", "The course schedule", "A summary of the content"], correct: 1 },
    truefalse: { question: "Learning objectives should be measurable and specific.", correct: true },
    flashcard: { front: "What is scaffolding in education?", back: "A technique where support is gradually removed as the learner gains competence." },
    accordion: { items: [{ title: "What is formative assessment?", content: "Formative assessment is ongoing evaluation used to monitor learning progress and provide feedback." }, { title: "Why is feedback important?", content: "Feedback helps learners identify gaps in understanding and guides improvement." }] },
    tabs: { tabs: [{ label: "Overview", content: "This section provides an overview of the main concepts." }, { label: "Examples", content: "Here are practical examples of the concepts in action." }, { label: "Summary", content: "Key takeaways from this section." }] },
    timeline: { events: [{ date: "Week 1", title: "Foundation", desc: "Core concepts and terminology" }, { date: "Week 2", title: "Application", desc: "Hands-on practice and case studies" }, { date: "Week 3", title: "Assessment", desc: "Review and evaluation" }] },
    steps: { steps: [{ title: "Identify Learning Needs", desc: "Conduct a needs analysis to understand what learners require." }, { title: "Design Content", desc: "Create structured content that meets the identified needs." }, { title: "Develop Materials", desc: "Build interactive and engaging course assets." }] },
    pdf: { url: "", filename: "Course Material.pdf" },
    download: { url: "", filename: "Reference Guide.pdf", size: "2.4 MB" },
    external_link: { url: "https://example.com", title: "Additional Resource", desc: "Explore supplementary materials on this topic." },
  };
  return { ...base, ...(defs[type] || {}) };
};

const INITIAL_BLOCKS = [
  createBlock("title"),
  createBlock("paragraph"),
  createBlock("note"),
  createBlock("heading"),
  createBlock("mcq"),
  createBlock("flashcard"),
  createBlock("accordion"),
  createBlock("timeline"),
];

const COURSE_DATA = {
  name: "Instructional Design Fundamentals",
  modules: [
    { id: "m1", name: "Module 1 — Foundations", color: "#2563EB", lessons: [
      { id: "l1", name: "Introduction to ID", status: "done" },
      { id: "l2", name: "Learning Theories", status: "done" },
      { id: "l3", name: "Needs Analysis", status: "active" },
    ]},
    { id: "m2", name: "Module 2 — Design", color: "#059669", lessons: [
      { id: "l4", name: "Writing Objectives", status: "todo" },
      { id: "l5", name: "Content Mapping", status: "todo" },
    ]},
    { id: "m3", name: "Module 3 — Development", color: "#7C3AED", lessons: [
      { id: "l6", name: "Media Production", status: "todo" },
      { id: "l7", name: "Interactive Design", status: "todo" },
      { id: "l8", name: "Accessibility", status: "todo" },
    ]},
  ]
};

const THEMES = [
  { id: "light", name: "Light", swatch: "#FFFFFF" },
  { id: "slate", name: "Slate", swatch: "#F1F5F9" },
  { id: "dark", name: "Dark", swatch: "#1E293B" },
  { id: "warmth", name: "Warmth", swatch: "#FEF3C7" },
  { id: "forest", name: "Forest", swatch: "#ECFDF5" },
];

// ─── Block Type → Chip Appearance ────────────────────────────────────────────
const BLOCK_META = {
  title: { label: "Title", bg: "#F3F4F6", color: "#374151" },
  heading: { label: "Heading", bg: "#EFF6FF", color: "#1D4ED8" },
  subheading: { label: "Subheading", bg: "#EFF6FF", color: "#1D4ED8" },
  paragraph: { label: "Paragraph", bg: "#F9FAFB", color: "#6B7280" },
  quote: { label: "Quote", bg: "#EFF6FF", color: "#1D4ED8" },
  divider: { label: "Divider", bg: "#F3F4F6", color: "#9CA3AF" },
  image: { label: "Image", bg: "#F0F9FF", color: "#0284C7" },
  gallery: { label: "Gallery", bg: "#F0F9FF", color: "#0284C7" },
  video: { label: "Video", bg: "#F0F9FF", color: "#0284C7" },
  audio: { label: "Audio", bg: "#F0F9FF", color: "#0284C7" },
  animation: { label: "Animation", bg: "#F0F9FF", color: "#0284C7" },
  highlight: { label: "Highlight", bg: "#FFFBEB", color: "#D97706" },
  note: { label: "Note", bg: "#EFF6FF", color: "#2563EB" },
  warning: { label: "Warning", bg: "#FEF2F2", color: "#DC2626" },
  tip: { label: "Tip", bg: "#ECFDF5", color: "#059669" },
  summary: { label: "Summary", bg: "#F5F3FF", color: "#7C3AED" },
  key_concept: { label: "Key Concept", bg: "#F0FDFA", color: "#0D9488" },
  definition: { label: "Definition", bg: "#ECFDF5", color: "#059669" },
  formula: { label: "Formula", bg: "#1E293B", color: "#94A3B8" },
  mcq: { label: "Quiz", bg: "#F5F3FF", color: "#7C3AED" },
  truefalse: { label: "True/False", bg: "#F5F3FF", color: "#7C3AED" },
  flashcard: { label: "Flashcard", bg: "#EFF6FF", color: "#2563EB" },
  accordion: { label: "Accordion", bg: "#F9FAFB", color: "#374151" },
  tabs: { label: "Tabs", bg: "#F9FAFB", color: "#374151" },
  timeline: { label: "Timeline", bg: "#EFF6FF", color: "#2563EB" },
  steps: { label: "Steps", bg: "#ECFDF5", color: "#059669" },
  pdf: { label: "PDF", bg: "#FEF2F2", color: "#DC2626" },
  download: { label: "Download", bg: "#F3F4F6", color: "#6B7280" },
  external_link: { label: "Link", bg: "#F0F9FF", color: "#0284C7" },
};

// ─── Block Editor ────────────────────────────────────────────────────────────
const BlockEditor = ({ block, onChange }) => {
  const field = (label, key, opts = {}) => (
    <div className="field-group">
      <label className="field-label">{label}</label>
      {opts.multiline
        ? <textarea className="textarea-input" value={block[key] || ""} onChange={e => onChange({ [key]: e.target.value })} placeholder={opts.placeholder || ""} rows={opts.rows || 3}/>
        : <input className="text-input" value={block[key] || ""} onChange={e => onChange({ [key]: e.target.value })} placeholder={opts.placeholder || ""}/>
      }
    </div>
  );

  switch (block.type) {
    case "title": return field("Title Text", "text", { placeholder: "Enter lesson title…" });
    case "heading": return field("Heading", "text", { placeholder: "Section heading…" });
    case "subheading": return field("Subheading", "text", { placeholder: "Subsection heading…" });
    case "paragraph": return field("Content", "text", { multiline: true, rows: 4, placeholder: "Write your paragraph…" });
    case "quote":
      return (<>
        {field("Quote Text", "text", { multiline: true, rows: 3, placeholder: "Enter a meaningful quote…" })}
        {field("Attribution", "author", { placeholder: "Name, Title" })}
      </>);
    case "divider": return <p style={{ fontSize: 12, color: "var(--text-tertiary)", padding: "4px 0" }}>A horizontal rule will be rendered.</p>;
    case "image":
      return (<>
        {field("Image URL", "url", { placeholder: "https://…" })}
        {field("Alt Text", "alt", { placeholder: "Descriptive alt text for accessibility" })}
        {field("Caption", "caption", { placeholder: "Optional caption" })}
      </>);
    case "video":
      return (<>
        {field("Video URL", "url", { placeholder: "YouTube, Vimeo, or .mp4 URL" })}
        {field("Caption", "caption", { placeholder: "Optional caption" })}
      </>);
    case "audio":
      return (<>
        {field("Audio URL", "url", { placeholder: "Link to .mp3 or .ogg" })}
        {field("Track Title", "title", { placeholder: "Audio title" })}
      </>);
    case "highlight": case "note": case "warning": case "tip": case "summary":
      return field("Content", "text", { multiline: true, rows: 3, placeholder: `${block.type} text…` });
    case "key_concept":
      return (<>
        {field("Concept Title", "title", { placeholder: "Concept name…" })}
        {field("Explanation", "text", { multiline: true, rows: 3, placeholder: "Describe the concept…" })}
      </>);
    case "definition":
      return (<>
        {field("Term", "term", { placeholder: "Term to define…" })}
        {field("Definition", "text", { multiline: true, rows: 2, placeholder: "Clear, concise definition…" })}
      </>);
    case "formula":
      return (<>
        {field("Formula / Code", "code", { multiline: true, rows: 2, placeholder: "E = mc², or code snippet…" })}
        {field("Language / Note", "language", { placeholder: "math, python, etc." })}
      </>);
    case "mcq": {
      const opts = block.options || ["", "", "", ""];
      return (<>
        {field("Question", "question", { multiline: true, rows: 2, placeholder: "Enter your question…" })}
        <div className="field-group">
          <label className="field-label">Options (check correct)</label>
          {opts.map((opt, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <button onClick={() => onChange({ correct: i })} style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${block.correct === i ? "var(--blue)" : "var(--border-strong)"}`, background: block.correct === i ? "var(--blue)" : "white", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {block.correct === i && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }}/>}
              </button>
              <input className="text-input" style={{ flex: 1, padding: "6px 10px", fontSize: 13 }} value={opt} placeholder={`Option ${String.fromCharCode(65+i)}`} onChange={e => { const o = [...opts]; o[i] = e.target.value; onChange({ options: o }); }}/>
              <button onClick={() => { const o = opts.filter((_, j) => j !== i); onChange({ options: o, correct: block.correct >= i ? Math.max(0, block.correct - 1) : block.correct }); }} style={{ background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer", fontSize: 16, padding: 2, lineHeight: 1 }}>×</button>
            </div>
          ))}
          <button onClick={() => onChange({ options: [...opts, ""] })} style={{ fontSize: 11.5, color: "var(--blue)", background: "var(--blue-light)", border: "1px dashed var(--blue-mid)", borderRadius: "var(--radius-sm)", padding: "4px 10px", cursor: "pointer", fontWeight: 600, marginTop: 2 }}>+ Add Option</button>
        </div>
      </>);
    }
    case "truefalse":
      return (<>
        {field("Statement", "question", { multiline: true, rows: 2, placeholder: "Enter a true or false statement…" })}
        <div className="field-group">
          <label className="field-label">Correct Answer</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[true, false].map(v => (
              <button key={String(v)} onClick={() => onChange({ correct: v })} style={{ flex: 1, padding: "7px", borderRadius: "var(--radius-sm)", border: `1.5px solid ${block.correct === v ? "var(--blue)" : "var(--border)"}`, background: block.correct === v ? "var(--blue-light)" : "white", color: block.correct === v ? "var(--blue)" : "var(--text-secondary)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                {v ? "True" : "False"}
              </button>
            ))}
          </div>
        </div>
      </>);
    case "flashcard":
      return (<>
        {field("Front (Question)", "front", { multiline: true, rows: 2, placeholder: "Question or term…" })}
        {field("Back (Answer)", "back", { multiline: true, rows: 2, placeholder: "Answer or definition…" })}
      </>);
    case "accordion": {
      const items = block.items || [];
      return (<>
        <div className="field-group"><label className="field-label">Sections</label>
          {items.map((item, i) => (
            <div key={i} style={{ border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Section {i+1}</span>
                <button onClick={() => onChange({ items: items.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 16 }}>×</button>
              </div>
              <input className="text-input" style={{ marginBottom: 6, fontSize: 13 }} placeholder="Section title…" value={item.title} onChange={e => { const it = [...items]; it[i] = { ...it[i], title: e.target.value }; onChange({ items: it }); }}/>
              <textarea className="textarea-input" style={{ fontSize: 13, minHeight: 56 }} placeholder="Section content…" value={item.content} onChange={e => { const it = [...items]; it[i] = { ...it[i], content: e.target.value }; onChange({ items: it }); }}/>
            </div>
          ))}
          <button onClick={() => onChange({ items: [...items, { title: "", content: "" }] })} style={{ fontSize: 11.5, color: "var(--blue)", background: "var(--blue-light)", border: "1px dashed var(--blue-mid)", borderRadius: "var(--radius-sm)", padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>+ Add Section</button>
        </div>
      </>);
    }
    case "tabs": {
      const tabs = block.tabs || [];
      return (<>
        <div className="field-group"><label className="field-label">Tabs</label>
          {tabs.map((tab, i) => (
            <div key={i} style={{ border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Tab {i+1}</span>
                <button onClick={() => onChange({ tabs: tabs.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 16 }}>×</button>
              </div>
              <input className="text-input" style={{ marginBottom: 6, fontSize: 13 }} placeholder="Tab label…" value={tab.label} onChange={e => { const t = [...tabs]; t[i] = { ...t[i], label: e.target.value }; onChange({ tabs: t }); }}/>
              <textarea className="textarea-input" style={{ fontSize: 13, minHeight: 56 }} placeholder="Tab content…" value={tab.content} onChange={e => { const t = [...tabs]; t[i] = { ...t[i], content: e.target.value }; onChange({ tabs: t }); }}/>
            </div>
          ))}
          <button onClick={() => onChange({ tabs: [...tabs, { label: "New Tab", content: "" }] })} style={{ fontSize: 11.5, color: "var(--blue)", background: "var(--blue-light)", border: "1px dashed var(--blue-mid)", borderRadius: "var(--radius-sm)", padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>+ Add Tab</button>
        </div>
      </>);
    }
    case "timeline": {
      const events = block.events || [];
      return (<>
        <div className="field-group"><label className="field-label">Events</label>
          {events.map((ev, i) => (
            <div key={i} style={{ border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Event {i+1}</span>
                <button onClick={() => onChange({ events: events.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 16 }}>×</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 6 }}>
                <input className="text-input" style={{ fontSize: 13 }} placeholder="Date/Label" value={ev.date} onChange={e => { const ev2 = [...events]; ev2[i] = { ...ev2[i], date: e.target.value }; onChange({ events: ev2 }); }}/>
                <input className="text-input" style={{ fontSize: 13 }} placeholder="Event title" value={ev.title} onChange={e => { const ev2 = [...events]; ev2[i] = { ...ev2[i], title: e.target.value }; onChange({ events: ev2 }); }}/>
              </div>
              <input className="text-input" style={{ marginTop: 6, fontSize: 13 }} placeholder="Short description" value={ev.desc} onChange={e => { const ev2 = [...events]; ev2[i] = { ...ev2[i], desc: e.target.value }; onChange({ events: ev2 }); }}/>
            </div>
          ))}
          <button onClick={() => onChange({ events: [...events, { date: "", title: "", desc: "" }] })} style={{ fontSize: 11.5, color: "var(--blue)", background: "var(--blue-light)", border: "1px dashed var(--blue-mid)", borderRadius: "var(--radius-sm)", padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>+ Add Event</button>
        </div>
      </>);
    }
    case "steps": {
      const steps = block.steps || [];
      return (<>
        <div className="field-group"><label className="field-label">Steps</label>
          {steps.map((step, i) => (
            <div key={i} style={{ border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Step {i+1}</span>
                <button onClick={() => onChange({ steps: steps.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 16 }}>×</button>
              </div>
              <input className="text-input" style={{ marginBottom: 6, fontSize: 13 }} placeholder="Step title" value={step.title} onChange={e => { const s = [...steps]; s[i] = { ...s[i], title: e.target.value }; onChange({ steps: s }); }}/>
              <textarea className="textarea-input" style={{ fontSize: 13, minHeight: 48 }} placeholder="Step description" value={step.desc} onChange={e => { const s = [...steps]; s[i] = { ...s[i], desc: e.target.value }; onChange({ steps: s }); }}/>
            </div>
          ))}
          <button onClick={() => onChange({ steps: [...steps, { title: "", desc: "" }] })} style={{ fontSize: 11.5, color: "var(--blue)", background: "var(--blue-light)", border: "1px dashed var(--blue-mid)", borderRadius: "var(--radius-sm)", padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>+ Add Step</button>
        </div>
      </>);
    }
    case "download":
      return (<>
        {field("File URL", "url", { placeholder: "https://…" })}
        {field("Display Name", "filename", { placeholder: "Document Name.pdf" })}
        {field("File Size", "size", { placeholder: "e.g. 2.4 MB" })}
      </>);
    case "external_link":
      return (<>
        {field("URL", "url", { placeholder: "https://…" })}
        {field("Link Title", "title", { placeholder: "Descriptive link name" })}
        {field("Description", "desc", { placeholder: "Brief description of this resource" })}
      </>);
    default:
      return <p style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>Configure this block above.</p>;
  }
};

// ─── Block Preview ────────────────────────────────────────────────────────────
const BlockPreview = ({ block, activeTab, setActiveTab, flipped, setFlipped, openAccordion, setOpenAccordion }) => {
  switch (block.type) {
    case "title": return <div className="preview-title">{block.text}</div>;
    case "heading": return <h2 className="preview-heading" style={{ fontFamily: "var(--font-sans)" }}>{block.text}</h2>;
    case "subheading": return <h3 className="preview-subheading">{block.text}</h3>;
    case "paragraph": return <p className="preview-paragraph">{block.text}</p>;
    case "quote": return (
      <blockquote className="preview-quote">
        <p style={{ margin: "0 0 6px" }}>{block.text}</p>
        {block.author && <cite style={{ fontSize: 12, fontStyle: "normal", opacity: 0.75 }}>— {block.author}</cite>}
      </blockquote>
    );
    case "divider": return <hr className="divider-preview"/>;
    case "image":
      return block.url
        ? <figure style={{ margin: 0 }}><img src={block.url} alt={block.alt} style={{ width: "100%", borderRadius: "var(--radius-md)", maxHeight: 240, objectFit: "cover" }}/>{block.caption && <figcaption style={{ textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", marginTop: 7 }}>{block.caption}</figcaption>}</figure>
        : <div className="media-placeholder"><Ic name="image" size={28}/><p style={{ marginTop: 10, marginBottom: 0 }}>No image selected — paste a URL in the editor</p></div>;
    case "video": return <div className="media-placeholder"><Ic name="play" size={28}/><p style={{ marginTop: 10, marginBottom: 4 }}>Video Preview</p><p style={{ fontSize: 11.5, marginBottom: 0 }}>{block.url || "No URL provided"}</p></div>;
    case "audio": return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--surface-2)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: "12px 14px" }}>
        <button style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--blue)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><Ic name="play" size={14} color="white"/></button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{block.title || "Audio Track"}</div>
          <div style={{ height: 4, background: "var(--border)", borderRadius: 99, marginTop: 6 }}><div style={{ width: "35%", height: "100%", background: "var(--blue)", borderRadius: 99 }}/></div>
        </div>
        <span style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>0:00</span>
      </div>
    );
    case "animation": return <div className="media-placeholder"><Ic name="zap" size={28}/><p style={{ marginTop: 10, marginBottom: 0 }}>Animation / GIF placeholder</p></div>;
    case "highlight": return (
      <div className="callout-box callout-highlight">
        <span className="callout-icon">★</span>
        <div className="callout-content"><div className="callout-label">Highlight</div>{block.text}</div>
      </div>
    );
    case "note": return (
      <div className="callout-box callout-note">
        <span className="callout-icon">ℹ</span>
        <div className="callout-content"><div className="callout-label">Note</div>{block.text}</div>
      </div>
    );
    case "warning": return (
      <div className="callout-box callout-warning">
        <span className="callout-icon">⚠</span>
        <div className="callout-content"><div className="callout-label">Warning</div>{block.text}</div>
      </div>
    );
    case "tip": return (
      <div className="callout-box callout-tip">
        <span className="callout-icon">💡</span>
        <div className="callout-content"><div className="callout-label">Tip</div>{block.text}</div>
      </div>
    );
    case "summary": return (
      <div className="callout-box callout-summary">
        <span className="callout-icon">📋</span>
        <div className="callout-content"><div className="callout-label">Summary</div>{block.text}</div>
      </div>
    );
    case "key_concept": return (
      <div className="callout-box callout-key-concept">
        <span className="callout-icon">🔑</span>
        <div className="callout-content"><div className="callout-label">Key Concept</div><strong style={{ fontSize: 13.5, display: "block", marginBottom: 3 }}>{block.title}</strong>{block.text}</div>
      </div>
    );
    case "definition": return (
      <div style={{ borderLeft: "3px solid var(--green)", paddingLeft: 14, background: "var(--green-light)", border: "1px solid #A7F3D0", borderLeft: "3px solid var(--green)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", padding: "10px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--green)", marginBottom: 3 }}>Definition</div>
        <strong style={{ fontSize: 14, color: "var(--text-primary)" }}>{block.term}</strong>
        <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "#065F46", lineHeight: 1.6 }}>{block.text}</p>
      </div>
    );
    case "formula": return (
      <div className="preview-formula">
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748B", marginBottom: 6 }}>{block.language || "formula"}</div>
        {block.code}
      </div>
    );
    case "mcq": {
      const opts = block.options || [];
      return (
        <div className="quiz-block">
          <div className="quiz-header" style={{ background: "#F5F3FF", color: "var(--purple)" }}><Ic name="check" size={13}/> Multiple Choice</div>
          <div className="quiz-body">
            <p className="quiz-question">{block.question}</p>
            {opts.map((opt, i) => (
              <div key={i} className={`quiz-option ${block.correct === i ? "correct" : ""}`}>
                <div className="option-radio" style={{ borderColor: block.correct === i ? "var(--green)" : undefined }}>{block.correct === i && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }}/>}</div>
                <span style={{ fontSize: 13.5, color: "var(--text-primary)" }}>{opt || `Option ${String.fromCharCode(65+i)}`}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "truefalse": return (
      <div className="quiz-block">
        <div className="quiz-header" style={{ background: "#F0FDF4", color: "var(--green)" }}><Ic name="check" size={13}/> True / False</div>
        <div className="quiz-body">
          <p className="quiz-question">{block.question}</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[true, false].map(v => (
              <div key={String(v)} style={{ flex: 1, padding: "10px", border: `1.5px solid ${block.correct === v ? "var(--green)" : "var(--border)"}`, background: block.correct === v ? "var(--green-light)" : "white", borderRadius: "var(--radius-sm)", textAlign: "center", fontSize: 14, fontWeight: 700, color: block.correct === v ? "var(--green)" : "var(--text-secondary)", cursor: "pointer" }}>
                {v ? "True" : "False"}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
    case "flashcard":
      return (
        <div className="flashcard-preview" onClick={() => setFlipped && setFlipped(!flipped)}>
          <div className="flashcard-inner">
            {flipped ? block.back : block.front}
            <span className="flashcard-hint">{flipped ? "← flip back" : "click to flip →"}</span>
          </div>
        </div>
      );
    case "accordion": {
      const items = block.items || [];
      return (
        <div className="accordion-preview">
          {items.map((item, i) => (
            <div key={i} className="accordion-item">
              <button className="accordion-trigger" onClick={() => setOpenAccordion && setOpenAccordion(openAccordion === i ? null : i)}>
                {item.title || `Section ${i+1}`}
                <Ic name={openAccordion === i ? "chevronUp" : "chevronDown"} size={14}/>
              </button>
              {openAccordion === i && <div className="accordion-content">{item.content}</div>}
            </div>
          ))}
        </div>
      );
    }
    case "tabs": {
      const tabs = block.tabs || [];
      const at = activeTab || 0;
      return (
        <div className="tabs-preview">
          <div className="tabs-nav">
            {tabs.map((tab, i) => (
              <button key={i} className={`tab-btn ${at === i ? "active" : ""}`} onClick={() => setActiveTab && setActiveTab(i)}>{tab.label || `Tab ${i+1}`}</button>
            ))}
          </div>
          <div className="tab-content">{tabs[at]?.content || ""}</div>
        </div>
      );
    }
    case "timeline": {
      const events = block.events || [];
      return (
        <div className="timeline-preview">
          {events.map((ev, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot-col">
                <div className="timeline-dot">{i+1}</div>
                {i < events.length - 1 && <div className="timeline-line"/>}
              </div>
              <div className="timeline-content">
                <div className="timeline-title">{ev.title || `Event ${i+1}`}</div>
                <div className="timeline-date">{ev.date}</div>
                <div className="timeline-desc">{ev.desc}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    case "steps": {
      const steps = block.steps || [];
      return (
        <div className="steps-preview">
          {steps.map((step, i) => (
            <div key={i} className="step-item">
              <div className="step-num">{i+1}</div>
              <div className="step-content">
                <div className="step-title">{step.title || `Step ${i+1}`}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    case "download": return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--surface-2)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)" }}>
        <div style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic name="file" size={20} color="#DC2626"/></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{block.filename || "File Name.pdf"}</div>
          <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 1 }}>{block.size || "Unknown size"}</div>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "var(--blue)", color: "white", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}><Ic name="download" size={12} color="white"/> Download</button>
      </div>
    );
    case "external_link": return (
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--surface-2)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", textDecoration: "none" }}>
        <div style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic name="link" size={20} color="var(--blue)"/></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{block.title || "External Resource"}</div>
          <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 1 }}>{block.url || "https://…"}</div>
          {block.desc && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{block.desc}</div>}
        </div>
        <Ic name="chevronRight" size={16} color="var(--text-tertiary)"/>
      </a>
    );
    default: return <p style={{ fontSize: 12.5, color: "var(--text-tertiary)", fontStyle: "italic" }}>Preview unavailable for this block type.</p>;
  }
};

// ─── Block Card Component ─────────────────────────────────────────────────────
const BlockCard = ({ block, index, total, onChange, onDelete, onDuplicate, onMoveUp, onMoveDown, onDragStart, onDragOver, onDrop, isDragOver, isDragging }) => {
  const meta = BLOCK_META[block.type] || { label: block.type, bg: "#F3F4F6", color: "#374151" };
  const [showPreview, setShowPreview] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(0);

  return (
    <div
      className={`block-card ${isDragOver ? "drag-over" : ""} ${isDragging ? "dragging" : ""} ${block.collapsed ? "collapsed" : ""}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={e => { e.preventDefault(); onDragOver(); }}
      onDrop={onDrop}
    >
      <div className="block-header">
        <div className="drag-handle"><Ic name="drag" size={14}/></div>
        <div className="block-type-chip" style={{ background: meta.bg, color: meta.color }}>{meta.label}</div>
        {block.type === "title" && block.text && (
          <span style={{ fontSize: 12.5, color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{block.text}</span>
        )}
        <div className="block-actions">
          <button className="block-action-btn has-tooltip" onClick={() => setShowPreview(p => !p)} title={showPreview ? "Hide preview" : "Show preview"}>
            <span className="tooltip">{showPreview ? "Hide preview" : "Show preview"}</span>
            <Ic name={showPreview ? "eye" : "eye"} size={12}/>
          </button>
          <button className="block-action-btn has-tooltip" onClick={() => onChange({ collapsed: !block.collapsed })}>
            <span className="tooltip">{block.collapsed ? "Expand" : "Collapse"}</span>
            <Ic name={block.collapsed ? "chevronDown" : "chevronUp"} size={12}/>
          </button>
          <button className="block-action-btn has-tooltip" onClick={onMoveUp} disabled={index === 0}>
            <span className="tooltip">Move up</span>
            <Ic name="arrowUp" size={12}/>
          </button>
          <button className="block-action-btn has-tooltip" onClick={onMoveDown} disabled={index === total - 1}>
            <span className="tooltip">Move down</span>
            <Ic name="arrowDown" size={12}/>
          </button>
          <button className="block-action-btn has-tooltip" onClick={onDuplicate}>
            <span className="tooltip">Duplicate</span>
            <Ic name="copy" size={12}/>
          </button>
          <button className="block-action-btn danger has-tooltip" onClick={onDelete}>
            <span className="tooltip">Delete</span>
            <Ic name="trash" size={12}/>
          </button>
        </div>
      </div>
      {!block.collapsed && (
        <div className="block-body">
          {/* Preview strip */}
          {showPreview && (
            <div style={{ background: "var(--surface-2)", borderRadius: "var(--radius-sm)", padding: "12px 14px", marginBottom: 12, border: "1px solid var(--border)" }}>
              <BlockPreview block={block} activeTab={activeTab} setActiveTab={setActiveTab} flipped={flipped} setFlipped={setFlipped} openAccordion={openAccordion} setOpenAccordion={setOpenAccordion}/>
            </div>
          )}
          {/* Editor */}
          <BlockEditor block={block} onChange={changes => onChange(changes)}/>
        </div>
      )}
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [courseName, setCourseName] = useState("Instructional Design Fundamentals");
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [moduleExpanded, setModuleExpanded] = useState({ m1: true, m2: false, m3: false });
  const [blockSearch, setBlockSearch] = useState("");
  const [dragFrom, setDragFrom] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [history, setHistory] = useState([INITIAL_BLOCKS]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [saved, setSaved] = useState(true);
  const [insertAfter, setInsertAfter] = useState(null);
  const [exportFormat, setExportFormat] = useState("html");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState({});
  const [activeTabs, setActiveTabs] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const themeRef = useRef(null);

  useEffect(() => {
    const handler = e => { if (themeRef.current && !themeRef.current.contains(e.target)) setShowThemeMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pushHistory = (newBlocks) => {
    const next = history.slice(0, historyIdx + 1);
    next.push(newBlocks);
    setHistory(next);
    setHistoryIdx(next.length - 1);
    setSaved(false);
  };

  const setBlocksWithHistory = (fn) => {
    const updated = typeof fn === "function" ? fn(blocks) : fn;
    setBlocks(updated);
    pushHistory(updated);
  };

  const undo = () => {
    if (historyIdx > 0) { const idx = historyIdx - 1; setHistoryIdx(idx); setBlocks(history[idx]); }
  };
  const redo = () => {
    if (historyIdx < history.length - 1) { const idx = historyIdx + 1; setHistoryIdx(idx); setBlocks(history[idx]); }
  };

  const addBlock = (type) => {
    const newBlock = createBlock(type);
    if (insertAfter !== null) {
      setBlocksWithHistory(prev => { const arr = [...prev]; arr.splice(insertAfter + 1, 0, newBlock); return arr; });
    } else {
      setBlocksWithHistory(prev => [...prev, newBlock]);
    }
    setShowBlockPicker(false);
    setInsertAfter(null);
  };

  const updateBlock = (id, changes) => {
    setBlocksWithHistory(prev => prev.map(b => b.id === id ? { ...b, ...changes } : b));
  };

  const deleteBlock = (id) => setBlocksWithHistory(prev => prev.filter(b => b.id !== id));

  const duplicateBlock = (id) => {
    const idx = blocks.findIndex(b => b.id === id);
    const copy = { ...blocks[idx], id: `b_${Date.now()}` };
    setBlocksWithHistory(prev => { const arr = [...prev]; arr.splice(idx + 1, 0, copy); return arr; });
  };

  const moveBlock = (id, dir) => {
    setBlocksWithHistory(prev => {
      const arr = [...prev];
      const idx = arr.findIndex(b => b.id === id);
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  const handleDrop = (targetIdx) => {
    if (dragFrom === null || dragFrom === targetIdx) { setDragFrom(null); setDragOver(null); return; }
    setBlocksWithHistory(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragFrom, 1);
      arr.splice(targetIdx, 0, moved);
      return arr;
    });
    setDragFrom(null); setDragOver(null);
  };

  const filteredBlocks = blockSearch
    ? ALL_BLOCK_TYPES.filter(b => b.label.toLowerCase().includes(blockSearch.toLowerCase()) || b.desc.toLowerCase().includes(blockSearch.toLowerCase()) || b.category.toLowerCase().includes(blockSearch.toLowerCase()))
    : null;

  const runAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `You are an expert instructional designer. ${aiPrompt}. Write concisely and clearly for a professional e-learning course. Keep response under 200 words.` }]
        })
      });
      const data = await res.json();
      setAiResult(data.content?.[0]?.text || "No response.");
    } catch { setAiResult("Unable to connect. Please try again."); }
    setAiLoading(false);
  };

  const previewWidth = previewDevice === "desktop" ? "100%" : previewDevice === "tablet" ? "768px" : "375px";

  const themeStyles = {
    light: {},
    slate: { "--bg": "#F1F5F9", "--surface": "#FFFFFF", "--surface-2": "#E8EDF2" },
    dark: { "--bg": "#0F172A", "--surface": "#1E293B", "--surface-2": "#334155", "--border": "#334155", "--border-strong": "#475569", "--text-primary": "#F1F5F9", "--text-secondary": "#94A3B8", "--text-tertiary": "#64748B" },
    warmth: { "--bg": "#FFF8EE", "--surface": "#FFFBF5", "--surface-2": "#FEF3DC" },
    forest: { "--bg": "#F0FDF4", "--surface": "#FFFFFF", "--surface-2": "#DCFCE7", "--border": "#BBF7D0", "--blue": "#059669", "--blue-light": "#ECFDF5", "--blue-mid": "#A7F3D0", "--blue-dark": "#047857" },
  };

  return (
    <>
      <style>{css}</style>
      <div className="app-shell" style={themeStyles[currentTheme] || {}}>

        {/* ── Topbar ── */}
        <header className="topbar">
          <div className="logo-mark"><Ic name="logo" size={16}/></div>
          <span className="app-name">CourseForge</span>
          <div className="topbar-divider"/>
          <input className="course-name-input" value={courseName} onChange={e => setCourseName(e.target.value)} spellCheck={false}/>
          <div className="topbar-divider"/>
          {/* Undo/Redo */}
          <div className="has-tooltip">
            <span className="tooltip">Undo (⌘Z)</span>
            <button className="btn-icon" onClick={undo} disabled={historyIdx === 0}><Ic name="undo" size={14}/></button>
          </div>
          <div className="has-tooltip">
            <span className="tooltip">Redo (⌘Y)</span>
            <button className="btn-icon" onClick={redo} disabled={historyIdx === history.length - 1}><Ic name="redo" size={14}/></button>
          </div>
          <div className="topbar-divider"/>
          <button className="btn btn-ghost" onClick={() => { setSaved(true); }}>
            <Ic name="save" size={13}/> Save
          </button>
          {saved && <div className="save-indicator"><div className="save-dot"/><span>Saved</span></div>}
          <div className="spacer"/>
          <button className="btn btn-ghost"><Ic name="eye" size={13}/> Preview</button>

          {/* Theme */}
          <div style={{ position: "relative" }} ref={themeRef}>
            <button className="btn btn-ghost" onClick={() => setShowThemeMenu(p => !p)}>
              <Ic name="palette" size={13}/> Theme <Ic name="chevronDown" size={11}/>
            </button>
            {showThemeMenu && (
              <div className="theme-dropdown">
                <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", padding: "0 4px 6px" }}>Choose Theme</div>
                {THEMES.map(t => (
                  <button key={t.id} className={`theme-option ${currentTheme === t.id ? "active" : ""}`} onClick={() => { setCurrentTheme(t.id); setShowThemeMenu(false); }}>
                    <div className="theme-swatch" style={{ background: t.swatch }}/>
                    {t.name}
                    {currentTheme === t.id && <Ic name="check" size={13} color="var(--blue)"/>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI */}
          <button className={`btn ${showAI ? "btn-primary" : "btn-ghost"}`} style={showAI ? {} : { color: "var(--purple)", borderColor: "#DDD6FE", background: "var(--purple-light)" }} onClick={() => setShowAI(p => !p)}>
            <Ic name="sparkles" size={13} color={showAI ? "white" : "var(--purple)"}/> AI Assistant
          </button>

          <button className="btn btn-icon has-tooltip"><span className="tooltip">Settings</span><Ic name="settings" size={14}/></button>
          <button className="btn btn-primary" onClick={() => setShowExport(true)}>
            <Ic name="export" size={13} color="white"/> Export
          </button>
        </header>

        {/* ── Left Sidebar ── */}
        <aside className="sidebar-left">
          <div className="sidebar-header">
            <div className="sidebar-title">Course Explorer</div>
            <div className="search-box">
              <Ic name="search" size={13} color="var(--text-tertiary)"/>
              <input placeholder="Search lessons…" spellCheck={false}/>
            </div>
          </div>
          <div className="sidebar-scroll">
            {/* Course root */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 16px 5px", marginBottom: 2 }}>
              <Ic name="bookOpen" size={13} color="var(--blue)"/>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{courseName}</span>
            </div>
            {COURSE_DATA.modules.map(mod => (
              <div key={mod.id} className="tree-section">
                <div className="tree-module" onClick={() => setModuleExpanded(p => ({ ...p, [mod.id]: !p[mod.id] }))}>
                  <div className="tree-module-icon" style={{ background: mod.color + "22" }}>
                    <Ic name={moduleExpanded[mod.id] ? "chevronDown" : "chevronRight"} size={10} color={mod.color}/>
                  </div>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12 }}>{mod.name}</span>
                  <span style={{ fontSize: 10.5, color: "var(--text-tertiary)", fontWeight: 600 }}>{mod.lessons.length}</span>
                </div>
                {moduleExpanded[mod.id] && mod.lessons.map(les => (
                  <div key={les.id} className={`tree-lesson ${les.status === "active" ? "active" : ""}`}>
                    <Ic name="file" size={11} color={les.status === "active" ? "var(--blue)" : "var(--text-tertiary)"}/>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{les.name}</span>
                    <div className="lesson-status" style={{ background: les.status === "done" ? "var(--green)" : les.status === "active" ? "var(--blue)" : "var(--border-strong)" }}/>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <button className="btn-add-module"><Ic name="plus" size={13}/> Add Module</button>
          </div>
        </aside>

        {/* ── Editor Panel ── */}
        <main className="editor-panel">
          <div className="editor-toolbar">
            <div className="lesson-breadcrumb">
              <span>Module 1</span>
              <Ic name="chevronRight" size={10}/>
              <b>Needs Analysis</b>
            </div>
            <div className="topbar-divider"/>
            <span className="block-count-badge">{blocks.length} blocks</span>
            <div style={{ flex: 1 }}/>
            <button className="btn btn-ghost" style={{ fontSize: 11.5 }} onClick={() => { setInsertAfter(null); setShowBlockPicker(true); }}>
              <Ic name="plus" size={12}/> Add Block
            </button>
          </div>
          <div className="editor-scroll">
            {blocks.map((block, idx) => (
              <div key={block.id}>
                <BlockCard
                  block={block}
                  index={idx}
                  total={blocks.length}
                  isDragOver={dragOver === idx}
                  isDragging={dragFrom === idx}
                  onChange={changes => updateBlock(block.id, changes)}
                  onDelete={() => deleteBlock(block.id)}
                  onDuplicate={() => duplicateBlock(block.id)}
                  onMoveUp={() => moveBlock(block.id, -1)}
                  onMoveDown={() => moveBlock(block.id, 1)}
                  onDragStart={() => setDragFrom(idx)}
                  onDragOver={() => setDragOver(idx)}
                  onDrop={() => handleDrop(idx)}
                />
                {/* Inter-block add button */}
                <div className="add-block-row" style={{ opacity: 0, transition: "opacity 0.15s" }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                  <div className="add-block-line"/>
                  <button className="btn-add-block" onClick={() => { setInsertAfter(idx); setShowBlockPicker(true); }}>
                    <Ic name="plus" size={11}/> Insert block
                  </button>
                  <div className="add-block-line"/>
                </div>
              </div>
            ))}
            {/* Bottom add block */}
            <div className="add-block-row" style={{ marginTop: 8 }}>
              <div className="add-block-line"/>
              <button className="btn-add-block" onClick={() => { setInsertAfter(null); setShowBlockPicker(true); }}>
                <Ic name="plus" size={11}/> Add block
              </button>
              <div className="add-block-line"/>
            </div>
          </div>
        </main>

        {/* ── Right Preview ── */}
        <aside className="preview-panel">
          <div className="preview-topbar">
            <Ic name="monitor" size={13} color="var(--text-tertiary)"/>
            <span className="preview-title-bar">Live Preview</span>
            <div className="live-badge"><div className="live-dot"/> Live</div>
            <div className="preview-device-btns">
              {["desktop", "tablet", "mobile"].map(d => (
                <button key={d} className="btn-icon" onClick={() => setPreviewDevice(d)} style={{ color: previewDevice === d ? "var(--blue)" : undefined, background: previewDevice === d ? "var(--blue-light)" : undefined }}>
                  {d === "desktop" ? <Ic name="monitor" size={13}/> : d === "tablet" ? <span style={{ fontSize: 13 }}>⬜</span> : <span style={{ fontSize: 13 }}>📱</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="preview-scroll">
            <div className="preview-browser-chrome">
              <div className="chrome-dots"><div className="chrome-dot" style={{ background: "#FF5F57" }}/><div className="chrome-dot" style={{ background: "#FFBD2E" }}/><div className="chrome-dot" style={{ background: "#28CA41" }}/></div>
              <div className="chrome-url">localhost:3000/lesson/needs-analysis</div>
            </div>
            <div style={{ maxWidth: previewWidth, margin: "0 auto", transition: "max-width 0.3s ease" }}>
              <div className="preview-content" style={{ minHeight: "calc(100vh - 44px - 32px)" }}>
                {blocks.filter(b => !b.collapsed).map((block, i) => (
                  <div key={block.id} style={{ marginBottom: block.type === "divider" ? 8 : block.type === "title" ? 20 : 18 }}>
                    <BlockPreview
                      block={block}
                      activeTab={activeTabs[block.id] || 0}
                      setActiveTab={v => setActiveTabs(p => ({ ...p, [block.id]: v }))}
                      flipped={!!flippedCards[block.id]}
                      setFlipped={v => setFlippedCards(p => ({ ...p, [block.id]: v }))}
                      openAccordion={activeAccordion[block.id] ?? 0}
                      setOpenAccordion={v => setActiveAccordion(p => ({ ...p, [block.id]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

      </div>{/* end app-shell */}

      {/* ── Block Picker Modal ── */}
      {showBlockPicker && (
        <div className="modal-overlay" onClick={() => setShowBlockPicker(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Insert Content Block</div>
              <div className="modal-search">
                <Ic name="search" size={14} color="var(--text-tertiary)"/>
                <input placeholder="Search blocks…" value={blockSearch} onChange={e => setBlockSearch(e.target.value)} autoFocus/>
                {blockSearch && <button onClick={() => setBlockSearch("")} style={{ background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>}
              </div>
            </div>
            <div className="modal-body">
              {filteredBlocks
                ? (<><div className="block-category-label">Search Results ({filteredBlocks.length})</div>
                   <div className="block-grid">
                     {filteredBlocks.map(b => (
                       <button key={b.type} className="block-pick-btn" onClick={() => addBlock(b.type)}>
                         <div className="block-pick-icon"><span style={{ fontSize: 14 }}>{b.emoji}</span></div>
                         <div className="block-pick-label">{b.label}</div>
                         <div className="block-pick-desc">{b.desc}</div>
                       </button>
                     ))}
                   </div>
                 </>)
                : BLOCK_CATEGORIES.map(cat => (
                    <div key={cat.label}>
                      <div className="block-category-label" style={{ color: cat.color }}>{cat.label}</div>
                      <div className="block-grid">
                        {cat.blocks.map(b => (
                          <button key={b.type} className="block-pick-btn" onClick={() => addBlock(b.type)}>
                            <div className="block-pick-icon"><span style={{ fontSize: 15 }}>{b.emoji}</span></div>
                            <div className="block-pick-label">{b.label}</div>
                            <div className="block-pick-desc">{b.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      )}

      {/* ── Export Modal ── */}
      {showExport && (
        <div className="modal-overlay export-modal" onClick={() => setShowExport(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 480 }}>
            <div className="modal-header">
              <div className="modal-title">Export Course</div>
              <p style={{ fontSize: 12.5, color: "var(--text-tertiary)", marginTop: 4 }}>Choose a format to publish your course content.</p>
            </div>
            <div className="modal-body" style={{ padding: "14px 20px 6px" }}>
              {[
                { id: "html", emoji: "🌐", name: "Clean HTML", desc: "Standalone HTML/CSS/JS package with assets" },
                { id: "scorm12", emoji: "📦", name: "SCORM 1.2", desc: "LMS-compatible package for older platforms" },
                { id: "scorm2004", emoji: "📦", name: "SCORM 2004", desc: "Modern LMS package with advanced tracking" },
                { id: "xapi", emoji: "⚡", name: "xAPI / Tin Can", desc: "Experience API package for advanced analytics" },
                { id: "offline", emoji: "💾", name: "Offline Package", desc: "Self-contained ZIP for offline learning" },
              ].map(fmt => (
                <div key={fmt.id} className={`export-option ${exportFormat === fmt.id ? "selected" : ""}`} onClick={() => setExportFormat(fmt.id)}>
                  <div className="export-icon">{fmt.emoji}</div>
                  <div className="export-info">
                    <div className="export-name">{fmt.name}</div>
                    <div className="export-desc">{fmt.desc}</div>
                  </div>
                  {exportFormat === fmt.id && <div style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic name="check" size={12} color="white"/></div>}
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 20px 20px", display: "flex", gap: 8 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowExport(false)}><Ic name="export" size={13} color="white"/> Export Package</button>
              <button className="btn btn-ghost" onClick={() => setShowExport(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Assistant Panel ── */}
      {showAI && (
        <div className="ai-panel">
          <div className="ai-header">
            <div className="ai-badge"><Ic name="sparkles" size={11} color="var(--purple)"/> AI Assistant</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-primary)" }}>CourseForge AI</div>
                <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 2 }}>Powered by Claude · Instructional Design Expert</div>
              </div>
              <button className="btn-icon" onClick={() => setShowAI(false)}><Ic name="x" size={14}/></button>
            </div>
          </div>
          <div className="ai-body">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: 8 }}>Quick Prompts</div>
              <div className="ai-prompt-chips">
                {[
                  "Write a learning objective",
                  "Create a quiz question",
                  "Summarize this lesson",
                  "Generate flashcard pairs",
                  "Write a tip block",
                  "Explain in simpler terms",
                  "Create an accordion FAQ",
                  "Write a key concept",
                ].map(p => (
                  <button key={p} className="ai-chip" onClick={() => setAiPrompt(p)}>{p}</button>
                ))}
              </div>
            </div>
            {aiResult && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--purple)", marginBottom: 6 }}>Result</div>
                <div className="ai-result">{aiResult}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button className="btn btn-ghost" style={{ flex: 1, fontSize: 11.5 }} onClick={() => { addBlock("paragraph"); setShowAI(false); }}>Insert as Block</button>
                  <button className="btn btn-ghost" style={{ fontSize: 11.5 }} onClick={() => navigator.clipboard?.writeText(aiResult)}>Copy</button>
                </div>
              </div>
            )}
          </div>
          <div className="ai-footer">
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 8 }}>Describe what you need…</div>
            <div className="ai-input-row">
              <input className="ai-input" placeholder="e.g. Write a learning objective about…" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} onKeyDown={e => e.key === "Enter" && runAI()}/>
              <button className="btn-ai" onClick={runAI} disabled={aiLoading}>
                {aiLoading ? "…" : <><Ic name="sparkles" size={12} color="white"/> Go</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
