import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "on",
      "react/prop-types": "on",
      "no-unused-vars": ["warning", { varsIgnorePattern: "^[A-Z_]" }],
      "no-multiple-empty-lines": ["warning", { max: 2 }],
      eqeqeq: ["warning", "always"], // === 사용 권장
      "default-case": "warn", // switch문에 default
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
];
