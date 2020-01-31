# ThingsAI Backend
http://13.235.246.177/   
www.thethingscloud.com

NodeJs, ExpressJs & MongoDB based restful backend service for http://beta.thingsai.io  
http://13.233.134.17

Repo used from: 
https://github.com/tolgaek/express-sample-api/

## Getting Started
### To run the project:  
Make sure MongoDB instance is running on the system.  

1. Clone the project
2. Create and open a file called `.env`in the project root folder and paste the following into the file:  
`NODE_ENV=development`
3. Create and open a file `config/helpers/track-user.json` and paste the following:  
```{
	"track": false
}```
4. Then enter the following commands:   
`$ npm install`  
`$ nodemon`  
The app should be up and running. 

## For mongoose unique(if not working):
`> use thingsaidb`  
`> db.users.createIndex({email: 1}, {unique: true})`  
`> db.devices.createIndex({device_id: 1}, {unique: true})`  
`> db.slavetypes.createIndex({slave_type_id: 1}, {unique: true})`

## For logging in into mongo  
`$ mongo admin -u adminUser -p things123`

## For making db dump
Login into primary replica  
`$ mongodump -u adminUser -p things123`