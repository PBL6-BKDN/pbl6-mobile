# WebRTC Demo Flowchart - Phiên bản đơn giản (Manual Only)

## Luồng hoạt động chính của WebRTC Demo đơn giản

```mermaid
flowchart TD
    A[Khởi động ứng dụng] --> B[Hiển thị WebRTC Demo UI]
    B --> C[Chỉ sử dụng Manual Mode - Copy/Paste]
    
    C --> D{Người dùng chọn vai trò}
    
    D -->|Caller| E[Nhấn Bắt đầu cuộc gọi]
    D -->|Receiver| F[Nhấn Trả lời cuộc gọi]
    
    E --> G[Yêu cầu quyền camera/micro]
    F --> G
    
    G --> H{Cấp quyền?}
    H -->|Không| I[Hiển thị lỗi]
    H -->|Có| J[Khởi tạo MediaStream]
    
    J --> K[Tạo RTCPeerConnection]
    K --> L[Thêm local stream vào connection]
    
    L --> M{Là Caller?}
    
    M -->|Có| N[Tạo Offer]
    M -->|Không| O[Chờ nhận Offer]
    
    N --> P[Hiển thị Offer JSON để sao chép]
    P --> Q[Người dùng sao chép và gửi thủ công qua WhatsApp/Telegram]
    
    O --> R[Chờ người dùng dán Offer JSON]
    R --> S[Nhấn Xử lý tín hiệu]
    S --> T[Validate JSON input]
    
    T --> U{JSON hợp lệ?}
    U -->|Không| V[Hiển thị lỗi validation]
    U -->|Có| W[Xử lý Offer]
    
    W --> X[Tạo Answer]
    X --> Y[Hiển thị Answer JSON để sao chép]
    Y --> Z[Người dùng sao chép Answer và gửi thủ công]
    
    Q --> AA[Caller nhận và dán Answer JSON]
    Z --> AA
    AA --> BB[Nhấn Xử lý tín hiệu cho Answer]
    BB --> CC[Validate Answer JSON]
    
    CC --> DD{Answer hợp lệ?}
    DD -->|Không| EE[Hiển thị lỗi]
    DD -->|Có| FF[Xử lý Answer]
    
    FF --> GG[Thiết lập kết nối P2P]
    GG --> HH[Tạo ICE candidates]
    HH --> II[Hiển thị ICE candidate để sao chép]
    II --> JJ[Trao đổi ICE candidates thủ công]
    
    JJ --> KK{Kết nối thành công?}
    
    KK -->|Có| LL[Hiển thị video streams]
    KK -->|Không| MM[Hiển thị lỗi kết nối]
    
    LL --> NN[Cuộc gọi đang hoạt động]
    NN --> OO{Người dùng thao tác}
    
    OO -->|Tắt/bật tiếng| PP[Toggle mute/unmute]
    OO -->|Kết thúc cuộc gọi| QQ[Đóng kết nối]
    
    PP --> NN
    QQ --> RR[Dọn dẹp resources]
    RR --> SS[Quay về trạng thái ban đầu]
    SS --> B
    
    I --> B
    MM --> B
    V --> R
    EE --> AA
```

## Luồng xử lý tín hiệu WebRTC đơn giản (Manual Only)

```mermaid
flowchart TD
    A[Nhận signal data từ input] --> B[Kiểm tra input rỗng]
    B -->|Rỗng| C[Hiển thị lỗi: Vui lòng dán dữ liệu]
    B -->|Có dữ liệu| D[Kiểm tra định dạng]
    
    D --> E{Là button text?}
    E -->|Có| F[Lỗi: Đã dán text nút thay vì JSON]
    E -->|Không| G{Bắt đầu bằng curly brace?}
    
    G -->|Không| H[Lỗi: Không phải JSON format]
    G -->|Có| I[Parse JSON]
    
    I --> J{Parse thành công?}
    J -->|Không| K[Lỗi: JSON không hợp lệ]
    J -->|Có| L[Validate cấu trúc signal]
    
    L --> M{Có type và data?}
    M -->|Không| N[Lỗi: Thiếu trường bắt buộc]
    M -->|Có| O{Kiểm tra signal type}
    
    O -->|offer| P[Xử lý Offer]
    O -->|answer| Q[Xử lý Answer] 
    O -->|ice-candidate| R[Xử lý ICE Candidate]
    O -->|Khác| S[Lỗi: Signal type không hỗ trợ]
    
    P --> T[setRemoteDescription với offer]
    T --> U[createAnswer]
    U --> V[setLocalDescription với answer]
    V --> W[Hiển thị answer JSON để sao chép]
    
    Q --> X[setRemoteDescription với answer]
    X --> Y[Kết nối P2P thiết lập]
    
    R --> Z[addIceCandidate]
    Z --> AA[Cải thiện kết nối]
    
    W --> BB[Người dùng sao chép answer và gửi thủ công]
    Y --> CC[Cuộc gọi hoàn tất]
    AA --> CC
    
    C --> DD[Kết thúc xử lý]
    F --> DD
    H --> DD
    K --> DD
    N --> DD
    S --> DD
    BB --> DD
    CC --> DD
```

## Quy trình Manual Signaling đơn giản

```mermaid
flowchart TD
    A[Device A - Caller] --> B[Nhấn Bắt đầu cuộc gọi]
    B --> C[Tạo Offer JSON]
    C --> D[Sao chép Offer]
    D --> E[Gửi qua WhatsApp/Telegram/SMS]
    
    F[Device B - Receiver] --> G[Nhấn Trả lời cuộc gọi]
    G --> H[Chờ nhận Offer]
    
    E --> I[Device B nhận tin nhắn]
    I --> J[Dán Offer vào input]
    J --> K[Nhấn Xử lý tín hiệu]
    K --> L[Tạo Answer JSON]
    L --> M[Sao chép Answer]
    M --> N[Gửi Answer về Device A]
    
    N --> O[Device A nhận Answer]
    O --> P[Dán Answer vào input]
    P --> Q[Nhấn Xử lý tín hiệu]
    Q --> R[Kết nối P2P được thiết lập]
    
    R --> S[Tạo ICE candidates]
    S --> T[Cả hai device trao đổi ICE candidates]
    T --> U[Sao chép và dán ICE candidates]
    U --> V[Kết nối hoàn tất]
    V --> W[Cuộc gọi video thành công]
```

## Cấu trúc dữ liệu SignalingData

```mermaid
flowchart TD
    A[SignalingData Interface] --> B[type: string]
    A --> C[data: any]
    A --> D[timestamp: number]
    
    B --> E{Các loại type}
    E --> F[offer]
    E --> G[answer] 
    E --> H[ice-candidate]
    
    F --> I[data chứa RTCSessionDescription]
    G --> J[data chứa RTCSessionDescription]
    H --> K[data chứa RTCIceCandidate]
    
    I --> L[Được tạo bởi createOffer]
    J --> M[Được tạo bởi createAnswer]
    K --> N[Được tạo bởi onicecandidate event]
    
    L --> O[Gửi từ Caller đến Receiver]
    M --> P[Gửi từ Receiver về Caller]
    N --> Q[Trao đổi qua lại giữa cả hai]
```