#!/usr/bin/python3

# got to the level of "app.py"
import os
import re

def setup_test_databases(dt, ut):
    import python._pytest.test_static_definitions as test_sd

    os.system("""
    cp python/_pytest/db_raws/test_p_data_0.db          python/_pytest/test_p_data.db
    cp python/_pytest/db_raws/test_user_data_0.db       python/_pytest/test_user_data.db
    cp python/_pytest/db_raws/test_key_graveyard_0.db   python/_pytest/test_key_graveyard.db
    """)

    dt.sd.data_db_location = test_sd.data_db_location
    dt.init_data_tools()

    ut.sd.user_db_location = test_sd.user_db_location
    ut.sd.key_graveyard_db_location = test_sd.key_graveyard_db_location
    ut.init_user_tools()

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
    import python.data_tools as dt
    import python.user_tools as ut
    setup_test_databases(dt, ut)

    assert dt.data_io_handler._db_location == "python/_pytest/test_p_data.db"
    assert ut.user_io_handler._db_location == "python/_pytest/test_user_data.db"
    assert ut.key_graveyard._db_location   == "python/_pytest/test_key_graveyard.db"

# USER TOOLS
def test_load_user_information():
    import python._pytest.test_static_definitions as test_sd
    import python.data_tools as dt
    import python.user_tools as ut
    setup_test_databases(dt, ut)

    assert ut.load_user_information("") is None
    assert ut.load_user_information("Y1X2C3") =={
        'u_id':'1.23', 'Name':'ul1_BspStamm', 'Verband':'V2', 'meta':'meta_1.23', 'Unterlager': 'Espuertes'}
    assert ut.load_user_information("Y1X2C3:") is None
    assert ut.load_user_information("Y1X2C3:POIUZT") is None
    assert ut.load_user_information("Y1X2C3") == ut.load_user_information("POIUZT")
    assert ut.load_user_information("y1x2c3") is None

def test_key_functions():
    import python.data_tools as dt
    import python.user_tools as ut
    setup_test_databases(dt, ut)

    new_key = ut.gen_new_key()
    assert bool(re.match(r"^[A-Z \d\W]{6}$",new_key))
    assert ut.key_exists(new_key)
    assert ut.key_exists("ASQW12")
    assert ut.key_exists("asdf") == False
    assert ut.key_exists(new_key[:5]) == False

    import numpy as np 
    alt_key = new_key[:5]+np.base_repr((np.int(new_key[5],base=36)+1)%36,base=36)
    assert ut.key_exists(alt_key) == False


def test_u_id_functions():
    import python.data_tools as dt
    import python.user_tools as ut
    setup_test_databases(dt, ut)

    new_id = ut.gen_new_u_id("3")
    assert bool(re.match(r'^\w.\w\w$', new_id))
    assert new_id != ut.gen_new_u_id("3")

    assert ut.id_exists(new_id)
    assert ut.id_exists("1.00")
    assert ut.id_exists("1.23")
    assert ut.id_exists("1.99") == False
    assert ut.id_exists("1.2") is None
    assert ut.id_exists("1.234") is None

def test_load_user_dict():
    import python.data_tools as dt
    import python.user_tools as ut
    setup_test_databases(dt, ut)

    assert ut.load_user_dict({'u_id':'1.23', }) == {}
    assert ut.load_user_dict({'u_id':'1.99', }) == {}
    assert ut.load_user_dict({'u_id':'1.00', }) == {
    '1.00': {'Keys': ':AQSWDE:',
            'Name': 'ul1_Leitung',
            'Verband': 'V1',
            'Unterlager': 'Espuertes',
            'meta': 'meta_1.00'},
    '1.23': {'Keys': ':Y1X2C3:POIUZT:',
            'Name': 'ul1_BspStamm',
            'Verband': 'V2',
            'Unterlager': 'Espuertes',
            'meta': 'meta_1.23'},
    }

    assert ut.load_user_dict({'u_id':'2.00', }) == {
    '2.00': {'Keys': ':4R5T5T:',
            'Name': 'ul2_Leitung',
            'Unterlager': 'Prismanien',
            'Verband': 'V3',
            'meta': 'meta_2.00'},
    }

    ut.update_user_dict({'u_id':'1.23'}, {
        '1.23': {'Name': 'ul1_BspStamm_modified',},
        })
    assert ut.load_user_dict({'u_id':'1.00', })['1.23']['Name'] ==\
        'ul1_BspStamm'

    ut.update_user_dict({'u_id':'2.00'}, {
        '1.23': {'Name': 'ul1_BspStamm_modified',},
        })
    assert ut.load_user_dict({'u_id':'1.00', })['1.23']['Name'] ==\
        'ul1_BspStamm'

    ut.update_user_dict({'u_id':'1.00'}, {
        '1.23': {'Name': 'ul1_BspStamm_modified',},
        })
    assert ut.load_user_dict({'u_id':'1.00', })['1.23']['Name'] ==\
        'ul1_BspStamm_modified'

    ut.update_user_dict({'u_id':'0.__'}, {
        '1.00': {'Name': 'ul1_Leitung_modified',},
        })
    assert ut.load_user_dict({'u_id':'1.00', })['1.00']['Name'] ==\
        'ul1_Leitung_modified'

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

