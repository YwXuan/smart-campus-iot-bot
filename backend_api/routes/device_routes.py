from flask import Blueprint, request, jsonify
from db import get_db_connection

device_api = Blueprint('device_api', __name__)

# ✅ 自動產生 device_id
def generate_device_id(device_type):
    prefix_map = {
        '冷氣': 'AC',
        '電腦': 'PC',
        '風扇': 'FAN',
        '電燈': 'LAMP'
    }
    prefix = prefix_map.get(device_type)
    if not prefix:
        raise ValueError("不支援的設備類型")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT device_id FROM Device WHERE device_type = %s AND device_id LIKE %s ORDER BY device_id DESC LIMIT 1",
        (device_type, f"{prefix}%")
    )
    last_id = cursor.fetchone()
    if last_id:
        num = int(last_id[0][len(prefix):]) + 1
    else:
        num = 1

    cursor.close()
    conn.close()
    return f"{prefix}{num:03d}"

# ✅ 新增設備 API
@device_api.route('/devices', methods=['POST'])
def add_device():
    data = request.get_json()
    device_type = data['device_type']
    zone = data['zone']
    model = data.get('model', None)

    try:
        device_id = generate_device_id(device_type)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO Device (device_id, device_type, zone, model)
            VALUES (%s, %s, %s, %s)
        """, (device_id, device_type, zone, model))
        conn.commit()
        result = {'message': '設備新增成功', 'device_id': device_id}
    except Exception as e:
        conn.rollback()
        result = {'error': str(e)}
    finally:
        cursor.close()
        conn.close()

    return jsonify(result)
