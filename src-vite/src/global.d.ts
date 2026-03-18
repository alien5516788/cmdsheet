// Pywebview API interface
interface PyWebviewApi {
  [key: string]: (...args: any[]) => Promise<any>;
}

interface Window {
  pywebview?: { api: PyWebviewApi };
}

declare const pywebview: { api: PyWebviewApi };
