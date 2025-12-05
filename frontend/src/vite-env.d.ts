/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Diğer environment variable'lar buraya eklenebilir
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
