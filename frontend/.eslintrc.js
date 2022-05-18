module.exports = {
    'settings': {
        'react': { 'version': 'latest' }
    },
    'env': {
        'node': true,
        'browser': true,
        'es6': true,
        'cypress/globals': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:security/recommended'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'react',
        'security',
        'cypress'
    ],
    'rules': {
        'indent': [
            'error',
            2,
            { 'SwitchCase': 1 }
        ],
        'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
        'quotes': [
            'error',
            'double'
        ],
        'semi': [
            'error',
            'always'
        ],
        'eqeqeq': 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [
            'error', 'always'
        ],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ]
    }
}
