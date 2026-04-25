import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PuzzleFeed } from "./PuzzleFeed";

vi.mock("@/store/app-store", () => ({
  useApp: () => ({
    puzzleTheme: "mix",
    puzzleDifficulty: "normal",
  }),
}));

vi.mock("@/lib/lichess-puzzles", () => ({
  fetchLichessPuzzles: vi.fn(() => Promise.reject(new Error("offline"))),
}));

describe("PuzzleFeed", () => {
  it("shows a retry state when Lichess puzzles fail to load", async () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={client}>
        <PuzzleFeed />
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Could not load puzzles")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
