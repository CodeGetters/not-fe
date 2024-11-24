const path = require("path");
const fs = require("fs");
const { RawSource } = require("webpack-sources");

class ReplaceTextInFilePlugin {
  constructor(options = {}) {
    this.rules = options.rules || [];
  }

  apply(compiler) {
    if (compiler.hooks) {
      compiler.hooks.emit.tap("ReplaceTextInFilePlugin", (compilation) => {
        const assets = Object.keys(compilation.assets);
        assets
          .filter((assetName) => /\.(js|html|css|json)$/.test(assetName))
          .forEach((assetName) => {
            const asset = compilation.assets[assetName];
            const content = asset.source();
            if (content) {
              const source = content.toString();
              let updatedSource = source;
              this.rules.forEach((rule) => {
                const { pattern, replacement } = rule;
                updatedSource = updatedSource.replace(pattern, replacement);
              });
              compilation.assets[assetName] = new RawSource(updatedSource);
            }
          });
      });
    }
  }
}

module.exports = ReplaceTextInFilePlugin;
