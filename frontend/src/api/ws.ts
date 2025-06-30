import mitt from "mitt";

type Msg = { type: string; md?: string };

const emitter = mitt();
let socket: WebSocket | null = null;
const queue: Msg[] = []; // ← буфер сообщений

export function useWS() {
  if (!socket) {
    const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:3000";
    socket = new WebSocket(WS_URL);

    socket.addEventListener("open", () => {
      console.log("[WS] connected");
      // ► отправляем всё, что накопилось
      queue.splice(0).forEach((m) => socket!.send(JSON.stringify(m)));
    });

    socket.addEventListener("message", (e) => {
      const msg = JSON.parse(e.data);
      emitter.emit(msg.type, msg);
    });

    socket.addEventListener("close", () => {
      console.log("[WS] disconnected – reconnect in 2 s");
      socket = null;
      setTimeout(useWS, 2000);
    });
  }

  return {
    emit: (msg: Msg) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
      } else {
        queue.push(msg); // ← складируем, пока CONNECTING
        console.warn("[WS] queued:", msg);
      }
    },
    on: emitter.on.bind(emitter),
  };
}
