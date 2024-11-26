const utils = require("../utils");
const defaultWords = require("../utils/base-config").defaultWords;
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "detect misspellings",
      category: "Possible Errors",
      recommended: true,
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          words: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const words = { ...defaultWords, ...options.words };

    function checkNode(node) {
      utils.checkTypo(context, node, words);
    }

    return {
      Literal: checkNode,
      Text: checkNode,
    };
  },
};
