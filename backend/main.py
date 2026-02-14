from flask import Flask, request, jsonify
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) 

todo_list = [
    { "id": 1, "title": "Learn Flask", "done": True },
    { "id": 2, "title": "Build a Flask App", "done": False },
]


@app.route('/api/todos/', methods=['GET'])      # ระบุให้รับแค่ GET
def get_todos():
    return jsonify(todo_list)

@app.route('/api/todos/', methods=['POST'])
def add_todo():
    data = request.get_json()
<<<<<<< HEAD
    todo = new_todo(data)
    if todo:
        todo_list.append(todo)
        return jsonify(todo)
    else:
        # return http response code 400 for bad requests
        return (jsonify({'error': 'Invalid todo data'}), 400)

def new_todo(data):
    if len(todo_list) == 0:
        id = 1
    else:
        id = 1 + max([todo['id'] for todo in todo_list])

    if 'title' not in data:
        return None
    
    return {
        "id": id,
        "title": data['title'],
        "done": data.get('done', False),
    }


@app.route('/api/todos/<int:id>/toggle/', methods=['PATCH'])
def toggle_todo(id):
    todos = [todo for todo in todo_list if todo['id'] == id]
    if not todos:
        return (jsonify({'error': 'Todo not found'}), 404)
    todo = todos[0]
    todo['done'] = not todo['done']
    return jsonify(todo)

@app.route('/api/todos/<int:id>/', methods=['DELETE'])
def delete_todo(id):
    global todo_list
    # งานของคุณ: ลบ todo item ที่มี id ตรงกับ id
    # ถ้าทำงานถูกต้อง ให้คืน response ที่เป็น json ว่าง ๆ หรือ response message บางอย่างกลับไปก็ได้
    todo_list = [todo for todo in todo_list if todo['id'] != id]
    return jsonify({})

if __name__ == '__main__':
    app.run(debug=True)
=======
    todo = TodoItem(
        title=data['title'],
        done=data.get('done', False)
    )
    db.session.add(todo)
    db.session.commit()
    return jsonify(todo.to_dict())

@app.route('/api/todos/<int:id>/toggle/', methods=['PATCH'])
def toggle_todo(id):
    todo = TodoItem.query.get_or_404(id)
    todo.done = not todo.done
    db.session.commit()
    return jsonify(todo.to_dict())

@app.route('/api/todos/<int:id>/', methods=['DELETE'])
def delete_todo(id):
    todo = TodoItem.query.get_or_404(id)
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'message': 'Todo deleted successfully'})


@app.route('/api/todos/<int:todo_id>/comments/', methods=['POST'])
def add_comment(todo_id):
    todo_item = TodoItem.query.get_or_404(todo_id)

    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'Comment message is required'}), 400

    comment = Comment(
        message=data['message'],
        todo_id=todo_item.id
    )
    db.session.add(comment)
    db.session.commit()
 
    return jsonify(comment.to_dict())
>>>>>>> 07ac9f5a2e8abfa2752614f10cc0715ffc5da1f5
