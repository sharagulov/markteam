import { defineStore } from "pinia";

export const useDocStore = defineStore("doc", {
  state: () => ({
    id: "",
    md: "# Loading…",
    ws: null as WebSocket | null,
    users: [] as string[],
  }),
  actions: {
    setId(id: string) {
      this.id = id;
    },
    setMd(md: string) {
      this.md = md;
    },
    setUsers(users: string[]) {
      // убираем дубли — только уникальные
      this.users = Array.from(new Set(users));
    },
    connect(wsUrl: string) {
      this.ws = new WebSocket(wsUrl);
      this.ws.addEventListener("message", (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === "patch" && msg.id === this.id) {
          this.setMd(msg.md);
        }
        if (msg.type === "users") {
          this.setUsers(msg.users);
        }
      });
    },
    sendPatch(md: string) {
      this.ws?.send(JSON.stringify({ type: "patch", id: this.id, md }));
    },
    disconnect() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      this.users = [];
    },
  },
});
