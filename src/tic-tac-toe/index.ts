import { M, IsNever, BoardKey, CheckWinner, RenderBoard } from "./utils";

type Rows = 1 | 2 | 3;
type Cols = 1 | 2 | 3;
export type P1 = 1;
export type P2 = 2;
type Cell = 0 | P1 | P2;
export type FlattenBoardShape = [
  Cell,
  Cell,
  Cell,
  Cell,
  Cell,
  Cell,
  Cell,
  Cell,
  Cell
];
type Players = {
  P1: "p1";
  P2: "p2";
};

type InsertOnBoard<
  Board extends FlattenBoardShape,
  RowIdx extends number,
  ColIdx extends number,
  Num
> = Extract<
  {
    [Row in keyof Board]: Row extends `${M.Add<
      M.Multiply<M.Subtract<RowIdx, 1>, 3>,
      M.Subtract<ColIdx, 1>
    >}`
      ? Board[Row] extends 0
        ? Num
        : "Invalid position"
      : Board[Row];
  },
  FlattenBoardShape
>;

type GameState = {
  board: FlattenBoardShape;
  previousTurn: Players[keyof Players] | null;
  currentRow: Rows;
  currentCol: Cols;
};

type NextState<State extends GameState> = ReturnType<Game<State>>;

type Game<
  State extends GameState = {
    board: [0, 0, 0, 0, 0, 0, 0, 0, 0];
    previousTurn: Players["P2"];
    currentRow: Rows;
    currentCol: Cols;
  }
> = () => {
  p1: State["previousTurn"] extends Players["P1"]
    ? () => "Invalid turn, it's player 2's turn"
    : <R extends Rows, C extends Cols>(
        row: R,
        col: C
      ) => NextState<{
        board: InsertOnBoard<State["board"], R, C, 1>;
        previousTurn: Players["P1"];
        currentRow: R;
        currentCol: C;
      }>;
  p2: State["previousTurn"] extends Players["P2"]
    ? () => "Invalid turn, it's player 1's turn"
    : <R extends Rows, C extends Cols>(
        row: R,
        col: C
      ) => NextState<{
        board: InsertOnBoard<State["board"], R, C, 2>;
        previousTurn: Players["P2"];
        currentRow: R;
        currentCol: C;
      }>;
  checkWinner: CheckWinner<State["board"]> extends infer WinState
    ? WinState extends "Tie"
      ? () => "Tie"
      : (won: "Winner winner chicken dinner") => WinState
    : () => "Incomplete";
  checkState: IsNever<State["board"]> extends true
    ? `Invalid turn by ${State["previousTurn"]}, Cell ${State["currentRow"]}-${State["currentCol"]} is already taken`
    : () => State;
  state: State;
  board: State["board"];
  boardKey: BoardKey<State["board"]>;
  ui: {
    winner: CheckWinner<State["board"]>;
    board: RenderBoard<State["board"]>;
  };
};

declare const game: Game;

const g = game().p1(1, 1).p2(1, 3).p1(3, 3).p2(2, 1).p1(3, 1);

// hover over these to check for game state
g.checkWinner();
g.checkState();

// hover over this to render board
g.ui.board;
