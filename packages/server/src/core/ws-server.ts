import { ServerWebSocket } from "bun";
import { HashTable } from "../util/hash-table";

export class WsServer {
  private clientConnections = new HashTable();

  open(ws: ServerWebSocket) {
    const id = generateSessionId();
  }

  close(ws: ServerWebSocket<undefined>, code: number, reason: string) {}
  ping(ws: ServerWebSocket<undefined>, data: Buffer) {}
  pong(ws: ServerWebSocket<undefined>, data: Buffer) {}
  drain(ws: ServerWebSocket<undefined>) {}
  message(ws: ServerWebSocket<undefined>, message: string | Buffer) {}
}

function generateSessionId() {
  throw new Error("Function not implemented.");
}
