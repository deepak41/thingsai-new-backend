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

#localhost = "http://localhost:3000"
localhost = "http://13.235.246.177"


def getDeviceData():
	device_data = db.device_data.find({"device_id": 61121695973, "slave_id": 1}).sort('ts', pymongo.ASCENDING).limit(20000)
	device_data = list(device_data)

	print(len(device_data))

	for index, data in enumerate(device_data):
		sendDeviceData(data, "ks.deepak07@gmail.com")


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


def createSlave():

	energy = {
		"d" : "100",
		"type" : "Divide",
		"field" : "today_wh",
		"op" : "last"
	}

	props = [
		{
			"name" : "dc1_current",
			"type" : "decimal"
		},
		{
			"name" : "dc1_voltage",
			"type" : "decimal"
		},
		{
			"name" : "dc1_wattage",
			"type" : "decimal"
		},
		{
			"name" : "dc2_current",
			"type" : "decimal"
		},
		{
			"name" : "dc2_voltage",
			"type" : "decimal"
		},
		{
			"name" : "dc2_wattage",
			"type" : "decimal"
		},
		{
			"name" : "phase1_current",
			"type" : "decimal"
		},
		{
			"name" : "phase1_frequency",
			"type" : "decimal"
		},
		{
			"name" : "phase1_voltage",
			"type" : "decimal"
		},
		{
			"name" : "phase1_wattage",
			"type" : "decimal"
		},
		{
			"name" : "phase2_current",
			"type" : "decimal"
		},
		{
			"name" : "phase2_frequency",
			"type" : "decimal"
		},
		{
			"name" : "phase2_voltage",
			"type" : "decimal"
		},
		{
			"name" : "phase2_wattage",
			"type" : "decimal"
		},
		{
			"name" : "phase3_current",
			"type" : "decimal"
		},
		{
			"name" : "phase3_frequency",
			"type" : "decimal"
		},
		{
			"name" : "phase3_voltage",
			"type" : "decimal"
		},
		{
			"name" : "phase3_wattage",
			"type" : "decimal"
		},
		{
			"name" : "today_runtime",
			"type" : "integer"
		},
		{
			"name" : "today_wh",
			"type" : "integer"
		},
		{
			"name" : "x",
			"type" : "decimal"
		},
		{
			"name" : "y",
			"type" : "decimal"
		}
	]


	url = localhost + "/api/slave-types/create-by-admin"

	data = {
	    "slave_type_id": "PhGGX3UAMOvAH5SsQ93h",
	    "name": "Three Phase Delta Inverter",
	    "energy": energy,
	    "props": props,
	    "owner": "ks.deepak07@gmail.com"
	}
	data_json = json.dumps(data)

	headers = {
		'Content-Type': 'application/json'
	}


	response = requests.post(url, data=data_json, headers=headers)
	print("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU")
	print(response.json())
	return response.json()


def createDevice(email):

	slaves = [
		{
			"slave_id" : 1,
			"type" : "PhGGX3UAMOvAH5SsQ93h"
		}
	]

	url = localhost + "/api/devices/create-by-admin"

	data = {
	    "device_id": 61121695973,
	    "name": "20KW Delta Ameen Peer Dhargah",
	    "slaves": slaves
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


start = time.time()

getDeviceData()
createSlave()
createDevice("ks.deepak07@gmail.com")

end = time.time()
time_taken = end - start
print('Time: ', time_taken/60)
