import EditorModule from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/themes/prism-tomorrow.css";
import type { SnippetBlock } from "./snippeteditor";
import { useEffect, useRef, useState } from "react";


interface CodeV1Props {
  block: SnippetBlock;
  updateContent: React.Dispatch<React.SetStateAction<SnippetBlock[]>>;
}

export default function CodeV1(props: CodeV1Props) {
  const { block, updateContent } = props;

  // @ts-expect-error Modules has to be imported as a React component
  const Editor = EditorModule.default;

  // Content
  const [content, setContent] = useState(block.content);

  // Saving to db on every keystroke is slow, so we debounce the update
  const debounceRef = useRef<number | null>(null);

  function update_block(value: string) {
    // clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // set new debounce
    debounceRef.current = setTimeout(() => {
      updateContent(prev =>
        prev.map(b => {
          if (b.id !== block.id) return b;
          return {
            ...b,
            content: value,
          };
        }),
      );
    }, 300);
  }

  // Sync with externel updates
  useEffect(() => {
    async function set_content() {
      setContent(block.content);
    }
    set_content();
  }, [block.id]);

  // Update the db when content changes
  useEffect(() => {
    if (content === block.content) return;
    update_block(content);
  }, [content]);

  // cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-md">
      <Editor
        value={content}
        onValueChange={(value: string) => setContent(value)}
        highlight={(code: string) => Prism.highlight(code, Prism.languages.clike, "clike")}
        padding={10}
        style={{
          fontFamily: "monospace",
          fontSize: 16,
          backgroundColor: "#2e3440",
          color: "#f8f8f2",
          minHeight: "40px",
        }}
      />
    </div>
  );
}
