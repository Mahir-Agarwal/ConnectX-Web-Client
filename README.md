<!-- markdownlint-disable MD033 MD041 -->
<div align="center">
  
  <h1>⚡ ConnectX Web Client</h1>
  
  <p>
    <strong>A modern, real-time cross-platform web application powering peer-to-peer WebRTC file transfers.</strong>
  </p>

  <p>
    <a href="#-overview">Overview</a> •
    <a href="#-demo">Demo</a> •
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/WebRTC-Enabled-333333?style=for-the-badge&logo=webrtc" alt="WebRTC"/>
    <img src="https://img.shields.io/badge/WebSocket-Realtime-000000?style=for-the-badge&logo=socket.io" alt="WebSocket"/>
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="License"/>
  </p>
</div>

---

## 📖 Overview

**ConnectX** is a beautifully crafted web application designed to instantly send and receive files across platforms using **WebRTC-based peer-to-peer (P2P) file transfer**. 

No cloud storage, no intermediaries, and no waiting. Simply create a session, scan the **QR code from your Android device**, and establish a secure, direct connection for blistering-fast data transfer. Built using React and Vite, ConnectX acts as the fast and intuitive frontend to our high-performance Spring Boot signaling backend.

---

## 🎥 Demo

Experience the seamless connection process and lightning-fast transfer across platforms:

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Web View</b></td>
      <td align="center"><b>Mobile View</b></td>
    </tr>
    <tr>
      <td><img src="Demo (GIF)/WebApp_Demo.gif" alt="ConnectX Web Demo" width="600" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" /></td>
      <td><img src="Demo (GIF)/MobileApp_Demo.gif" alt="ConnectX Mobile Demo" width="280" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" /></td>
    </tr>
  </table>
  <br/>
  <p><i>Sharing files instantly and wirelessly via WebRTC data channel from both perspectives.</i></p>
</div>

---

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>🔒 Direct & Secure</h3>
      <ul>
        <li><strong>Peer-to-Peer Transfer</strong>: End-to-end encrypted transfer using WebRTC Data Channels.</li>
        <li><strong>Zero Cloud Storage</strong>: Files move directly between Web and Mobile, ensuring total privacy.</li>
        <li><strong>QR Code Connection</strong>: Secure authorization by scanning on the mobile app.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>⚡ Lightning Fast</h3>
      <ul>
        <li><strong>Local Network Speed</strong>: Bypasses the internet entirely if both devices share the same WiFi.</li>
        <li><strong>Real-Time Signaling</strong>: Instantly negotiated sessions using WebSocket and STUN/TURN relays.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🎨 Modern Web UI</h3>
      <ul>
        <li><strong>React & Framer Motion</strong>: Fluid animations and responsive, state-driven interface.</li>
        <li><strong>Premium Design</strong>: Beautiful aesthetic that feels modern and intuitive.</li>
        <li><strong>Cross-Platform</strong>: Runs flawlessly in any modern web browser.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🏗️ Robust Architecture</h3>
      <ul>
        <li><strong>Efficient Chunking</strong>: Handles large files without crashing the browser memory.</li>
        <li><strong>Error Resiliency</strong>: Keep-alive pings and automatic reconnections for stable transfers.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 | Declarative component-based UI. |
| **Build Tool** | Vite | Next-generation fast bundler. |
| **P2P Engine** | WebRTC | Google's WebRTC library for raw P2P data channels. |
| **Styling** | Tailwind CSS | Utility-first styling for rapid UI development. |
| **Networking** | WebSockets | Persistent duplex connection to the Signaling Server. |
| **Animations** | Framer Motion | Production-ready motion library for React. |

---

## 🧠 Application Flow

The ConnectX Web app communicates seamlessly with the Android Client and Backend Infrastructure:

1. **Create Session**: User clicks "Start Sharing" to generate a unique receiving QR code.
2. **Scan on Android**: The companion Android app scans the QR code containing the `SessionId`.
3. **WebSocket Handshake**: The Web App and Android App connect via the Spring Boot Signaling service.
4. **WebRTC Negotiation**: The devices exchange `OFFER`, `ANSWER`, and `ICE_CANDIDATES`.
5. **P2P Transfer**: A direct DataChannel opens, and binary file chunks stream directly between devices.

---

## 🚀 Getting Started

Follow these steps to run the Web project locally.

<details>
<summary><strong> Running the Project</strong></summary>

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Mahir-Agarwal/ConnectX-Web-Client.git
    cd ConnectX-Web-Client
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file pointing to your backend signaling server.
    ```env
    VITE_API_BASE_URL=http://192.168.x.x:8080/api
    VITE_MOBILE_URL=http://192.168.x.x:5173
    ```

4.  **Start Development Server**:
    ```bash
    npm run dev
    ```
</details>

---

## 📂 Project Structure

```bash
ConnectX-WebApp/
├── Demo/                    # Application Demo GIFs
├── src/
│   ├── api/                 # API integration (Session Management)
│   ├── components/          # Reusable React UI components
│   ├── context/             # React Context (Session State)
│   ├── services/            # Core logic (Signaling & WebRTC)
│   ├── App.jsx              # Application Entry Point
│   └── main.jsx             # React DOM Mount
└── package.json             # Project dependencies
```

---

<div align="center">
  <p>
    <sub> Engineered and Developed by <a href="https://github.com/Mahir-Agarwal">Mahir Agarwal</a></sub>
  </p>
</div>
