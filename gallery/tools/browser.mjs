// Chrome ou Edge headless controlado pelo DevTools Protocol, sem dependências: abre uma página,
// espera uma condição e devolve o que for pedido. Usado para paginar e imprimir os documentos.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const candidates = [
  process.env.BROWSER,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/microsoft-edge",
];

export function findBrowser() {
  const browser = candidates.find((path) => path && existsSync(path));
  if (!browser) throw new Error("nenhum Chrome ou Edge encontrado; defina BROWSER=/caminho/do/navegador");
  return browser;
}

function endpoint(child) {
  return new Promise((resolve, reject) => {
    let log = "";
    const timer = setTimeout(() => reject(new Error(`o navegador não abriu a porta de depuração\n${log}`)), 30000);
    child.stderr.on("data", (chunk) => {
      log += chunk;
      const match = log.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });
    child.on("exit", (code) => reject(new Error(`o navegador saiu com código ${code}\n${log}`)));
  });
}

// Abre `url`, chama `task(send)` e fecha tudo. `send(method, params)` fala com a aba aberta.
export async function withPage(url, task) {
  const profile = await mkdtemp(join(tmpdir(), "browser-"));
  const child = spawn(findBrowser(), [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    // Em contêineres de CI o Chrome não consegue criar a sandbox do sistema.
    ...(process.env.CI ? ["--no-sandbox"] : []),
    "about:blank",
  ]);
  try {
    const socket = new WebSocket(await endpoint(child));
    await new Promise((resolve, reject) => {
      socket.onopen = resolve;
      socket.onerror = () => reject(new Error("falha ao conectar no navegador"));
    });
    let next = 0;
    const waiting = new Map();
    socket.onmessage = ({ data }) => {
      const message = JSON.parse(data);
      const pending = waiting.get(message.id);
      if (!pending) return;
      waiting.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    };
    const call = (method, params = {}, sessionId) =>
      new Promise((resolve, reject) => {
        const id = ++next;
        waiting.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params, sessionId }));
      });
    const { targetId } = await call("Target.createTarget", { url });
    const { sessionId } = await call("Target.attachToTarget", { targetId, flatten: true });
    const result = await task((method, params) => call(method, params, sessionId));
    await call("Browser.close").catch(() => {});
    socket.close();
    return result;
  } finally {
    child.kill();
    await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {});
  }
}

// Avalia uma expressão na página e devolve o valor.
export async function evaluate(send, expression) {
  const { result, exceptionDetails } = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
  return result.value;
}

// Repete a expressão até ela devolver algo verdadeiro ou o prazo acabar.
export async function waitFor(send, expression, timeout = 60000) {
  const limit = Date.now() + timeout;
  while (Date.now() < limit) {
    const value = await evaluate(send, expression).catch(() => undefined);
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`tempo esgotado esperando: ${expression}`);
}
