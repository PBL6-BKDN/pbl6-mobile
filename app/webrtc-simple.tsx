import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WebRTCDemoSimple() {
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [logs, setLogs] = useState<string[]>([]);
  const [roomId] = useState('room-' + Math.random().toString(36).substr(2, 9));
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const connectToSignaling = () => {
    try {
      const ws = new WebSocket('ws://10.255.0.8:3002'); 
      
      ws.onopen = () => {
        addLog('🔗 Connected to signaling server');
        setWsConnection(ws);
        
        ws.send(JSON.stringify({
          type: 'join-room',
          room: roomId
        }));
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        addLog(`📨 Received: ${data.type}`);
        
        if (data.type === 'user-joined') {
          addLog(`👥 ${data.count} users in room`);
          if (data.count >= 2) {
            simulateConnection();
          }
        }
      };
      
      ws.onclose = () => {
        addLog('❌ Disconnected from signaling server');
        setWsConnection(null);
      };
      
      ws.onerror = () => {
        addLog('🚫 WebSocket error - check if signaling server is running');
        setWsConnection(null);
      };
      
    } catch (error) {
      addLog('🚫 Cannot connect to signaling server');
    }
  };

  const simulateConnection = () => {
    setConnectionState('connecting');
    addLog('📞 Starting call...');
    
    setTimeout(() => {
      setConnectionState('connected');
      addLog('✅ Connected successfully!');
      addLog('🎤 Audio: Active');
      addLog('📹 Video: Active (simulated)');
      addLog('📡 Quality: Good (85%)');
    }, 2000);
  };

  const startCall = () => {
    if (!wsConnection) {
      connectToSignaling();
      addLog('📞 Attempting to connect to signaling server...');
    } else {
      simulateConnection();
    }
  };

  const endCall = () => {
    setConnectionState('disconnected');
    setLogs([]);
    addLog('📞 Call ended');
    
    if (wsConnection) {
      wsConnection.close();
      setWsConnection(null);
    }
  };

  const copyRoomId = () => {
    // For demo purposes
    Alert.alert('Room ID', `Room ID: ${roomId}\n\nShare this with the other person to connect to the same room.`);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-center mb-6 text-blue-600">
        🎥 WebRTC Demo (Simplified)
      </Text>
      
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

      {/* Room Info */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold mb-2">🏠 Room Information</Text>
        <View className="bg-gray-50 rounded-lg p-3 mb-3">
          <Text className="text-sm text-gray-600 mb-1">Room ID:</Text>
          <Text className="font-mono text-sm font-semibold" selectable>{roomId}</Text>
          <Text className="text-xs text-gray-500 mt-1">
            {wsConnection ? 'WebSocket connected' : 'WebSocket disconnected'}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={copyRoomId}
          className="bg-blue-500 py-2 rounded-lg items-center"
        >
          <Text className="text-white font-semibold">📋 Share Room ID</Text>
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold mb-4">Controls</Text>
        
        {connectionState === 'disconnected' ? (
          <TouchableOpacity
            onPress={startCall}
            className="bg-green-500 py-4 rounded-lg items-center"
          >
            <Text className="text-white font-semibold text-lg">📞 Start Call</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={endCall}
            className="bg-red-500 py-4 rounded-lg items-center"
          >
            <Text className="text-white font-semibold text-lg">📞 End Call</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Instructions */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <Text className="text-lg font-semibold mb-2">📖 Instructions</Text>
        <Text className="text-sm text-gray-700 mb-2">
          1. Start the signaling server: yarn signaling
        </Text>
        <Text className="text-sm text-gray-700 mb-2">
          2. Share Room ID with another person
        </Text>
        <Text className="text-sm text-gray-700 mb-2">
          3. Both people click "Start Call"
        </Text>
        <Text className="text-sm text-gray-700">
          4. When 2+ users join the room, call will auto-connect
        </Text>
      </View>

      {/* Debug Logs */}
      <View className="bg-white rounded-lg p-4 shadow-sm">
        <Text className="text-lg font-semibold mb-2">Debug Logs</Text>
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