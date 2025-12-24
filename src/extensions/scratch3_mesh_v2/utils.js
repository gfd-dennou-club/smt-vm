const log = require('../../util/log');

const getMeshIdFromUrl = () => {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    const meshId = urlParams.get('mesh');

    if (!meshId) return null;

    if (meshId.length > 256) {
        log.warn(`Mesh ID too long: ${meshId.length} characters (max 256)`);
        return null;
    }

    // Allow alphanumeric, hyphen, underscore, dot.
    const validPattern = /^[a-zA-Z0-9-._]+$/;
    if (!validPattern.test(meshId)) {
        log.warn(`Mesh ID contains invalid characters: ${meshId}`);
        return null;
    }

    return meshId;
};

module.exports = {
    getMeshIdFromUrl
};
