import Editor from "@monaco-editor/react";
import type { SnippetBlock } from "./snippeteditor";

interface CodeV1Props {
  block: SnippetBlock;
  updateBlock: React.Dispatch<React.SetStateAction<SnippetBlock[]>>;
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
  "shell"
];

export default function CodeV1(props: CodeV1Props) {
  const { block, updateBlock } = props;

  // Snippet content is stored as a JSON string and should be parsed
  let language = "plaintext";
  let code = "";

  try {
    const parsed = JSON.parse(block.content);
    language = parsed.language || "plaintext";
    code = parsed.code || "";
  } catch (err) {
    pywebview.api.print_log("Failed to parse block content\n", err);
  }

  // Update the block with new data (language or code)
  function update_block(newData: { language?: string; code?: string }) {
    updateBlock(prev =>
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
          content: JSON.stringify({
            ...parsed,
            ...newData
          })
        };
      })
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
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Code editor */}
      <Editor
        height="200px"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={(value) => update_block({ code: value || "" })}
        options={{ minimap: { enabled: false } }}
      />
    </div>
  );
}
