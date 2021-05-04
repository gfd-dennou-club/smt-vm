const debugMode = true;

const MeshService = require('./mesh-service');

const log = require('../../util/log');
const debugLogger = require('../../util/debug-logger');
const debug = debugLogger(debugMode);

class MeshPeer extends MeshService {
    get logPrefix () {
        return 'Mesh Peer';
    }

    connect (hostPeerId) {
        if (this.connectionState === 'connected') {
            log.info('Already connected');
            return;
        }
        if (this.connectionState === 'connecting') {
            log.info('Now connecting, please wait to connect.');
            return;
        }

        let meshId, hostOrPeer, timestamp, domain;
        [hostMeshId, hostOrPeer, ttl, domain] = hostPeerId.split('_');

        if (!hostMeshId || hostMeshId.trim() === '' || hostOrPeer !== 'host') {
            this.setConnectionState('request_error');

            log.error('Not select Host Mesh ID');
            return;
        }

        this.hostMeshId = hostMeshId;
        this.hostPeerId = hostPeerId;

        this.setConnectionState('connecting');

        this.room = this.peer.joinRoom(this.hostPeerId);
        this.room.on('open', this.onRoomOpen.bind(this));
        this.room.on('peerJoin', this.onRoomPeerJoin.bind(this));
        this.room.on('peerLeave', this.onRoomPeerLeave.bind(this));
        this.room.once('log', this.onRoomLog.bind(this));
        this.room.on('data', this.onRoomData.bind(this));
        this.room.on('close', this.onRoomClose.bind(this));

        this.connectTimeoutId =
            setTimeout(this.onConnectTimeout.bind(this), this.connectTimeoutSeconds * 1000);
    }

    onRoomOpen () {
        MeshService.prototype.onRoomOpen.call(this);

        log.info('Connected as Mesh Peer.');

        this.sendVariables(this.getGlobalVariables());
    }

    onRoomPeerLeave (peerId) {
        MeshService.prototype.onRoomPeerLeave.call(this, peerId);

        if (peerId !== this.room.name) {
            return;
        }

        this.requestDisconnect();
    }
}

module.exports = MeshPeer;
