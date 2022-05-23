type Unwrap<Obj> = {
  [P in keyof Obj]: Obj[P] extends Tree<any> ? Obj[P]["nodeValue"] : Obj;
};

interface Tree<Obj> {
  nodeValue: Unwrap<Obj>;
  file<S extends string, Content extends string>(
    s: S,
    c: Content
  ): Tree<Obj & { [P in S]: Content }>;
  folder<S extends string, SubTree extends Tree<{}>>(
    s: S,
    subtree: SubTree
  ): Tree<Obj & { [P in S]: SubTree }>;
  build(): Unwrap<Obj>;
}

const tree = () => {
  return {
    nodeValue: {},
    file(name, content) {
      return this;
    },
    folder(name, children) {
      return this;
    },
    build() {
      return "";
    },
  } as Tree<{}>;
};

// prettier-ignore
const mytree =
  tree()
    .folder(
      "root",
      tree()
        .file("index.html", "<p>Hello world</p>")
        .folder(
          "src",
          tree().file("index.js", "window.close()")
        )
        .folder(
          "styles",
          tree()
            .file("styles.css", "* { display: none }")
            .folder(
              "scss",
              tree().file("main.scss", "Hi nested")
            )
        )
    )
    .build()

export {};
