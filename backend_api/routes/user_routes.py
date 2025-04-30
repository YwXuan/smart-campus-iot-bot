from flask import Blueprint, request, jsonify
from db import get_db_connection

user_api = Blueprint('user_api', __name__)

@user_api.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Users")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

def generate_user_id(position_id):
    prefix = 'S' if position_id == 1 else 'T'
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT user_id FROM Users WHERE position_id = %s AND user_id LIKE %s ORDER BY user_id DESC LIMIT 1",
        (position_id, f"{prefix}%")
    )
    last_id = cursor.fetchone()
    if last_id:
        num = int(last_id[0][1:]) + 1
    else:
        num = 1

    cursor.close()
    conn.close()
    return f"{prefix}{num:06d}"  # 補滿 6 碼，例如 S000001


@user_api.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    name = data['name']
    rfid_uid = data['rfid_uid']
    position_id = data['position_id']
    user_id = generate_user_id(position_id)  # 自動產生！

    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        INSERT INTO Users (user_id, name, rfid_uid, position_id)
        VALUES (%s, %s, %s, %s)
    """
    try:
        cursor.execute(query, (user_id, name, rfid_uid, position_id))
        conn.commit()
        result = {'message': '使用者新增成功！', 'user_id': user_id}
    except Exception as e:
        conn.rollback()
        result = {'error': str(e)}
    finally:
        cursor.close()
        conn.close()

    return jsonify(result)


@user_api.route('/user/line/<line_user_id>', methods=['GET'])
def get_user_by_line_id(line_user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM Users WHERE line_user_id = %s"
    cursor.execute(query, (line_user_id,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        return jsonify(user)
    else:
        return jsonify({'error': '找不到此使用者'}), 404

@user_api.route('/bind', methods=['POST'])
def bind_line_user():
    data = request.get_json()
    user_id = data.get('user_id')
    rfid_uid = data.get('rfid_uid')
    line_user_id = data.get('line_user_id')

    conn = get_db_connection()
    cursor = conn.cursor()

    # 驗證是否存在此用戶
    query = "SELECT * FROM Users WHERE user_id = %s AND rfid_uid = %s"
    cursor.execute(query, (user_id, rfid_uid))
    result = cursor.fetchone()

    if result:
        try:
            update_query = "UPDATE Users SET line_user_id = %s WHERE user_id = %s"
            cursor.execute(update_query, (line_user_id, user_id))
            conn.commit()
            msg = {'message': '綁定成功 🎉'}
        except Exception as e:
            conn.rollback()
            msg = {'error': str(e)}
    else:
        msg = {'error': '查無此學生，請確認學號與 RFID 是否正確'}

    cursor.close()
    conn.close()
    return jsonify(msg)
