import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // rollupOptions: {
    //   output: {
    //     assetFileNames: 'assets/[name][extname]',
    //     chunkFileNames: 'vendor/[name]-[hash].js',
    //     manualChunks: {
    //       hiveledger: ['@engrave/ledger-app-hive'],
    //       ledger: ['@ledgerhq/hw-transport-webusb'],
    //       cryptojs: ['crypto-js'],
    //       hivetx: ['hive-tx']
    //     }
    //   }
    // }
  }
})

