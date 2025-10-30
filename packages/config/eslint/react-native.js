module.exports = {
  extends: ['./base.js', 'expo', 'prettier'],
  env: {
    'react-native/react-native': true,
  },
  plugins: ['react', 'react-hooks', 'react-native'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
  },
};
