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
# localhost = "http://13.232.200.4"


def getUsers():
	users = db.user.find({"origin": "customer"})
	users = list(users)

	if len(users) != 0:
		for user in users:
			if user["email"] not in ["balub997@gmail.com", "thingsioai@gmail.com", "testmailid80@gmail.com", "arsutukur@gmail.com", "shahabaaz288@gmail.com", "mereddy6542@gmail.com", "bsrr1953@gmail.com", "vishaltalukar66@gmail.com"]:
				print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ EMAIL @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
				print(user["email"])

				# if user["email"] != "bsrr1953@gmail.com":
				# 	continue

				print(createUser(user["email"], user["name"]))

				all_devices = []
				for group in user["groups"]:
					all_devices.extend(getGroupDevices(group))

				print("######################################### all devices ###############################")
				print(len(all_devices))
				# print(all_devices)

				for device in all_devices:
					print("========================================= DEVICE =================================================")
					print(device["device_id"])
					device["device_id"] = int(device["device_id"])
					for slave in device["slave_types"]:
						slave["type"] = str(slave["type"])
					createDevice(user["email"], device)

					getDeviceData(device["device_id"], user["email"])



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

	# data = {
	#     "email": email,
	#     "name": name,
	#     "password": "qwerty"
	# }
	data = {
	    "email": email,
	    "name": name
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
	# print("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU")
	# print(response.json())
	return response.json()


def getDeviceData(device_id, email):
	device_data = db.device_data.find({"device_id": device_id})
	print("5555555555555555555555555555555555555555555555555555555555555555555555555555")
	print(device_id)
	device_data = list(device_data)

	if(len(device_data)>0):
		
		print("44444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444")
		print(len(device_data))
		# print(device_data[0])
		for data in device_data:
			sendDeviceData(data, email)


def sendDeviceData(data, email):

	url = localhost + "/api/device-data/create-by-admin"

	data = {
	    "data" : data["data"],
		"slave_id" : data["slave_id"],
		"device_id" : data["device_id"],
		"ts" : data["ts"],
		"by_user": email
	}
	data_json = json.dumps(data)

	headers = {
		'Content-Type': 'application/json'
	}


	response = requests.post(url, data=data_json, headers=headers)
	print("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU-- DEVICE DATA --UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU")
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
	# print("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU")
	# print(response.json())
	return response.json()


def getSlaves():
	slaves = db.slaves.find({"origin": "customer"})
	slaves = list(slaves)

	for slave in slaves:
		createSlave(slave)



start = time.time()
getUsers()
getSlaves()
end = time.time()
time_taken = end - start
print('Time: ', time_taken/60)