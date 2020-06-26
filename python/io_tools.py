import fasteners
import time
import json
import yaml

from numpy.random import random


class io_handler():
    def __init__(self, path):
        self.path = path
        self._queue = []

        self._tstep = 0.1

    def _acquire(self, time_out = False):
        job_id = random()
        self._queue.append(job_id)

        if time_out:
            time_0 = time()

        while (self._queue[0] != job_id):
            time.sleep(self._tstep)

            if time_out:
                if time_out< (time()-time_0):
                    return False

            # print(f' <{job_id}> awaiting <> ')

        # print(f' <{job_id}> started <> ')
        return True

    def _release(self):
        # print(f' <{self._queue[0]}> ended <> ')
        job_id = self._queue.pop(0)
        return

    def load(self):
        permit = self._acquire()
        if not permit:
            return

        ret_data = self._load()

        self._release()
        
        return ret_data

    def save(self, in_data):
        permit = self._acquire()
        if not permit:
            return

        self._save(in_data)

        self._release()

class json_io_handler(io_handler):
    def __init__(self, arg):
        super().__init__(arg)

    def _load(self):
        with open(self.path, "r") as fobj:
            json_data = yaml.safe_load(fobj)
        return json_data

    def _save(self, json_data_update):
        with open(self.path, "r") as fobj:
            json_data_local = yaml.safe_load(fobj)

        for _id in json_data_update:
            if _id not in json_data_local:
                json_data_local[_id] = {}
            json_data_local[_id].update(json_data_update[_id])

        with open(self.path, "w") as fobj:
            fobj.write(json.dumps(json_data_local, indent=4))

