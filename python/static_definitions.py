
unterlager_dict = {
    0: "Admin",
    1: "Espuertes",
    2: "Prismanien"
}

Felder = [ 'Kurztext', 'Langtext', 'N_TN', 'Geld_Anfrage', 'Geld_Limit', 'Zeiten',]

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
        },
        "UL": {
            # Stamm ließt die inahltlichen Infos des eigenen ULs
            'Titel'         : 0 ,
            'Kurztext'      : 0 , 
            'Langtext'      : 0 , 
            'N_TN'          : 0 , 
            'Zeiten'        : 0 , 
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
        },
        "UL": {
            'Titel'         : 0 ,
            'Kurztext'      : 0 , 
            'Langtext'      : 0 , 
            'N_TN'          : 0 , 
            'Geld_Anfrage'  : 0 , 
            'Geld_Limit'    : 1 ,
            'Zeiten'        : 0 , 
        },
        "GL": {
            'Titel'         : 0 ,
            'Kurztext'      : 0 , 
            'Langtext'      : 0 , 
            'N_TN'          : 0 , 
            'Zeiten'        : 0 ,  
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
        },
        "UL": {
            'Titel'         : 0 ,
            'Kurztext'      : 0 , 
            'Langtext'      : 0 , 
            'N_TN'          : 0 , 
            'Geld_Anfrage'  : 0 , 
            'Geld_Limit'    : 0 ,
            'Zeiten'        : 0 , 
        },
        "GL": {
            'Titel'         : 0 ,
            'Kurztext'      : 0 , 
            'Langtext'      : 0 , 
            'N_TN'          : 0 , 
            'Geld_Anfrage'  : 0 , 
            'Geld_Limit'    : 0 ,
            'Zeiten'        : 0 , 
        }

    }
}