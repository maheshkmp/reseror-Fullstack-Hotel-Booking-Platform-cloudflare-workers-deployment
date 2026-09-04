"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Link as LinkIcon, 
  Heading1, 
  Heading2, 
  Quote, 
  List, 
  ListOrdered, 
  Type, 
  AlignCenter, 
  AlignLeft, 
  AlignRight,
  Plus,
  Minus,
  Image as ImageIcon
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Tell your story...",
  disabled,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
    immediatelyRender: false,
  });

  // Update content if value changes externally (e.g. initial load)
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("relative w-full", className)}>
      {editor && (
        <BubbleMenu
          editor={editor}
          className="flex items-center gap-1 rounded-md border bg-popover p-1 shadow-md"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-accent")}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-accent")}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn("h-8 w-8 p-0", editor.isActive("underline") && "bg-accent")}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="mx-1 h-4" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 1 }) && "bg-accent")}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 2 }) && "bg-accent")}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn("h-8 w-8 p-0", editor.isActive("blockquote") && "bg-accent")}
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-4" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt("URL");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              } else if (url === "") {
                editor.chain().focus().unsetLink().run();
              }
            }}
            className={cn("h-8 w-8 p-0", editor.isActive("link") && "bg-accent")}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu
          editor={editor}
          className="flex items-center gap-1"
        >
          <div className="flex items-center gap-1 rounded-full border bg-background p-1 shadow-sm ml-[-40px]">
             <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn("h-8 w-8 rounded-full p-0", editor.isActive("bulletList") && "bg-accent")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn("h-8 w-8 rounded-full p-0", editor.isActive("orderedList") && "bg-accent")}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="h-8 w-8 rounded-full p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </FloatingMenu>
      )}

      <EditorContent 
        editor={editor} 
        className="prose prose-lg max-w-none min-h-[500px] outline-none"
      />

      <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .tiptap {
          outline: none !important;
        }
        .tiptap p {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .tiptap h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .tiptap h2 {
          font-size: 1.8rem;
          font-weight: 600;
          margin-top: 1.25em;
          margin-bottom: 0.5em;
        }
        .tiptap blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1rem;
          font-style: italic;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
