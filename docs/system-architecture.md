# PBL6 Mobile - System Architecture Flow

## Overall System Flow

```mermaid
graph TB
    %% User Interface Layer
    A[📱 Mobile App - HomeScreen] --> B[🗺️ MapComponent]
    A --> C[📊 Device Status Cards]
    A --> D[📞 Call Button]
    
    %% MQTT Communication Layer
    E[🔗 MQTT Broker] --> F[📡 useMQTT Hook]
    F --> G[Device Info Topic]
    F --> H[WebRTC Signaling Topic]
    F --> I[Alerts Topic]
    
    %% WebRTC Communication Layer
    J[🎤 useWebRTC Hook] --> K[📞 Peer Connection]
    K --> L[🎵 Local Stream]
    K --> M[🎵 Remote Stream]
    
    %% IoT Device Layer
    N[🔧 IoT Device] --> E
    N --> O[📍 GPS Location]
    N --> P[🔋 Battery Status]
    N --> Q[🚨 SOS Button]
    
    %% UI Components
    R[📱 CallModal] --> S[🔇 Mute Toggle]
    R --> T[📹 Video Toggle]
    R --> U[📞 End Call]
    
    %% Data Flow Connections
    F --> A
    A --> J
    J --> R
    E --> N
    
    %% Styling
    classDef mobile fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef mqtt fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef webrtc fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef iot fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef ui fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    
    class A,B,C,D mobile
    class E,F,G,H,I mqtt
    class J,K,L,M webrtc
    class N,O,P,Q iot
    class R,S,T,U ui
```

## MQTT Communication Flow

```mermaid
sequenceDiagram
    participant IoT as 🔧 IoT Device
    participant MQTT as 🔗 MQTT Broker
    participant App as 📱 Mobile App
    participant Hook as 📡 useMQTT Hook
    
    Note over IoT,Hook: Device Registration & Status Updates
    IoT->>MQTT: Publish to devices/{deviceId}/info
    MQTT->>Hook: Subscribe & receive device info
    Hook->>App: Update device status in UI
    
    Note over IoT,Hook: SOS Alert Flow
    IoT->>MQTT: Publish SOS to devices/{deviceId}/alerts
    MQTT->>Hook: Receive SOS alert
    Hook->>App: Show alert notification
    App->>App: Auto-trigger call attempt
    
    Note over IoT,Hook: Battery & Location Updates
    loop Every 30 seconds
        IoT->>MQTT: Publish battery/location update
        MQTT->>Hook: Receive update
        Hook->>App: Update UI components
    end
```

## WebRTC Call Establishment Flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant App as 📱 Mobile App
    participant WebRTC as 🎤 useWebRTC Hook
    participant MQTT as 🔗 MQTT Broker
    participant IoT as 🔧 IoT Device
    
    Note over User,IoT: Call Initiation
    User->>App: Press "Gọi" button
    App->>WebRTC: Call startCall(deviceId)
    WebRTC->>WebRTC: Create peer connection
    WebRTC->>WebRTC: Get local media stream
    
    Note over User,IoT: Offer/Answer Exchange
    WebRTC->>MQTT: Publish offer to devices/{deviceId}/webrtc/offer
    MQTT->>IoT: Forward offer
    IoT->>MQTT: Publish answer to devices/{deviceId}/webrtc/answer
    MQTT->>WebRTC: Receive answer
    WebRTC->>WebRTC: Set remote description
    
    Note over User,IoT: ICE Candidate Exchange
    loop ICE Negotiation
        WebRTC->>MQTT: Publish ICE candidate
        MQTT->>IoT: Forward ICE candidate
        IoT->>MQTT: Publish ICE candidate
        MQTT->>WebRTC: Receive ICE candidate
    end
    
    Note over User,IoT: Call Established
    WebRTC->>App: Update call state to "connected"
    App->>App: Show CallModal
    Note over User,IoT: 🎉 P2P Audio/Video Call Active
