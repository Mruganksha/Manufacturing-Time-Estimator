from flask import Flask, request, jsonify
from flask_cors import CORS
import math
import re

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

def parse_line(line):
    coords = {}
    for axis in ['X', 'Y', 'Z', 'I', 'J']:
        match = re.search(rf'{axis}(-?\d+\.?\d*)', line, re.IGNORECASE)
        if match:
            coords[axis] = float(match.group(1))
    return coords

def distance(p1, p2):
    return math.sqrt(
        (p2['X'] - p1['X'])**2 +
        (p2['Y'] - p1['Y'])**2 +
        (p2['Z'] - p1['Z'])**2
    )

def process_gcode(gcode_lines):
    current_pos = {'X': 0.0, 'Y': 0.0, 'Z': 0.0}
    total_distance = 0.0

    for line in gcode_lines:
        line = line.strip().upper()
        if not line or line.startswith('(') or line.startswith('%') or 'M30' in line:
            continue

        if any(cmd in line for cmd in ['G00', 'G01', 'G02', 'G03']):
            move_type = 'LINEAR' if 'G01' in line or 'G00' in line else 'ARC'
            new_coords = parse_line(line)

            for axis in ['X', 'Y', 'Z']:
                if axis not in new_coords:
                    new_coords[axis] = current_pos[axis]

            if move_type == 'LINEAR':
                total_distance += distance(current_pos, new_coords)

            elif move_type == 'ARC':
                I = new_coords.get('I', 0.0)
                J = new_coords.get('J', 0.0)
                center_x = current_pos['X'] + I
                center_y = current_pos['Y'] + J
                radius = math.sqrt(I**2 + J**2)  

                start_angle = math.atan2(current_pos['Y'] - center_y, current_pos['X'] - center_x)
                end_angle = math.atan2(new_coords['Y'] - center_y, new_coords['X'] - center_x)
                angle_diff = end_angle - start_angle

                if 'G02' in line and angle_diff > 0:
                    angle_diff -= 2 * math.pi
                elif 'G03' in line and angle_diff < 0:
                    angle_diff += 2 * math.pi

                arc_length = abs(radius * angle_diff)
                total_distance += arc_length

            current_pos = new_coords.copy()

    return total_distance


@app.route('/api/milling-time', methods=['POST', 'OPTIONS'])
def milling_time():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    gcode = data.get('gcode', '')
    feed = float(data.get('feed', 1))  # mm/hour

    gcode_lines = gcode.strip().splitlines()
    total_distance = process_gcode(gcode_lines)

    time_hours = total_distance / feed

    return jsonify({
        "tool_travel": round(total_distance, 2),
        "feed_rate": feed,
        "machining_time": round(time_hours, 4)
    })

@app.route('/api/wire-edm-time', methods=['POST', 'OPTIONS'])
def calculate_wire_edm_time():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()

    num_items = int(data['num_items'])
    path_length = float(data['path_length'])
    insert_height = float(data['insert_height'])
    num_passes = int(data['num_passes'])
    approach = float(data['approach'])
    num_holes = int(data['num_holes'])
    setup_time = float(data['setup_time'])

    # Base cutting area
    cutting_area = (path_length + approach) * insert_height  # = 6084.411

    # Apply factor based on passes
    if num_passes == 2:
        cutting_area_per_piece = cutting_area * 1.25  # = 7605.51
    elif num_passes == 3:
        cutting_area_per_piece = cutting_area * 1.5
    else:
        cutting_area_per_piece = cutting_area

    total_cutting_area = cutting_area_per_piece * num_items
    cutting_time = total_cutting_area / 900  # Adjusted to match spreadsheet

    hole_shifting_time = (num_items * num_holes * 7) / 3600  # In hours
    total_time = cutting_time + hole_shifting_time + setup_time

    return jsonify({
        "cutting_area": round(cutting_area, 3),
        "cutting_area_per_piece": round(cutting_area_per_piece, 5),
        "total_cutting_area": round(total_cutting_area, 5),
        "cutting_time": round(cutting_time, 5),
        "hole_shifting_time": round(hole_shifting_time, 5),
        "setup_time": round(setup_time, 2),
        "total_time": round(total_time, 5)
    })




@app.route('/api/edm-time', methods=['POST', 'OPTIONS'])
def calculate_edm_time():
    if request.method == 'OPTIONS':
        # ✅ CORS preflight response
        response = app.make_default_options_response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        return response

    data = request.get_json()

    try:
        length = float(data['length'])
        width = float(data['width'])
        height = float(data['height'])
        mrr = float(data['mrr'])  # MRR in mm³/min
        setup_time = float(data['setup_time'])  # in minutes

        # 🧮 Calculations
        volume_to_remove = length * width * height  # mm³
        machining_time = volume_to_remove / mrr     # in minutes
        total_time_minutes = machining_time + setup_time
        total_time_hours = total_time_minutes / 60  # hours

        return jsonify({
            "volume_to_remove": round(volume_to_remove, 2),
            "machining_time_minutes": round(machining_time, 2),
            "total_time_minutes": round(total_time_minutes, 2),
            "total_time_hours": round(total_time_hours, 4)
        }), 200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST, OPTIONS"
        }

    except (KeyError, ValueError) as e:
        return jsonify({"error": str(e)}), 400, {
            "Access-Control-Allow-Origin": "*"
        }


@app.route('/api/grinding-time', methods=['POST', 'OPTIONS'])
def calculate_grinding_time():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json
    try:
        length = float(data['length'])  # in mm
        width = float(data['width'])  # in mm
        feed = float(data['feed'])  # in mm/pass
        total_depth = float(data['total_depth'])  # in mm
        depth_of_cut = float(data['depth_of_cut'])  # in mm
        table_speed = float(data['table_speed'])  # in mm/min
        setting_time = float(data['setting_time'])  # in minutes

        # Calculations
        time_per_pass = (length + 50) / table_speed
        number_of_passes = width / feed
        total_cuts = total_depth / depth_of_cut

        total_time_minutes = (time_per_pass * total_cuts * number_of_passes) + setting_time
        total_time_hours = total_time_minutes / 60

        return jsonify({
            "time_per_pass": round(time_per_pass, 2),
            "number_of_passes": round(number_of_passes, 2),
            "total_cuts": round(total_cuts, 2),
            "total_time_minutes": round(total_time_minutes, 2),
            "total_time_hours": round(total_time_hours, 2)
        })

    except (KeyError, ValueError) as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)
