import requests
import json
import csv
import time
from datetime import datetime, timedelta
from dateutil import tz
from pymongo import MongoClient
import pymongo


client = MongoClient('localhost:27017')
db = client.thingsio2

localhost = "http://localhost:3000"
# prodServerip = "http://139.59.20.55"


def getUsers():
	users = db.user.find({"origin": "customer"})
	users = list(users)

	if len(users) != 0:
		for user in users:
			if user["email"] not in ["balub997@gmail.com", "thingsioai@gmail.com", "testmailid80@gmail.com"]:
				print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ EMAIL @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
				print(user["email"])

				print(createUser(user["email"], user["name"]))

				all_devices = []
				for group in user["groups"]:
					all_devices.extend(getGroupDevices(group))

				print("#################### all devices ###############################")
				print(len(all_devices))
				# print(all_devices)

				for device in all_devices:
					print("==========================================================================================")
					device["device_id"] = int(device["device_id"])
					for slave in device["slave_types"]:
						slave["type"] = str(slave["type"])
					print(device)
					createDevice(user["email"], device)


def getGroupDevices(group_id):
	data = db.groups.find_one({"_id": group_id})
	devices = []
	for site in data["sites"]:
		devices.extend(getDevices(site)) 

	return devices


def getDevices(site_id):
	devices = db.devices.find({"site_id": site_id})
	devices = list(devices)
	if len(devices) >= 1:
		for device in devices:
			pass

	return devices



def createUser(email, name):
	url = localhost + "/api/users/"

	data = {
	    "email": email,
	    "name": name,
	    "password": "qwerty"
	}
	data_json = json.dumps(data)

	headers = {
		'Content-Type': 'application/json'
	}

	response = requests.post(url, data=data_json, headers=headers)
	return response.json()


def createDevice(email, device):
	url = localhost + "/api/devices/create-by-admin"

	data = {
	    "device_id": device["device_id"],
	    "name": device["name"],
	    "slaves": device["slave_types"]
	}
	data_json = json.dumps(data)

	headers = {
		'Content-Type': 'application/json'
	}

	params = {
	    'email': email
	}

	response = requests.post(url, data=data_json, headers=headers, params=params)
	print("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU")
	print(response.json())
	return response.json()



def createSlave(slave):

	if 'energy' not in slave:
		slave["energy"] = {}

	url = localhost + "/api/slave-types/create-by-admin"

	data = {
	    "slave_type_id": str(slave["_id"]),
	    "name": slave["name"],
	    "energy": slave["energy"],
	    "props": slave["props"]
	}
	data_json = json.dumps(data)

	headers = {
		'Content-Type': 'application/json'
	}


	response = requests.post(url, data=data_json, headers=headers)
	print("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU")
	print(response.json())
	return response.json()


def getSlaves():
	slaves = db.slaves.find({"origin": "customer"})
	slaves = list(slaves)

	for slave in slaves:
		createSlave(slave)



getUsers()
getSlaves()