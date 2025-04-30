from flask import Blueprint, request, jsonify
from db import get_db_connection
from datetime import date

seat_api = Blueprint('seat_api', __name__)

# ✅ 查詢某教室所有座位
@seat_api.route('/classroom/<room_id>/seats', methods=['GET'])
def get_seats_by_classroom(room_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM Seat WHERE room_id = %s"
    cursor.execute(query, (room_id,))
    seats = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(seats)


# ✅ 查詢某位使用者今天的座位
@seat_api.route('/user/<user_id>/seat', methods=['GET'])
def get_today_seat(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT s.seat_id, s.room_id, s.seat_number, s.device_id
        FROM SeatAssignment sa
        JOIN Seat s ON sa.seat_id = s.seat_id
        WHERE sa.user_id = %s AND sa.assign_date = CURDATE()
    """
    cursor.execute(query, (user_id,))
    seat = cursor.fetchone()

    cursor.close()
    conn.close()

    if seat:
        return jsonify(seat)
    else:
        return jsonify({'message': '今日尚未排座位'}), 404


# ✅ 新增排座位紀錄（今天）
@seat_api.route('/seat-assignment', methods=['POST'])
def assign_seat():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO SeatAssignment (user_id, seat_id, assign_date)
        VALUES (%s, %s, %s)
    """
    try:
        cursor.execute(query, (
            data['user_id'],
            data['seat_id'],
            date.today()
        ))
        conn.commit()
        result = {'message': '座位排定成功！'}
    except Exception as e:
        conn.rollback()
        result = {'error': str(e)}
    finally:
        cursor.close()
        conn.close()

    return jsonify(result)
