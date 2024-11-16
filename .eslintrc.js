module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  ignorePatterns: ['dist', 'build', 'node_modules'],
  overrides: [
    // Frontend specific rules
    {
      files: ['fe/**/*.{ts,tsx}'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      plugins: ['react', 'react-hooks', '@typescript-eslint'],
      env: {
        browser: true,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
      },
    },
    // Backend specific rules
    {
      files: ['be/**/*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@nestjs/recommended',
      ],
      plugins: ['@typescript-eslint', '@nestjs'],
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
