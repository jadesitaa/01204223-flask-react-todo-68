import './App.css'
import { useState } from 'react'

function TodoItem({todo, toggleDone, deleteTodo, addNewComment}) {
    const [newComment, setNewComment] = useState("");
    
    return (
    <li>
        <span className={todo.done ? "done" : ""}>{todo.title}</span>
        <button onClick={() => {toggleDone(todo.id)}}>Toggle</button>
        <button onClick={() => {deleteTodo(todo.id)}}>❌</button>

        {/* 1. กรณีที่มีคอมเมนต์: แสดงคำว่า Comments และจำนวนในวงเล็บ */}
        {(todo.comments) && (todo.comments.length > 0) && (
            <>
                <b>Comments ({todo.comments.length}):</b>
                <ul>
                    {todo.comments.map(comment => (
                        <li key={comment.id}>{comment.message}</li>
                    ))}
                </ul>
            </>
        )}

        {/* 2. กรณีที่ไม่มีคอมเมนต์: แสดงคำว่า No comments ตามที่เทสระบุ */}
        {(todo.comments) && (todo.comments.length === 0) && (
            <p>No comments</p>
        )}

        <div className="new-comment-forms">
            {/* อย่าลืมใส่ input เพื่อให้พิมพ์คอมเมนต์ได้จริงนะคะ */}
            <input 
                type="text" 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Write a comment..."
            />
            <button onClick={() => {
                addNewComment(todo.id, newComment);
                setNewComment("");
            }}>Add Comment</button>
        </div>
    </li>
    );
}

export default TodoItem;