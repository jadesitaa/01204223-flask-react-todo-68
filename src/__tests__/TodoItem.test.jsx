import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TodoItem from '../TodoItem.jsx'

describe('TodoItem', () => {
  const baseTodo = {
    id: 1,
    title: 'Sample Todo',
    done: false,
    comments: [],
  };


  it('renders with no comments correctly', () => {
    render(<TodoItem todo={baseTodo} />);
    expect(screen.getByText('Sample Todo')).toBeInTheDocument();
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
  });
});