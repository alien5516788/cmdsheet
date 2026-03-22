import { Fragment } from "react";
import CodeV1 from "./code_v1";
import BlockController from "./blockcontroller";
// import TextV1 from "./text_v1";
// import MathV1 from "./math_v1";

export interface SnippetBlock {
  id: string;
  version: number;
  renderer: "text" | "code" | "math";
  content: string;
}

interface SnippetEditorProps {
  content: SnippetBlock[];
  updateContent: React.Dispatch<React.SetStateAction<SnippetBlock[]>>
}

export default function SnippetEditor(props: SnippetEditorProps) {
  const { content, updateContent } = props;

  // block renderer
  function get_renderer(block: SnippetBlock) {
    /*
      - Returns the appropriate renderer component for the given block
      - Blocks are versioned to allow for future renderer updates
    */
    const renderer = block.renderer + "_v" + block.version;

    // TODO: Implement text and math renderer
    switch (renderer) {
      case "code_v1":
        return <CodeV1 key={block.id} block={block} updateContent={updateContent} />;
      // case "text_v1":
      //   return <TextV1 key={block.id} block={block} updateContent={updateContent} />;
      // case "math_v1":
      //   return <MathV1 key={block.id} block={block} updateContent={updateContent} />;
      default:
        return <div>Unsupported block</div>;
    }
  }

  function add_block(posIndex: number, renderer: "text" | "code" | "math") {
    /*
      Inserts a new block at the given position
      Existing blocks are shifted down
    */
    const newBlock: SnippetBlock = {
      id: crypto.randomUUID(),
      version: 1,
      renderer,
      content: ""
    };
    updateContent(prev => {
      const newBlocks = [...prev];
      newBlocks.splice(posIndex, 0, newBlock);
      return newBlocks;
    });
  }

  function remove_block(posIndex: number) {
    updateContent(prev => [...prev.slice(0, posIndex), ...prev.slice(posIndex + 1)]);
  }


  return (
    <div className="flex-1 bg-[#2c2e3a] rounded p-4 overflow-auto text-sm font-mono whitespace-pre-wrap">
      {/* Default block controller */}
      <BlockController
        index={-1}
        addBlock={add_block}
        removeBlock={remove_block}
        last={false}
      />

      {/* Every Block is rendered with a new block controller below it */}
      {content.map((block, index) => {
        return (
          <Fragment key={block.id}>
            {get_renderer(block)}
            <BlockController index={index} addBlock={add_block} removeBlock={remove_block} last={index === content.length - 1} />
          </Fragment>
        );
      })}
    </div>
  );
}
