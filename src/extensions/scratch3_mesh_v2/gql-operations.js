const gqlTag = require('graphql-tag');
const gql = gqlTag.default || gqlTag;

const LIST_GROUPS_BY_DOMAIN = gql`
  query ListGroupsByDomain($domain: String) {
    listGroupsByDomain(domain: $domain) {
      id
      domain
      fullId
      name
      hostId
      createdAt
    }
  }
`;

const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!, $hostId: ID!, $domain: String) {
    createGroup(name: $name, hostId: $hostId, domain: $domain) {
      id
      domain
      fullId
      name
      hostId
      createdAt
    }
  }
`;

const JOIN_GROUP = gql`
  mutation JoinGroup($groupId: ID!, $domain: String!, $nodeId: ID!) {
    joinGroup(groupId: $groupId, domain: $domain, nodeId: $nodeId) {
      id
      name
      groupId
      domain
    }
  }
`;

const LEAVE_GROUP = gql`
  mutation LeaveGroup($groupId: ID!, $domain: String!, $nodeId: ID!) {
    leaveGroup(groupId: $groupId, domain: $domain, nodeId: $nodeId) {
      peerId
      groupId
      domain
      message
    }
  }
`;

const DISSOLVE_GROUP = gql`
  mutation DissolveGroup($groupId: ID!, $domain: String!, $hostId: ID!) {
    dissolveGroup(groupId: $groupId, domain: $domain, hostId: $hostId) {
      groupId
      domain
      message
    }
  }
`;

const REPORT_DATA = gql`
  mutation ReportDataByNode($groupId: ID!, $domain: String!, $nodeId: ID!, $data: [SensorDataInput!]!) {
    reportDataByNode(groupId: $groupId, domain: $domain, nodeId: $nodeId, data: $data) {
      nodeId
      groupId
      domain
      data {
        key
        value
      }
      timestamp
    }
  }
`;

const FIRE_EVENT = gql`
  mutation FireEventByNode($groupId: ID!, $domain: String!, $nodeId: ID!, $eventName: String!, $payload: String) {
    fireEventByNode(groupId: $groupId, domain: $domain, nodeId: $nodeId, eventName: $eventName, payload: $payload) {
      name
      firedByNodeId
      groupId
      domain
      payload
      timestamp
    }
  }
`;

const ON_DATA_UPDATE = gql`
  subscription OnDataUpdateInGroup($groupId: ID!, $domain: String!) {
    onDataUpdateInGroup(groupId: $groupId, domain: $domain) {
      nodeId
      groupId
      domain
      data {
        key
        value
      }
      timestamp
    }
  }
`;

const ON_EVENT = gql`
  subscription OnEventInGroup($groupId: ID!, $domain: String!) {
    onEventInGroup(groupId: $groupId, domain: $domain) {
      name
      firedByNodeId
      groupId
      domain
      payload
      timestamp
    }
  }
`;

const ON_GROUP_DISSOLVE = gql`
  subscription OnGroupDissolve($groupId: ID!, $domain: String!) {
    onGroupDissolve(groupId: $groupId, domain: $domain) {
      groupId
      domain
      message
    }
  }
`;

module.exports = {
    LIST_GROUPS_BY_DOMAIN,
    CREATE_GROUP,
    JOIN_GROUP,
    LEAVE_GROUP,
    DISSOLVE_GROUP,
    REPORT_DATA,
    FIRE_EVENT,
    ON_DATA_UPDATE,
    ON_EVENT,
    ON_GROUP_DISSOLVE
};
