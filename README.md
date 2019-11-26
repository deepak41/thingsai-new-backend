# ThingsAI Backend
http://13.235.104.223   
www.thethingscloud.com

NodeJs, ExpressJs & MongoDB based restful backend service for http://beta.thingsai.io

Repo used from: 
https://github.com/tolgaek/express-sample-api/

## Getting Started
### To run the project:  
Make sure MongoDB instance is running on the system.  

1. Clone the project
2. Create and open a file called `.env`in the root folder and paste the following into the file:  
`NODE_ENV=development`
3. Create and open a file `config/helpers/track-user.json` and paste the following:  
```{
	"track": false
}```
4. Then enter the following commands:   
`$ npm install`  
`$ nodemon`  
The app should be up and running.