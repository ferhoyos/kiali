import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

// eslint-disable-next-line import/no-default-export
export default tseslint.config(
  {
    ignores: ['build/**', 'cypress/**', 'node_modules/**', 'public/**']
  },

  js.configs.recommended,

  {
    files: ['**/*.{js,ts,tsx}'],
    plugins: {
      'import': importPlugin,
      'jsx-a11y': jsxA11y,
      react,
      'react-hooks': reactHooks
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2020,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      'array-callback-return': 'warn',
      'no-case-declarations': 'warn',
      'no-empty': 'warn',
      'no-prototype-builtins': 'warn',
      'default-case': ['warn', { commentPattern: '^no default$' }],
      'dot-location': ['warn', 'property'],
      eqeqeq: ['warn', 'smart'],
      'getter-return': 'warn',
      'new-parens': 'warn',
      'no-array-constructor': 'warn',
      'no-caller': 'warn',
      'no-cond-assign': ['warn', 'except-parens'],
      'no-const-assign': 'warn',
      'no-control-regex': 'warn',
      'no-delete-var': 'warn',
      'no-dupe-args': 'warn',
      'no-dupe-class-members': 'warn',
      'no-dupe-keys': 'warn',
      'no-duplicate-case': 'warn',
      'no-empty-character-class': 'warn',
      'no-empty-pattern': 'warn',
      'no-eval': 'warn',
      'no-ex-assign': 'warn',
      'no-extend-native': 'warn',
      'no-extra-bind': 'warn',
      'no-extra-label': 'warn',
      'no-fallthrough': 'warn',
      'no-func-assign': 'warn',
      'no-global-assign': 'warn',
      'no-implied-eval': 'warn',
      'no-invalid-regexp': 'warn',
      'no-iterator': 'warn',
      'no-label-var': 'warn',
      'no-labels': ['warn', { allowLoop: true, allowSwitch: false }],
      'no-lone-blocks': 'warn',
      'no-loop-func': 'warn',
      'no-mixed-operators': [
        'warn',
        {
          allowSamePrecedence: false,
          groups: [
            ['&', '|', '^', '~', '<<', '>>', '>>>'],
            ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
            ['&&', '||'],
            ['in', 'instanceof']
          ]
        }
      ],
      'no-multi-str': 'warn',
      'no-new-func': 'warn',
      'no-new-wrappers': 'warn',
      'no-obj-calls': 'warn',
      'no-octal': 'warn',
      'no-octal-escape': 'warn',
      'no-redeclare': 'warn',
      'no-regex-spaces': 'warn',
      'no-restricted-globals': ['error', 'event'],
      'no-restricted-properties': [
        'error',
        {
          message: 'Please use import() instead.',
          object: 'require',
          property: 'ensure'
        },
        {
          message: 'Please use import() instead.',
          object: 'System',
          property: 'import'
        }
      ],
      'no-restricted-syntax': ['warn', 'WithStatement'],
      'no-script-url': 'warn',
      'no-self-assign': 'warn',
      'no-self-compare': 'warn',
      'no-sequences': 'warn',
      'no-shadow-restricted-names': 'warn',
      'no-sparse-arrays': 'warn',
      'no-template-curly-in-string': 'warn',
      'no-this-before-super': 'warn',
      'no-throw-literal': 'warn',
      'no-undef': 'off',
      'no-unreachable': 'warn',
      'no-unsafe-negation': 'warn',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true
        }
      ],
      'no-unused-labels': 'warn',
      'no-unused-vars': [
        'warn',
        {
          args: 'none',
          ignoreRestSiblings: true
        }
      ],
      'no-use-before-define': [
        'warn',
        {
          classes: false,
          functions: false,
          variables: false
        }
      ],
      'no-useless-computed-key': 'warn',
      'no-useless-concat': 'warn',
      'no-useless-constructor': 'warn',
      'no-useless-escape': 'warn',
      'no-useless-rename': [
        'warn',
        {
          ignoreDestructuring: false,
          ignoreExport: false,
          ignoreImport: false
        }
      ],
      'no-whitespace-before-property': 'warn',
      'no-with': 'warn',
      'require-yield': 'warn',
      'rest-spread-spacing': ['warn', 'never'],
      strict: ['warn', 'never'],
      'unicode-bom': ['warn', 'never'],
      'use-isnan': 'warn',
      'valid-typeof': 'warn',

      'import/first': 'error',
      'import/no-amd': 'error',
      'import/no-anonymous-default-export': 'warn',
      'import/no-default-export': 'error',
      'import/no-webpack-loader-syntax': 'error',

      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-role': ['warn', { ignoreNonDOM: true }],
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/iframe-has-title': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/no-access-key': 'warn',
      'jsx-a11y/no-distracting-elements': 'warn',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'jsx-a11y/scope': 'warn',

      'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
      'react/jsx-no-comment-textnodes': 'warn',
      'react/jsx-no-duplicate-props': 'warn',
      'react/jsx-no-target-blank': 'warn',
      'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': ['warn', { allowAllCaps: true, ignore: [] }],
      'react/jsx-uses-react': 'warn',
      'react/jsx-uses-vars': 'warn',
      'react/no-danger-with-children': 'warn',
      'react/no-direct-mutation-state': 'warn',
      'react/no-is-mounted': 'warn',
      'react/no-typos': 'error',
      'react/require-render-return': 'error',
      'react/style-prop-object': 'warn',

      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error'
    }
  },

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2018,
        sourceType: 'module',
        warnOnUnsupportedTypeScriptVersion: true
      }
    },
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/no-redeclare': 'warn',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'none',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/no-use-before-define': [
        'warn',
        {
          classes: false,
          functions: false,
          typedefs: false,
          variables: false
        }
      ],
      '@typescript-eslint/no-useless-constructor': 'warn',
      'default-case': 'off',
      'no-array-constructor': 'off',
      '@typescript-eslint/no-array-constructor': 'warn',
      'no-dupe-class-members': 'off',
      'no-redeclare': 'off',
      'no-undef': 'off',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',
      'no-useless-constructor': 'off'
    }
  },

  {
    files: ['*.config.{js,ts}', 'eslint.config.*.js'],
    rules: {
      'import/no-default-export': 'off'
    }
  },

  {
    files: ['**/*.cjs'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs'
    }
  }
);
