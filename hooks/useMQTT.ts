import { useEffect, useRef, useState } from 'react';

// MQTT Client interface
interface MQTTClient {
  connect: (url: string, options?: any) => void;
  publish: (topic: string, message: string) => void;
  subscribe: (topic: string, callback: (message: any) => void) => void;
  disconnect: () => void;
}

// Mock MQTT client for development
class MockMQTTClient implements MQTTClient {
  private subscribers: Map<string, (message: any) => void> = new Map();

  connect(url: string, options?: any) {
    console.log('MQTT Mock: Connected to', url);
  }

  publish(topic: string, message: string) {
    console.log('MQTT Mock: Publishing to', topic, message);
    // Simulate echo for testing
    setTimeout(() => {
      const callback = this.subscribers.get(topic);
      if (callback) {
        callback({ topic, payload: message });
      }
    }, 100);
  }

  subscribe(topic: string, callback: (message: any) => void) {
    console.log('MQTT Mock: Subscribing to', topic);
    this.subscribers.set(topic, callback);
  }

  disconnect() {
    console.log('MQTT Mock: Disconnected');
    this.subscribers.clear();
  }
}

export const useMQTT = (deviceId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<MQTTClient | null>(null);

  useEffect(() => {
    // Initialize MQTT client (using mock for now)
    clientRef.current = new MockMQTTClient();
    
    // Connect to MQTT broker
    clientRef.current.connect('wss://your-mqtt-broker.com:9001');
    setIsConnected(true);

    // Subscribe to device topics
    if (deviceId) {
      clientRef.current.subscribe(`device/${deviceId}/info`, handleDeviceInfo);
      clientRef.current.subscribe(`device/${deviceId}/webrtc/offer`, handleWebRTCOffer);
      clientRef.current.subscribe(`device/${deviceId}/webrtc/candidate`, handleWebRTCCandidate);
      clientRef.current.subscribe(`device/${deviceId}/alert`, handleAlert);
    }

    return () => {
      clientRef.current?.disconnect();
    };
  }, [deviceId]);

  const handleDeviceInfo = (message: any) => {
    console.log('Device info received:', message);
    // Update device status in state
  };

  const handleWebRTCOffer = (message: any) => {
    console.log('WebRTC offer received:', message);
    // Handle incoming call from device
  };

  const handleWebRTCCandidate = (message: any) => {
    console.log('WebRTC candidate received:', message);
    // Handle ICE candidate
  };

  const handleAlert = (message: any) => {
    console.log('Alert received:', message);
    // Show notification or alert
  };

  const publishMessage = (topic: string, message: any) => {
    if (clientRef.current) {
      clientRef.current.publish(topic, JSON.stringify(message));
    }
  };

  return {
    isConnected,
    publishMessage
  };
};