// very hacky & dirty code
// possible we can optimize to not generate invalid states but I'm too lazy
const fs = require("node:fs");

let a = [];
for (let i = 0; i < 19683; ++i) {
  let c = i;
  for (let j = 0; j < 9; ++j) {
    a.push(parseInt(c % 3));
    c /= 3;
  }
}

function chunk(arr, len) {
  var chunks = [],
    i = 0,
    n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
}
let array = chunk(chunk(a, 3), 3);

let str = "";
let map = [];
map.push("export type BoardMap = {\n");

for (let i = 0; i < array.length; i++) {
  const row = array[i];
  let name = [];
  let arr = [];
  arr.push("\n/**");
  arr.push(`\n* | a | b | c |\n* |:---:|:---:|:---:|\n`);
  for (let j = 0; j < row.length; j++) {
    let col = row[j];
    name.push(`${col.toString().replace(/\,/g, "_")}`);
    arr.push(`* | ${col.toString().replace(/\,/g, " | ")} |`);
    arr.push("\n");
  }
  arr.push("*/\n");
  arr.push("render: ''\n};\n");
  arr.push("\n");

  let n = name.join("_");
  arr.unshift(`interface BoardState${n} {`);

  map.push(`\n"${n}": BoardState${n};\n`);
  str += arr.join("");
}

map.push(`\n}`);
str += map.join("");

fs.writeFileSync("./tic-tac-toe/boards.ts", str, { encoding: "utf-8" });
