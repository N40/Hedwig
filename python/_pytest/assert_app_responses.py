V_login = [
    {
        "url": "/login",
        "j_res": {'u_info': None},
    },
    {
        "url": "/login?k=Y1X2C3",
        "j_res": {'u_info': None},
    },
    {
        "url": "/login?key=Y1X2C3",
        "j_res": {'u_info': {
                    'Name': 'ul1_BspStamm',
                    'Unterlager': 'Espuertes',
                    'Verband': 'V2',
                    'meta': 'meta_1.23',
                    'u_id': '1.23'}, }
    },

]

V_logout = [
    {
        "url": "/logout",
        "b_res": b"ok",
    },
    {
        "url": "/logout?key=123",
        "b_res": b"ok",
    },
    {
        "url": "/logout?key=Y1X2C3",
        "b_res": b"ok",
    }
]

V_master_musthave = [
    "<title>HEDWIG - FM2020 Programm-Info transfer Platform</title>",
]

V_master_donthave = [
    # escape string-mining algorithms
    '{}@{}.{}'.format("nano","farbenmEEHr2020","de"),
    '{}{}@{}.{}'.format("nathanael","Weinrich","gmx","de")
]

from python.static_definitions import MASTERKEY
V_backdoor = [
    {
        "url": f"/login?key={MASTERKEY}",
        "j_res": {'u_info': {
            'Name': 'AdminBackdoor',
            'Unterlager': 'Admin',
            'u_id': '0.__'} },
    }
]


V_data_pull_data_positive = [
    {
        "url": "/data/pull_data?key=Y1X2C3",
        "j_res": {
            '1.00.r1': {'Ausrichter': 'ul1_Leitung',
                        'Kurztext': 'KT_r1',
                        'Langtext': 'LT_r1',
                        'Titel': 'Titel_r1',
                        'meta': 'meta_1.00.r1'},
            '1.23.t2': {'Kurztext': 'KT_t2',
                        'Langtext': 'LT_t2',
                        'Titel': 'Titel_t2',
                        'Ausrichter': 'ul1_BspStamm',
                        'meta': 'meta_1.23.t2'},
            '1.23.z3': {'Kurztext': 'KT_z3',
                        'Langtext': 'LT_z3',
                        'Titel': 'Titel_z3',
                        'Ausrichter': 'ul1_BspStamm',
                        'meta': 'meta_1.23.z3'},
            '1.78.i5': {}
        }
    },
]

V_data_pull_data_negative = [
    {
        "url": "/data/pull_data",
    },
    {
        "url": "/data/pull_data?key=123",
    },
    {
        "url": "/data/pull_data?key=y1x2c3",
    },
    {
        "url": "/data/pull_data?k=Y1X2C3",
    }
]

V_data_push_data_positive = [
    {
        "url": "/data/push_data?key=Y1X2C3",
        "p_data": {},
    },
    {
        "url": "/data/push_data?key=Y1X2C3",
        "p_data": {'1.23.z3': {
                        'Titel': 'Titel_z3_Modified',}
        },
    },
]

V_data_push_data_negative = [
    {
        "url": "/data/push_data?key=Y1X2C3",
        "p_data": {"a":"b"},
    },
    {
        "url": "/data/push_data?key=Y1X2C3",
        "p_data": None,
    },
    {
        "url": "/data/push_data?key=Y1X2C3",
        "p_data": "String",
    },
]

V_data_push_pull_modification = [
    {
        "url_push": "/data/push_data?key=Y1X2C3",
        "url_pull": "/data/pull_data?key=Y1X2C3",
        "p_data_push": {
            '1.00.r1': {'Titel': 'Titel_r1_Modified'},
            '1.23.t2': {'Titel': 'Titel_t2_Modified'},
            '1.23.z3': {'meta': 'Removed at [dd.mm.yyyy, hh:mm] by user-id [a.bc]'}
        },
        "p_data_pull": {
            '1.00.r1': {'Ausrichter': 'ul1_Leitung',
                        'Kurztext': 'KT_r1',
                        'Langtext': 'LT_r1',
                        'Titel': 'Titel_r1',
                        'meta': 'meta_1.00.r1'},
            '1.23.t2': {'Kurztext': 'KT_t2',
                        'Langtext': 'LT_t2',
                        'Titel': 'Titel_t2_Modified',
                        'Ausrichter': 'ul1_BspStamm',
                        'meta': 'meta_1.23.t2'},
            '1.78.i5': {},
        },
    },
]

V_static_definition_keys = [
    "unterlager_dict",
    "ti_days",
    "rights_dict",
]

V_user_get_new_user_key_url_positive = [
    "/user/get_new_user_key?key=AQSWDE",
    "/user/get_new_user_key?key="+MASTERKEY,
]

V_user_get_new_user_key_url_negative = [
    "/user/get_new_user_key",
    "/user/get_new_user_key?key=aqswde",
    "/user/get_new_user_key?key=AQS",
    "/user/get_new_user_key?key=Y1X2C3",
]

V_user_get_new_user_id_url_positive = [
    "/user/get_new_user_id?key=AQSWDE&tulid=1",
    "/user/get_new_user_id?key="+MASTERKEY+"&tulid=0",
    "/user/get_new_user_id?key="+MASTERKEY+"&tulid=1",
]

