interface BlockControllerProps {
  index: number;
  addBlock: (posIndex: number, renderer: "text" | "code" | "math") => void;
  removeBlock: (posIndex: number) => void;
  last: boolean;
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
    A controller adds or delete blocks below or above it, except the last controller whihc doesn have
      a block below
  */
  const { index, addBlock, removeBlock, last } = props;

  return (
    <div className={`flex gap-2 opacity-5 hover:opacity-25 transition border rounded-t px-2 mt-1 ${last ? "mb-3" : ""}`}>
      <button className="cursor-pointer" onClick={() => addBlock(index + 1, "text")}>+ Text</button>
      <button className="cursor-pointer" onClick={() => addBlock(index + 1, "code")}>+ Code</button>
      <button className="cursor-pointer" onClick={() => addBlock(index + 1, "math")}>+ Math</button>

      {!last &&
        <button
          className="cursor-pointer ml-auto text-red-400"
          onClick={() => removeBlock(index + 1)}
        >
          Delete
        </button>
      }
    </div>
  );
}
