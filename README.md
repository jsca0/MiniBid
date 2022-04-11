# MiniBid

### Project Structure
```
MiniBid
│
└─── models                 #database schemas
└─── routes                 #api routes
└─── validations            #validating user input
└─── verifications          #authenticating users           
└─── app.js                 #main app file
└─── .env                   #environment variables
└─── node_modules           #dependencies
└─── package-lock.json      #npm automatically generated document
└─── package.json           #metadata and npm packagage list                  
```
### Node.js Libraries Used
MiniBid uses: 
- express, for developing the server. 
- nodemon, to aid development.
- mongoose, for database communication.
- body-parser, for reading requests.
- dotenv, for reading environment variables.
- joi, for enforcing validation.
- bcryptjs, for password hashing.
- jsonwebtoken, for enforcing authentication.
###  Setup and Installation 
First a new MongoDB collection need to be created and deployed. The collection's connection link string should be retrieved. This link will be used to connect the MiniBid server to the new mongoDB collection.

Next there should be a ```.env``` file in MiniBid's root directory. The ```.env``` should have  a variable ```DB_CONNECTOR``` with the MongoDB link as its value. There should also be a variable ```TOKEN_SECRET``` set to a secret value, MiniBid will use this value when authenticating user tokens.

To install and start MiniBid:
  
1. Navigate to project folder and install dependencies with: 
```
$ npm install
```
> This command will use the ```package.json``` file to install all of MiniBid's dependencies.
2. Start MiniBid with:
  ```
  $ npm start
  ```
  > This will start MiniBid's server.
  Now MiniBid should be running on localhost port 3000. Clients can now send requests to MiniBid's API endpoints. 