V_user_get_new_user_id_url_negative = [
    "/user/get_new_user_id",
    "/user/get_new_user_id?key=aqswde",
    "/user/get_new_user_id?key=AQS",
    "/user/get_new_user_id?key=Y1X2C3",
    "/user/get_new_user_id?key=AQSWDE&tulid=0",
    "/user/get_new_user_id?key=AQSWDE",
]

# PUSH PULL USER_DICT
V_user_pull_user_dict_positive = [
    {
        "url":  "/user/pull_user_dict?key=AQSWDE",
        "j_res": {
            '1.00':  {'Keys': ':AQSWDE:',
                      'Name': 'ul1_Leitung',
                      'Unterlager': 'Espuertes',
                      'Verband': 'V1',
                      'meta': 'meta_1.00'},
             '1.23': {'Keys': ':Y1X2C3:POIUZT:',
                      'Name': 'ul1_BspStamm',
                      'Unterlager': 'Espuertes',
                      'Verband': 'V2',
                      'meta': 'meta_1.23'}
        }
    },
    {
        "url":  "/user/pull_user_dict?key="+MASTERKEY,
        "j_res": {
            '1.00': {'Keys': ':AQSWDE:',
                      'Name': 'ul1_Leitung',
                      'Unterlager': 'Espuertes',
                      'Verband': 'V1',
                      'meta': 'meta_1.00'},
            '1.23': {'Keys': ':Y1X2C3:POIUZT:',
                      'Name': 'ul1_BspStamm',
                      'Unterlager': 'Espuertes',
                      'Verband': 'V2',
                      'meta': 'meta_1.23'},
            '2.00': {'Keys': ':4R5T5T:',
                     'Name': 'ul2_Leitung',
                     'Unterlager': 'Wasteland',
                     'Verband': 'V3',
                     'meta': 'meta_2.00'}
        }
    },
    {
        "url":  "/user/pull_user_dict?key=Y1X2C3",
        "j_res": {},
    }

]

V_user_pull_user_dict_negative = [
    { "url":  "/user/pull_user_dict" },
    { "url":  "/user/pull_user_dict?key=Y1X2" },
]



V_user_push_user_dict_positive = [
    {
        "url_push": "/user/push_user_dict?key=AQSWDE",
        "ud_push": {},
    },
]

V_user_push_user_dict_negative = [
    {
        "url_push": "/user/push_user_dict?key=AQSWDE",
        "ud_push": {'a': 'b'},
    },
    {
        "url_push": "/user/push_user_dict?key=AQSWDE",
        "ud_push": None,
    },
]



V_user_push_pull_mod = [
    {
        "url_push": "/user/push_user_dict?key=AQSWDE",
        "url_pull": "/user/pull_user_dict?key=AQSWDE",
        "ud_push": {
            '1.23':  {'Name': 'ul1_BspStamm_Modified',}
        },
        "ud_pull": {
            '1.00':  {'Keys': ':AQSWDE:',
                      'Name': 'ul1_Leitung',
                      'Unterlager': 'Espuertes',
                      'Verband': 'V1',
                      'meta': 'meta_1.00'},
             '1.23': {'Keys': ':Y1X2C3:POIUZT:',
                      'Name': 'ul1_BspStamm_Modified',
                      'Unterlager': 'Espuertes',
                      'Verband': 'V2',
                      'meta': 'meta_1.23'}
        }
    },
    {
        "url_push": "/user/push_user_dict?key=AQSWDE",
        "url_pull": "/user/pull_user_dict?key=NEWKEY",
        "ud_push": {
            '1.00':  {'Keys': ':AQSWDE:NEWKEY:'}
        },
        "ud_pull": {
            '1.00':  {'Keys': ':AQSWDE:NEWKEY:',
                      'Name': 'ul1_Leitung',
                      'Unterlager': 'Espuertes',
                      'Verband': 'V1',
                      'meta': 'meta_1.00'},
             '1.23': {'Keys': ':Y1X2C3:POIUZT:',
                      'Name': 'ul1_BspStamm_Modified',
                      'Unterlager': 'Espuertes',
                      'Verband': 'V2',
                      'meta': 'meta_1.23'}
        }
    },
    {
        "url_push": "/user/push_user_dict?key=Y1X2C3",
        "url_pull": "/user/pull_user_dict?key=AQSWDE",
        "ud_push": {
            '1.00':  {'Name': 'ul1_Leitung_Modified',}
        },
        "ud_pull": {
            '1.00':  {'Keys': ':AQSWDE:NEWKEY:',
                      'Name': 'ul1_Leitung',
                      'Unterlager': 'Espuertes',
                      'Verband': 'V1',
                      'meta': 'meta_1.00'},
             '1.23': {'Keys': ':Y1X2C3:POIUZT:',
                      'Name': 'ul1_BspStamm_Modified',
                      'Unterlager': 'Espuertes',
                      'Verband': 'V2',
                      'meta': 'meta_1.23'}
        }
    },
    {
        "url_push": "/user/push_user_dict?key=AQSWDE",
        "url_pull": "/user/pull_user_dict?key=AQSWDE",
        "ud_push": {
            '1.00':  {'Keys': ''}
        },
        "ud_pull": None,
    }
]