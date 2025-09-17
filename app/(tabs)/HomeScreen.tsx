import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const handleCallPress = () => {
    try {
      router.push('/webrtc-demo');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở màn hình gọi');
    }
  };

  const alerts = [
    { time: '19:00', type: 'SOS kích hoạt' },
    { time: '18:50', type: 'Pin yếu (15%)' },
    { time: '18:45', type: 'Vào cần phá trước' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header with User Info */}
      <View className="bg-white px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff&size=128' }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View>
              <Text className="text-sm text-gray-500">Hi, Welcome Back</Text>
              <Text className="text-lg font-semibold text-gray-900">John Doe</Text>
            </View>
          </View>
          <View className="flex-row space-x-3">
            <TouchableOpacity className="p-2">
              <Ionicons name="notifications-outline" size={24} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2">
              <Ionicons name="settings-outline" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Device Info Card */}
      <View className="mx-4 mt-4">
        <View className="bg-indigo-100 rounded-2xl p-4">
          <Text className="text-indigo-900 font-semibold text-center mb-3">Thiết Bị Của Tôi</Text>
          
          <View className="bg-white rounded-xl p-4 flex-row items-center">
            <View className="bg-gray-100 rounded-lg p-3 mr-4">
              <Ionicons name="hardware-chip" size={32} color="#4f46e5" />
            </View>
            
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <Ionicons name="battery-half" size={16} color="#22c55e" />
                  <Text className="text-sm text-gray-700 ml-1">Pin: 60%</Text>
                </View>
              </View>
              
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-green-500 rounded-full mr-2"></View>
                  <Text className="text-sm text-gray-700">Kết nối: online/offline</Text>
                </View>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="location" size={16} color="#22c55e" />
                <Text className="text-sm text-gray-700 ml-1">GPS: OK</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Map Section - Empty */}
      <View className="mx-4 mt-4">
        <View className="bg-white rounded-2xl overflow-hidden" style={{ height: 200 }}>
          <View className="flex-1 bg-gray-100 items-center justify-center">
            <Ionicons name="map-outline" size={48} color="#9ca3af" />
            <Text className="text-gray-500 mt-2">Bản đồ</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="mx-4 mt-4">
        <View className="bg-indigo-100 rounded-2xl p-4">
          <View className="flex-row items-center space-x-4">
            {/* User Avatar */}
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=Contact&background=22c55e&color=fff&size=128' }}
              className="w-12 h-12 rounded-full"
            />
            
            {/* Call Button */}
            <TouchableOpacity 
              onPress={handleCallPress}
              className="bg-white rounded-xl px-6 py-3 flex-row items-center justify-center flex-1 mr-3"
            >
              <Ionicons name="call" size={20} color="#22c55e" />
              <Text className="text-gray-900 font-semibold ml-2">Gọi</Text>
            </TouchableOpacity>

            {/* Warning Button */}
            <TouchableOpacity className="bg-white rounded-xl px-6 py-3 flex-row items-center justify-center flex-1">
              <Ionicons name="warning" size={20} color="#f59e0b" />
              <Text className="text-gray-900 font-semibold ml-2">Cảnh báo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Alerts Preview */}
      <View className="mx-4 mt-4 mb-6">
        <View className="bg-white rounded-2xl p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Alerts Preview</Text>
          
          {alerts.map((alert, index) => (
            <View key={index} className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
              <Text className="text-sm text-gray-600 w-12">{alert.time}</Text>
              <Text className="text-sm text-gray-900 flex-1 ml-4">{alert.type}</Text>
            </View>
          ))}
          
          <TouchableOpacity className="mt-3">
            <Text className="text-sm text-blue-600">[Xem tất cả →]</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Spacer for Navigation */}
      <View className="h-24"></View>
    </ScrollView>
  );
}
