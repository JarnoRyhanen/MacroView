// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // react-native-reanimated plugin must appear once and last
    ['react-native-reanimated/plugin', { globals: ['__labelImage'] }],
    ['react-native-worklets-core/plugin']
  ],
};