const { getDefaultConfig } = require("expo/metro-config");
const { resolve } = require("path");

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: resolve(
    "node_modules/react-native-svg-transformer/index.js"
  ),
};
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
};

module.exports = config;
