module.exports = {
    root: true,
    extends: ['scratch', 'scratch/es6'],
    env: {
        browser: true
    },
    globals: {
        process: true
    },
    rules: {
        'no-warning-comments': [0, {
            terms: ['todo'],
            location: 'start'
        }]
    }
};
