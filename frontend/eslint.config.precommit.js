import baseConfig from './eslint.config.js';
import tseslint from 'typescript-eslint';

// eslint-disable-next-line import/no-default-export
export default tseslint.config(
  ...baseConfig,

  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/explicit-module-boundary-types': ['error', { allowArgumentsExplicitlyTypedAsAny: true }],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: {},
          interfaces: { order: 'alphabetically' },
          typeLiterals: { order: 'alphabetically' }
        }
      ],
      '@typescript-eslint/no-inferrable-types': 'error',
      'no-var': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error'
    }
  }
);
