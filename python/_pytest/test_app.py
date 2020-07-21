#!/usr/bin/python3

# got to the level of "app.py"
import os
import re
import json

def setup_test_databases():
    import python._pytest.test_static_definitions as test_sd

    os.system("""
    cp python/_pytest/db_raws/test_p_data_0.db          python/_pytest/test_p_data.db
    cp python/_pytest/db_raws/test_user_data_0.db       python/_pytest/test_user_data.db
    cp python/_pytest/db_raws/test_key_graveyard_0.db   python/_pytest/test_key_graveyard.db
    """)

    # dt.sd.data_db_location = test_sd.data_db_location
    # dt.init_data_tools()

    # ut.sd.user_db_location = test_sd.user_db_location
    # ut.sd.key_graveyard_db_location = test_sd.key_graveyard_db_location
    # ut.init_user_tools()
    import python.sqlite_io_tools as siot
    siot.sd.data_db_location = test_sd.data_db_location
    siot.sd.user_db_location = test_sd.user_db_location
    siot.sd.key_graveyard_db_location = test_sd.key_graveyard_db_location

    siot.init_data_io()
    siot.init_user_io()

    return siot

def setup_test_ut_dt(siot):
    import python.data_tools as dt
    import python.user_tools as ut
    dt.siot = siot
    ut.siot = siot
    return ut, dt

def hash_dict(dict):
    hash_value = hash(json.dumps(dict, indent=4, sort_keys=True))

# __ TESTING __
# MASTER STUFF
def test_imports():

    from flask import Flask, jsonify, render_template, request, redirect, url_for, after_this_request, send_from_directory

    import time
    import json
    import sqlite3
    import re

    import python.data_tools as dt
    import python.user_tools as ut
    import python.static_definitions as sd
    import python.type_tools

    # Asserting python 3.6 or higher
    import sys
    assert (sys.version.split(".")[0] == "3" and int(sys.version.split(".")[1])>=6)

def test_mock_databases():
    siot = setup_test_databases()
    ut, dt = setup_test_ut_dt(siot)

    assert siot.data_io_handler._db_location == "python/_pytest/test_p_data.db"
    assert siot.user_io_handler._db_location == "python/_pytest/test_user_data.db"
    assert siot.key_graveyard._db_location   == "python/_pytest/test_key_graveyard.db"

# USER TOOLS

def test__key_exists():
    siot = setup_test_databases()
    ut, dt = setup_test_ut_dt(siot) 
    import python._pytest.assert_dict_values as adv

    for key in adv.V_key_exists:
        assert ut.key_exists(key) == adv.V_key_exists[key]

def test__gen_new_key():
    siot = setup_test_databases()
    ut, dt = setup_test_ut_dt(siot)

    new_key = ut.gen_new_key()
    assert bool(re.match(r"^[A-Z \d\W]{6}$",new_key))
    assert ut.key_exists(new_key)
    assert ut.key_exists(new_key[:5]) == False

    import numpy as np 
    alt_key = new_key[:5]+np.base_repr((np.int(new_key[5],base=36)+1)%36,base=36)
    assert ut.key_exists(alt_key) == False


def test__id_exists():
    siot = setup_test_databases()
    ut, dt = setup_test_ut_dt(siot) 
    import python._pytest.assert_dict_values as adv

    for x_id in adv.V_id_exists:
        assert ut.id_exists(x_id) == adv.V_id_exists[x_id]

def test__gen_new_u_id():
    siot = setup_test_databases()
    ut, dt = setup_test_ut_dt(siot) 

    new_id = ut.gen_new_u_id("3")
    assert bool(re.match(r'^\w.\w\w$', new_id))
    assert new_id != ut.gen_new_u_id("3")
    assert ut.id_exists(new_id)



def test__load_user_information():
    siot = setup_test_databases()
    ut, dt = setup_test_ut_dt(siot) 

    import python._pytest.assert_dict_values as adv

    for key in adv.V_load_user_information:
        print(key)
        assert ut.load_user_information(key) ==\
            adv.V_load_user_information[key]

def test__load_user_dict():
    siot = setup_test_databases()
    ut, dt = setup_test_ut_dt(siot) 

    import python._pytest.assert_dict_values as adv

    for case in adv.V_load_user_dict:
        print(case)
        assert ut.load_user_dict(adv.V_load_user_dict[case]["u_info"]) ==\
            adv.V_load_user_dict[case]["res"]

def test__update_user_dict():
    siot = setup_test_databases()
    ut, dt = setup_test_ut_dt(siot) 

    import python._pytest.assert_dict_values as adv

    for case in adv.V_update_user_dict:
        print(case)
        ut.update_user_dict(
            adv.V_update_user_dict[case]["mod"]["u_info"],
            adv.V_update_user_dict[case]["mod"]["arg"],
        )
        assert ut.load_user_dict(
            adv.V_update_user_dict[case]["check"]["u_info"] ) ==\
            adv.V_update_user_dict[case]["check"]["res"]
# DATA TOOLS
# def test_get_rights():
#     import python.data_tools as dt
#     import python.user_tools as ut
#     setup_test_databases(dt, ut)

# def test_get_sub_rights():
#     import python.data_tools as dt
#     import python.user_tools as ut
#     setup_test_databases(dt, ut)

# def test_extract_data():
#     import python.data_tools as dt
#     import python.user_tools as ut
#     setup_test_databases(dt, ut)

def test__load_data():
    siot = setup_test_databases()
    ut, dt = setup_test_ut_dt(siot)
    import python._pytest.assert_dict_values as adv

    for case in adv.V_load_data:
        assert dt.load_data(
            adv.V_load_data[case]["u_info"]) ==\
            adv.V_load_data[case]["res"]


    for case in adv.V_load_data_head:
        assert list(dt.load_data(
            adv.V_load_data_head[case]["u_info"] )) ==\
            adv.V_load_data_head[case]["head"]

def test__save_data():
    siot = setup_test_databases()
    ut, dt = setup_test_ut_dt(siot)
    import python._pytest.assert_dict_values as adv

    for case in adv.V_save_data_mod:
        u_info_mod, mod_data, u_info_check, modified =\
            [adv.V_save_data_mod[case][k] for k in adv.V_save_data_mod[case]]

        old_state = dt.load_data(u_info_check)
        dt.save_data(u_info_mod, mod_data)
        new_state = dt.load_data(u_info_check)

        print(f"case: {case} \n:",u_info_mod, mod_data, u_info_check, modified)
        # assert (old_state != new_state) == modified
        if modified:
            assert old_state != new_state
        else:
            assert old_state == new_state

    for case in adv.V_save_data_format:
        u_info, p_id, field, in_value, out_value =\
            [adv.V_save_data_format[case][k] for k in adv.V_save_data_format[case]]

        dt.save_data(u_info, {p_id: {field: in_value}})
        assert dt.load_data(u_info)[p_id][field] == out_value

# SERVER ROUTES
# - this one does not look feasible hence it's difficult to pass arguments (without hacking it to much) -

