const port = parseInt(process.env.WORKER_PORT || "3001");
const secret = process.env.SYNC_SECRET;

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/health") {
      return new Response("OK");
    }

    const auth = req.headers.get("authorization");
    if (secret && auth !== `Bearer ${secret}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/trigger/blog" && req.method === "POST") {
      Bun.spawn(["bun", "run", "run:blog"], {
        cwd: "/app",
        env: { ...process.env },
        stdout: "inherit",
        stderr: "inherit",
      });

      return new Response(
        JSON.stringify({ success: true, message: "Blog generation started" }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    if (url.pathname === "/trigger/backup" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const type = body.type || "full";

      Bun.spawn(
        [
          "bun",
          "scripts/backup-worker/dist/index.js",
          `--type=${type}`,
        ],
        {
          cwd: "/app",
          env: { ...process.env },
          stdout: "inherit",
          stderr: "inherit",
        },
      );

      return new Response(
        JSON.stringify({ success: true, message: "Backup started" }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
});

console.log(`Worker server listening on port ${port}`);
