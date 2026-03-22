import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import type { SnippetBlock } from "./snippeteditor";

interface CodeV1Props {
  block: SnippetBlock;
  updateContent: React.Dispatch<React.SetStateAction<SnippetBlock[]>>;
}

const LANGUAGES = [
  "plaintext",
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "csharp",
  "go",
  "rust",
  "php",
  "html",
  "css",
  "json",
  "markdown",
  "shell",
];

function getExtensions(language: string) {
  switch (language) {
    case "python":
      return [python()];
    case "html":
      return [html()];
    case "css":
      return [css()];
    case "json":
      return [json()];
    default:
      // For javascript/typescript, use js with JSX if desired
      return [javascript({ jsx: true })];
  }
}

export default function CodeV1({ block, updateContent }: CodeV1Props) {
  let language = "plaintext";
  let code = "";

  try {
    const parsed = JSON.parse(block.content);
    language = parsed.language || "plaintext";
    code = parsed.code || "";
  } catch (err) {
    console.error(err);
  }

  function update_block(newData: { language?: string; code?: string }) {
    updateContent(prev =>
      prev.map(b => {
        if (b.id !== block.id) return b;
        let parsed;
        try {
          parsed = JSON.parse(b.content);
        } catch {
          parsed = { language: "plaintext", code: "" };
        }
        return {
          ...b,
          content: JSON.stringify({ ...parsed, ...newData }),
        };
      }),
    );
  }

  return (
    <div className="mb-4">
      {/* Language selector */}
      <div className="mb-2 flex justify-between items-center">
        <select
          value={language}
          onChange={(e) => update_block({ language: e.target.value })}
          className="bg-[#44475a] text-[#f8f8f2] text-xs px-2 py-1 rounded outline-none"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* CodeMirror editor */}
      <CodeMirror
        value={code}
        height="200px"
        extensions={getExtensions(language)}
        theme="dark"
        onChange={(value) => update_block({ code: value })}
        basicSetup={{
          lineNumbers: false,
          highlightActiveLineGutter: false,
          foldGutter: false,
          dropCursor: false,
          indentOnInput: false,
          bracketMatching: false,
          closeBrackets: false,
          autocompletion: false,
          rectangularSelection: false,
          highlightActiveLine: false,
          highlightSelectionMatches: false,
          searchKeymap: false,
        }}
        style={{
          backgroundColor: "#21222c",
          color: "#f8f8f2",
          fontFamily: "monospace",
          fontSize: "14px",
        }}
      />
    </div>
  );
}
