const babelJest = require("babel-jest");

module.exports = babelJest.default.createTransformer({
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-react",
  ],
  plugins: [
    function () {
      return {
        name: "transform-import-meta",
        visitor: {
          MemberExpression(path) {
            const { node } = path;
            if (
              node.object.type === "MetaProperty" &&
              node.object.meta.name === "import" &&
              node.object.property.name === "meta" &&
              node.property.name === "env"
            ) {
              // Replace import.meta.env with a global variable
              path.replaceWith(
                path.scope.buildUndeclaredVariableErrorMessage(path.node)
              );
            }
          },
          MetaProperty(path) {
            if (
              path.node.meta.name === "import" &&
              path.node.property.name === "meta"
            ) {
              // Replace import.meta with VITE_GLOBAL_IMPORT_META
              path.replaceWithSourceString("VITE_GLOBAL_IMPORT_META");
            }
          },
        },
      };
    },
  ],
});
