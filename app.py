
#!/bin/python3
from flask import Flask, jsonify, render_template, request, redirect, url_for, after_this_request, send_from_directory


import time
import json

from python.data_tools import *
from python.user_tools import *

import python.static_definitions as sd
import python.sqlite_io_tools as siot

siot.init_data_io()
siot.init_user_io()


app = Flask(__name__)



#_____data_transfer_____#

@app.route("/data/pull_data")
def pull_data():
    # Server -> Client
    u_info = load_user_information(request.args.get("key"))
    if (u_info is None):
        return "invalid access-key", 403

    p_data = load_data(u_info)

    return p_data


@app.route("/data/push_data", methods=['GET', 'POST'])
def push_data():
    # Server <- Client
    if request.method != 'POST':
        return "invalid access-key", 403

    u_info = load_user_information(request.args.get("key"))
    if (u_info is None):
        return

    p_data_push = request.get_json()
    if validate_data(p_data_push) == False:
        return "invalid data payload", 403

    save_data(u_info, p_data_push)

    return "success"

#_____basic_comm_____#

@app.route("/get_server_time")
def get_server_time():
    return time.strftime("%d.%m.%Y, %H:%M")

@app.route("/login")
def login():
    key = request.args.get("key")
    answer = {"u_info": load_user_information(key)}
    return jsonify(answer)

@app.route("/logout")
def logout():
    # this function is for logging purpose only
    # (coming later)
    key = request.args.get("key")
    return "ok"

@app.route("/get_static_definitions")
def get_static_definitions():
    sdt = {
        'ti_days':          sd.ti_days,
        'unterlager_dict':  sd.unterlager_dict,
        'rights_dict':      sd.rights_dict,
        'infotafel_presets': sd.infotafel_presets
    }

    return f'static_definitions = {json.dumps(sdt, indent=4)}'

#_____user_manip_____#

@app.route("/user/pull_user_dict")
def pull_user_dict():
    # Server -> Client
    u_info = load_user_information(request.args.get("key"))
    if (u_info is None):
        return "invalid access-key", 403

    user_dict = load_user_dict(u_info)

    return jsonify(user_dict)

@app.route("/user/get_new_user_key")
def get_new_user_key():
    u_info = load_user_information(request.args.get("key"))
    if (u_info is None):
        return "invalid access-key", 403
    
    if u_info["u_id"][0] == '0':
        pass
    elif u_info["u_id"][2:] == '00':
        pass
    else:
        return "permission denied, are you ULL?", 403


    new_key = gen_new_key();
    return new_key

@app.route("/user/get_new_user_id")
def get_new_user_id():
    u_info = load_user_information(request.args.get("key"))
    if (u_info is None):
        return "invalid access-key", 403

    target_ul_id = str(request.args.get("tulid", 'X'))
    
    if u_info["u_id"][0] == '0':
        pass
    elif u_info["u_id"][2:] == '00':
        if(target_ul_id != str(u_info["u_id"][0])):
            return "permission denied for target UL-id ", 403
        pass
    else:
        return "permission denied, are you ULL?", 403


    new_u_id = gen_new_u_id(target_ul_id);
    return new_u_id



@app.route("/user/push_user_dict", methods=['GET', 'POST'])
def push_user_dict():
    # Server <- Client
    if request.method != 'POST':
        return "POST method required", 403

    u_info = load_user_information(request.args.get("key"))
    if (u_info is None):
        return "invalid access-key", 403
    
    user_dict = request.get_json()

    if validate_user_dict(user_dict) == False:
        return "invalid data payload", 403

    update_user_dict(u_info, user_dict)

    return "success"

#____print_list_frame__#
@app.route("/pl_frame")
def pl_frame():
    return render_template('pl_frame.html')



#_____main_routine_____#

@app.route("/")
def main():
    return render_template('main.html', reload = time.time())

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static','favicon.ico',mimetype='image/vnd.microsoft.icon')


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
    # app.run(debug=True)

