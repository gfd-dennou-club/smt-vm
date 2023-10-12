module.exports = {
    rules: {
        'no-undefined': [0],
        'no-warning-comments': [0, {
            terms: ['todo'],
            location: 'start'
        }]
    }
};
