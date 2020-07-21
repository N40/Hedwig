# USER TOOLS
V_key_exists = {
    "ASQW12": True,
    "asdf"  : False
}

V_id_exists = {
    "1.00"  : True,
    "1.23"  : True,
    "1.99"  : False,
    "1.2"   : None,
    "1.234" : None
}

V_load_user_information = {
    "": None,
    "Y1X2C3": {
        'u_id':'1.23', 'Name':'ul1_BspStamm', 'Verband':'V2', 'meta':'meta_1.23', 'Unterlager': 'Espuertes'
    },
    "POIUZT": {
        'u_id':'1.23', 'Name':'ul1_BspStamm', 'Verband':'V2', 'meta':'meta_1.23', 'Unterlager': 'Espuertes'
    },
    "Y1X2C3:": None,
    "Y1X2C3:POIUZT": None,
    "y1x2c3": None,
}

V_load_user_dict = {
    '1.23':{
        'u_info' : {'u_id':'1.23'},
        'res':     {}
    },
    '1.99':{
        'u_info' : {'u_id':'1.99'},
        'res':     {}
    },
    '1.00':{
        'u_info': {'u_id':'1.00', },
        'res':    {
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
        },
    },
    '2.00':{
        'u_info': {'u_id':'2.00', },
        'res':    {
            '2.00': {'Keys': ':4R5T5T:',
                'Name': 'ul2_Leitung',
                'Unterlager': 'Wasteland',
                'Verband': 'V3',
                'meta': 'meta_2.00'
            },
        },
    }
}

