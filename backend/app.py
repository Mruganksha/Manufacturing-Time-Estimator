from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

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
    shift_time_per_hole = float(data['shift_time_per_hole'])
    setup_time = float(data['setup_time'])

    cutting_area = (path_length + approach) * insert_height
    cutting_area_per_piece = cutting_area * num_passes

    if num_passes == 2:
        cutting_area_per_piece *= 1.25
    elif num_passes == 3:
        cutting_area_per_piece *= 1.50

    total_cutting_area = cutting_area_per_piece * num_items
    cutting_time = total_cutting_area / 900
    shift_time = num_items * num_holes * shift_time_per_hole
    total_time = cutting_time + shift_time + setup_time

    return jsonify({
        "cutting_area_per_piece": round(cutting_area_per_piece, 2),
        "total_cutting_area": round(total_cutting_area, 2),
        "cutting_time": round(cutting_time, 2),
        "shift_time": round(shift_time, 2),
        "setup_time": round(setup_time, 2),
        "total_time": round(total_time, 2)
    })


@app.route('/api/edm-time', methods=['POST', 'OPTIONS'])
def calculate_edm_time():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json
    try:
        length = float(data['length'])
        width = float(data['width'])
        height = float(data['height'])
        mrr = float(data['mrr'])

        volume_to_remove = length * width * height
        total_time = volume_to_remove / mrr

        return jsonify({
            "volume_to_remove": round(volume_to_remove, 2),
            "total_time": round(total_time, 2)
        })
    except (KeyError, ValueError) as e:
        return jsonify({"error": str(e)}), 400

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