```

## Component Architecture Flow

```mermaid
graph LR
    %% App Layer
    A[📱 App/_layout.tsx] --> B[📱 (tabs)/_layout.tsx]
    B --> C[🏠 HomeScreen.tsx]
    
    %% Hooks Layer
    C --> D[📡 useMQTT Hook]
    C --> E[🎤 useWebRTC Hook]
    
    %% Components Layer
    C --> F[🗺️ MapComponent]
    C --> G[📱 CallModal]
    
    %% Platform Specific
    F --> H[🗺️ MapComponent.tsx - Web]
    F --> I[🗺️ MapComponent.native.tsx - Mobile]
    
    %% External Services
    D --> J[🔗 MQTT Broker]
    E --> K[🌐 WebRTC Signaling]
    
    %% Data Flow
    J --> L[📊 Device Data]
    K --> M[🎵 Media Streams]
    
    L --> C
    M --> G
    
    %% Styling
    classDef app fill:#e3f2fd,stroke:#0277bd,stroke-width:2px
    classDef hooks fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    classDef components fill:#fef7ff,stroke:#4a148c,stroke-width:2px
    classDef external fill:#fff8e1,stroke:#f57c00,stroke-width:2px
    
    class A,B,C app
    class D,E hooks
    class F,G,H,I components
    class J,K,L,M external
```

## State Management Flow

```mermaid
stateDiagram-v2
    [*] --> Disconnected: App starts
    
    state MQTT_States {
        Disconnected --> Connecting: Initialize MQTT
        Connecting --> Connected: Broker connection success
        Connected --> Reconnecting: Connection lost
        Reconnecting --> Connected: Reconnection success
        Reconnecting --> Disconnected: Max retries exceeded
    }
    
    state WebRTC_States {
        [*] --> Idle: No call
        Idle --> Calling: User presses call button
        Calling --> Connecting: Signaling started
        Connecting --> Connected: P2P established
        Connected --> Ended: Call terminated
        Ended --> Idle: Cleanup complete
        
        Calling --> Failed: Signaling timeout
        Connecting --> Failed: ICE negotiation failed
        Failed --> Idle: Reset state
    }
    
    state UI_States {
        [*] --> HomeScreen: App loaded
        HomeScreen --> CallModal: Call started
        CallModal --> HomeScreen: Call ended
        
        HomeScreen --> AlertDialog: SOS received
        AlertDialog --> HomeScreen: Alert dismissed
        AlertDialog --> CallModal: Auto-call triggered
    }
```

## Data Structure Flow

```mermaid
erDiagram
    DEVICE_INFO {
        string deviceId
        string name
        number latitude
        number longitude
        number battery
        string status
        datetime lastSeen
    }
    
    MQTT_MESSAGE {
        string topic
        object payload
        datetime timestamp
        string messageId
    }
    
    WEBRTC_STATE {
        string callState
        object localStream
        object remoteStream
        object peerConnection
        array iceServers
    }
    
    CALL_SESSION {
        string sessionId
        string deviceId
        datetime startTime
        datetime endTime
        string callType
        string status
    }
    
    SOS_ALERT {
        string alertId
        string deviceId
        datetime timestamp
        string severity
        object location
        boolean acknowledged
    }
    
    DEVICE_INFO ||--o{ MQTT_MESSAGE : publishes
    DEVICE_INFO ||--o{ SOS_ALERT : triggers
    DEVICE_INFO ||--o{ CALL_SESSION : participates
    WEBRTC_STATE ||--o{ CALL_SESSION : manages
```

## Error Handling Flow

```mermaid
graph TD
    A[🚨 Error Occurred] --> B{Error Type?}
    
    B -->|MQTT Connection| C[🔗 MQTT Error Handler]
    B -->|WebRTC Signaling| D[🎤 WebRTC Error Handler]
    B -->|Network| E[🌐 Network Error Handler]
    B -->|Permission| F[🔐 Permission Error Handler]
    
    C --> G[Retry Connection]
    C --> H[Show Offline Mode]
    
    D --> I[Reset Peer Connection]
    D --> J[Show Call Failed]
    
    E --> K[Check Network Status]
    E --> L[Queue Actions for Retry]
    
    F --> M[Request Permissions]
    F --> N[Show Permission Denied]
    
    G --> O[📱 Update UI State]
    H --> O
    I --> O
    J --> O
    K --> O
    L --> O
    M --> O
    N --> O
```
