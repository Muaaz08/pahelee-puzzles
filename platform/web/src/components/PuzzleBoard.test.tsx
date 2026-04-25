import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PuzzleBoard } from "./PuzzleBoard";
import type { Puzzle } from "@/data/puzzles";

vi.mock("react-chessboard", () => ({
  Chessboard: (props: {
    position: string;
    onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
  }) => (
    <div>
      <div data-testid="position">{props.position}</div>
      <button onClick={() => props.onPieceDrop("c3", "b5")}>first</button>
      <button onClick={() => props.onPieceDrop("b5", "d6")}>second</button>
      <button onClick={() => props.onPieceDrop("c3", "a4")}>wrong</button>
    </div>
  ),
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

describe("PuzzleBoard", () => {
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
});
