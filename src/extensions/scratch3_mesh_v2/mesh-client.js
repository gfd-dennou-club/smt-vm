const AWSAppSyncClient = require('aws-appsync').default;
const gqlTag = require('graphql-tag');
const gql = gqlTag.default || gqlTag;

// TODO: Replace with actual configuration or environment variables
const GRAPHQL_ENDPOINT = process.env.MESH_GRAPHQL_ENDPOINT || 'https://example.com/graphql';
const REGION = process.env.MESH_AWS_REGION || 'us-east-1';
const API_KEY = process.env.MESH_API_KEY || 'da2-example';

let client = null;

/* istanbul ignore next */
const createClient = () => {
    if (client) return client;

    client = new AWSAppSyncClient({
        url: GRAPHQL_ENDPOINT,
        region: REGION,
        auth: {
            type: 'API_KEY',
            apiKey: API_KEY
        },
        disableOffline: true
    });

    return client;
};

/* istanbul ignore next */
const getClient = () => client;

module.exports = {
    createClient,
    getClient,
    gql
};
