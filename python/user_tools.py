import json
import yaml
import time
from numpy import base_repr
from numpy.random import random as rand

import python.static_definitions as sd

# from python.io_tools import json_io_handler
# user_io_handler = json_io_handler("data/users/user_dict.json")
# uklu_io_handler = io_handler("data/users/user_key_list_used")

import python.sqlite_io_tools as siot


#______________________________

def load_user_information(key):
    # user_dict = user_io_handler.load()
    # u_info = {}
    # for u_id in user_dict:
    #     if (len(user_dict[u_id].keys())==0):
    #         continue

    #     if (key in user_dict[u_id]["Keys"]):
    #         u_info["u_id"] = u_id
    #         u_info["Name"] = user_dict[u_id]["Name"]
    #         u_info["Verband"] = user_dict[u_id]["Verband"]
    #         u_info["Unterlager"] = sd.unterlager_dict[int(u_id[0])]
    #         return u_info

    # backdoor (in case of non-functional or empty user-database)
    if (key == sd.MASTERKEY):
        return {
            "u_id": "0.__",
            "Name": "AdminBackdoor",
            "Unterlager": sd.unterlager_dict[0],
        }
    
    u_info = siot.user_io_handler.fetch_u_info_by_key(key)
    if u_info is not None:
        u_info["Unterlager"] = sd.unterlager_dict[int(u_info["u_id"][0])]
        return u_info

    
    return None



def gen_new_key(ul_id = 'X'):
    # ul_id is deprecated here
    key = (''.join([base_repr (int(rand()*36),36) for i in range(5)]) + ul_id[0]).upper()
    while key_exists(key):
        key = (''.join([base_repr (int(rand()*36),36) for i in range(5)]) + ul_id[0]).upper()

    # used_keys_dict = yaml.safe_load(open("data/users/user_key_list_used.json", "r"))
    # used_keys_dict["X_used_keys"].append(key);
    # open("data/users/user_key_list_used.json", "w").write(json.dumps(used_keys_dict, indent=4))

    key_graveyard.add_key(key)

    return key

def key_exists(key):
    # used_keys = yaml.safe_load(open("data/users/user_key_list_used.json", "r"))["X_used_keys"]
    # if (key in used_keys):
    #     return True

    # user_dict = user_io_handler.load()
    # for u_id in user_dict:
    #     if len(user_dict[u_id].keys()):
    #         if (key in user_dict[u_id]["Keys"]):
    #             return True

    if (siot.user_io_handler.fetch_u_info_by_key(key) is not None):
        return True;
    elif (key_graveyard.check_for_key(key)):
        return True

    return False

def id_exists(u_id):
    # user_dict = user_io_handler.load()
    # return (new_id in user_dict)
    return siot.user_io_handler._check_for_id(u_id)

def gen_new_u_id(ul_id):
    if (ul_id == "X"):
        return

    new_id = (f'{ul_id}.{base_repr(int(rand()*35*36 + 36),36)}').lower()
    while id_exists(new_id):
        new_id = (f'{ul_id}.{base_repr(int(rand()*35*36 + 36),36)}').lower()

    # user_dict = yaml.safe_load(open("data/users/user_dict.json", "r"))
    # user_dict[new_id]={};
    # open("data/users/user_dict.json", "w").write(json.dumps(user_dict, indent=4))
    # user_io_handler.save({new_id:{}})

    siot.user_io_handler.update_data({
        new_id:{'meta': f'uninvoced id, created at {time.strftime("%d.%m.%Y, %H:%M")}'}
    })

    return new_id


def load_user_dict(u_info):
    # user_dict = yaml.safe_load(open("data/users/user_dict.json", "r"))
    # user_dict = user_io_handler.load()

    u_id = u_info['u_id']
    #client_u_id = u_id

    # if (client_u_id[0] == '0'):
    #     return user_dict

    # reduced_user_dict = {}
    # if (client_u_id[2:]=='00'):
    #     for u_id in user_dict:
    #         if (u_id[0] == client_u_id[0]):
    #             reduced_user_dict[u_id] = user_dict[u_id]
        
    #     return reduced_user_dict


    if u_id[0] == "0":
        p_data = siot.user_io_handler.load_data_all()
    elif u_id[2:4] == "00":
        p_data = siot.user_io_handler.load_data_many_by_ul_id(u_id[0])
    else:
        p_data = {}

    for u_id in p_data:
        p_data[u_id]["Unterlager"] = sd.unterlager_dict[int(u_id[0])]

    return p_data


def update_user_dict(u_info, user_dict_push):
    client_u_id = u_info["u_id"]

    user_dict_updates = {}
    if (client_u_id[0] == '0'):
        user_dict_updates = user_dict_push

    elif (client_u_id[2:]=='00'):
        for u_id in user_dict_push:
            if (u_id[0] == client_u_id[0]):
                user_dict_updates[u_id] = user_dict_push[u_id]

    else:
        return

    # user_io_handler.save(user_dict_updates)
    siot.user_io_handler.update_data(user_dict_updates)
