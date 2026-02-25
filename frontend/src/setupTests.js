import { vi } from 'vitest';
import '@testing-library/jest-dom';
// บอก Vitest ว่าถ้าเจอการ import ไฟล์ .svg ให้ส่งค่าว่างกลับไปแทน
vi.mock('./assets/react.svg', () => ({ default: 'svg' }));
vi.mock('/vite.svg', () => ({ default: 'svg' }));