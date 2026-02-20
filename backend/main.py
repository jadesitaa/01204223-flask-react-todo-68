from flask import Flask, request, jsonify
import click
from flask_cors import CORS 
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt 
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

app = Flask(__name__)
CORS(app) 
bcrypt = Bcrypt(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'fdsjkfjioi2rjshr2345hrsh043j5oij5545'

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# --- Models ---

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    done = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {"id": self.id, "title": self.title, "done": self.done}

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    fullname = db.Column(db.String(120))
    password = db.Column(db.String(200), nullable=False)

# --- Routes ---

@app.route('/api/todos/', methods=['GET'])
# @jwt_required()  <-- ปิดไว้ก่อนเพื่อให้ React ดึงข้อมูลได้
def get_todos():
    todos = Todo.query.all()
    return jsonify([todo.to_dict() for todo in todos])

@app.route('/api/todos/', methods=['POST'])
def add_todo():
    data = request.get_json()
    todo = Todo(title=data['title'], done=data.get('done', False))
    db.session.add(todo)
    db.session.commit()
    return jsonify(todo.to_dict())

@app.route('/api/todos/<int:id>/toggle/', methods=['PATCH'])
def toggle_todo(id):
    todo = Todo.query.get_or_404(id)
    todo.done = not todo.done
    db.session.commit()
    return jsonify(todo.to_dict())

@app.route('/api/todos/<int:id>/', methods=['DELETE'])
def delete_todo(id):
    todo = Todo.query.get_or_404(id)
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'message': 'Todo deleted successfully'})

# --- Auth Routes ---

@app.route('/api/login/', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    
    # ตรวจสอบรหัสผ่านโดยใช้ bcrypt
    if user and bcrypt.check_password_hash(user.password, data.get('password')):
        access_token = create_access_token(identity=user.username)
        return jsonify(access_token=access_token)
    
    return jsonify({'error': 'Invalid username or password'}), 401

# --- CLI Commands ---

@app.cli.command("create-user")
@click.argument("username")
@click.argument("fullname")
@click.argument("password")
def create_user(username, fullname, password):
    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, fullname=fullname, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    click.echo(f"User {username} created!")