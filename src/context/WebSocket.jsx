import React, { createContext, useContext, useEffect, useRef } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, userId }) => {
    const socketRef = useRef(null);
    const listenersRef = useRef([]); // Để lưu danh sách các listener

    useEffect(() => {
        // Kết nối WebSocket deploy FE web
        socketRef.current = new WebSocket(
            `wss://deploybe-cnm-production.up.railway.app/ws?userId=${userId}`
        );

        socketRef.current.onopen = () => {
            console.log("WebSocket connected");
        };

        socketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            // Gọi tất cả các listener đã đăng ký
            listenersRef.current.forEach((listener) => listener(message));
        };

        socketRef.current.onclose = () => {
            console.log("WebSocket disconnected");
        };

        return () => {
            socketRef.current.close();
        };
    }, [userId]);

    // Gửi tin nhắn qua WebSocket
    const sendMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
            console.log("Message sent:", message);
        }
    };

    const returnMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        }
    };

    // Đăng ký lắng nghe tin nhắn
    const onMessage = (listener) => {
        listenersRef.current.push(listener);

        // Trả về hàm hủy đăng ký listener
        return () => {
            listenersRef.current = listenersRef.current.filter((l) => l !== listener);
        };
    };

    // // Gửi thông báo yêu cầu kết bạn tới bên B
    // const sendFriendRequestToReceiver = (receiverID, friendRequestMessage) => {
    //     sendMessage({
    //         type: "friend_request_received",
    //         receiverID,
    //         message: friendRequestMessage,
    //     });
    // };

    return (
        <WebSocketContext.Provider value={{ sendMessage, returnMessage, onMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
