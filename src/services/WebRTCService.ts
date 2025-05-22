import { CallType } from '../context/ChatContext';

// Define types
type RTCConnectionState = 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed';
type MediaStreamType = 'audio' | 'video' | 'screen' | 'none';

interface PeerConnection {
  id: string;
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
  mediaStream?: MediaStream;
  mediaType: MediaStreamType;
}

type SignalingMessage = {
  type: 'offer' | 'answer' | 'ice-candidate' | 'hangup';
  sender: string;
  receiver: string;
  payload: any;
};

type SignalingCallback = (message: SignalingMessage) => void;
type ConnectionStateCallback = (state: RTCConnectionState, peerId: string) => void;
type RemoteStreamCallback = (stream: MediaStream, peerId: string) => void;
type DataChannelMessageCallback = (data: any, peerId: string) => void;

class WebRTCService {
  private peerConnections: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private userId: string | null = null;
  private signalingCallbacks: SignalingCallback[] = [];
  private connectionStateCallbacks: ConnectionStateCallback[] = [];
  private remoteStreamCallbacks: RemoteStreamCallback[] = [];
  private dataChannelMessageCallbacks: DataChannelMessageCallback[] = [];
  private iceServers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    {
      urls: 'turn:numb.viagenie.ca',
      username: 'webrtc@live.com',
      credential: 'muazkh'
    }
  ];

  /**
   * Initialize the WebRTC service
   * @param userId User ID
   */
  public init(userId: string): void {
    this.userId = userId;
    console.log('WebRTC service initialized for user:', userId);
  }

  /**
   * Get local media stream
   * @param type Type of media to get (audio, video, or both)
   * @returns Promise with the media stream
   */
  public async getLocalStream(type: CallType): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: type === 'video' ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localStream = stream;
      return stream;
    } catch (error) {
      console.error('Error getting local stream:', error);
      throw error;
    }
  }

  /**
   * Get screen sharing stream
   * @returns Promise with the screen sharing stream
   */
  public async getScreenStream(): Promise<MediaStream> {
    try {
      // @ts-ignore - TypeScript doesn't recognize getDisplayMedia yet
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: false
      });
      
      this.screenStream = stream;
      
      // Listen for the user stopping screen sharing
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        this.screenStream = null;
        // Notify all peers that screen sharing has ended
        this.peerConnections.forEach((peer, peerId) => {
          this.sendSignalingMessage({
            type: 'hangup',
            sender: this.userId!,
            receiver: peerId,
            payload: { reason: 'screen_ended' }
          });
        });
      };
      
      return stream;
    } catch (error) {
      console.error('Error getting screen stream:', error);
      throw error;
    }
  }

  /**
   * Create a peer connection
   * @param peerId ID of the peer to connect to
   * @param mediaType Type of media to share
   * @returns The created peer connection
   */
  public createPeerConnection(peerId: string, mediaType: MediaStreamType = 'none'): RTCPeerConnection {
    if (!this.userId) {
      throw new Error('WebRTC service not initialized');
    }

    // Check if connection already exists
    if (this.peerConnections.has(peerId)) {
      return this.peerConnections.get(peerId)!.connection;
    }

    // Create new connection
    const connection = new RTCPeerConnection({ iceServers: this.iceServers });
    
    // Add local stream tracks if available
    let stream: MediaStream | null = null;
    
    if (mediaType === 'screen' && this.screenStream) {
      stream = this.screenStream;
    } else if ((mediaType === 'audio' || mediaType === 'video') && this.localStream) {
      stream = this.localStream;
    }
    
    if (stream) {
      stream.getTracks().forEach(track => {
        if (this.localStream) {
          connection.addTrack(track, this.localStream);
        }
      });
    }
    
    // Create data channel
    const dataChannel = connection.createDataChannel('chat', {
      ordered: true
    });
    
    this.setupDataChannel(dataChannel, peerId);
    
    // Set up event handlers
    connection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({
          type: 'ice-candidate',
          sender: this.userId!,
          receiver: peerId,
          payload: event.candidate
        });
      }
    };
    
    connection.oniceconnectionstatechange = () => {
      const state = connection.iceConnectionState as RTCConnectionState;
      this.connectionStateCallbacks.forEach(callback => callback(state, peerId));
    };
    
    connection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      this.remoteStreamCallbacks.forEach(callback => callback(remoteStream, peerId));
    };
    
    connection.ondatachannel = (event) => {
      this.setupDataChannel(event.channel, peerId);
    };
    
    // Store the connection
    this.peerConnections.set(peerId, {
      id: peerId,
      connection,
      dataChannel,
      mediaType
    });
    
    return connection;
  }

  /**
   * Set up a data channel
   * @param channel The data channel to set up
   * @param peerId ID of the peer
   */
  private setupDataChannel(channel: RTCDataChannel, peerId: string): void {
    channel.onopen = () => {
      console.log(`Data channel to ${peerId} opened`);
    };
    
    channel.onclose = () => {
      console.log(`Data channel to ${peerId} closed`);
    };
    
    channel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.dataChannelMessageCallbacks.forEach(callback => callback(data, peerId));
      } catch (error) {
        console.error('Error parsing data channel message:', error);
      }
    };
  }

  /**
   * Create an offer
   * @param peerId ID of the peer to send the offer to
   * @returns Promise with the created offer
   */
  public async createOffer(peerId: string): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.getPeerConnection(peerId);
    
    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    
    await peerConnection.setLocalDescription(offer);
    
    this.sendSignalingMessage({
      type: 'offer',
      sender: this.userId!,
      receiver: peerId,
      payload: offer
    });
    
    return offer;
  }

  /**
   * Handle an incoming offer
   * @param peerId ID of the peer who sent the offer
   * @param offer The received offer
   * @returns Promise with the created answer
   */
  public async handleOffer(peerId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.getPeerConnection(peerId);
    
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    
    this.sendSignalingMessage({
      type: 'answer',
      sender: this.userId!,
      receiver: peerId,
      payload: answer
    });
    
    return answer;
  }

  /**
   * Handle an incoming answer
   * @param peerId ID of the peer who sent the answer
   * @param answer The received answer
   */
  public async handleAnswer(peerId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const peerConnection = this.getPeerConnection(peerId);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  /**
   * Handle an incoming ICE candidate
   * @param peerId ID of the peer who sent the ICE candidate
   * @param candidate The received ICE candidate
   */
  public async handleIceCandidate(peerId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const peerConnection = this.getPeerConnection(peerId);
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  /**
   * Send a message through the data channel
   * @param peerId ID of the peer to send the message to
   * @param data Data to send
   * @returns Whether the message was sent successfully
   */
  public sendDataChannelMessage(peerId: string, data: any): boolean {
    const peer = this.peerConnections.get(peerId);
    
    if (!peer || !peer.dataChannel || peer.dataChannel.readyState !== 'open') {
      return false;
    }
    
    try {
      peer.dataChannel.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error sending data channel message:', error);
      return false;
    }
  }

  /**
   * Close a peer connection
   * @param peerId ID of the peer connection to close
   */
  public closePeerConnection(peerId: string): void {
    const peer = this.peerConnections.get(peerId);
    
    if (peer) {
      if (peer.dataChannel) {
        peer.dataChannel.close();
      }
      
      peer.connection.close();
      this.peerConnections.delete(peerId);
      
      this.sendSignalingMessage({
        type: 'hangup',
        sender: this.userId!,
        receiver: peerId,
        payload: { reason: 'user_ended' }
      });
    }
  }

  /**
   * Close all peer connections
   */
  public closeAllPeerConnections(): void {
    this.peerConnections.forEach((_, peerId) => {
      this.closePeerConnection(peerId);
    });
  }

  /**
   * Stop all media streams
   */
  public stopAllMediaStreams(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }
  }

  /**
   * Get a peer connection
   * @param peerId ID of the peer
   * @returns The peer connection
   */
  private getPeerConnection(peerId: string): RTCPeerConnection {
    if (!this.peerConnections.has(peerId)) {
      this.createPeerConnection(peerId);
    }
    
    return this.peerConnections.get(peerId)!.connection;
  }

  /**
   * Send a signaling message
   * @param message The message to send
   */
  private sendSignalingMessage(message: SignalingMessage): void {
    this.signalingCallbacks.forEach(callback => callback(message));
  }

  /**
   * Register a callback for signaling messages
   * @param callback Function to call when a signaling message is sent
   */
  public onSignalingMessage(callback: SignalingCallback): void {
    this.signalingCallbacks.push(callback);
  }

  /**
   * Register a callback for connection state changes
   * @param callback Function to call when a connection state changes
   */
  public onConnectionStateChange(callback: ConnectionStateCallback): void {
    this.connectionStateCallbacks.push(callback);
  }

  /**
   * Register a callback for remote streams
   * @param callback Function to call when a remote stream is received
   */
  public onRemoteStream(callback: RemoteStreamCallback): void {
    this.remoteStreamCallbacks.push(callback);
  }

  /**
   * Register a callback for data channel messages
   * @param callback Function to call when a data channel message is received
   */
  public onDataChannelMessage(callback: DataChannelMessageCallback): void {
    this.dataChannelMessageCallbacks.push(callback);
  }
}

// Create a singleton instance
const webRTCService = new WebRTCService();
export default webRTCService;
