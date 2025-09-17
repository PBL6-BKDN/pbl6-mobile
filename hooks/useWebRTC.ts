import { useRef, useState } from 'react';

export interface WebRTCState {
  isConnected: boolean;
  isConnecting: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isVideoEnabled: boolean;
}

export const useWebRTC = (deviceId: string, publishMessage: (topic: string, message: any) => void) => {
  const [state, setState] = useState<WebRTCState>({
    isConnected: false,
    isConnecting: false,
    localStream: null,
    remoteStream: null,
    isMuted: false,
    isVideoEnabled: true
  });

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // WebRTC configuration
  const rtcConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  const initializePeerConnection = async () => {
    try {
      // Create peer connection
      peerConnectionRef.current = new RTCPeerConnection(rtcConfiguration);

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          publishMessage(`mobile/${deviceId}/webrtc/candidate`, {
            candidate: event.candidate
          });
        }
      };

      // Handle remote stream
      peerConnectionRef.current.ontrack = (event) => {
        console.log('Remote stream received');
        setState(prev => ({
          ...prev,
          remoteStream: event.streams[0]
        }));
      };

      // Handle connection state changes
      peerConnectionRef.current.onconnectionstatechange = () => {
        const connectionState = peerConnectionRef.current?.connectionState;
        console.log('Connection state:', connectionState);
        
        setState(prev => ({
          ...prev,
          isConnected: connectionState === 'connected',
          isConnecting: connectionState === 'connecting'
        }));
      };

      return true;
    } catch (error) {
      console.error('Failed to initialize peer connection:', error);
      return false;
    }
  };

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });

      localStreamRef.current = stream;
      setState(prev => ({
        ...prev,
        localStream: stream
      }));

      // Add tracks to peer connection
      if (peerConnectionRef.current) {
        stream.getTracks().forEach(track => {
          peerConnectionRef.current?.addTrack(track, stream);
        });
      }

      return stream;
    } catch (error) {
      console.error('Failed to get local stream:', error);
      return null;
    }
  };

  // Start call (Mobile → Device)
  const startCall = async () => {
    console.log('Starting call to device:', deviceId);
    
    setState(prev => ({ ...prev, isConnecting: true }));

    // Initialize peer connection
    const initialized = await initializePeerConnection();
    if (!initialized) {
      setState(prev => ({ ...prev, isConnecting: false }));
      return;
    }

    // Get local media stream
    const stream = await getLocalStream();
    if (!stream) {
      setState(prev => ({ ...prev, isConnecting: false }));
      return;
    }

    try {
      // Create offer
      const offer = await peerConnectionRef.current!.createOffer();
      await peerConnectionRef.current!.setLocalDescription(offer);

      // Send offer to device via MQTT
      publishMessage(`mobile/${deviceId}/webrtc/offer`, {
        type: 'offer',
        sdp: offer.sdp
      });

      console.log('Offer sent to device');
    } catch (error) {
      console.error('Failed to create offer:', error);
      setState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  // Handle answer from device
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(answer);
        console.log('Answer processed');
      }
    } catch (error) {
      console.error('Failed to handle answer:', error);
    }
  };

  // Handle ICE candidate from device
  const handleRemoteCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(candidate);
        console.log('ICE candidate added');
      }
    } catch (error) {
      console.error('Failed to add ICE candidate:', error);
    }
  };

  // End call
  const endCall = () => {
    console.log('Ending call');

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setState({
      isConnected: false,
      isConnecting: false,
      localStream: null,
      remoteStream: null,
      isMuted: false,
      isVideoEnabled: true
    });
  };

  // Toggle mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setState(prev => ({ ...prev, isMuted: !audioTrack.enabled }));
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setState(prev => ({ ...prev, isVideoEnabled: videoTrack.enabled }));
      }
    }
  };

  return {
    state,
    startCall,
    endCall,
    handleAnswer,
    handleRemoteCandidate,
    toggleMute,
    toggleVideo
  };
};