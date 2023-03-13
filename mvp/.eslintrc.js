// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {},
};
