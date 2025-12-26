const log = require('../../util/log');

/* istanbul ignore next */
const getDomainFromUrl = () => {
    /* istanbul ignore next */
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    const domain = urlParams.get('mesh');

    if (!domain) return null;

    if (domain.length > 256) {
        /* istanbul ignore next */
        log.warn(`Mesh domain too long: ${domain.length} characters (max 256)`);
        /* istanbul ignore next */
        return null;
    }

    // Allow alphanumeric, hyphen, underscore, dot.
    const validPattern = /^[a-zA-Z0-9-._]+$/;
    if (!validPattern.test(domain)) {
        /* istanbul ignore next */
        log.warn(`Mesh domain contains invalid characters: ${domain}`);
        /* istanbul ignore next */
        return null;
    }

    return domain;
};

module.exports = {
    getDomainFromUrl
};
