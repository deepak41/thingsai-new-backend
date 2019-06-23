import requests
import json
import csv
import time
from datetime import datetime, timedelta
from dateutil import tz
from pymongo import MongoClient
import pymongo


client = MongoClient('localhost:27017')
db = client.alertsdb

alertsServerip = "http://alerts.thethingscloud.com"
prodServerip = "http://baas.thethingscloud.com"
prodServerip = "http://139.59.20.55"

def loginToProdServer():
	url = prodServerip + "/api/sessions"

	data = {
	    "email": "admin@thethingscloud.com",
	    "password": "admin123"
	}
	data_json = json.dumps(data)

	headers = {
	        'Content-Type': 'application/json'
	}

	response = requests.post(url, data=data_json, headers=headers)
	token = response.json()["token"]
	return token


def getDevicesList(token):
	url = prodServerip + "/api/devices"
    
	headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    }

	response = requests.get(url, headers=headers)
	devices = response.json()["data"]

	devices_list = []

	for device in devices:
		devices_list.append(device["device_id"])

	return devices_list


def get_ts_diff(ts):
	current_ts = int(time.time())
	print(current_ts)

	result = current_ts - ts
	return result

def sendSms(device_id, ts, phone_no):

	url = alertsServerip + "/api/notifications/no_data_got"

	data = {
		"device_id": device_id,
		"ts": ts
		# "phone_no": phone_no
	}

	data_json = json.dumps(data)

	headers = {
	        'Content-Type': 'application/json'
	}

	response = requests.post(url, data=data_json, headers=headers)
	r = response.json()
	print(r)


token = loginToProdServer()
devices_list = getDevicesList(token)


for device in devices_list:

	data = list(db.lastdevicedata.find({"device_id": device}))
	print(data)

	if(len(data) is 0):
		sendSms(device, 0, "+917004632653")

	else:
		ts_diff = get_ts_diff(data[0]["ts"])
		if(ts_diff >= 3600):
			sendSms(data[0]["device_id"], data[0]["ts"], "+917004632653")


