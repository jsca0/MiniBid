# MiniBid
## Setup, Installation and Project Structure
### Project Structure
IMAGE
  

### Setup and Installation
First set up a new collection in mongodb called 'MiniBid' and get the ????LINK????. Fill the link's \<password> and change 'myFisrtDatabase' to 'MiniBid'. This link will be used to connect the MiniBid application to the new mongodb collection.  
  IMAGE  
  Next make sure a ```.env``` file exists in MiniBid's root directory. In ```.env``` create a variable ```DB_CONNECTOR``` and give it the mongodb link. Then create a variable ```TOKEN_SECRET``` and set it to a secret value, MiniBid will use this value when authenticating user tokens.
  
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
## Enforcing authentication/verification functionalities
## Development of the MiniBid RESTful API
### Brief Description of MiniBid’s Database Models
MiniBid uses five database models: User, Item, Auction, Bid and Event.
  IMAGE
  
### MiniBid Application Logic Overview
### MiniBid RESTful API Endpoints
- /api/user
  - /register
  - /login 

For every other endpoint requests must come from registered users, they should have the user's ```auth_token``` in thier headers.
Items...
- /api/items
  - /:itemId
  - /:itemId/auction 

In order to bid on an ```Item``` a user should send a POST requsest containing the ```Bid``` to the following endpoint (where :itemId is the ```Item:_id```):
- /api/bid/itemId
E.g. IMAGE
## Development of the MiniBid testing cases
Testing was done using testcases written in Python. The testcases used can be found in ```./test/test_cases.py```.
  Running the tests with pytest gives: 
  IMAGE
