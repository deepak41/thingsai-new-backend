import requests
import json
import csv
import time
from datetime import datetime, timedelta
from dateutil import tz
from pymongo import MongoClient
import pymongo


client = MongoClient('localhost:27017')
db = client.thingsioportal

# localhost = "http://localhost:3000"
localhost = "http://13.235.104.223"

def getUsers():
	users = db.user.find({"origin": "customer"})
	users = list(users)

	if len(users) != 0:
		for user in users:
			print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ EMAIL @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
			print(user["email"])
			print(user["phone_no"])
			print(updateUser(user["email"], user["phone_no"]))


def updateUser(email, phone_no):
	url = localhost + "/api/users/update-by-admin?email=" + email

	data = {
	    "phone_no": phone_no
	}

	data_json = json.dumps(data)

	headers = {
		'Content-Type': 'application/json'
	}

	response = requests.post(url, data=data_json, headers=headers)
	return response.json()