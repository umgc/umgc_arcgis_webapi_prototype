module.exports = {
    overrides: [
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: './tsconfig.json',
            },
            plugins: ['@typescript-eslint', '@angular-eslint'],

            /**
             * TODO: Look up what this actually includes
             */
            // "extends": "tslint:recommended",

            rules: {
                // ORIGINAL tslint.json -> "array-type": false,
                '@typescript-eslint/array-type': 'off',

                // ORIGINAL tslint.json -> "arrow-parens": false,
                'arrow-parens': 'off',

                // ORIGINAL tslint.json -> "deprecation": { "severity": "warning" },
                /**
                 * | [`deprecation`]              | 🌓  | [`import/no-deprecated`] <sup>[1]</sup>            |
                 * <sup>[1]</sup> Only warns when importing deprecated symbols<br>
                 */

                // ORIGINAL tslint.json -> "component-class-suffix": true,
                '@angular-eslint/component-class-suffix': 'error',

                // ORIGINAL tslint.json -> "contextual-lifecycle": true,
                '@angular-eslint/contextual-lifecycle': 'error',

                // ORIGINAL tslint.json -> "directive-class-suffix": true,
                /**
                 * TODO: Not converted yet
                 */
                // '@angular-eslint/directive-class-suffix': 'error'

                // ORIGINAL tslint.json -> "directive-selector": [true, "attribute", "app", "camelCase"],
                '@angular-eslint/directive-selector': [
                    'error',
                    { type: 'attribute', prefix: 'app', style: 'camelCase' },
                ],

                // ORIGINAL tslint.json -> "component-selector": [true, "element", "app", "kebab-case"],
                '@angular-eslint/component-selector': [
                    'error',
                    { type: 'element', prefix: 'app', style: 'kebab-case' },
                ],

                // ORIGINAL tslint.json -> "import-blacklist": [true, "rxjs/Rx"],
                'no-restricted-imports': [
                    'error',
                    {
                        paths: [
                            {
                                name: 'rxjs/Rx',
                                message:
                                    "Please import directly from 'rxjs' instead",
                            },
                        ],
                    },
                ],

                // ORIGINAL tslint.json -> "interface-name": false,
                '@typescript-eslint/interface-name-prefix': 'off',

                // ORIGINAL tslint.json -> "max-classes-per-file": false,
                'max-classes-per-file': 'off',

                // ORIGINAL tslint.json -> "max-line-length": [true, 140],
                'max-len': ['error', { code: 140 }],

                // ORIGINAL tslint.json -> "member-access": false,
                '@typescript-eslint/explicit-member-accessibility': 'off',

                // ORIGINAL tslint.json -> "member-ordering": [true, { "order": ["static-field", "instance-field", "static-method", "instance-method"] } ],
                '@typescript-eslint/member-ordering': [
                    'error',
                    {
                        default: [
                            'static-field',
                            'instance-field',
                            'static-method',
                            'instance-method',
                        ],
                    },
                ],

                // ORIGINAL tslint.json -> "no-consecutive-blank-lines": false,
                'no-multiple-empty-lines': 'off',

                // ORIGINAL tslint.json -> "no-console": [true, "debug", "info", "time", "timeEnd", "trace"],
                'no-restricted-syntax': [
                    'error',
                    {
                        selector:
                            'CallExpression[callee.object.name="console"][callee.property.name=/^(debug|info|time|timeEnd|trace)$/]',
                        message:
                            'Unexpected property on console object was called',
                    },
                ],

                // ORIGINAL tslint.json -> "no-empty": false,
                'no-empty': 'off',

                // ORIGINAL tslint.json -> "no-inferrable-types": [true, "ignore-params"],
                '@typescript-eslint/no-inferrable-types': [
                    'error',
                    {
                        ignoreParameters: true,
                    },
                ],

                // ORIGINAL tslint.json -> "no-non-null-assertion": true,
                '@typescript-eslint/no-non-null-assertion': 'error',

                // ORIGINAL tslint.json -> "no-redundant-jsdoc": true,
                /**
                 * | [`no-redundant-jsdoc`]              | 🛑  | N/A ([open issue](https://github.com/gajus/eslint-plugin-jsdoc/issues/134))         |
                 */

                // ORIGINAL tslint.json -> "no-switch-case-fall-through": true,
                'no-fallthrough': 'error',

                // ORIGINAL tslint.json -> "no-var-requires": false,
                '@typescript-eslint/no-var-requires': 'off',

                // ORIGINAL tslint.json -> "object-literal-key-quotes": [true, "as-needed"],
                'quote-props': ['error', 'as-needed'],

                // ORIGINAL tslint.json -> "object-literal-sort-keys": false,
                'sort-keys': 'off',

                // ORIGINAL tslint.json -> "ordered-imports": false,
                /**
                 * Needs import plugin
                 */

                // ORIGINAL tslint.json -> "quotemark": [true, "single"],
                quotes: ['error', 'single'],

                // ORIGINAL tslint.json -> "trailing-comma": false,
                'comma-dangle': 'off',

                // ORIGINAL tslint.json -> "no-conflicting-lifecycle": true,
                '@angular-eslint/no-conflicting-lifecycle': 'error',

                // ORIGINAL tslint.json -> "no-host-metadata-property": true,
                '@angular-eslint/no-host-metadata-property': 'error',

                // ORIGINAL tslint.json -> "no-input-rename": true,
                '@angular-eslint/no-input-rename': 'error',

                // ORIGINAL tslint.json -> "no-inputs-metadata-property": true,
                '@angular-eslint/no-inputs-metadata-property': 'error',

                // ORIGINAL tslint.json -> "no-output-native": true,
                '@angular-eslint/no-output-native': 'error',

                // ORIGINAL tslint.json -> "no-output-on-prefix": true,
                '@angular-eslint/no-output-on-prefix': 'error',

                // ORIGINAL tslint.json -> "no-output-rename": true,
                '@angular-eslint/no-output-rename': 'error',

                // ORIGINAL tslint.json -> "no-outputs-metadata-property": true,
                '@angular-eslint/no-outputs-metadata-property': 'error',

                // ORIGINAL tslint.json -> "template-banana-in-box": true,
                // APPLIED VIA TEMPLATE-RELATED CONFIG BELOW

                // ORIGINAL tslint.json -> "template-no-negated-async": true,
                // APPLIED VIA TEMPLATE-RELATED CONFIG BELOW

                // ORIGINAL tslint.json -> "use-lifecycle-interface": true,
                '@angular-eslint/use-lifecycle-interface': 'warn',

                // ORIGINAL tslint.json -> "use-pipe-transform-interface": true
                '@angular-eslint/use-pipe-transform-interface': 'error',
            },
        },
        {
            files: ['*.component.html'],
            parser: '@angular-eslint/template-parser',
            plugins: ['@angular-eslint/template'],
            rules: {
                // ORIGINAL tslint.json -> "template-banana-in-box": true,
                '@angular-eslint/template/banana-in-a-box': 'error',

                // ORIGINAL tslint.json -> "template-no-negated-async": true,
                '@angular-eslint/template/no-negated-async': 'error',
            },
        },
    ],
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'prettier/prettier': 2,
        '@typescript-eslint/array-type': 'off',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
            'off',
            {
                accessibility: 'explicit',
            },
        ],
        '@typescript-eslint/indent': [
            'error',
            4,
            {
                FunctionDeclaration: {
                    parameters: 'first',
                },
                FunctionExpression: {
                    parameters: 'first',
                },
            },
        ],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false,
                },
            },
        ],
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/quotes': ['error', 'single'],
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/unified-signatures': 'error',
        'arrow-body-style': 'error',
        'arrow-parens': ['off', 'as-needed'],
        camelcase: 'error',
        'comma-dangle': 'off',
        complexity: 'off',
        'constructor-super': 'error',
        curly: 'error',
        'dot-notation': 'error',
        'eol-last': 'error',
        eqeqeq: ['error', 'smart'],
        'guard-for-in': 'error',
        'id-blacklist': [
            'error',
            'any',
            'Number',
            'number',
            'String',
            'string',
            'Boolean',
            'boolean',
            'Undefined',
            'undefined',
        ],
        'id-match': 'error',
        'import/order': 'off',
        'max-classes-per-file': 'off',
        'max-len': [
            'error',
            {
                code: 140,
            },
        ],
        'new-parens': 'error',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-cond-assign': 'error',
        'no-console': [
            'error',
            {
                allow: [
                    'log',
                    'warn',
                    'dir',
                    'timeLog',
                    'assert',
                    'clear',
                    'count',
                    'countReset',
                    'group',
                    'groupEnd',
                    'table',
                    'dirxml',
                    'error',
                    'groupCollapsed',
                    'Console',
                    'profile',
                    'profileEnd',
                    'timeStamp',
                    'context',
                ],
            },
        ],
        'no-debugger': 'error',
        'no-empty': 'off',
        'no-eval': 'error',
        'no-fallthrough': 'error',
        'no-invalid-this': 'off',
        'no-multiple-empty-lines': 'off',
        'no-new-wrappers': 'error',
        'no-restricted-imports': ['error', 'rxjs/Rx'],
        'no-shadow': [
            'error',
            {
                hoist: 'all',
            },
        ],
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        'no-underscore-dangle': 'error',
        'no-unsafe-finally': 'error',
        'no-unused-expressions': 'error',
        'no-unused-labels': 'error',
        'object-shorthand': 'error',
        'one-var': ['error', 'never'],
        'quote-props': ['error', 'as-needed'],
        radix: 'error',
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'never',
                asyncArrow: 'always',
                named: 'never',
            },
        ],
        'spaced-comment': 'error',
        'use-isnan': 'error',
        'valid-typeof': 'off',
    },
};
