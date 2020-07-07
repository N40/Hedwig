import time
import json
import yaml

import python.static_definitions as sd
from python.io_tools import json_io_handler

data_io_handler = json_io_handler("data/content/p_data.json")

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
        elif (field[:2] == "Z_") and (sub_rights.get("Zeiten", -1) >= min_level):
            p_out[field] = p_input[field]
        elif sub_rights.get(field, -1) >= min_level:
            p_out[field] = p_input[field]
    if len(p_out.keys()):
        p_out["meta"] = p_input.get("meta",{})

    return p_out

#___________________________________

def load_data(u_info):
    # p_data = yaml.safe_load(open("data/content/p_data.json", "r"))
    p_data = data_io_handler.load()

    u_id = u_info["u_id"]
    rights = get_rights(u_id)

    p_data_pull = {}
    for p_id in p_data:
        sub_rights = get_sub_rights(u_id, p_id, rights)
        if len(sub_rights.keys()) == 0:
            continue

        p_data_pull[p_id] = extract_data(p_data[p_id], sub_rights)

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

    # p_data = yaml.safe_load(open("data/content/p_data.json", "r"))
    # for p_id in p_updates:
    #     if p_id not in p_data:
    #         p_data[p_id] = {}
    #     p_data[p_id].update(p_updates[p_id])

    # open("data/content/p_data.json", "w").write(json.dumps(p_data, indent=4))

    data_io_handler.save(p_updates)