from flask import Blueprint, request, jsonify
from db import get_db_connection
from datetime import datetime

swipe_api = Blueprint('swipe_api', __name__)

# @swipe_api.route('/swipe', methods=['POST'])
# def add_swipe_record():
#     data = request.get_json()
#     conn = get_db_connection()
#     cursor = conn.cursor(dictionary=True)

#     try:
#         user_id = data['user_id']
#         room_id = data['room_id']
#         timestamp = data['timestamp']  # 格式：'2025-04-19 15:00:00'

#         # ✅ 1. 檢查 5 分鐘內是否已經刷過卡
#         check_query = """
#             SELECT * FROM SwipeRecord
#             WHERE user_id = %s AND room_id = %s
#             AND timestamp >= NOW() - INTERVAL 5 MINUTE
#         """
#         cursor.execute(check_query, (user_id, room_id))
#         cursor.fetchall()  # 💥💡 強制清空所有結果，避免 unread result
#         if cursor.rowcount > 0:
#             return jsonify({'warning': '你剛剛已經刷過卡了！'}), 400

#         # ✅ 2. 寫入刷卡紀錄
#         insert_query = """
#             INSERT INTO SwipeRecord (user_id, timestamp, room_id)
#             VALUES (%s, %s, %s)
#         """
#         cursor.execute(insert_query, (user_id, timestamp, room_id))
#         conn.commit()
#         return jsonify({'message': '刷卡成功！'})

#     except Exception as e:
#         conn.rollback()
#         return jsonify({'error': str(e)}), 500

#     finally:
#         try:
#             cursor.close()
#         except:
#             pass
#         try:
#             conn.close()
#         except:
#             pass

@swipe_api.route('/swipe', methods=['POST'])
def add_swipe_record():
    data = request.get_json()
    rfid_uid = data.get('rfid_uid')
    room_id = data.get('room_id')
    timestamp = data.get('timestamp') or datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # 根據 UID 查 user_id
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT user_id FROM Users WHERE rfid_uid = %s", (rfid_uid,))
    user = cursor.fetchone()
    if not user:
        return jsonify({'error': '查無此卡片'}), 404

    user_id = user['user_id']

    # 防止重複刷卡（略）

    # 寫入刷卡紀錄
    insert_query = """
        INSERT INTO SwipeRecord (user_id, timestamp, room_id)
        VALUES (%s, %s, %s)
    """
    cursor.execute(insert_query, (user_id, timestamp, room_id))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': '刷卡成功！'})
