import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom';
import TodoItem from '../TodoItem.jsx';
import App from '../App.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';


/**
 * @jest-environment jsdom
 */

// Mock ไฟล์ที่มีปัญหา
vi.mock('/vite.svg', () => ({ default: 'svg-link' }));
vi.mock('./assets/react.svg', () => ({ default: 'svg-link' }));

const todoItem1 = { id: 1, title: 'First todo', done: false, comments: [] };
const todoItem2 = {
  id: 2, title: 'Second todo', done: false, comments: [
    { id: 1, message: 'First comment' },
  ]
};
const originalTodoList = [todoItem1, todoItem2];

const mockResponse = (data) => ({
  ok: true,
  json: () => Promise.resolve(data),
});

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renders correctly', async () => {
    global.fetch.mockImplementationOnce(() => mockResponse(originalTodoList));

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    expect(await screen.findByText('First todo')).toBeInTheDocument();
  });
});

describe('TodoItem', () => {
  const baseTodo = { id: 1, title: 'Sample Todo', done: false, comments: [] };

  it('renders with no comments correctly', () => {
    render(<TodoItem todo={baseTodo} />);
    expect(screen.getByText('No comments')).toBeInTheDocument();
  });

  it('makes callback to toggleDone when Toggle button is clicked', () => {
    const onToggleDone = vi.fn();
    render(<TodoItem todo={baseTodo} toggleDone={onToggleDone} />);
    const buttons = screen.getAllByRole('button', { name: /toggle/i });
    const button = buttons[0];
    button.click();
    expect(onToggleDone).toHaveBeenCalledWith(baseTodo.id);
  });
});