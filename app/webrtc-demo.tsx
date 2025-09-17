import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SignalingData {
  type: 'offer' | 'answer' | 'ice-candidate';
  data: any;
  timestamp: number;
}

export default function WebRTCDemo() {
  const [isInitiator, setIsInitiator] = useState(false);
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [signalData, setSignalData] = useState('');
  const [receivedSignal, setReceivedSignal] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [callTarget, setCallTarget] = useState('Device IoT - ESP32');

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ];

  useEffect(() => {
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      // No need to cleanup tracks in demo mode
    };
  }, []);

  const initializePeerConnection = () => {
    const pc = new RTCPeerConnection({ iceServers });
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        addLog('ICE candidate generated');
        
        const signalData: SignalingData = {
          type: 'ice-candidate',
          data: event.candidate,
          timestamp: Date.now()
        };
        setSignalData(JSON.stringify(signalData, null, 2));
        addLog('📋 ICE CANDIDATE ready to copy - send to other device');
      }
    };

    pc.ontrack = (event) => {
      addLog('Remote track received');
      const remoteStream = event.streams[0];
      setRemoteStream(remoteStream);
      if (remoteVideo.current && remoteStream) {
        remoteVideo.current.srcObject = remoteStream;
      }
    };

    pc.onconnectionstatechange = () => {
      addLog(`Connection state: ${pc.connectionState}`);
      setConnectionState(pc.connectionState as any);
    };

    return pc;
  };

  const startCall = async () => {
    try {
      setConnectionState('connecting');
      addLog('Starting call as initiator...');
      setIsInitiator(true);
      
      // For demo purposes, we'll simulate getting media
      addLog('Simulating media access for demo...');
      
      // Create a fake local stream indicator
      setLocalStream({} as MediaStream);
      
      // Initialize peer connection
      const pc = initializePeerConnection();
      peerConnection.current = pc;
      
      // Create offer immediately for demo
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      addLog('Offer created and set as local description');
      
      const signalData: SignalingData = {
        type: 'offer',
        data: offer,
        timestamp: Date.now()
      };
      setSignalData(JSON.stringify(signalData, null, 2));
      addLog('📋 OFFER ready to copy - send to other device manually');
      
    } catch (error) {
      addLog(`Error starting call: ${error}`);
      setConnectionState('disconnected');
      Alert.alert('Error', 'Failed to start call. This is a demo version.');
    }
  };

  const answerCall = async () => {
    try {
      addLog('Answering call...');
      
      // For demo purposes, simulate getting media
      addLog('Simulating media access for demo...');
      
      // Create a fake local stream indicator
      setLocalStream({} as MediaStream);
      
      // Initialize peer connection
      const pc = initializePeerConnection();
      peerConnection.current = pc;
      
      addLog('Ready to receive offer. Paste the offer data and click "Process Signal"');
      
    } catch (error) {
      addLog(`Error answering call: ${error}`);
      Alert.alert('Error', 'Failed to answer call. This is a demo version.');
    }
  };

  const processSignal = async () => {
    if (!receivedSignal.trim()) {
      Alert.alert('Error', 'Please paste signal data first');
      return;
    }

    // Check if user pasted button text instead of JSON
    const trimmedSignal = receivedSignal.trim();
    if (trimmedSignal === 'Trả lời cuộc gọi' || trimmedSignal === 'Bắt đầu cuộc gọi' || 
        trimmedSignal === 'Answer Call' || trimmedSignal === 'Start Call' ||
        !trimmedSignal.startsWith('{')) {
      Alert.alert(
        'Invalid Input', 
        'Please paste JSON signal data, not button text. The data should start with { and contain "type" and "data" fields.'
      );
      addLog('Invalid input detected: User pasted button text instead of JSON signal data');
      return;
    }

    try {
      const signalData: SignalingData = JSON.parse(receivedSignal);
      
      // Validate signal structure
      if (!signalData.type || !signalData.data) {
        Alert.alert('Error', 'Invalid signal format. Missing type or data field.');
        addLog('Invalid signal structure: Missing required fields');
        return;
      }

      const pc = peerConnection.current;
      
      if (!pc) {
        Alert.alert('Error', 'Peer connection not initialized');
        return;
      }

      switch (signalData.type) {
        case 'offer':
          addLog('Processing offer...');
          addLog(`Current connection state: ${pc.signalingState}`);
          
          if (pc.signalingState !== 'stable') {
            Alert.alert('Error', 'Connection not in stable state to receive offer');
            addLog(`Cannot process offer in state: ${pc.signalingState}`);
            return;
          }
          
          await pc.setRemoteDescription(signalData.data);
          addLog('Remote description set with offer');
          
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          
          addLog('Answer created and set as local description');
          const answerSignal: SignalingData = {
            type: 'answer',
            data: answer,
            timestamp: Date.now()
          };
          setSignalData(JSON.stringify(answerSignal, null, 2));
          addLog('📋 ANSWER ready to copy - send back to caller');
          break;
          
        case 'answer':
          addLog('Processing answer...');
          addLog(`Current connection state: ${pc.signalingState}`);
          
          if (pc.signalingState !== 'have-local-offer') {
            Alert.alert('Error', `Cannot set remote answer. Current state: ${pc.signalingState}. Expected: have-local-offer`);
            addLog(`Cannot process answer in state: ${pc.signalingState}`);
            return;
          }
          
          await pc.setRemoteDescription(signalData.data);
          addLog('Remote description set with answer - connection should be established');
          setConnectionState('connected');
          break;
          
        case 'ice-candidate':
          addLog('Processing ICE candidate...');
          addLog(`Current connection state: ${pc.signalingState}`);
          
          if (pc.remoteDescription) {
            await pc.addIceCandidate(signalData.data);
            addLog('ICE candidate added successfully');
          } else {
            addLog('Cannot add ICE candidate - no remote description set yet');
            Alert.alert('Warning', 'ICE candidate received but no remote description set yet');
          }
          break;
          
        default:
          Alert.alert('Error', `Unknown signal type: ${signalData.type}`);
          addLog(`Unknown signal type received: ${signalData.type}`);
          return;
      }
      
      setReceivedSignal('');
      addLog('Signal processed successfully');
    } catch (error) {
      addLog(`Error processing signal: ${error}`);
      
      // Reset connection state on error
      if (peerConnection.current) {
        addLog(`Connection state was: ${peerConnection.current.signalingState}`);
      }
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorName = error instanceof Error ? error.name : 'Unknown';
      
      if (error instanceof SyntaxError) {
        Alert.alert(
          'JSON Parse Error', 
          'The pasted data is not valid JSON. Please copy the complete signal data from the other device.'
        );
      } else if (errorName === 'InvalidStateError') {
        Alert.alert(
          'Connection State Error', 
          `WebRTC connection is in wrong state. Please restart the call process. Error: ${errorMessage}`
        );
        // Reset the connection
        setConnectionState('disconnected');
        setSignalData('');
      } else {
        Alert.alert('Error', `Failed to process signal data: ${errorMessage}`);
      }
    }
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        addLog(`Audio ${audioTrack.enabled ? 'unmuted' : 'muted'}`);
      }
    }
  };

  const endCall = () => {
    addLog('Ending call...');
    
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    // For demo, just clear the fake stream
    setLocalStream(null);
    setRemoteStream(null);
    setConnectionState('disconnected');
    setIsInitiator(false);
    setSignalData('');
    setReceivedSignal('');
    setIsMuted(false);
    
    addLog('Call ended - demo reset');
  };

  const resetConnection = () => {
    addLog('Resetting connection...');
    
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    setLocalStream(null);
    setRemoteStream(null);
    setConnectionState('disconnected');
    setIsInitiator(false);
    setSignalData('');
    setReceivedSignal('');
    setIsMuted(false);
    
    addLog('Connection reset complete - ready for new call');
    Alert.alert('Reset Complete', 'Connection has been reset. You can start a new call.');
  };

  const copyToClipboard = () => {
    // For React Native, we'll just show an alert since clipboard API might not work
    Alert.alert(
      'Sao chép thành công!', 
      'JSON đã sẵn sàng để sao chép. Bạn có thể select text và copy thủ công.',
      [{ text: 'OK' }]
    );
    addLog('Signal data ready to copy manually');
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-center mb-6 text-blue-600">
        🎥 WebRTC Demo (React Native)
      </Text>
      
      {/* Demo Notice */}
      <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <Text className="text-lg font-semibold mb-2 text-blue-800">ℹ️ Demo Mode:</Text>
        <Text className="text-sm text-blue-700 mb-1">• Đây là demo WebRTC cho React Native</Text>
        <Text className="text-sm text-blue-700 mb-1">• Không cần camera/microphone thật</Text>
        <Text className="text-sm text-blue-700">• JSON sẽ xuất hiện ngay khi nhấn nút</Text>
      </View>
      
      {/* Instructions */}
      <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <Text className="text-lg font-semibold mb-2 text-yellow-800">📋 Hướng dẫn sử dụng:</Text>
        <Text className="text-sm text-yellow-700 mb-1">1. Device A nhấn "Bắt đầu cuộc gọi" → Copy JSON xuất hiện</Text>
        <Text className="text-sm text-yellow-700 mb-1">2. Gửi JSON cho Device B qua WhatsApp/Telegram</Text>
        <Text className="text-sm text-yellow-700 mb-1">3. Device B nhấn "Trả lời cuộc gọi" → Paste JSON vào → Nhấn "Xử lý"</Text>
        <Text className="text-sm text-yellow-700 mb-1">4. Device B copy Answer JSON → Gửi về Device A</Text>
        <Text className="text-sm text-yellow-700">5. Device A paste Answer → Kết nối thành công!</Text>
      </View>
      
      {/* Call Target Info */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold mb-2">Đang gọi</Text>
        <View className="flex-row items-center">
          <Ionicons name="hardware-chip" size={24} color="#4f46e5" />
          <Text className="ml-2 text-gray-700">{callTarget}</Text>
        </View>
      </View>
      
      {/* Connection Status */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold mb-2">Trạng thái kết nối</Text>
        <View className="flex-row items-center">
          <View className={`w-3 h-3 rounded-full mr-2 ${
            connectionState === 'connected' ? 'bg-green-500' : 
            connectionState === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <Text className="capitalize">
            {connectionState === 'connected' ? 'Đã kết nối' : 
             connectionState === 'connecting' ? 'Đang kết nối' : 'Ngắt kết nối'}
          </Text>
        </View>
      </View>

      {/* Video Containers */}
      {(localStream || remoteStream) && (
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold mb-2">Video Streams</Text>
          
          <View className="flex-row space-x-4">
            {/* Local Video */}
            <View className="flex-1">
              <Text className="text-sm text-gray-600 mb-2">Local (You)</Text>
              <View style={{ height: 150 }} className="bg-black rounded-lg items-center justify-center">
                <Ionicons name="videocam" size={32} color="white" />
                <Text className="text-white text-xs mt-1">Local Video</Text>
              </View>
            </View>
            
            {/* Remote Video */}
            <View className="flex-1">
              <Text className="text-sm text-gray-600 mb-2">Remote</Text>
              <View style={{ height: 150 }} className="bg-black rounded-lg items-center justify-center">
                <Ionicons name="videocam" size={32} color="white" />
                <Text className="text-white text-xs mt-1">Remote Video</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Control Buttons */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold mb-4">Điều khiển</Text>
        
        {connectionState === 'disconnected' ? (
          <View className="space-y-3">
            <TouchableOpacity
              onPress={startCall}
              className="bg-blue-500 py-4 rounded-lg items-center"
            >
              <Text className="text-white font-semibold text-lg">📞 Bắt đầu cuộc gọi (Caller)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={answerCall}
              className="bg-green-500 py-4 rounded-lg items-center"
            >
              <Text className="text-white font-semibold text-lg">📱 Trả lời cuộc gọi (Receiver)</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-3">
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={toggleMute}
                className={`flex-1 py-3 rounded-lg items-center ${
                  isMuted ? 'bg-red-500' : 'bg-gray-500'
                }`}
              >
                <Text className="text-white font-semibold">
                  {isMuted ? '� Bật tiếng' : '🔊 Tắt tiếng'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={endCall}
                className="flex-1 bg-red-500 py-3 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">📞 Kết thúc</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Reset button - always available */}
        <TouchableOpacity
          onPress={resetConnection}
          className="bg-orange-500 py-2 rounded-lg items-center mt-3"
        >
          <Text className="text-white font-semibold">🔄 Reset Connection</Text>
        </TouchableOpacity>
      </View>

      {/* Signaling Data Exchange */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold mb-2">🔄 Trao đổi tín hiệu WebRTC (Manual)</Text>
        
        {/* Display current signal data */}
        {signalData && (
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <Text className="text-sm text-gray-600">
                📤 Dữ liệu để gửi 
              </Text>
              <View className="ml-2 px-2 py-1 bg-blue-100 rounded">
                <Text className="text-xs font-semibold text-blue-700">
                  {(() => {
                    try {
                      const parsed = JSON.parse(signalData);
                      return parsed.type?.toUpperCase() || 'UNKNOWN';
                    } catch {
                      return 'JSON';
                    }
                  })()}
                </Text>
              </View>
            </View>
            
            <View className="border border-blue-300 rounded-lg p-3 mb-3 bg-blue-50 max-h-32">
              <ScrollView>
                <Text className="text-xs font-mono" selectable>
                  {signalData}
                </Text>
              </ScrollView>
            </View>
            
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={copyToClipboard}
                className="flex-1 bg-blue-500 py-2 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">📋 Sao chép dữ liệu</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setSignalData('')}
                className="px-4 bg-gray-500 py-2 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">🗑️</Text>
              </TouchableOpacity>
            </View>
            
            <Text className="text-xs text-gray-500 mb-4 italic">
              💡 Gửi JSON này qua WhatsApp/Telegram/SMS cho người kia
            </Text>
          </View>
        )}
        
        {/* Input for received signal */}
        <Text className="text-sm text-gray-600 mb-2">
          📥 Dán JSON signal data nhận được từ người kia:
        </Text>
        <TextInput
          value={receivedSignal}
          onChangeText={setReceivedSignal}
          placeholder="Dán JSON signal data (bắt đầu bằng { và chứa type, data)..."
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-lg p-3 mb-2 bg-white text-xs"
        />
        
        <Text className="text-xs text-gray-500 mb-3 italic">
          💡 Dữ liệu hợp lệ: {'{'}\"type\":\"offer\",\"data\":{'{'}...{'}'}{'}'}
        </Text>
        
        <TouchableOpacity
          onPress={processSignal}
          className="bg-green-500 py-2 rounded-lg items-center"
          disabled={!receivedSignal.trim()}
        >
          <Text className="text-white font-semibold">⚡ Xử lý tín hiệu</Text>
        </TouchableOpacity>
      </View>

      {/* Debug Logs */}
      <View className="bg-white rounded-lg p-4 shadow-sm">
        <Text className="text-lg font-semibold mb-2">Nhật ký Debug</Text>
        <View className="border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-40">
          <ScrollView>
            {logs.map((log, index) => (
              <Text key={index} className="text-xs text-gray-700 mb-1">
                {log}
              </Text>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}