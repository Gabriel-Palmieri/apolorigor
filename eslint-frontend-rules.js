const rules = {
  "jsx-bindings": {
    meta: {
      type: "problem",
      schema: [],
      messages: {
        missing: "JSX component {{name}} is not imported or declared.",
      },
    },
    create(context) {
      return {
        JSXOpeningElement(node) {
          let name = node.name;
          while (name.type === "JSXMemberExpression") name = name.object;
          if (name.type !== "JSXIdentifier" || !/^[A-Z]/.test(name.name))
            return;
          if (!context.sourceCode.markVariableAsUsed(name.name, node))
            context.report({
              node: name,
              messageId: "missing",
              data: { name: name.name },
            });
        },
      };
    },
  },
  "utility-styles": {
    meta: {
      type: "problem",
      schema: [],
      messages: {
        inline:
          "Use design-system utilities. Continuous progress is isolated in shared/ui/feedback/Progress.jsx.",
      },
    },
    create(context) {
      const allowed = context.filename
        .replaceAll("\\", "/")
        .endsWith("/shared/ui/feedback/Progress.jsx");
      return {
        JSXAttribute(node) {
          if (node.name.name === "style" && !allowed)
            context.report({ node, messageId: "inline" });
        },
      };
    },
  },
};
export default { rules };
