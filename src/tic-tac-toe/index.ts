import { M, IsNever, CheckWinner, RenderBoard } from "./utils";

export type P1 = 1;
export type P2 = 2;
type Rows = 1 | 2 | 3;
type Cols = 1 | 2 | 3;
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
  previousTurn: Players[keyof Players];
  currentRow: Rows;
  currentCol: Cols;
};

type NextState<State extends GameState> = ReturnType<Game<State>>;
type Turn<
  State extends GameState,
  Player extends keyof Players
> = State["previousTurn"] extends Players[Player]
  ? () => `Invalid turn, it's ${Player}'s turn`
  : <R extends Rows, C extends Cols>(
      row: R,
      col: C
    ) => NextState<{
      error: never;
      board: InsertOnBoard<State["board"], R, C, Player extends "P1" ? 1 : 2>;
      previousTurn: Players[Player];
      currentRow: R;
      currentCol: C;
    }>;

type Game<
  State extends GameState = {
    board: [0, 0, 0, 0, 0, 0, 0, 0, 0];
    previousTurn: Players["P2"];
    currentRow: Rows;
    currentCol: Cols;
  }
> = () => {
  p1: Turn<State, "P1">;
  p2: Turn<State, "P2">;
  checkWinner: CheckWinner<State["board"]> extends infer WinState
    ? WinState extends "Incomplete"
      ? () => "Incomplete"
      : WinState extends "Tie"
      ? () => "Tie"
      : (won: "Winner winner chicken dinner") => WinState
    : never;
  checkState: IsNever<State["board"]> extends true
    ? `Invalid turn by ${State["previousTurn"]}, Cell ${State["currentRow"]}-${State["currentCol"]} is already taken`
    : () => State;
  state: State;
  board: State["board"];
  ui: {
    winner: CheckWinner<State["board"]>;
    board: RenderBoard<State["board"], CheckWinner<State["board"]>>;
  };
};

declare const game: Game;

const g = game().p1(1, 1).p2(2, 2).p1(1, 2).p2(3, 3).p1(2, 3);

// hover over these to check for game state
g.checkWinner();
g.checkState();

// hover over this to render board
g.ui.board;
