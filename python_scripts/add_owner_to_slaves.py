import requests
import json
import csv
import time
from datetime import datetime, timedelta
from dateutil import tz
from pymongo import MongoClient
import pymongo


client = MongoClient('localhost:27017')
db = client.thingsaidb


users = db.users.find()
users = list(users)

for user in users:
	print(user["email"])
	for device in user["devices"]:
		print(device)
		device11 = db.devices.find_one({"device_id": device["device_id"]})
		for slave in device11["slaves"]:
			print(slave)

			myquery = { "slave_type_id": slave["type"] }
			newvalues = { "$set": { "owner": user["email"] } }

			db.slavetypes.update_one(myquery, newvalues)

			slave11 = db.slavetypes.find_one({"slave_type_id": slave["type"]})
			print(slave11)
