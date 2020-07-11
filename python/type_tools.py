import re

def assert_key(x_key):
    assert_string(x_key)
    if not bool(re.match(r"^[A-Z \d\W]{6}$",x_key)):
        raise TypeError(f'The given key does not match the format "KKKKKK"')

def assert_p_id(x_id):
    assert_string(x_id)
    if not bool(re.match(r'^\w.\w\w.\w\w$', x_id)):
        raise TypeError(f'The given index "{x_id}" does not match the programm-id format "L.UU.PP"')

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