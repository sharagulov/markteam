import { WebSocketServer, WebSocket } from "ws";
import { saveMarkdown } from "../services/markdown.service";

interface Message {
  type: string;
  md?: string;
}

export function createFSM(socket: WebSocket, wss: WebSocketServer) {
  return {
    dispatch(raw: string) {
      let msg: Message;
      try {
        msg = JSON.parse(raw);
      } catch {
        return;
      }

      if (msg.type === "update_md" && msg.md) {
        saveMarkdown(msg.md);
        wss.clients.forEach((client: WebSocket) => {
          if (client !== socket && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "patch", md: msg.md }));
          }
        });
      }
    },
  };
}
