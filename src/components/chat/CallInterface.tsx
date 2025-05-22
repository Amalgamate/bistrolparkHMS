import React, { useState, useEffect, useRef } from 'react';
import { Call, CallType, useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import webRTCService from '../../services/WebRTCService';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  Maximize2, 
  Minimize2, 
  X, 
  Volume2, 
  VolumeX,
  MessageSquare,
  MoreVertical,
  Users
} from 'lucide-react';
import { formatDuration } from 'date-fns';

interface CallInterfaceProps {
  call: Call;
}

const CallInterface: React.FC<CallInterfaceProps> = ({ call }) => {
  const { user } = useAuth();
  const { endCall, rejectCall, answerCall } = useChat();
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(call.type === 'video');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callContainerRef = useRef<HTMLDivElement>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const isIncoming = call.callerId !== user?.id;
  const isOngoing = call.status === 'ongoing';
  const isVideo = call.type === 'video';
  
  // Initialize WebRTC when call is answered
  useEffect(() => {
    if (isOngoing) {
      initializeWebRTC();
      
      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      
      // Clean up WebRTC
      webRTCService.stopAllMediaStreams();
      webRTCService.closeAllPeerConnections();
    };
  }, [isOngoing]);
  
  // Initialize WebRTC
  const initializeWebRTC = async () => {
    try {
      // Initialize WebRTC service
      webRTCService.init(user?.id || 'unknown');
      
      // Get local media stream
      const localStream = await webRTCService.getLocalStream(call.type);
      
      // Display local stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      
      // Set up remote stream handler
      webRTCService.onRemoteStream((stream, peerId) => {
        console.log(`Received remote stream from ${peerId}`);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });
      
      // Create peer connection
      const peerConnection = webRTCService.createPeerConnection(
        isIncoming ? call.callerId : call.receiverId,
        isVideo ? 'video' : 'audio'
      );
      
      // Create offer or handle offer based on call direction
      if (!isIncoming) {
        await webRTCService.createOffer(call.receiverId);
      }
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      handleEndCall();
    }
  };
  
  // Handle mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // Mute local audio tracks
    const localStream = localVideoRef.current?.srcObject as MediaStream;
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Toggle from current state
      });
    }
  };
  
  // Handle video toggle
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    
    // Enable/disable local video tracks
    const localStream = localVideoRef.current?.srcObject as MediaStream;
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled; // Toggle from current state
      });
    }
  };
  
  // Handle screen sharing
  const toggleScreenSharing = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing
        const localStream = await webRTCService.getLocalStream(call.type);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const screenStream = await webRTCService.getScreenStream();
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error('Error toggling screen sharing:', error);
    }
  };
  
  // Handle full screen toggle
  const toggleFullScreen = () => {
    if (!callContainerRef.current) return;
    
    if (!isFullScreen) {
      if (callContainerRef.current.requestFullscreen) {
        callContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullScreen(!isFullScreen);
  };
  
  // Handle call answer
  const handleAnswerCall = () => {
    answerCall(call.id);
  };
  
  // Handle call rejection
  const handleRejectCall = () => {
    rejectCall(call.id);
  };
  
  // Handle call end
  const handleEndCall = () => {
    endCall(call.id);
  };
  
  // Format duration for display
  const formatCallDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours > 0 ? hours.toString().padStart(2, '0') : null,
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].filter(Boolean).join(':');
  };
  
  // Render minimized call view
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white rounded-lg shadow-lg p-3 flex items-center z-50">
        <div className="mr-3">
          {isVideo ? (
            <Video className="w-5 h-5" />
          ) : (
            <Phone className="w-5 h-5" />
          )}
        </div>
        <div className="mr-3">
          <p className="font-medium">{isIncoming ? call.callerName : call.receiverName}</p>
          <p className="text-xs text-gray-300">{formatCallDuration(callDuration)}</p>
        </div>
        <button 
          className="p-2 bg-red-500 rounded-full hover:bg-red-600"
          onClick={handleEndCall}
        >
          <PhoneOff className="w-4 h-4" />
        </button>
        <button 
          className="p-2 ml-2 bg-gray-700 rounded-full hover:bg-gray-600"
          onClick={() => setIsMinimized(false)}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }
  
  return (
    <div 
      ref={callContainerRef}
      className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50"
    >
      <div className="relative w-full max-w-4xl">
        {/* Call header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="flex items-center text-white">
            <div className="mr-3">
              {isIncoming ? (
                call.callerAvatar ? (
                  <img 
                    src={call.callerAvatar} 
                    alt={call.callerName} 
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {call.callerName.charAt(0)}
                  </div>
                )
              ) : (
                call.receiverAvatar ? (
                  <img 
                    src={call.receiverAvatar} 
                    alt={call.receiverName} 
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {call.receiverName.charAt(0)}
                  </div>
                )
              )}
            </div>
            <div>
              <h3 className="font-semibold">{isIncoming ? call.callerName : call.receiverName}</h3>
              <p className="text-sm text-gray-300">
                {isOngoing ? formatCallDuration(callDuration) : call.status}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <button 
              className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 mr-2"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="w-5 h-5" />
            </button>
            <button 
              className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700"
              onClick={handleEndCall}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Video container */}
        <div className="relative w-full h-[600px] bg-gray-800 rounded-lg overflow-hidden">
          {/* Remote video (full size) */}
          {isVideo && (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Local video (picture-in-picture) */}
          {isVideo && (
            <div className="absolute bottom-4 right-4 w-1/4 max-w-[200px] aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Audio-only call display */}
          {!isVideo && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-semibold mb-4">
                {(isIncoming ? call.callerName : call.receiverName).charAt(0)}
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {isIncoming ? call.callerName : call.receiverName}
              </h2>
              <p className="text-gray-300">
                {isOngoing ? formatCallDuration(callDuration) : call.status}
              </p>
            </div>
          )}
        </div>
        
        {/* Call controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-gray-800 bg-opacity-80 rounded-full px-4 py-2 flex items-center space-x-4">
            <button 
              className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={toggleMute}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
            </button>
            
            {isVideo && (
              <button 
                className={`p-3 rounded-full ${!isVideoEnabled ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                onClick={toggleVideo}
              >
                {!isVideoEnabled ? (
                  <VideoOff className="w-5 h-5 text-white" />
                ) : (
                  <Video className="w-5 h-5 text-white" />
                )}
              </button>
            )}
            
            {isVideo && (
              <button 
                className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                onClick={toggleScreenSharing}
              >
                <Monitor className="w-5 h-5 text-white" />
              </button>
            )}
            
            <button 
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? (
                <Minimize2 className="w-5 h-5 text-white" />
              ) : (
                <Maximize2 className="w-5 h-5 text-white" />
              )}
            </button>
            
            {isOngoing ? (
              <button 
                className="p-3 rounded-full bg-red-500 hover:bg-red-600"
                onClick={handleEndCall}
              >
                <PhoneOff className="w-5 h-5 text-white" />
              </button>
            ) : (
              <>
                <button 
                  className="p-3 rounded-full bg-red-500 hover:bg-red-600"
                  onClick={handleRejectCall}
                >
                  <PhoneOff className="w-5 h-5 text-white" />
                </button>
                <button 
                  className="p-3 rounded-full bg-green-500 hover:bg-green-600"
                  onClick={handleAnswerCall}
                >
                  <Phone className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
