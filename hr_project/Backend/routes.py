from flask import Blueprint, jsonify, request
from .app import get_db_connection, row_to_dict, rule_based_predict

bp = Blueprint('api', __name__)

@bp.route('/api/employees', methods=['GET'])
def get_employees():
    with get_db_connection() as conn:
        rows = conn.execute('SELECT * FROM employees ORDER BY id').fetchall()
    return jsonify([row_to_dict(row) for row in rows])

@bp.route('/api/employees/<int:emp_id>', methods=['GET'])
def get_employee(emp_id):
    with get_db_connection() as conn:
        row = conn.execute('SELECT * FROM employees WHERE id = ?', (emp_id,)).fetchone()
    if row is None:
        return jsonify({'error': 'Employee not found'}), 404
    return jsonify(row_to_dict(row))

@bp.route('/api/employees', methods=['POST'])
def add_employee():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and email are required'}), 400
    employee = {
        'name':         data.get('name'),
        'email':        data.get('email'),
        'dept':         data.get('dept', 'Engineering'),
        'role':         data.get('role', 'Employee'),
        'salary':       int(data.get('salary', 50000)),
        'attendance':   int(data.get('attendance', 90)),
        'overtime':     int(data.get('overtime', 8)),
        'experience':   int(data.get('experience', 0)),
        'satisfaction': int(data.get('satisfaction', 3)),
        'leaveFreq':    int(data.get('leaveFreq', 2)),
        'status':       data.get('status', 'active'),
        'joined':       data.get('joined', ''),
        'phone':        data.get('phone', ''),
    }
    with get_db_connection() as conn:
        cursor = conn.execute(
            '''
            INSERT INTO employees (name, email, dept, role, salary, attendance, overtime, experience, satisfaction, leaveFreq, status, joined, phone)
            VALUES (:name, :email, :dept, :role, :salary, :attendance, :overtime, :experience, :satisfaction, :leaveFreq, :status, :joined, :phone)
            ''',
            employee
        )
        emp_id = cursor.lastrowid
        row = conn.execute('SELECT * FROM employees WHERE id = ?', (emp_id,)).fetchone()
    return jsonify(row_to_dict(row)), 201

@bp.route('/api/employees/<int:emp_id>', methods=['PUT'])
def update_employee(emp_id):
    data = request.get_json() or {}
    with get_db_connection() as conn:
        row = conn.execute('SELECT * FROM employees WHERE id = ?', (emp_id,)).fetchone()
        if row is None:
            return jsonify({'error': 'Employee not found'}), 404

        fields = {k: data[k] for k in data.keys() if k in ['name', 'email', 'dept', 'role', 'salary', 'attendance', 'overtime', 'experience', 'satisfaction', 'leaveFreq', 'status', 'joined', 'phone']}
        if fields:
            assignments = ', '.join([f"{k} = :{k}" for k in fields.keys()])
            fields['id'] = emp_id
            conn.execute(f'UPDATE employees SET {assignments} WHERE id = :id', fields)
        updated_row = conn.execute('SELECT * FROM employees WHERE id = ?', (emp_id,)).fetchone()
    return jsonify(row_to_dict(updated_row))

@bp.route('/api/employees/<int:emp_id>', methods=['DELETE'])
def delete_employee(emp_id):
    with get_db_connection() as conn:
        cursor = conn.execute('DELETE FROM employees WHERE id = ?', (emp_id,))
        if cursor.rowcount == 0:
            return jsonify({'error': 'Employee not found'}), 404
    return jsonify({'message': 'Employee deleted', 'id': emp_id})
