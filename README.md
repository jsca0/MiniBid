# MiniBid
## Setup, Installation and Project Structure
### Project Structure

### Node.js Libraries Used
MiniBid uses: express nodemon mongoose body-parser dotenv joi bcryptjs jsonwebtoken
### Setup and Installation
First set up a new collection in mongodb called 'MiniBid' and get the ????LINK????. Fill the link's \<password> and change 'myFisrtDatabase' to 'MiniBid'. This link will be used to connect the MiniBid application to the new mongoDB collection.

IMAGE

Next make sure a ```.env``` file exists in MiniBid's root directory. In ```.env``` create a variable ```DB_CONNECTOR``` and give it the mongoDB link. Then create a variable ```TOKEN_SECRET``` and set it to a secret value, MiniBid will use this value when authenticating user tokens.
  
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

- ```User``` defines a MiniBid user. Users have a username, an email and a password (passwords are stored as hashes of actual passwords). 

- ```Item``` defines an item, created and owned by a ```User```.  When a user creates an item they provide it with a title, the item’s condition (‘new’ or ‘used’), a description, an initial starting price and an expiration date. When an item expires the ‘item status’ field will indicate whether or not the item sold.

- ```Auction``` defines an auction on an ```Item```. ```Auctions``` contain the item they are auctioning, the current price of the item, the current highest bid and, once they expire, the winner (if there is one). Auctions do not contain information regarding the time left to complete. This is because it would be difficult to achieve a high degree of accuracy when the time remaining is calculated server-side and then sent back to a client in a http response. This could be done with a stateful connection between the client and the server, but MiniBid should have a RESTful API and that would violate the stateless property RESTful software should have. It makes more sense for a client to obtain an Item’s expiration date via MiniBid’s API and then calculate the Auction’s time remaining client-side.

- ```Bid``` defines a bid on an ```Item``` in an ```Auction```. Bids hold information on the bidding amount, the bidding ```User``` and the ```Bid``` they out bid. 

- ```Events``` are used by MiniBid to track the expiration of items. An ```Event``` contains a reference to an ```Item``` and an experation time.

IMAGE DIAGRAM

```Auctions``` and ```Bids``` have an ```itemid``` field, this behaves as a key that can be used to find an Item's Auction and it's Bids within their respective database collections.
### MiniBid Application Logic Overview
MiniBid was developed to meet these goals:

> 1.  Users should be able to register and login to an account. 

When a user registers an account they set a password. The password is stored as a hash in order to not expose user passwords. When a user logs in the password is checked against the stored hash. 

> 2. Authorised users should be able to post items for auction with a starting price and an end date. The item should not be sold after the end date and should not be sold for less than the starting price.

When a user posts an item, the user input is validated. The starting price is validated as a positive number with a precision of two decimal places; In order to ensure that the user submitted price can be converted into a valid currency. 

The user supplied end date is validated as a date time in the future. The date should have ISO 8601 format.

Item expiration is implemented by, on ```Item``` creation, submitting an ```Event``` referencing both the item’s id and it’s expiration date into MiniBids ‘events’ database collection. The database is instructed to delete this ```Event``` when the expiration time is reached. MiniBid listens for deletions happening in the ‘events’ collection. When an ```Event``` is deleted MiniBid retrieves the ```Item``` the deleted event was attached to. MiniBid also retrieves the item’s ```Auction```. If the auction has any bids then the ```Item``` is marked as ‘SOLD’ and the ```Auction``` is updated with the winners user id. Otherwise the ```Item``` marked as ‘EXPIRED’.

> 3. Authorised users should be able to bid on an item, so long as it is not their own, has not expired and their bid is higher than the items current highest bid. When the item expires the user with the highest bid wins.

When an ```Auction``` is created its ```current_price``` field is set to the starting price of the item being sold. When a bid is made the ```current_price``` is updated to the bid amount. ```Bids``` are validated by ensuring they are higher than the auction's ```current_price```. 

The accuracy of auctions is only to the minute; The winning bid will always be a bid placed within 60 seconds of the auction expiring, but this could mean, for example, a winner being a bid placed 30 seconds after the item had expired.

> 4. Authorised users should be able to browse an item’s bidding history.

If an item is sold MiniBid’s ‘bids’ database collection is searched for all the bids with a matching item id. These bids are returned to the user sorted by date.
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

![test results](/images/test_results.png)
