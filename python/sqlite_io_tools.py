import sqlite3
import re
import time

from python.static_definitions import SQL_COLUMNS_DATA

# TYPE ASSERTIONS FOR ERROR CHECKING
def assert_key(x_key):
    assert_string(x_key)
    if not bool(re.match(r"^[A-Z \d\W]{6}$",x_key)):
        raise TypeError(f'The given key does not match the format "KKKKKK"')

def assert_p_id(x_id):
    assert_string(x_id)
    if not bool(re.match(r'^\w.\w\w.\w\w$', x_id)):
        raise TypeError(f'The given index "{x_id}" does not match the programm-id format "L.UU.PP"')
        return False
    return True

def assert_u_id(x_id):
    assert_string(x_id)
    if not bool(re.match(r'^\w.\w\w$', x_id)):
        raise TypeError(f'The given index "{x_id}" does not match the user-id format "L.UU"')

def assert_ul_id(x_id):
    assert_string(x_id)
    if not bool(re.match(r'^\w$', x_id)):
        raise TypeError(f'The given index "{x_id}" does not match the UL-id format "L"')

def assert_string(string):
    if type(string) is not str:
        raise TypeError(f'The given input "{string}" is not of string format')

# INIT HELPER FUNCTIONS (ONLY ONCE NEEDED)
def SQL_create_JSON_DB(path, name='_table', columns=SQL_COLUMNS_DATA):
    conn = sqlite3.connect(path)
    c = conn.cursor()
    exe = f'({", ".join([col+" text" for col in columns])})'
    print(exe)
    c.execute(f'CREATE TABLE {name} {exe}')
    conn.commit()
    conn.close()

def SQL_create_KeyGraveyard(path, name='_table', columns=["key","date_created"]):
    conn = sqlite3.connect(path)
    c = conn.cursor()
    exe = f'({", ".join([col+" text" for col in columns])})'
    print(exe)
    c.execute(f'CREATE TABLE {name} {exe}')
    conn.commit()
    conn.close()


# IO CLASSES
class SQL_Cursor():
    def __init__(self, db_location, verbos=True):
        self._db_location = db_location
        self.verbos = verbos

        self._conn = sqlite3.connect(self._db_location)
        self._c = self._conn.cursor()

        if self.verbos:
            print(f" > Opening connection to database '{self._db_location}'")


    def __enter__(self):
        return self._c

    def __exit__(self, *_):
        self._conn.commit()
        self._conn.close()

        if self.verbos:
            print(f" > Closing connection to database '{self._db_location}'")

        self.__del__()

    def __del__(self):
        pass


class SQL_Handler():
    def __init__(self, db_location):
        self._db_location = db_location
        # self._conn = sqlite3.connect(db_location)
        # self._c    = self._conn.cursor()
        # print(f" > Opening connection to database '{self._db_location}'")

        with SQL_Cursor(self._db_location) as _cursor:
            _cursor.execute('PRAGMA table_info(_table)')
            self._columns = [x[1] for x in _cursor.fetchall()] # get only col. names
            self._idc = self._columns[0] # index-name

    def _check_db_valid(self, target_columns):
        for col in target_columns:
            if col not in self._columns:
                self.__del__()
                raise IndexError(f"Column '{col}' not found in database '{self._db_location}'. Aborting")

        print(f" > Database '{self._db_location}' has valid columns")
        return True

    def __del__(self):
        # print(f" > Closing connection to database '{self._db_location}'")
        # self._conn.close()
        pass

    # This needs to be redone.
    # Goal is to have one class, one __init__ call and sub_connections on context-call
    # def __enter__(self):
    #     return self
    # def __exit__(self, *_):
    #     # Ignoring inputs, dumping to _
    #     return

class SQL_KeyGraveyard_Handler(SQL_Handler):
    """docstring for SQL_KeyGraveyard_Handler"""
    def __init__(self, db_location):
        super().__init__(db_location)

        self._check_db_valid(["key", "date_created"])

    def check_for_key(self, x_key):
        try:
            assert_key(x_key)
        except Exception as e:
            print("TypeError:", e)
            return
        
        with SQL_Cursor(self._db_location) as _cursor:
            _cursor.execute('SELECT * FROM _table WHERE key=?', (x_key,) )
            return (_cursor.fetchone() is not None)
        
    def add_key(self, x_key):
        try:
            assert_key(x_key)
        except Exception as e:
            print("TypeError:", e)
            return

        with SQL_Cursor(self._db_location) as _cursor:
            _cursor.execute(f"INSERT INTO _table (key, date_created) VALUES (?,?)",
                (x_key, time.strftime("%d.%m.%Y, %H:%M")) )



