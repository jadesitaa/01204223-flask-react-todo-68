import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest' // เพิ่ม beforeEach ตรงนี้
import TodoItem from '../TodoItem.jsx'
import App from '../App.jsx'
import userEvent from '@testing-library/user-event'

const todoItem1 = { id: 1, title: 'First todo', done: false, comments: [] };
const todoItem2 = { id: 2, title: 'Second todo', done: false, comments: [
  { id: 1, message: 'First comment' },
  { id: 2, message: 'Second comment' },
] };

const originalTodoList = [
  todoItem1,
  todoItem2,
];

const mockResponse = (data) => ({
  ok: true,
  json: () => Promise.resolve(data),
});

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renders correctly', async () => {
    global.fetch.mockImplementationOnce(() =>
      mockResponse(originalTodoList)
    );

    render(<App />);
    
    expect(await screen.findByText('First todo')).toBeInTheDocument();
    expect(await screen.findByText('Second todo')).toBeInTheDocument();
    expect(await screen.findByText(/2/)).toBeInTheDocument();
  });

it('toggles done on a todo item', async() => {
    const toggledTodoItem1 = { ...todoItem1, done: true };

    global.fetch
      .mockImplementationOnce(() => mockResponse(originalTodoList))    
      .mockImplementationOnce(() => mockResponse(toggledTodoItem1));

    render(<App />);

    const firstTodo = await screen.findByText('First todo');
    expect(firstTodo).not.toHaveClass('done');

    const toggleButtons = await screen.findAllByRole('button', { name: /toggle/i });
    toggleButtons[0].click();

    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.stringMatching(/1\/toggle/), 
      expect.objectContaining({ method: 'PATCH' })
    );

    expect(await screen.findByText('First todo')).toHaveClass('done');
  });
});


describe('TodoItem', () => {
    const baseTodo = {
        id: 1,
        title: 'Sample Todo',
        done: false,
        comments: [],
    };

    it('renders with no comments correctly', () => {
        render(<TodoItem todo={baseTodo} />);
        expect(screen.getByText('No comments')).toBeInTheDocument();
    });

    it('does not show no comments message when it has a comment', () => {
        const todoWithComment = {
            ...baseTodo,
            comments: [{ id: 1, message: 'First comment' }]
        };
        render(<TodoItem todo={todoWithComment} />);
        expect(screen.queryByText('No comments')).not.toBeInTheDocument();
    });

    it('renders with comments correctly', () => {
        const todoWithComment = {
            ...baseTodo,
            comments: [
                { id: 1, message: 'First comment' },
                { id: 2, message: 'Another comment' },
            ]
        };
        render(<TodoItem todo={todoWithComment} />);
        expect(screen.getByText('Sample Todo')).toBeInTheDocument();
        expect(screen.getByText('First comment')).toBeInTheDocument();
        expect(screen.getByText('Another comment')).toBeInTheDocument();
        expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it('makes callback to toggleDone when Toggle button is clicked', () => {
        const onToggleDone = vi.fn();
        render(<TodoItem todo={baseTodo} toggleDone={onToggleDone} />);
        const button = screen.getByRole('button', { name: /toggle/i });
        button.click();
        expect(onToggleDone).toHaveBeenCalledWith(baseTodo.id);
    });

    it('makes callback to deleteTodo when delete button is clicked', () => {
        const onDeleteTodo = vi.fn();
        render(<TodoItem todo={baseTodo} deleteTodo={onDeleteTodo} />);
        const button = screen.getByRole('button', { name: '❌' }); 
        button.click();
        expect(onDeleteTodo).toHaveBeenCalledWith(baseTodo.id);
    });

    it('makes callback to addNewComment when a new comment is added', async () => {
        const onAddNewComment = vi.fn();
        render(<TodoItem todo={baseTodo} addNewComment={onAddNewComment} />);
        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'New comment');
        const button = screen.getByRole('button', { name: /add comment/i });
        fireEvent.click(button);
        expect(onAddNewComment).toHaveBeenCalledWith(baseTodo.id, 'New comment');
    });
});