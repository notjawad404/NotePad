import { useEditor, EditorContent } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import RichTextToolbar from "./RichTextToolbar";
import { normalizeContent } from "./richTextUtils";
import "./richText.css";

// Adds a font-size attribute to the textStyle mark (no official extension).
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) =>
              attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

function buildExtensions(placeholder) {
  return [
    StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
    Underline,
    TextStyle,
    Color,
    FontFamily,
    FontSize,
    Highlight,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
    }),
    Placeholder.configure({ placeholder: placeholder || "Write your note…" }),
  ];
}

// Editable rich text field with a formatting toolbar.
export default function RichTextEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    extensions: buildExtensions(placeholder),
    content: normalizeContent(value),
    // Emit both the rendered HTML and the structured document (ProseMirror JSON).
    onUpdate: ({ editor }) => onChange(editor.getHTML(), editor.getJSON()),
    editorProps: { attributes: { class: "rich-text-input" } },
  });

  if (!editor) return null;

  return (
    <div className="rich-editor bg-slate-800/60 border border-slate-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/60 focus-within:border-indigo-500 transition-colors">
      <RichTextToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

// Read-only renderer. Uses TipTap's schema so stored HTML is rendered safely
// (unknown/unsafe markup is dropped) without a separate sanitizer.
export function RichTextViewer({ value }) {
  const editor = useEditor(
    {
      editable: false,
      extensions: buildExtensions(""),
      content: normalizeContent(value),
    },
    [value]
  );

  if (!editor) return null;

  return (
    <div className="rich-viewer">
      <EditorContent editor={editor} />
    </div>
  );
}