class SQL_JSON_IO_Handler(SQL_Handler):
    """docstring for SQL_JSON_IO_Handler"""
    def __init__(self, db_location):
        super().__init__(db_location)

    def _check_for_id(self, x_id, _cursor=None):
        try:
            self._idc_type_assert(x_id)
        except TypeError as e:
            print("TypeError: ", e)
            return

        if _cursor is not None:
            _cursor.execute('SELECT * FROM _table WHERE '+self._idc+'=?', (x_id,) )
            return (_cursor.fetchone() is not None)
        else:
            with SQL_Cursor(self._db_location) as _cursor:
                _cursor.execute('SELECT * FROM _table WHERE '+self._idc+'=?', (x_id,) )
                return (_cursor.fetchone() is not None)



    def _add_id(self, x_id, _cursor=None):
        try:
            self._idc_type_assert(x_id)
        except TypeError as e:
            print("TypeError: ", e)
            return

        if self._check_for_id(x_id):
            return

        if _cursor is not None:
            _cursor.execute(f"INSERT INTO _table ('{self._idc}') VALUES (?)", (x_id,))
        else:
            with SQL_Cursor(self._db_location) as _cursor:
                _cursor.execute(f"INSERT INTO _table ('{self._idc}') VALUES (?)", (x_id,))

    def update_data(self, data_dict):
        try:
            assert type(data_dict)==dict
        except AssertionError:
            print("TypeError: input data is not a dict")
            return

        with SQL_Cursor(self._db_location) as _cursor:
            for x_id in data_dict:
                try:
                    self._idc_type_assert(x_id)
                except TypeError as e:
                    print("TypeError: ", e)
                    return {}

                if not self._check_for_id(x_id, _cursor):
                    self._add_id(x_id, _cursor)

                keys = list(data_dict[x_id].keys())
                vals = [data_dict[x_id][k] for k in keys]

                command = f""" UPDATE _table
                SET {'=? , '.join(keys)}=?
                WHERE {self._idc}=?
                """
        
                _cursor.execute(command, (*vals, x_id))


    def load_data_by_x_id(self, x_id):
        try:
            self._idc_type_assert(x_id)
        except TypeError as e:
            print("TypeError: ", e)
            return {}

        if not self._check_for_id(x_id):
            return

        row_dict = {}
        
        with SQL_Cursor(self._db_location) as _cursor:
            _cursor.execute('SELECT * FROM _table WHERE '+self._idc+'=?', (x_id,) )
            db_row = _cursor.fetchone()

        for col, val in zip(self._columns[1:], db_row[1:]):
            if val is not None:
                row_dict[col] = val

        return row_dict

    def load_data_all(self):
        with SQL_Cursor(self._db_location) as _cursor:
            _cursor.execute('SELECT * FROM _table')
            return self._sql_to_json(_cursor.fetchall())

    def _sql_to_json(self, sql_fetchall_response):
        if type(sql_fetchall_response)==tuple:
            sql_fetchall_response = [sql_fetchall_response]
        elif sql_fetchall_response is None:
            return {}

        try:
            assert type(sql_fetchall_response)==list
        except AssertionError as e:
            print("TypeError: ",e)
            return {}

        if len(sql_fetchall_response)==0:
            return {}

        data_dict = {}
        for x_id, *vals in sql_fetchall_response:
            try:
                assert (x_id is not None)
            except AssertionError:
                print(f"TypeError: id '{x_id} is None'")
                continue

            data_dict[x_id] = {}
            for col, val in zip(self._columns[1:], vals):
                if val is not None:
                    data_dict[x_id][col] = val

        return data_dict


class Data_IO_Handler(SQL_JSON_IO_Handler):
    """docstring for DATA_IO_HANDLER"""
    def __init__(self, db_location, columns=None):
        super().__init__(db_location)
        
        self._idc_type_assert = assert_p_id

        if columns is not None:
            self._check_db_valid(columns)


    def load_data_many_by_u_id(self, u_id):
        try:
            assert_u_id(u_id)
        except TypeError as e:
            print("TypeError: ", e)
            return {}

        with SQL_Cursor(self._db_location) as _cursor:
            _cursor.execute('SELECT * FROM _table WHERE '+self._idc+' LIKE \''+ u_id + '.%\'')
            return self._sql_to_json(_cursor.fetchall())

    def load_data_many_by_ul_id(self, ul_id):
        try:
            assert_ul_id(ul_id)
        except TypeError as e:
            print("TypeError: ", e)
            return {}

        with SQL_Cursor(self._db_location) as _cursor:
            _cursor.execute('SELECT * FROM _table WHERE '+self._idc+' LIKE \''+ ul_id + '.%.%\'')
            return self._sql_to_json(_cursor.fetchall())

class User_IO_Handler(SQL_JSON_IO_Handler):
    """docstring for User_IO_Handler"""
    def __init__(self, db_location):
        super().__init__(db_location)
        
        self._idc_type_assert = assert_u_id

    def load_data_many_by_ul_id(self, ul_id):
        try:
            assert_ul_id(ul_id)
        except TypeError as e:
            print("TypeError: ", e)
            return {}

        with SQL_Cursor(self._db_location) as _cursor:
            _cursor.execute('SELECT * FROM _table WHERE '+self._idc+' LIKE \''+ ul_id + '.%\'')
            return self._sql_to_json(_cursor.fetchall())

    def fetch_u_info_by_key(self, x_key, nokey=True):
        try:
            assert_key(x_key)
        except TypeError as e:
            print("TypeError: ", e)
            return

        with SQL_Cursor(self._db_location) as _cursor:
            _cursor.execute('SELECT * FROM _table WHERE Keys LIKE\'%:'+x_key+ ':%\'')
            query = self._sql_to_json(_cursor.fetchone())

        if query == {}:
            return None

        u_id, u_info = query.popitem()
        if nokey:
            u_info.pop("Keys")
        u_info["u_id"] = u_id
        return u_info

        
# USAGE
# p_data_handler = Data_IO_Handler("p_data.db")
# u_data_handler = User_IO_Handler("u_data.db")
# keylist_handler = SQL_KeyGraveyard_Handler("keylist.db")