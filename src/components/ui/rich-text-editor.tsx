"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  placeholder = "Start typing...",
  disabled = false,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
  });

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    if (disabled) return;

    document.execCommand(command, false, value);
    updateActiveStates();
    handleContentChange();
  };

  const updateActiveStates = () => {
    setIsActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
    });
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const handleKeyUp = () => {
    updateActiveStates();
    handleContentChange();
  };

  const handleMouseUp = () => {
    updateActiveStates();
  };

  const insertLink = () => {
    if (disabled) return;

    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const toolbarButtons = [
    { command: "bold", icon: Bold, label: "Bold" },
    { command: "italic", icon: Italic, label: "Italic" },
    { command: "underline", icon: Underline, label: "Underline" },
    { command: "insertUnorderedList", icon: List, label: "Bullet List" },
    { command: "insertOrderedList", icon: ListOrdered, label: "Numbered List" },
    { command: "justifyLeft", icon: AlignLeft, label: "Align Left" },
    { command: "justifyCenter", icon: AlignCenter, label: "Align Center" },
    { command: "justifyRight", icon: AlignRight, label: "Align Right" },
  ];

  return (
    <div className={cn("border rounded-md", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
        {toolbarButtons.map(({ command, icon: Icon, label }) => (
          <Button
            key={command}
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0",
              isActive[command as keyof typeof isActive] && "bg-accent"
            )}
            onClick={() => execCommand(command)}
            disabled={disabled}
            title={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={insertLink}
          disabled={disabled}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("undo")}
          disabled={disabled}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("redo")}
          disabled={disabled}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        className={cn(
          "min-h-[200px] p-4 focus:outline-none",
          disabled && "opacity-50 cursor-not-allowed",
          "prose prose-sm max-w-none",
          "[&_ul]:list-disc [&_ul]:ml-6",
          "[&_ol]:list-decimal [&_ol]:ml-6",
          "[&_li]:mb-1",
          "[&_p]:mb-2",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3",
          "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2",
          "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2",
          "[&_strong]:font-bold",
          "[&_em]:italic",
          "[&_u]:underline",
          "[&_a]:text-blue-600 [&_a]:underline"
        )}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
}
