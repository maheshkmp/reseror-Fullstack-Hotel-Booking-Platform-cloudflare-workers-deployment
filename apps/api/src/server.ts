import app from "./app";

const port = Number(process.env.PORT || 4000);

Bun.serve({
  ...app,
  hostname: "0.0.0.0",
  port,
});

console.log(`API listening on http://0.0.0.0:${port}`);
