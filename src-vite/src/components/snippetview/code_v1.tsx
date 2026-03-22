import EditorModule from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/themes/prism-tomorrow.css";
import type { SnippetBlock } from "./snippeteditor";

interface CodeV1Props {
  block: SnippetBlock;
  updateContent: React.Dispatch<React.SetStateAction<SnippetBlock[]>>;
}

export default function CodeV1(props: CodeV1Props) {
  const { block, updateContent } = props;

  // @ts-expect-error Modules has to be imported as a React component
  const Editor = EditorModule.default;

  function update_block(value: string) {
    /*
      Loop through the current content and update the block with the new value
      ISSUE: Update is not buffered which causes db writes on every keystroke
    */
    updateContent(prev =>
      prev.map(b => {
        if (b.id !== block.id) return b;
        return {
          ...b,
          content: value,
        };
      }),
    );
  }

  return (
    <div className="overflow-hidden border border-[#44475a]">
      <Editor
        value={block.content}
        onValueChange={(value: string) => update_block(value)}
        highlight={(code: string) => Prism.highlight(code, Prism.languages.clike, "clike")}
        padding={10}
        style={{
          fontFamily: "monospace",
          fontSize: 16,
          backgroundColor: "#282a36",
          color: "#f8f8f2",
          minHeight: "40px",
        }}
      />
    </div>
  );
}