def test_load_data():
    import python.data_tools as dt
    import python.user_tools as ut
    setup_test_databases(dt, ut)

    assert dt.load_data({'a':'b'}) is None
    assert dt.load_data({'u_id':''}) is None
    assert dt.load_data({'u_id':'1.x'}) is None
    assert dt.load_data({'u_id':'1.99'}) == {}
    assert dt.load_data({'u_id':'1.23'}) == {
    '1.23.t2': {'Kurztext': 'KT_t2',
                'Langtext': 'LT_t2',
                'Titel': 'Titel_t2',
                'meta': 'meta_1.23.t2'},
    '1.23.z3': {'Kurztext': 'KT_z3',
                'Langtext': 'LT_z3',
                'Titel': 'Titel_z3',
                'meta': 'meta_1.23.z3'}
    }
    assert dt.load_data({'u_id':'1.00'}) == {
    '1.23.t2': {'Kurztext': 'KT_t2',
                'Langtext': 'LT_t2',
                'Titel': 'Titel_t2',
                'meta': 'meta_1.23.t2'},
    '1.23.z3': {'Kurztext': 'KT_z3',
                'Langtext': 'LT_z3',
                'Titel': 'Titel_z3',
                'meta': 'meta_1.23.z3'},
    '1.00.r1': {'Kurztext': 'KT_r1',
                'Langtext': 'LT_r1',
                'Titel': 'Titel_r1',
                'meta': 'meta_1.00.r1'},
    '1.78.i5': {}
    }

    assert dt.load_data({'u_id':'2.00'}) == {
    '2.45.u4': {'Kurztext': 'KT_u4',
                'Langtext': 'LT_u4',
                'Titel': 'Titel_u4',
                'meta': 'meta_2.45.u4'}
    }

    assert list(dt.load_data({'u_id':'0.__'}).keys()) == \
        ['1.00.r1', '1.23.t2', '1.23.z3', '2.45.u4', '1.78.i5']


def test_save_data():
    import python.data_tools as dt
    import python.user_tools as ut
    setup_test_databases(dt, ut)

    # negative tests
    dt.save_data({'u_id':'1.00'}, {
    '1.23.t2':{'Titel': 'Titel_t2_modified'}
    })
    assert dt.load_data({'u_id':'1.23'})['1.23.t2']['Titel'] == 'Titel_t2'

    dt.save_data({'u_id':'2.45'}, {
    '1.23.t2':{'Titel': 'Titel_t2_modified'}
    })
    assert dt.load_data({'u_id':'1.23'})['1.23.t2']['Titel'] == 'Titel_t2'


    # positive tests
    dt.save_data({'u_id':'1.23'}, {
    '1.23.t2':{},
    })
    assert dt.load_data({'u_id':'1.23'})['1.23.t2']['Titel'] == 'Titel_t2'


    dt.save_data({'u_id':'1.23'}, {
    '1.23.t2':{'Titel': 'Titel_t2_modified'},
    '1.23.x9':{'Titel': 'Titel_x9_with_трудный_Wörterß?_crée'}
    })
    assert dt.load_data({'u_id':'1.23'})['1.23.t2']['Titel'] == 'Titel_t2_modified'
    assert dt.load_data({'u_id':'1.23'})['1.23.x9']['Titel'] == 'Titel_x9_with_трудный_Wörterß?_crée'

# SERVER ROUTES
# - this one does not look feasible hence it's difficult to pass arguments (without hacking it to much) -

