import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebRTCState } from '../hooks/useWebRTC';

interface CallModalProps {
  visible: boolean;
  onClose: () => void;
  deviceId: string;
  webrtcState: WebRTCState;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

export default function CallModal({
  visible,
  onClose,
  deviceId,
  webrtcState,
  onEndCall,
  onToggleMute,
  onToggleVideo
}: CallModalProps) {
  const { isConnected, isConnecting, isMuted, isVideoEnabled } = webrtcState;

  const getCallStatus = () => {
    if (isConnecting) return "Đang kết nối...";
    if (isConnected) return "Đã kết nối";
    return "Chưa kết nối";
  };

  const getStatusColor = () => {
    if (isConnecting) return "#f59e0b";
    if (isConnected) return "#10b981";
    return "#ef4444";
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-900">
        {/* Header */}
        <View className="pt-12 pb-6 px-6">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="chevron-down" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold">Cuộc gọi WebRTC</Text>
            <View className="w-8" />
          </View>
        </View>

        {/* Device Info */}
        <View className="flex-1 items-center justify-center px-6">
          <View className="items-center mb-8">
            {/* Device Avatar */}
            <View className="w-32 h-32 bg-indigo-600 rounded-full items-center justify-center mb-4">
              <Ionicons name="hardware-chip" size={64} color="white" />
            </View>
            
            {/* Device ID */}
            <Text className="text-white text-2xl font-bold mb-2">
              Thiết bị {deviceId}
            </Text>
            
            {/* Call Status */}
            <View className="flex-row items-center">
              <View 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getStatusColor() }}
              />
              <Text className="text-gray-300 text-lg">
                {getCallStatus()}
              </Text>
            </View>
          </View>

          {/* Video Placeholder */}
          {isConnected && (
            <View className="w-full h-48 bg-black rounded-lg mb-6 items-center justify-center">
              <Text className="text-gray-400">📹 Video từ thiết bị</Text>
            </View>
          )}
        </View>

        {/* Call Controls */}
        <View className="pb-8 px-6">
          <View className="flex-row items-center justify-center space-x-6">
            {/* Mute Button */}
            <TouchableOpacity
              onPress={onToggleMute}
              className={`w-16 h-16 rounded-full items-center justify-center ${
                isMuted ? 'bg-red-600' : 'bg-gray-700'
              }`}
            >
              <Ionicons 
                name={isMuted ? "mic-off" : "mic"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>

            {/* End Call Button */}
            <TouchableOpacity
              onPress={onEndCall}
              className="w-20 h-20 bg-red-600 rounded-full items-center justify-center"
            >
              <Ionicons name="call" size={32} color="white" />
            </TouchableOpacity>

            {/* Video Toggle Button */}
            <TouchableOpacity
              onPress={onToggleVideo}
              className={`w-16 h-16 rounded-full items-center justify-center ${
                !isVideoEnabled ? 'bg-red-600' : 'bg-gray-700'
              }`}
            >
              <Ionicons 
                name={!isVideoEnabled ? "videocam-off" : "videocam"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>

          {/* Connection Info */}
          {isConnected && (
            <View className="mt-6 p-4 bg-gray-800 rounded-lg">
              <Text className="text-gray-300 text-sm text-center">
                🔐 Kết nối P2P bảo mật qua WebRTC
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}