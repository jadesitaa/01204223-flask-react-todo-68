import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TodoItem from '../TodoItem.jsx'

describe('TodoItem', () => {
  it('renders with no comments correctly', () => {
    const baseTodo = {  // TodoItem พื้นฐานสำหรับทดสอบ
      id: 1,
      title: 'Sample Todo',
      done: false,
      comments: [],
    }

    // render component
    render(<TodoItem todo={baseTodo} />)

    // ตรวจสอบว่าข้อความปรากฏบนหน้า
    expect(screen.getByText('Sample Todo')).toBeInTheDocument()
  })
})
