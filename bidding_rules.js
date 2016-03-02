/**
 * Created by swannsg on 2016/02/16.
 */

/*

bidding_space = [
    {state   : 'xxxx',
     prev_bid: 'xx',
     next_bid: [
         {bid: 'xx', rules: ['rule1', 'rule2', 'rule3'],
         {bid: 'xx', rules: ['rule1', 'rule2', 'rule3'],
     ]
    }
]

*/

//here x is the bidding space
var db = [{'state': 'opener', 'next_bid_priority': ['2nt', '1s', '1h', '1nt', '1d', '1c'], 'next_bid': [{'rules': ["hasPointsBand('hcp', 0, 12)"], 'bid': 'nb', 'next_state': 'responder'}, {'rules': ["hasPointsBand('lp', 13, 22)", "hasSuitLength('c', 'gte', 2)", "hasSuitLength('d', 'lt', 4)", "hasSuitLength('h', 'lte', 4)", "hasSuitLength('s', 'lte', 4)"], 'bid': '1c', 'next_state': 'responder'}, {'rules': ["hasPointsBand('lp', 13, 22)", "hasSuitLength('d', 'gte', 4)", "hasSuitLength('h', 'lte', 4)", "hasSuitLength('s', 'lte', 4)"], 'bid': '1d', 'next_state': 'responder'}, {'rules': ["hasPointsBand('lp', 13, 22)", "hasSuitLength('h', 'gte', 5)", "hasSuitLength('s', 'lte', 4)"], 'bid': '1h', 'next_state': 'responder'}, {'rules': ["hasPointsBand('lp', 13, 22)", "hasSuitLength('s', 'gte', 5)"], 'bid': '1s', 'next_state': 'responder'}, {'rules': ["hasPointsBand('hcp', 15, 17)", "hasSuitLength('h', 'lte', 4)", "hasSuitLength('s', 'lte', 4)", "hasDoubletons('lte', 1)"], 'bid': '1nt', 'next_state': 'responder'}, {'rules': ["hasPointsBand('hcp', 23, 40)"], 'bid': '2c', 'next_state': 'responder'}, {'rules': ["hasPointsBand('hcp', 6, 11)", "hasSuitLength('d', 'eq', 6)"], 'bid': '2d', 'next_state': 'responder'}, {'rules': ["hasPointsBand('hcp', 6, 11)", "hasSuitLength('h', 'eq', 6)"], 'bid': '2h', 'next_state': 'responder'}, {'rules': ["hasPointsBand('hcp', 6, 11)", "hasSuitLength('s', 'eq', 6)"], 'bid': '2s', 'next_state': 'responder'}, {'rules': ["hasPointsBand('hcp', 20, 21)", "hasSuitLength('h', 'lte', 4)", "hasSuitLength('s', 'lte', 4)", "hasDoubletons('lte', 1)"], 'bid': '2nt', 'next_state': 'responder'}], 'previous_bid': 'none'}, {'state': 'responder', 'next_bid_priority': [], 'next_bid': [{'rules': [], 'bid': 'nb', 'next_state': 'p'}, {'rules': ["hasSuitLength('d', 'gte', 4)"], 'bid': '1d', 'next_state': 'p'}], 'previous_bid': '1c'}, {'state': 'responder', 'next_bid_priority': [], 'next_bid': [{'rules': [], 'bid': 'nb', 'next_state': 'p'}, {'rules': ["hasSuitLength('h', 'gte', 4)"], 'bid': '1h', 'next_state': 'p'}], 'previous_bid': '1d'}, {'state': 'responder', 'next_bid_priority': [], 'next_bid': [{'rules': [], 'bid': 'next_stat', 'next_state': 'e'}, {'rules': [], 'bid': 'nb', 'next_state': 'p'}, {'rules': ["hasSuitLength('d', 'gte', 4)"], 'bid': '1d', 'next_state': 'p'}], 'previous_bid': '1nt'}]
