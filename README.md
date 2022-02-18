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
MiniBid uses five database models: ```User```, ```Item```, ```Auction```, ```Bid``` and ```Event```.

IMAGE

```User``` defines a MiniBid user. User have a username, an email and a password (passwords are stored as hashes of actual passwords). 

```Item``` defines an item, created and owned by a ```User```.  When a user creates an item they provide it with a title, the item’s condition (‘new’ or ‘used’), a description, an initial starting price and an expiration date. When an item expires the ‘item status’ field will indicate whether or not the item sold.

```Auction``` defines an auction on an ```Item```. ```Auctions``` contain the item they are auctioning, the current price of the item, the current highest bid and, once they expire, the winner (if there is one). Auctions do not contain information regarding the time left to complete. This is because it would be difficult to achieve a high degree of accuracy when the time remaining is calculated server-side and then sent back to a client in a http response. This could be done with a stateful connection between the client and the server, but MiniBid is a RESTful application and that would violate the stateless property RESTful software should have. It makes more sense for a client to obtain an Item’s expiration date via MiniBid’s API and then calculate the Auction’s time remaining client-side.

```Bid``` defines a bid on an ```Item``` in an ```Auction```. Bids hold information on the bidding amount, the bidding ```User``` and the ```Bid``` they out bid. 

```Events``` are used by MiniBid to track the expiration of items. An ```Event``` contains and 'id' which references an ```Item``` and an experation time.
### MiniBid Application Logic Overview
### MiniBid RESTful API Endpoints
Users should first register and login using the following endpoints:
- /api/user
  - /register
  - /login
 
 IMAGE
 
 IMAGE

<b>For every other endpoint requests must come from registered users, they should have the user's ```auth_token``` in thier headers.</b>

To read all items, post an item to sell or read an item's auction, users should send requests to the following API endpoints (where :itemId is the ```Item:_id```):
- /api/items
  - /:itemId
  - /:itemId/auction

ITEMS IMAGE

ITEM IMAGE

AUCTION IMAGE
> Users must GET an item's auction in order to get the current price the item is selling for and, once it expires, the winner's ```User:_id```.

In order to bid on an item a user should send a POST requsest containing the ```Bid``` to the following endpoint (where :itemId is the ```Item:_id```):
- /api/bid/:itemId
> Bid requests should be sent with an ```auth_token``` which authorizes any user <b>except</b> the user who created the ```Item``` (i.e. Users cannot bid on their own items). 

BID IMAGE
## Testing
Testing was done using testcases written in Python. The testcases used can be found in ```./test/test_cases.py```.

Running the tests with pytest: 

IMAGE
