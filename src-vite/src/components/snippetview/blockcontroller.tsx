interface BlockControllerProps {
  index: number;
  addBlock: (posIndex: number, renderer: "heading" | "text" | "code" | "math") => void;
  removeBlock: (posIndex: number) => void;
}

export default function BlockController(props: BlockControllerProps) {
  /*
    Block controller is responsible for adding and removing anipept BlockControllerProps
    There are following block types currently,
      text: Renders a text block
      code: Renders a code block
      math: Renders a math block
    By default there must be a top most controller to add blocks at the beginning
    Top most controllers have index -1 and cannot be removed
    Upon adding a block a new block controller is added below the block for every blocks
    Controller adds a block below and delete above, except the first controller which doesn't have
      a block above
  */
  const { index, addBlock, removeBlock } = props;

  return (
    <div className="flex gap-2 opacity-[0.02] hover:opacity-25 transition border px-2">
      <button className="cursor-pointer" onClick={() => addBlock(index + 1, "heading")}>[H] Heading</button>
      <button className="cursor-pointer ml-4" onClick={() => addBlock(index + 1, "text")}>[T] Text</button>
      <button className="cursor-pointer ml-4" onClick={() => addBlock(index + 1, "code")}>{"</>"} Code</button>
      <button className="cursor-pointer ml-4" onClick={() => addBlock(index + 1, "math")}>[Σ] Math</button>

      {!(index <= -1) &&
        <button className="cursor-pointer ml-auto text-red-400" onClick={() => removeBlock(index)}>[X] Delete</button>
      }
    </div>
  );
}
