const gqlTag = require('graphql-tag');
const gql = gqlTag.default || gqlTag;

const LIST_GROUPS_BY_DOMAIN = gql`
  query ListGroupsByDomain($domain: String!) {
    listGroupsByDomain(domain: $domain) {
      id
      domain
      fullId
      name
      hostId
      createdAt
      expiresAt
    }
  }
`;

const CREATE_DOMAIN = gql`
  mutation CreateDomain {
    createDomain
  }
`;

const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!, $hostId: ID!, $domain: String!, $maxConnectionTimeSeconds: Int) {
    createGroup(name: $name, hostId: $hostId, domain: $domain, maxConnectionTimeSeconds: $maxConnectionTimeSeconds) {
      id
      domain
      fullId
      name
      hostId
      createdAt
      expiresAt
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
      expiresAt
      heartbeatIntervalSeconds
    }
  }
`;

const LEAVE_GROUP = gql`
  mutation LeaveGroup($groupId: ID!, $nodeId: ID!, $domain: String!) {
    leaveGroup(groupId: $groupId, nodeId: $nodeId, domain: $domain) {
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
      groupDissolve {
        groupId
        domain
        message
      }
    }
  }
`;

const RENEW_HEARTBEAT = gql`
  mutation RenewHeartbeat($groupId: ID!, $domain: String!, $hostId: ID!) {
    renewHeartbeat(groupId: $groupId, domain: $domain, hostId: $hostId) {
      groupId
      domain
      expiresAt
      heartbeatIntervalSeconds
    }
  }
`;

const SEND_MEMBER_HEARTBEAT = gql`
  mutation SendMemberHeartbeat($groupId: ID!, $domain: String!, $nodeId: ID!) {
    sendMemberHeartbeat(groupId: $groupId, domain: $domain, nodeId: $nodeId) {
      nodeId
      groupId
      domain
      expiresAt
      heartbeatIntervalSeconds
    }
  }
`;

const REPORT_DATA = gql`
  mutation ReportDataByNode($groupId: ID!, $domain: String!, $nodeId: ID!, $data: [SensorDataInput!]!) {
    reportDataByNode(groupId: $groupId, domain: $domain, nodeId: $nodeId, data: $data) {
      groupId
      domain
      nodeStatus {
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
  }
`;

const FIRE_EVENTS = gql`
  mutation FireEventsByNode($groupId: ID!, $domain: String!, $nodeId: ID!, $events: [EventInput!]!) {
    fireEventsByNode(groupId: $groupId, domain: $domain, nodeId: $nodeId, events: $events) {
      groupId
      domain
      batchEvent {
        events {
          name
          firedByNodeId
          groupId
          domain
          payload
          timestamp
        }
        firedByNodeId
        groupId
        domain
        timestamp
      }
    }
  }
`;

const ON_MESSAGE_IN_GROUP = gql`
  subscription OnMessageInGroup($groupId: ID!, $domain: String!) {
    onMessageInGroup(groupId: $groupId, domain: $domain) {
      groupId
      domain
      nodeStatus {
        nodeId
        groupId
        domain
        data {
          key
          value
        }
        timestamp
      }
      batchEvent {
        events {
          name
          firedByNodeId
          groupId
          domain
          payload
          timestamp
        }
        firedByNodeId
        groupId
        domain
        timestamp
      }
      groupDissolve {
        groupId
        domain
        message
      }
    }
  }
`;

const LIST_GROUP_STATUSES = gql`
  query ListGroupStatuses($groupId: ID!, $domain: String!) {
    listGroupStatuses(groupId: $groupId, domain: $domain) {
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

module.exports = {
    LIST_GROUPS_BY_DOMAIN,
    CREATE_DOMAIN,
    CREATE_GROUP,
    JOIN_GROUP,
    LEAVE_GROUP,
    DISSOLVE_GROUP,
    RENEW_HEARTBEAT,
    SEND_MEMBER_HEARTBEAT,
    REPORT_DATA,
    FIRE_EVENTS,
    ON_MESSAGE_IN_GROUP,
    LIST_GROUP_STATUSES
};
