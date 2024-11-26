module.exports = {
  rules: {
    "vue-no-deep-props": {
      create: function (context) {
        return {
          "VAttribute[directive=false][key.name='bind'][key.argument.type='VIdentifier'][key.argument.name='style']"(
            node,
          ) {
            const value = node.value.content;
            const regexp =
              /(\w+)\s*:\s*([\w\s\.\+\-\*\/%\$@&\|\^!~=\(\)\[\]]+);?/g;
            let match;
            while ((match = regexp.exec(value))) {
              const [, key, val] = match;
              if (key.split(".").length > 3) {
                context.report({
                  node,
                  message: `Style property "${key}" should not be deeper than 3 levels.`,
                });
              }
            }
          },
        };
      },
    },
  },
};
