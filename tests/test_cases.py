import requests
import datetime
import time

register_url = 'http://localhost:3000/api/user/register'
login_url = 'http://localhost:3000/api/user/login'
items_url = 'http://localhost:3000/api/items/'
bid_url = 'http://localhost:3000/api/bid/'


olga = {
    "username":"olga",
    "email":"olga@gmail.com",
    "password":"olga1234"
}

nick = {
    "username":"nick",
    "email":"nick@gmail.com",
    "password":"nick1234"
}

mary = {
    "username":"mary",
    "email":"mary@gmail.com",
    "password":"mary1234"
}

olga_login = {
    "email":"olga@gmail.com",
    "password":"olga1234"
}
nick_login = {
    "email":"nick@gmail.com",
    "password":"nick1234"
}

mary_login = {
    "email":"mary@gmail.com",
    "password":"mary1234"
}

def register_user(user):
    return requests.post(register_url, json=user).json()

def login(user):
    return requests.post(login_url, json=user).json()

#TC 1. Olga, Nick and Mary register in the application and access the API
#register_user(olga)
#register_user(nick)
#register_user(mary)

olga_auth = login(olga_login)
nick_auth = login(nick_login)
mary_auth = login(mary_login)

#TC 1. Olga, Nick and Mary register in the application and access the API
#TC 2. Olga, Nick and Mary will use the oAuth v2 authorisation service to get their tokens
def test_olga_mary_nick_can_access_api_with_token(): 
    olga_access = requests.get(items_url, headers=olga_auth).status_code
    nick_access = requests.get(items_url, headers=nick_auth).status_code
    mary_access = requests.get(items_url, headers=mary_auth).status_code

    assert(olga_access == 200 and nick_access == 200 and mary_access == 200)

#TC 3. Olga calls the API (any endpoint) without using a token. This call should be
#unsuccessful as the user is unauthorised.
def test_cant_access_api_without_token():
    access_status = requests.get(items_url).status_code
    assert(access_status == 401)

#TC 4. Olga adds an item for auction with an expiration time using her token.
def test_olga_can_add_item_with_token():
    olgas_item = {
        "title":"olgasitem",
        "condition":"new",
        "description":"olgas item",
        "starting_price": 1.5,
        "end_date": "2022-02-18T17:38:36"
    }
    res_status = requests.post(items_url, headers=olga_auth, json=olgas_item).status_code
    assert(res_status == 200)

#TC 5. Nick adds an item for auction with an expiration time using his token.
def test_nick_can_add_item_with_token():
    nicks_item = {
        "title":"nicksitem",
        "condition":"new",
        "description":"nicks item",
        "starting_price": 1.6,
        "end_date": "2022-02-18T17:38:36"
    }
    res_status = requests.post(items_url, headers=nick_auth, json=nicks_item).status_code
    assert(res_status == 200)

#TC 6. Mary adds an item for auction with an expiration time using her token.
def test_mary_can_add_item_with_token():
    end_date = datetime.datetime.now() + datetime.timedelta(seconds=120)

    marys_item = {
        "title":"marysitem",
        "condition":"new",
        "description":"marys item",
        "starting_price": 20.6,
        "end_date": end_date.isoformat()
    }
    res = requests.post(items_url, headers=mary_auth, json=marys_item)
    res_status = res.status_code

    global marys_item_id #set marys item id for the next tests
    marys_item_id = res.json()['_id']

    assert(res_status == 200)

#TC 7. Nick and Olga browse available items; there should be three items available
def test_nick_and_olga_count_three_items():
    nick_res = requests.get(items_url, headers=nick_auth).json()
    olga_res = requests.get(items_url, headers=olga_auth).json()

    assert(len(olga_res) == 3 and len(nick_res) == 3)

#TC 8. Nick and Olga get the details of Mary’s item.
def test_nick_and_olga_can_get_marys_item():
    marys_item = items_url + marys_item_id
    nick_res_status = requests.get(marys_item, headers=nick_auth).status_code
    olga_res_status = requests.get(marys_item, headers=olga_auth).status_code

    assert(nick_res_status == 200 and olga_res_status == 200)

#TC 9. Mary bids for her item. This call should be unsuccessful; an owner cannot
#bid for their items
def test_mary_cant_bid_for_her_own_item():
   bid_marys_item = bid_url + marys_item_id
   bid = {
       "amount":50
   }
   res_status = requests.post(bid_marys_item, headers=mary_auth, json=bid).status_code 

   assert(res_status == 400)

#TC 10. Nick and Olga bid for Mary’s item in a round-robin fashion (one after the
#other).
def bid_item(item_url, user_auth, amount):
    bid = {
        "amount":amount
    }
    return requests.post(item_url, headers=user_auth, json=bid)

def test_nick_and_olga_can_bid_on_marys_item():
    bid_marys_item = bid_url + marys_item_id
    nicks_bid = 21
    olgas_bid = 22
    nicks_res = True
    olgas_res = True
    timeout = time.time() + 60
    while True: #item can't expire during this loop
        #all nicks bids should be ok
        nicks_res = nicks_res and (bid_item(bid_marys_item, nick_auth, nicks_bid).status_code == 200)
        time.sleep(10)
        #all olgas bids should be ok
        olgas_res = olgas_res and (bid_item(bid_marys_item, olga_auth, olgas_bid).status_code == 200)
        if time.time() > timeout:
            break
        nicks_bid = nicks_bid + 5
        olgas_bid = olgas_bid + 5
        time.sleep(10)

    assert(nicks_res and olgas_res)

#TC 11. Nick or Olga wins the item after the end of the auction
def test_nick_or_olga_win():
    time.sleep(120)
    auction_url = items_url + marys_item_id + '/auction'
    nick_id = '620ebc4d9385d395ce9b163b'
    olga_id = '620ebc4d9385d395ce9b1638'
  
    auction_winner = requests.get(auction_url, headers=nick_auth).json()["winner"]["userid"]

    assert(auction_winner == nick_id or auction_winner == olga_id)

#TC 12. Olga browses all the items sold.
def test_olga_can_browse_sold_items():
    sold_url = items_url + "sold"
    res_status = requests.get(sold_url, headers=olga_auth).status_code

    assert(res_status == 200)

#TC 13. Mary queries for a list of bids as historical records of bidding actions of her
#sold item.
def test_mary_can_browse_item_history():
    item_history_url = items_url + marys_item_id + '/history'
    res_status = requests.get(item_history_url, headers=mary_auth).status_code

    assert(res_status == 200)
