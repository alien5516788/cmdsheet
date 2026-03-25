import { Fragment } from "react";
import BlockController from "./blockcontroller";
import HeadingV1 from "./heading_v1";
import TextV1 from "./text_v1";
import CodeV1 from "./code_v1";
// import MathV1 from "./math_v1";

export interface SnippetBlock {
  id: string;
  version: number;
  renderer: "heading" | "text" | "code" | "math";
  content: string;
}

interface SnippetEditorProps {
  content: SnippetBlock[];
  updateContent: React.Dispatch<React.SetStateAction<SnippetBlock[]>>
}

export default function SnippetEditor(props: SnippetEditorProps) {
  const { content, updateContent } = props;

  /*
    Block renderer
    Returns the appropriate renderer component for the given block
    Blocks are versioned to allow for future renderer updates
  */
  function get_renderer(block: SnippetBlock) {
    const renderer = block.renderer + "_v" + block.version;

    switch (renderer) {
      case "heading_v1":
        return <HeadingV1 key={block.id} block={block} updateContent={updateContent} />;
      case "text_v1":
        return <TextV1 key={block.id} block={block} updateContent={updateContent} />;
      case "code_v1":
        return <CodeV1 key={block.id} block={block} updateContent={updateContent} />;
      // TODO: Implement math renderer
      // case "math_v1":
      //   return <MathV1 key={block.id} block={block} updateContent={updateContent} />;
      default:
        return <div>Coming soon..</div>;
    }
  }

  /*
    Inserts a new block at the given position
    Existing blocks are shifted down
  */
  function add_block(posIndex: number, renderer: "heading" | "text" | "code" | "math") {
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

  /*
    Removes the block at the given position
    Existing blocks are shifted up
  */
  function remove_block(posIndex: number) {
    updateContent(prev => [...prev.slice(0, posIndex), ...prev.slice(posIndex + 1)]);
  }

  return (
    <div className="flex-1 text-sm font-mono whitespace-pre-wrap pb-3">
      {/* Default block controller */}
      <BlockController index={-1} addBlock={add_block} removeBlock={remove_block} />

      {/* Every Block is rendered with a new block controller below it */}
      {content.map((block, index) => {
        return (
          <Fragment key={block.id}>
            {get_renderer(block)}
            <BlockController index={index} addBlock={add_block} removeBlock={remove_block} />
          </Fragment>
        );
      })}
    </div>
  );
}
