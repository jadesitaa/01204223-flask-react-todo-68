import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,                          // ทำให้เรียกฟังก์ชันเกี่ยวกับการเทสได้โดยไม่ต้องประกาศ
    environment: 'jsdom',                   // รันเทสแบบไม่มี browser
    setupFiles: './src/setupTests.js',      // ระบุโค้ดสำหรับเตรียมต่าง ๆ
  },
})