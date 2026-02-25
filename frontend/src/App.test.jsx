import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom'; 
import { render, screen } from '@testing-library/react';
import viteLogo from '../public/vite.svg';
import { AuthProvider } from './context/AuthContext'; // import มาด้วย
import App from './App';


// Mock ไฟล์ที่มีปัญหา
vi.mock('/vite.svg', () => ({ default: 'svg-link' }));
vi.mock('./assets/react.svg', () => ({ default: 'svg-link' }));

const mockResponse = (body, ok = true) =>
  Promise.resolve({
    ok,
    json: () => Promise.resolve(body),
});

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders correctly', async () => {
    global.fetch.mockImplementationOnce(() =>
      mockResponse([
        { id: 1, title: 'First todo', done: false, comments: [] },
        { id: 2, title: 'Second todo', done: false, comments: [
          { id: 1, message: 'First comment' },
          { id: 2, message: 'Second comment' },
        ] },
      ]),
    );

    render(<App />);

    expect(await screen.findByText('First todo')).toBeInTheDocument();
    expect(await screen.findByText('Second todo')).toBeInTheDocument();
    expect(await screen.findByText('First comment')).toBeInTheDocument();
    expect(await screen.findByText('Second comment')).toBeInTheDocument();
  });
});