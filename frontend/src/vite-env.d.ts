/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WS_URL: string;
  // здесь можно описать и другие VITE_* переменные
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
