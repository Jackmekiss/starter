/* global __dirname, module, require */

const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const { withStorybook } = require("@storybook/react-native/withStorybook");

const config = getDefaultConfig(__dirname);

module.exports = withStorybook(withNativewind(config), {
  configPath: "./.rnstorybook",
});
