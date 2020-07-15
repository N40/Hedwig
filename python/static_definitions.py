MASTERKEY = "57d8a58c5f974be54b90f05d201946df"

SQL_COLUMNS_DATA = [
    "p_id",
    "meta",
    "Titel",
    "Kurztext",
    "Langtext",
    "N_TN",
    #
    "Z_RZ_03_08",
    "Z_RZ_04_08",
    "Z_RZ_05_08",
    "Z_RZ_09_08",
    "Z_RZ_10_08",
    #
    "Z_BT_08_08",
    #
    "Z_WP_03_08",
    "Z_WP_04_08",
    "Z_WP_05_08",
    "Z_WP_09_08",
    "Z_WP_10_08",
]

SQL_COLUMNS_USER = [
    "u_id",
    "Name",
    "Verband",
    "Keys",
    "meta",
]

data_db_location = "data/p_data.db"
user_db_location = "data/user_data.db"
key_graveyard_db_location = "data/key_graveyard.db"


# -1 = everyone, [1,2,3] = ul #1,#2 and #3
ti_days = {
    # Ringezeit
    "Z_RZ_03_08": -1,
    "Z_RZ_04_08": -1,
    "Z_RZ_05_08": -1,
    "Z_RZ_09_08": -1,
    "Z_RZ_10_08": -1,
    # Besuchertag
    "Z_BT_08_08": -1,
    # Wahlprogramm
    "Z_WP_03_08": -1,
    "Z_WP_04_08": -1,
    "Z_WP_05_08": -1,
    "Z_WP_09_08": -1,
    "Z_WP_10_08": -1
}

unterlager_dict = {
    0: "Admin",
    1: "Espuertes",
    2: "Wasteland",
    3: "Brownsea Island"
}

Felder = [ 'Kurztext', 'Langtext', 'N_TN', 'Geld_Anfrage', 'Geld_Limit', 'Zeiten',]

# TODO: add server-side date-check. In theory this is taken care of at client side.

# -1 = hidden, 0 = readable, 1 = rightable
# Level 0: User, Level 1: Target
rights_dict = {
    "Stamm":{
        "Eigen": {
            'Kurztext'      : 1 , 
            'Titel'         : 1 ,
            'Langtext'      : 1 ,
            'N_TN'          : 1 , 
            'Geld_Anfrage'  : 1 , 
            'Geld_Limit'    : 0 ,
            'Zeiten'        : 1 ,
            'Ausrichter'    : 1 ,
        },
        "UL": {
            # Stamm ließt die inahltlichen Infos des eigenen ULs
            'Titel'         : 0 ,
            'Kurztext'      : 0 , 
            'Langtext'      : 0 , 
            'N_TN'          : 0 , 
            'Zeiten'        : 0 , 
            'Ausrichter'    : 0 ,
        },
        "GL": {
        }
    },
    "ULL":{
        "Eigen": {
            'Titel'         : 1 ,
            'Kurztext'      : 1 , 
            'Langtext'      : 1 , 
            'N_TN'          : 1 , 
            'Geld_Anfrage'  : 1 , 
            'Geld_Limit'    : 1 ,
            'Zeiten'        : 1 ,
            'Ausrichter'    : 1 ,
        },
        "UL": {
            'Titel'         : 0 ,
            'Kurztext'      : 0 , 
            'Langtext'      : 0 , 
            'N_TN'          : 0 , 
            'Geld_Anfrage'  : 0 , 
            'Geld_Limit'    : 1 ,
            'Zeiten'        : 0 ,
            'Ausrichter'    : 0 ,
        },
        "GL": {
            'Titel'         : 0 ,
            'Kurztext'      : 0 , 
            'Langtext'      : 0 , 
            'N_TN'          : 0 , 
            'Zeiten'        : 0 ,
            'Ausrichter'    : 0 ,
        }
    },
    "Admin":{
        "Eigen":{
            'Titel'         : 0 ,
            'Kurztext'      : 0 , 
            'Langtext'      : 0 , 
            'N_TN'          : 0 , 
            'Geld_Anfrage'  : 0 , 
            'Geld_Limit'    : 0 ,
            'Zeiten'        : 0 ,
            'Ausrichter'    : 0 ,
        },
        "UL": {
            'Titel'         : 0 ,
            'Kurztext'      : 0 , 
            'Langtext'      : 0 , 
            'N_TN'          : 0 , 
            'Geld_Anfrage'  : 0 , 
            'Geld_Limit'    : 0 ,
            'Zeiten'        : 0 , 
            'Ausrichter'    : 0 ,
        },
        "GL": {
            'Titel'         : 0 ,
            'Kurztext'      : 0 , 
            'Langtext'      : 0 , 
            'N_TN'          : 0 , 
            'Geld_Anfrage'  : 0 , 
            'Geld_Limit'    : 0 ,
            'Zeiten'        : 0 ,
            'Ausrichter'    : 0 , 
        }

    }
}