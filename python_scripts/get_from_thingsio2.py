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


def getUsers():
	users = db.user.find({"origin": "customer"})
	users = list(users)

	if len(users) != 0:
		for user in users:
			if user["email"] not in ["balub997@gmail.com", "thingsioai@gmail.com", "testmailid80@gmail.com"]:
				print("************************EMAIL**********************************************************************")
				print(user["email"])
				for group in user["groups"]:
					getGroup(group)



def getGroup(group_id):
	data = db.groups.find_one({"_id": group_id})
	# print("+++++++++++++++++++++++++++++++++++++++++")
	# print(data)
	for site in data["sites"]:
		getDevices(site)


def getDevices(site_id):
	devices = db.devices.find({"site_id": site_id})
	devices = list(devices)
	if len(devices) >= 1:
		for device in devices:
			print("--------------------------------DEVICES-----------------------------------")
			print(device["device_id"])


getUsers()