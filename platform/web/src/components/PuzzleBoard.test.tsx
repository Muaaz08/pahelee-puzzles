import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PuzzleBoard } from "./PuzzleBoard";
import type { Puzzle } from "@/data/puzzles";

let customSquareStylesValue: Record<string, React.CSSProperties> = {};
let onSquareClickValue: ((square: string) => void) | undefined;
let onPieceDragBeginValue: ((square: string) => void) | undefined;
let onPieceDragEndValue: (() => void) | undefined;
let arePiecesDraggableValue: boolean = true;

vi.mock("react-chessboard", () => ({
  Chessboard: (props: {
    position: string;
    onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
    customSquareStyles?: Record<string, React.CSSProperties>;
    onSquareClick?: (square: string) => void;
    onPieceDragBegin?: (square: string) => void;
    onPieceDragEnd?: () => void;
    isDraggablePiece?: (square: string) => boolean;
    arePiecesDraggable?: boolean;
  }) => {
    customSquareStylesValue = props.customSquareStyles || {};
    onSquareClickValue = props.onSquareClick;
    onPieceDragBeginValue = props.onPieceDragBegin;
    onPieceDragEndValue = props.onPieceDragEnd;
    arePiecesDraggableValue = props.arePiecesDraggable ?? true;

    return (
      <div>
        <div data-testid="position">{props.position}</div>
        <div data-testid="styles">{JSON.stringify(customSquareStylesValue)}</div>
        <button onClick={() => props.onPieceDrop("c3", "b5")}>first</button>
        <button onClick={() => props.onPieceDrop("b5", "d6")}>second</button>
        <button onClick={() => props.onPieceDrop("c3", "a4")}>wrong</button>
      </div>
    );
  },
}));

const puzzle: Puzzle = {
  id: "B5NPC",
  fen: "r3kb1r/ppqbnpp1/2n1p2p/3pP3/1P1P4/P1N2N2/3B1PPP/R2QKB1R w KQkq - 1 11",
  solution: ["c3b5", "c7b8", "b5d6"],
  sideToMove: "w",
  rating: 1377,
  difficulty: "Medium",
  theme: "Opening",
  tags: ["opening"],
};

const opponentPuzzle: Puzzle = {
  id: "OPP01",
  fen: "r3kb1r/ppqbnpp1/2n1p2p/3pP3/1P1P4/P1N2N2/3B1PPP/R2QKB1R b KQkq - 1 11",
  solution: ["c7b8"],
  sideToMove: "b",
  rating: 1377,
  difficulty: "Medium",
  theme: "Opening",
  tags: ["opening"],
};

describe("PuzzleBoard", () => {
  beforeEach(() => {
    customSquareStylesValue = {};
    onSquareClickValue = undefined;
    onPieceDragBeginValue = undefined;
    onPieceDragEndValue = undefined;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("requires the full Lichess solution line before solving", () => {
    vi.useFakeTimers();
    const onSolved = vi.fn();

    render(
      <PuzzleBoard
        puzzle={puzzle}
        onSolved={onSolved}
        onWrong={vi.fn()}
        onAttempt={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("first"));
    expect(onSolved).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(450);
    });

    expect(screen.getByTestId("position")).toHaveTextContent(
      "rq2kb1r/pp1bnpp1/2n1p2p/1N1pP3/1P1P4/P4N2/3B1PPP/R2QKB1R w KQkq - 3 12",
    );

    fireEvent.click(screen.getByText("second"));
    expect(onSolved).toHaveBeenCalledTimes(1);
  });

  it("reverts a wrong legal move to the current puzzle position", () => {
    vi.useFakeTimers();
    const onWrong = vi.fn();

    render(
      <PuzzleBoard
        puzzle={puzzle}
        onSolved={vi.fn()}
        onWrong={onWrong}
        onAttempt={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("wrong"));
    expect(onWrong).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("position")).not.toHaveTextContent(puzzle.fen);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.getByTestId("position")).toHaveTextContent(puzzle.fen);
  });

  it("shows legal destination markers when tapping a friendly piece", () => {
    render(
      <PuzzleBoard
        puzzle={puzzle}
        onSolved={vi.fn()}
        onWrong={vi.fn()}
        onAttempt={vi.fn()}
      />,
    );

    expect(onSquareClickValue).toBeDefined();

    act(() => {
      onSquareClickValue!("c3");
    });

    expect(Object.keys(customSquareStylesValue).length).toBeGreaterThan(0);
  });

  it("clears markers when tapping the selected piece again", () => {
    render(
      <PuzzleBoard
        puzzle={puzzle}
        onSolved={vi.fn()}
        onWrong={vi.fn()}
        onAttempt={vi.fn()}
      />,
    );

    act(() => {
      onSquareClickValue!("c3");
    });

    expect(Object.keys(customSquareStylesValue).length).toBeGreaterThan(0);

    act(() => {
      onSquareClickValue!("c3");
    });

    expect(customSquareStylesValue).toEqual({});
  });

  it("shows markers when dragging a friendly piece", () => {
    render(
      <PuzzleBoard
        puzzle={puzzle}
        onSolved={vi.fn()}
        onWrong={vi.fn()}
        onAttempt={vi.fn()}
      />,
    );

    expect(onPieceDragBeginValue).toBeDefined();

    act(() => {
      onPieceDragBeginValue!("c3");
    });

    expect(Object.keys(customSquareStylesValue).length).toBeGreaterThan(0);
  });

  it("shows markers during drag and clears on drag end", () => {
    render(
      <PuzzleBoard
        puzzle={puzzle}
        onSolved={vi.fn()}
        onWrong={vi.fn()}
        onAttempt={vi.fn()}
      />,
    );

    expect(onPieceDragBeginValue).toBeDefined();

    act(() => {
      onPieceDragBeginValue!("c3");
    });

    expect(Object.keys(customSquareStylesValue).length).toBeGreaterThan(0);

    expect(onPieceDragEndValue).toBeDefined();

    act(() => {
      onPieceDragEndValue!();
    });

    expect(customSquareStylesValue).toEqual({});
  });

  it("allows dragging when puzzle is idle", () => {
    render(
      <PuzzleBoard
        puzzle={puzzle}
        onSolved={vi.fn()}
        onWrong={vi.fn()}
        onAttempt={vi.fn()}
      />,
    );

    expect(arePiecesDraggableValue).toBe(true);
  });
});