V_update_user_dict = {
    # negative
    "1.23->1.00":{
        "mod": {
            "u_info" :{'u_id':'1.23'},
            "arg":    {
                '1.23': {'Name': 'ul1_BspStamm_modified'},
            },
        },
        "check": {
            "u_info" :{'u_id':'1.00'},
            "res":    {
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
            },
        }
    },
    # negative
    "2.00->1.00":{
        "mod": {
            "u_info" :{'u_id':'2.00'},
            "arg":    {
                '1.23': {'Name': 'ul1_BspStamm_modified'}
            }
        },
        "check":  {
            "u_info": {'u_id':'1.00'},
            "res":    {
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
        }
    },
    # positive
    "1.00->1.00":{
        "mod": {
            "u_info" : {'u_id':'1.00'},
            "arg":     {
                '1.23': {'Name': 'ul1_BspStamm_modified'}
            }
        },
        "check":  {
            "u_info": {'u_id':'1.00'},
            "res":    {
                '1.00': {'Keys': ':AQSWDE:',
                        'Name': 'ul1_Leitung',
                        'Verband': 'V1',
                        'Unterlager': 'Espuertes',
                        'meta': 'meta_1.00'},
                '1.23': {'Keys': ':Y1X2C3:POIUZT:',
                        'Name': 'ul1_BspStamm_modified',
                        'Verband': 'V2',
                        'Unterlager': 'Espuertes',
                        'meta': 'meta_1.23'},
            }
        }
    },
    # positive
    "0.__->1.00":{
        "mod": {
            "u_info": {'u_id':'0.__'},
            "arg": {
                '1.00': {'Name': 'ul1_Leitung_modified'}
            }
        },
        "check":  {
            "u_info": {'u_id':'1.00'},
            "res": {
                '1.00': {'Keys': ':AQSWDE:',
                        'Name': 'ul1_Leitung_modified',
                        'Verband': 'V1',
                        'Unterlager': 'Espuertes',
                        'meta': 'meta_1.00'},
                '1.23': {'Keys': ':Y1X2C3:POIUZT:',
                        'Name': 'ul1_BspStamm_modified',
                        'Verband': 'V2',
                        'Unterlager': 'Espuertes',
                        'meta': 'meta_1.23'},
            }
        }
    },
}


# DATA TOOLS
V_load_data = {
    # fail cases
    "inv_0": {
        "u_info" : "1.23",
        "res":    None
    },
    "inv_1": {
        "u_info": {'a':'b'},
        "res":    None
    },
    "inv_2": {
        "u_info": {'u_id':''},
        "res":    None
    },
    "inv_3": {
        "u_info": {'u_id':'1.x'},
        "res":    None
    },

    # empty cases
    "3.99": {
        "u_info": {'u_id':'3.99'},
        "res":    {}
    },

    # success cases
    "1.23": {
        "u_info": {'u_id':'1.23'},
        "res":   {
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

    "1.00": {
        "u_info": {'u_id':'1.00'},
        "res":    {
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
            '1.00.r1': {'Kurztext': 'KT_r1',
                        'Langtext': 'LT_r1',
                        'Titel': 'Titel_r1',
                        'Ausrichter': 'ul1_Leitung',
                        'meta': 'meta_1.00.r1'},
            '1.78.i5': {},
            '2.45.u4': {'Kurztext': 'KT_u4',
                    'Langtext': 'LT_u4',
                    'Titel': 'Titel_u4',
                    'Ausrichter': '* unknown/deleted user *',
                    'meta': 'meta_2.45.u4'}
        }
    },

    "1.99": {
        "u_info": {'u_id':'1.99'},
        "res":    {
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
            '1.00.r1': {'Kurztext': 'KT_r1',
                        'Langtext': 'LT_r1',
                        'Titel': 'Titel_r1',
                        'Ausrichter': 'ul1_Leitung',
                        'meta': 'meta_1.00.r1'},
            '1.78.i5': {}
        }
    },

    "2.33": {
        "u_info": {'u_id':'2.33'},
        "res":    {
            '2.45.u4': {'Kurztext': 'KT_u4',
                        'Langtext': 'LT_u4',
                        'Titel': 'Titel_u4',
                        'Ausrichter': '* unknown/deleted user *',
                        'meta': 'meta_2.45.u4'}
        }
    },
}

V_load_data_head = {
    "0.__": {
        "u_info": {'u_id':'0.__'},
        "head": ['1.00.r1', '1.23.t2', '1.23.z3', '2.45.u4', '1.78.i5']
    },
    "3.00": {
        "u_info": {'u_id':'3.00'},
        "head": ['1.00.r1', '1.23.t2', '1.23.z3', '2.45.u4', '1.78.i5']
    }
}

V_save_data_mod = {
    # negative
    "1.23->1.23_Geld_Anfrage": { # invalid input
        "u_info_mod":   {'u_id':'1.23'},
        "mod": 3.1415,
        "u_info_check": {'u_id':'1.23'},
        "modified": False
    },
    "1.23->1.23_Geld_Anfrage": { # nonexisting column
        "u_info_mod":   {'u_id':'1.23'},
        "mod": {'1.23.t2': {'Wrong': 'Right'}},
        "u_info_check": {'u_id':'1.23'},
        "modified": False
    },
    "1.23->1.23_Geld_Anfrage": { # invalid value (double)
        "u_info_mod":   {'u_id':'1.23'},
        "mod": {'1.23.t2': {'Titel': 3.1415}},
        "u_info_check": {'u_id':'1.23'},
        "modified": False
    },
    "1.23->1.23_Geld_Anfrage": { # invalid value (None)
        "u_info_mod":   {'u_id':'1.23'},
        "mod": {'1.23.t2': {'Titel': None}},
        "u_info_check": {'u_id':'1.23'},
        "modified": False
    },

    "1.00->1.23_Titel": { # no right
        "u_info_mod":   {'u_id':'1.00'},
        "mod":          {'1.23.t2': {'Titel': 'Titel_t2_modified'}},
        "u_info_check": {'u_id':'1.23'},
        "modified": False
        # i.e. 1.00 can not overwrite 'Titel' owned by 1.23'
    },
    "1.00->1.23_Geld_Anfrage": { # no right
        "u_info_mod":   {'u_id':'1.00'},
        "mod": {'1.23.t2': {'Geld_Anfrage': 'Modified_Value'}},
        "u_info_check": {'u_id':'1.23'},
        "modified": False
    },
    "1.23->1.23_Geld_Limit": { # no right
        "u_info_mod":   {'u_id':'1.23'},
        "mod": {'1.23.t2': {'Geld_Limit': 'Modified_Value'}},
        "u_info_check": {'u_id':'1.23'},
        "modified": False
    },
    "1.23->1.23_zero": { # ignore statics
        "u_info_mod":   {'u_id':'1.23'},
        "mod": {'1.23.t2': {}},
        "u_info_check": {'u_id':'1.23'},
        "modified": False
    },
    "1.23->1.23_meta": { # ignore meta on statics
        "u_info_mod":   {'u_id':'1.23'},
        "mod": {'1.23.t2': {"meta": "Modified_Value"}},
        "u_info_check": {'u_id':'1.23'},
        "modified": False
    },
    "1.23->1.23_Geld_Anfrage": { # This date does not exist
        "u_info_mod":   {'u_id':'1.23'},
        "mod": {'1.23.t2': {'Z_BT_XX': 'Modified_Value'}},
        "u_info_check": {'u_id':'1.23'},
        "modified": False
    },

    #positive
    "1.23->1.23_Titel": { # own property
        "u_info_mod":   {'u_id':'1.23'},
        "mod": {'1.23.t2': {'Titel': 'Titel_t2_modified'}},
        "u_info_check": {'u_id':'1.23'},
        "modified": True
        # i.e. 1.23 can overwrite 'Titel' of its own p_data
    },
    "1.23->1.23_Geld_Anfrage": { # own property
        "u_info_mod":   {'u_id':'1.23'},
        "mod": {'1.23.t2': {'Geld_Anfrage': 'Modified_Value'}},
        "u_info_check": {'u_id':'1.23'},
        "modified": True
    },
    "1.00->1.23_Geld_Limit": { # rightful ULL power
        "u_info_mod":   {'u_id':'1.00'},
        "mod": {'1.23.t2': {'Geld_Limit': 'Modified_Value'}},
        "u_info_check": {'u_id':'1.23'},
        "modified": True
    },
    "1.23->1.23_Geld_Anfrage": { # modification of valid date
        "u_info_mod":   {'u_id':'1.23'},
        "mod": {'1.23.t2': {'Z_BT_08_08': 'Modified_Value'}},
        "u_info_check": {'u_id':'1.23'},
        "modified": True
    },

}

V_save_data_format = {
    "special_chars": {
        "u_info" : {'u_id':'1.23'},
        "p_id": '1.23.t2',
        "field": 'Titel',
        "in_value" : "Titel_x9_withøłÐ_трудный_Wörterß?_crée",
        "out_value": "Titel_x9_withøłÐ_трудный_Wörterß?_crée"
    },
    "escape_chars": {
        "u_info" : {'u_id':'1.23'},
        "p_id": '1.23.t2',
        "field": 'Titel',
        "in_value" : "\n \\ <br> ^´ \"\" \\",
        "out_value": "\n \\ <br> ^´ \"\" \\"
    },
}