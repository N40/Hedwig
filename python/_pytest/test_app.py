import pytest


import python._pytest.assert_app_responses as aar
from python._pytest.test_backend import setup_test_databases, setup_test_ut_dt
import python.type_tools as tt

import re

# GENERAL SETUP
from app import *
@pytest.fixture
def client():
    app.config['TESTING'] = True
    siot = setup_test_databases()

    with app.test_client() as client:
        client._siot = siot
        yield client


# TESTING

def test_master(client):
    for str_check in aar.V_master_musthave:
        rv = client.get("/")
        str_rv = rv.data.decode("utf8")

        assert str_check in str_rv;

    for str_protected in aar.V_master_donthave:
        str_protected = str_protected.lower()
        rv = client.get("/")
        str_rv = rv.data.decode("utf8").lower()
        match = str_protected in str_rv
        print(str_protected)
        assert match == False;

def test_backdoor(client):
    # fail the databases
    client._siot.user_io_handler
    client._siot.data_io_handler

    for case in aar.V_backdoor:
        url, json_check = case.values()

        rv = client.get(url)
        assert json.loads(rv.data) == json_check

def test__get_server_time(client):
    rv = client.get('/get_server_time')
    assert rv.data.decode('utf8') == time.strftime("%d.%m.%Y, %H:%M");

def test__login(client):
    for case in aar.V_login:
        url, json_check = case.values()

        rv = client.get(url)
        assert json.loads(rv.data) == json_check

def test__logout(client):
    for case in aar.V_logout:
        url, bin_check = case.values()

        rv = client.get(url)
        assert rv.data == bin_check


def test__data_pull_data(client):
    for case in aar.V_data_pull_data_positive:
        url = case["url"]
        json_check = case["j_res"]

        rv = client.get(url)
        assert json.loads(rv.data) == json_check

    for case in aar.V_data_pull_data_negative:
        url = case["url"]

        with pytest.raises(TypeError, match=r"either returned None or ended without a return"):
            rv = client.get(url)
            assert rv is None # this is actually redundant


def test__data_push_data(client):
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }

    for case in aar.V_data_push_data_positive:
        url = case["url"]
        json_data = json.dumps(case["p_data"])

        rv = client.post(url, data=json_data, headers=headers)
        assert rv.status == "200 OK"

    for case in aar.V_data_push_data_negative:
        url = case["url"]
        json_data = json.dumps(case["p_data"])

        with pytest.raises(TypeError, match=r"either returned None or ended without a return"):
            rv = client.post(url, data=json_data, headers=headers)


    with pytest.raises(TypeError, match=r"either returned None or ended without a return"):
        rv = client.post(url, data="{}")

def test__data_push_pull_mod(client):
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }

    for case in aar.V_data_push_pull_modification:
        url_push    = case['url_push']
        url_pull    = case['url_pull']
        p_data_push = case['p_data_push']
        p_data_pull = case['p_data_pull']

        client.post(url_push, data=json.dumps(p_data_push), headers=headers)
        rv = client.get(url_pull)
        res_data = json.loads(rv.data)

        assert res_data == p_data_pull

def test__get_static_definitions(client):
    rv = client.get("/get_static_definitions")

    # this will init static_definitions
    # "static_definitions = {...}"
    match = re.search(r"static_definitions.*=([\s\S]+)$", rv.data.decode("utf8"))
    assert match is not None
    static_definitions = json.loads(match.group(1))
    for key in aar.V_static_definition_keys:
        assert key in static_definitions

def test__user_get_new_user_key(client):
    for url in aar.V_user_get_new_user_key_url_positive:
        rv = client.get(url)
        key = rv.data.decode("utf8")
        tt.assert_key(key)

    for url in aar.V_user_get_new_user_key_url_negative:
        with pytest.raises(TypeError, match=r"either returned None or ended without a return"):
            rv = client.get(url)

def test__user_get_new_user_id(client):
    for url in aar.V_user_get_new_user_id_url_positive:
        rv = client.get(url)
        key = rv.data.decode("utf8")
        tt.assert_u_id(key)

    for url in aar.V_user_get_new_user_id_url_negative:
        with pytest.raises(TypeError, match=r"either returned None or ended without a return"):
            rv = client.get(url)


def test__user_pull_user_dict(client):
    for case in aar.V_user_pull_user_dict_positive:
        url = case["url"]
        json_check = case["j_res"]

        rv = client.get(url)
        assert json.loads(rv.data) == json_check

    for case in aar.V_user_pull_user_dict_negative:
        url = case["url"]

        print(url)
        with pytest.raises(TypeError, match=r"either returned None or ended without a return"):
            rv = client.get(url)

def test__user_push_user_dict(client):
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }

    for case in aar.V_user_push_user_dict_positive:
        url = case["url_push"]
        ud_push = case["ud_push"]

        rv = client.post(url, data=json.dumps(ud_push), headers=headers)

    for case in aar.V_user_push_user_dict_negative:
        url = case["url_push"]
        ud_push = case["ud_push"]

        with pytest.raises(TypeError, match=r"either returned None or ended without a return"):
            rv = client.get(url, data=json.dumps(ud_push), headers=headers)


def test__user_push_pull_mod(client):
    mimetype = 'application/json'
    headers = {
        'Content-Type': mimetype,
        'Accept': mimetype
    }

    for case in aar.V_user_push_pull_mod:
        url_push, url_pull, ud_push, ud_pull = case.values()

        print(f'{url_push}\n{url_pull}')

        client.post(url_push, data=json.dumps(ud_push), headers=headers)

        if ud_pull is None:
            print(f'{url_push}\n{url_pull}')
            print(ud_push, ud_pull)
            with pytest.raises(TypeError, match=r"either returned None or ended without a return"):
                rv = client.get(url_pull)
                print(rv.get_json())

        else:
            rv = client.get(url_pull)
            j_res = rv.get_json()

            assert j_res == ud_pull


