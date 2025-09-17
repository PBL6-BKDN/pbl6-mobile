import React from "react";
import { View, Text } from "react-native";

interface MapComponentProps {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
}

export default function MapComponent({ latitude, longitude, title, description }: MapComponentProps) {
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#e5f3ff',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Mock Map Background */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f0f9ff',
      }}>
        {/* Grid lines to simulate map */}
        <View style={{
          position: 'absolute',
          top: '20%',
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: '#cbd5e1',
          opacity: 0.3
        }} />
        <View style={{
          position: 'absolute',
          top: '40%',
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: '#cbd5e1',
          opacity: 0.3
        }} />
        <View style={{
          position: 'absolute',
          top: '60%',
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: '#cbd5e1',
          opacity: 0.3
        }} />
        <View style={{
          position: 'absolute',
          top: '80%',
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: '#cbd5e1',
          opacity: 0.3
        }} />
        
        {/* Vertical lines */}
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '25%',
          width: 1,
          backgroundColor: '#cbd5e1',
          opacity: 0.3
        }} />
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: 1,
          backgroundColor: '#cbd5e1',
          opacity: 0.3
        }} />
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '75%',
          width: 1,
          backgroundColor: '#cbd5e1',
          opacity: 0.3
        }} />
      </View>

      {/* Location Pin */}
      <View style={{
        backgroundColor: '#ef4444',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>📍</Text>
      </View>

      {/* Location Info */}
      <View style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
      }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1f2937' }}>{title}</Text>
        <Text style={{ fontSize: 10, color: '#6b7280' }}>{description}</Text>
        <Text style={{ fontSize: 10, color: '#9ca3af' }}>
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </Text>
      </View>

      {/* Web Notice */}
      <View style={{
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#fef3c7',
        padding: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#f59e0b',
      }}>
        <Text style={{ fontSize: 10, color: '#92400e' }}>
          🌐 Web Preview
        </Text>
      </View>
    </View>
  );
}