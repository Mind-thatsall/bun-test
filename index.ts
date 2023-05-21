Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") return new Response(Bun.file("./index.html"));
    return new Response("404");
  },
});

Bun.serve({
  port: 3001,
  fetch(req, server) {
    if (req.url === "/") {
      const success = server.upgrade(req, {
        data: { username: "user-" + (Math.random() * 100).toFixed(0) },
      });

      return success
        ? undefined
        : new Response("Upgrade failed", { status: 400 });
    }
    return new Response("hello");
  },
  websocket: {
    open(ws) {
      ws.subscribe("group-chat");
    },
    message(ws, data) {
      const message = data;
      ws.publish("group-chat", "someone has entered the chat");
    },
  },
});
