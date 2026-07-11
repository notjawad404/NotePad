import {
  UndoIcon,
  RedoIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  ListBulletIcon,
  ListOrderedIcon,
  QuoteIcon,
  CodeBlockIcon,
  LinkIcon,
  UnlinkIcon,
  HighlightIcon,
  ClearFormatIcon,
} from "./Icons";

const FONTS = [
  { label: "Font", value: "" },
  { label: "Sans", value: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, Cambria, 'Times New Roman', serif" },
  { label: "Mono", value: "ui-monospace, SFMono-Regular, Menlo, monospace" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Times", value: "'Times New Roman', Times, serif" },
  { label: "Courier", value: "'Courier New', Courier, monospace" },
  { label: "Comic Sans", value: "'Comic Sans MS', 'Comic Sans', cursive" },
];

const SIZES = [
  { label: "Size", value: "" },
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "24", value: "24px" },
  { label: "30", value: "30px" },
];

function ToolButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`h-8 min-w-8 px-1.5 flex items-center justify-center rounded text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-slate-700 mx-0.5 shrink-0" />;
}

const selectClass =
  "h-8 bg-slate-800 border border-slate-700 rounded text-slate-200 text-xs px-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer";

export default function RichTextToolbar({ editor }) {
  if (!editor) return null;

  const blockValue = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
    ? "h2"
    : editor.isActive("heading", { level: 3 })
    ? "h3"
    : "p";

  const onBlockChange = (e) => {
    const v = e.target.value;
    const chain = editor.chain().focus();
    if (v === "p") chain.setParagraph().run();
    else chain.setHeading({ level: Number(v[1]) }).run();
  };

  const onFontChange = (e) => {
    const v = e.target.value;
    if (!v) editor.chain().focus().unsetFontFamily().run();
    else editor.chain().focus().setFontFamily(v).run();
  };

  const onSizeChange = (e) => {
    const v = e.target.value;
    if (!v) editor.chain().focus().unsetFontSize().run();
    else editor.chain().focus().setFontSize(v).run();
  };

  const currentFont = editor.getAttributes("textStyle").fontFamily || "";
  const currentSize = editor.getAttributes("textStyle").fontSize || "";
  const currentColor = editor.getAttributes("textStyle").color || "#e2e8f0";

  const setLink = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Link URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-slate-700 bg-slate-900/60">
      <ToolButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <UndoIcon className="w-4 h-4" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <RedoIcon className="w-4 h-4" />
      </ToolButton>

      <Divider />

      <select value={blockValue} onChange={onBlockChange} className={selectClass} title="Text style" aria-label="Text style">
        <option value="p">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <select value={currentFont} onChange={onFontChange} className={selectClass} title="Font family" aria-label="Font family">
        {FONTS.map((f) => (
          <option key={f.label} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <select value={currentSize} onChange={onSizeChange} className={selectClass} title="Font size" aria-label="Font size">
        {SIZES.map((s) => (
          <option key={s.label} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <Divider />

      <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
        <span className="font-bold">B</span>
      </ToolButton>
      <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
        <span className="italic font-serif">I</span>
      </ToolButton>
      <ToolButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
        <span className="underline">U</span>
      </ToolButton>
      <ToolButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
        <span className="line-through">S</span>
      </ToolButton>

      <label
        className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-700 cursor-pointer relative"
        title="Text color"
        onMouseDown={(e) => e.preventDefault()}
      >
        <span className="text-sm font-semibold" style={{ color: currentColor }}>
          A
        </span>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Text color"
        />
      </label>
      <ToolButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
        <HighlightIcon className="w-4 h-4" />
      </ToolButton>

      <Divider />

      <ToolButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">
        <AlignLeftIcon className="w-4 h-4" />
      </ToolButton>
      <ToolButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center">
        <AlignCenterIcon className="w-4 h-4" />
      </ToolButton>
      <ToolButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">
        <AlignRightIcon className="w-4 h-4" />
      </ToolButton>
      <ToolButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify">
        <AlignJustifyIcon className="w-4 h-4" />
      </ToolButton>

      <Divider />

      <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
        <ListBulletIcon className="w-4 h-4" />
      </ToolButton>
      <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
        <ListOrderedIcon className="w-4 h-4" />
      </ToolButton>
      <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
        <QuoteIcon className="w-4 h-4" />
      </ToolButton>
      <ToolButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
        <CodeBlockIcon className="w-4 h-4" />
      </ToolButton>

      <Divider />

      <ToolButton onClick={setLink} active={editor.isActive("link")} title="Add link">
        <LinkIcon className="w-4 h-4" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        title="Remove link"
      >
        <UnlinkIcon className="w-4 h-4" />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        title="Clear formatting"
      >
        <ClearFormatIcon className="w-4 h-4" />
      </ToolButton>
    </div>
  );
}
