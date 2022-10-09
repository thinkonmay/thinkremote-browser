# Webrtc-proxy
### Peer to peer battery included WebRTC client for browser build on nextjs

# Dependencies 
  - Framework
    - [NextJS](https://nextjs.org/) - Server side rendering web framework
  - API
    - [RTCPeerConnection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection) - WebRTC API
  - UI
    - [Sweetalert](https://sweetalert2.github.io/) - For application status display
    - [MUImaterial](https://mui.com/) - For Draggable speed dial

# Repository structure

```
|-- webrtc                              | WebRTC web engine implmentation
    |-- datachannel                     | WebRTC data channel module
    |-- gui                             | GUI (audio and video element) manipulation
    |-- models                          | Data model
    |-- signaling                       | websocket signaling adapter
    |-- utils                           | Other utilities module
    | webrtc.ts                         | WebRTC class wrap around RTCPeerConnection
    | app.ts                            | Application object wrap around all modules
```