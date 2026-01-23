################# 
### ไฟล์ main.py
#################

from flask import Flask, request, jsonify
from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy                            # ลบออกได้
# from sqlalchemy.orm import DeclarativeBase                         # ลบออกได้
# from sqlalchemy import Integer, String, ForeignKey                 # ลบออกได้
# from sqlalchemy.orm import Mapped, mapped_column, relationship     # ลบออกได้
from flask_migrate import Migrate

from models import TodoItem, Comment, db                             # import จาก models

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'

db.init_app(app)                                                     # แก้จาก db = SQLAlchemy(app, model_class=Base)
migrate = Migrate(app, db)

@app.route('/api/todos/', methods=['GET'])
def get_todos():
    todos = TodoItem.query.all()
    return jsonify([todo.to_dict() for todo in todos])

@app.route('/api/todos/', methods=['POST'])
def add_todo():
    data = request.get_json()
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