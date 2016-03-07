/**
 * Created by swannsg on 2016/03/05.
 */

load(['../jspy/py_lite.js']);
load(['deal.js']);
load(['db_stub.js']);

'use strict';

var isOpposition = function(int) {
    if (int===1 || int===3) {
        return true;
    }
    return false;
};


var get_partners_previous_bid = function(bid_seq) {
    if (bid_seq.length >=2) {
        return bid_seq[bid_seq.length - 2];
    }
    else {
        // opening bid
        return 'none';
    }
};

var find_next_bid = function(state, partners_prev_bid, hand, db){
    // will be replaced with mongoDB
    var row;
    for (var i= 0; i< db.length; i++) {
        row = db[i];
        if (row.state===state && row.previous_bid===partners_prev_bid) {
            // correct row is found
            console.log('find_next_bid found: ' + state, partners_prev_bid);
            return row;
        }
        else {
            // row not found
            console.log('find_next_bid NOT found: ' + state, partners_prev_bid);
            return false;
        }
    }
}


var get_possible_bids = function(next_bid, hand) {
    /*
    * next_bid = db.row.next_bid = [ {rules:[],next_state:str,bid:str}, ...]
    * */
    possible_bids = {};
    for (var i=0;i<next_bid.length;i++) {
        var temp = [];
        for (var j=0; j< next_bid[i].rules.length; j++) {
            // evaluate each rule
            // !!! we should check the value of next_bid.rules[j] because we are going to execute this as code
            var js_cmd = 'hand.' + next_bid[i].rules[j];
            temp.push(eval(js_cmd));
        }
        if (!temp.includes(false)){
            // temp array contains all true
            possible_bids[next_bid[i].bid] = next_bid[i].next_state;
        }
    }
    if (Object.keys(possible_bids).length===0) {
        console.log('get_possible_bids: error! possible_bids {} is empty');
    }

    return possible_bids;
    //{'1c':state, 1d:state}
};

var select_bid = function(possible_bids, next_bid_priority) {
    var bids = Object.keys(possible_bids);
    if (bids.length===1) {
        // only one bid possible
        return possible_bids;
    }
    // select priority bid
    for (var i = 0; i < next_bid_priority.length; i++) {
        // element next_bid_priority[i]
        if (bids.includes(next_bid_priority[i])) {
            var result = {}
            result[next_bid_priority[i]] = possible_bids[next_bid_priority[i]]
            return result;
        }
    }
    console.log('select_bid: error! no bid selected');
};




// make a board
var hand_sel =  {points: {include: false, type  : 'hcp', count: 10 },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
var combo_sel = {points: {include: false, type  : 'lp',  count: 20},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
var board = new deal.make_hand(hand_sel, combo_sel)
if (!board.found) {
    console.log('no hand dealt');
    // exit module
}

// bidding for board that has been dealt
var dlr = board.team1.A;  // dealer
var lho = board.team2.A;  // left hand opposition
var rsp = board.team1.B;  // responder
var rho = board.team2.B   // right hand opposition

var state = 'opener';		    //intial state
var npasses = 0;				//number of consecutive passes
var nround = 0;				    //round number 1st, 2nd, 3rd
var bid_seq = [];			    //sequence of bids
var bidding_continues = true;
var dealer = 'team1.A';
var hands_in_bid_order = [dlr, lho, rsp, rho];
var bid = '';
while (bidding_continues) {
    // start round of bidding
    nround++
    // loop through each hand
    for (var i=0;i<hands_in_bid_order.length;i++) {
        if (isOpposition(i)) {
            // opposition bid
            bid = 'nb';
            bid_seq.push('nb');     // 'pass' or 'no bid'
            continue;
        }
        else if (!isOpposition(i)) {
            // own teams bid
            var result = find_next_bid(state, get_partners_previous_bid(bid_seq), hands_in_bid_order[i],db)
            if (!result) {
                // cannot find row in db
                bid = 'stuck';
                bidding_continues = false;
                console.log('cannot find row in db');
            }
            else {
                // row in db is found, result = row in db
                // get  possible bids {1c:state, 1d:state, ....}
                var possible_bids = get_possible_bids(result.next_bid, hands_in_bid_order[i]);
                result = select_bid(possible_bids, result.next_bid_priority);
                bid = Object.keys(result)[0]
                state = result[Object.keys(result)[0]];
                bid_seq.push(bid);
                if (bid=='nb' && state=='opener') {
                    // if opener passes and only happens once
                    npasses = npasses - 1
                }
            }
        }
        // check for 3 consecutive passes to show bidding is over
        if (bid==='nb') {
            npasses++
            if (npasses===3) {
                bidding_continues = false
                break;
            }
        }
        else {
            // not a pass so reset npasses
            npasses =0;
        }
    }
}

var result = {}
result.dealer = 'team1.A'
result.bid_seq = bid_seq
result.deal = [dlr.cards, lho.cards, rsp.cards, rho.cards]
