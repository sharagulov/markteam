import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { saveDoc } from "../services/doc.service";

type Msg =
  | { type: "join"; id: string; name: string }
  | { type: "patch"; id: string; md: string }
  | { type: "ping"; id: string };

interface ExtWebSocket extends WebSocket {
  docId?: string;
  username?: string;
}

// держим для каждого документа Set сокетов
const docSockets = new Map<string, Set<ExtWebSocket>>();

export function websocketInit(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket: ExtWebSocket) => {
    socket.on("message", (raw) => {
      const msg = JSON.parse(raw.toString()) as Msg;

      // Пользователь заходит в комнату
      if (msg.type === "join") {
        // сохраняем meta
        socket.docId = msg.id;
        socket.username = msg.name;

        // добавляем сокет в Set для данного docId
        if (!docSockets.has(msg.id)) {
          docSockets.set(msg.id, new Set());
        }
        docSockets.get(msg.id)!.add(socket);

        // рассылаем обновлённый список
        broadcastUsers(msg.id);
        return;
      }

      // Патчим документ и шлём всем остальным
      if (msg.type === "patch" && socket.docId === msg.id) {
        saveDoc(msg.id, msg.md);
        const out = JSON.stringify(msg);
        for (const client of docSockets.get(msg.id) || []) {
          if (client !== socket && client.readyState === WebSocket.OPEN) {
            client.send(out);
          }
        }
      }

      if (msg.type === "ping" && socket.docId === msg.id) {
        broadcastUsers(msg.id);
      }
    });

    socket.on("close", () => {
      // при выходе удаляем сокет из Set
      const id = socket.docId;
      if (!id) return;
      const set = docSockets.get(id);
      if (!set) return;

      set.delete(socket);
      if (set.size === 0) {
        docSockets.delete(id);
      } else {
        broadcastUsers(id);
      }
    });
  });
}

/** Рассылает всем в комнате список имён */
function broadcastUsers(docId: string) {
  const set = docSockets.get(docId);
  if (!set) return;
  const users = Array.from(set).map((s) => s.username || "Anonymous");

  const out = JSON.stringify({ type: "users", users });
  for (const client of set) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(out);
    }
  }
}
