import { test, beforeAll, afterAll } from "vitest";
import assert from "assert";
import { app } from "../../../backend/server.js";
import fetch from "node-fetch";
import getPort from "get-port";

let server;
let testPort;

beforeAll(async () => {
  testPort = await getPort({ port: 5000 });
  server = app.listen(testPort);
});

afterAll(() => {
  if (server) {
    server.close();
  }
});

test("server should start correctly", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
  const response = await fetch(`http://localhost:${testPort}`);
  assert.strictEqual(response.ok, true);
});
