import time
import json
import yaml

import python.static_definitions as sd
import python.type_tools as tt

# from python.io_tools import json_io_handler

# data_io_handler = json_io_handler("data/content/p_data.json")


# Checking if everything is fine
# Data_IO_Handler("data/p_data.db", sd.SQL_COLUMNS_DATA)
import python.sqlite_io_tools as siot

#___________________________________

def get_rights(u_id):
    if u_id.split('.')[1] == '00':
        return sd.rights_dict["ULL"]
    elif u_id[0]=='0':
        return sd.rights_dict["Admin"]
    else:
        return sd.rights_dict["Stamm"]

def get_sub_rights(u_id, p_id, rights):
    if p_id[:4] == u_id:
        return rights["Eigen"]
    elif p_id[0] == u_id[0]:
        return rights["UL"]
    else:
        return rights["GL"]

def extract_data(p_input, sub_rights, min_level = 0):
    p_out = {}
    for field in p_input:
        if field == 'meta':
            continue
        elif field == 'Ausrichter':
            continue
        elif (field[:2] == "Z_") and (sub_rights.get("Zeiten", -1) >= min_level):
            p_out[field] = p_input[field]
        elif sub_rights.get(field, -1) >= min_level:
            p_out[field] = p_input[field]
    if len(p_out.keys()) and ("meta" in p_input):
        p_out["meta"] = p_input["meta"]
    elif p_input.get("meta","").startswith("Removed"):
        # this is necessary in order to accept removement statements without any further data
        p_out["meta"] = p_input["meta"]

    return p_out

def filter_removed(p_input, keep_no_meta=True):
    p_out = {}
    for p_id in p_input:
        if ("meta" not in p_input[p_id]):
            if keep_no_meta:
                p_out[p_id] = p_input[p_id]
            continue

        if not p_input[p_id]["meta"].startswith("Removed"):
            p_out[p_id] = p_input[p_id];

    return p_out

def validate_data(p_data):
    if type(p_data) != dict:
        return False

    for p_id in p_data:
        try:
            tt.assert_p_id(p_id)
        except TypeError:
            return False

    return True

#___________________________________

def load_data(u_info):
    try:
        u_id = u_info["u_id"]
        tt.assert_u_id(u_id)
    except:
        return None

    rights = get_rights(u_id)

    # if u_id[0] == "0":
    #     p_data = siot.data_io_handler.load_data_all()
    # elif u_id[2:4] == "00":
    #     p_data = siot.data_io_handler.load_data_many_by_ul_id(u_id[0])
    # else:
    #     p_data = siot.data_io_handler.load_data_many_by_u_id(u_id)
    p_data = siot.data_io_handler.load_data_all()
    p_data = filter_removed(p_data)

    p_data_pull = {}
    for p_id in p_data:
        sub_rights = get_sub_rights(u_id, p_id, rights)
        if len(sub_rights.keys()) == 0:
            continue

        p_data_pull[p_id] = extract_data(p_data[p_id], sub_rights)

        if len(p_data_pull[p_id].keys()):
            try:
                p_data_pull[p_id]['Ausrichter'] = siot.user_io_handler.load_data_by_x_id(p_id[:4])['Name'];
            except:
                p_data_pull[p_id]['Ausrichter'] = '* unknown/deleted user *';

    return p_data_pull

def save_data(u_info, p_data_push):
    u_id = u_info["u_id"]
    rights = get_rights(u_id)

    p_updates = {}
    for p_id in p_data_push:
        sub_rights = get_sub_rights(u_id, p_id, rights)

        p_change = extract_data(p_data_push[p_id], sub_rights, 1)
        # in theory this should extract only the writable parts

        if (len(p_change.keys())==0):
            continue

        p_updates[p_id] = p_change

    siot.data_io_handler.update_data(p_updates)