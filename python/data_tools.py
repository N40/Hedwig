import time
import json
import yaml

import python.static_definitions as sd

# from python.io_tools import json_io_handler

# data_io_handler = json_io_handler("data/content/p_data.json")

from python.sqlite_io_tools import Data_IO_Handler
data_io_handler = Data_IO_Handler("data/p_data.db")
# Checking if everything is fine
# Data_IO_Handler("data/p_data.db", sd.SQL_COLUMNS_DATA)

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
        p_out["meta"] = p_input.get("meta","")

    return p_out

#___________________________________

def load_data(u_info):

    u_id = u_info["u_id"]
    rights = get_rights(u_id)

    if u_id[0] == "0":
        p_data = data_io_handler.load_data_all()
    elif u_id[2:4] == "00":
        p_data = data_io_handler.load_data_many_by_ul_id(u_id[0])
    else:
        p_data = data_io_handler.load_data_many_by_u_id(u_id)

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

    data_io_handler.update_data(p_updates)