import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // describe, it などをグローバルに使えるようにする
    environment: 'jsdom', // JSDOM環境を使用する
    setupFiles: [], // 必要に応じてセットアップファイルパスを指定
  },
});