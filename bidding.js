/**
 * Created by swannsg on 2016/02/15.
 */
load(['module.js']);
load(['bidding_rules.js']);






/*
function get_result_of_bid_rules(hand, bo ) {
    // (h)and, (b)id (o)bject
    var rules = bo.rules;
    var rules_result = [];
    for (var i = 0; i < rules.length; i++) {
        // iterate over rules which contains a rule object
        var conditions = rules[i].conditions;
        var each_bid = {};
        var each_bid_key = rules[i].bid
        each_bid[each_bid_key] = [];
        for (var k = 0; k < conditions.length; k++) {
            // iterate over conditions and get each condition
            var condition = conditions[k];
            switch (condition[0]) {
                case 'hasPoints':
                    each_bid[each_bid_key].push(hasPoints(condition[1], condition[2], condition[3], hand));
                    break;
                case 'hasSuitLength':
                    each_bid[each_bid_key].push(hasSuitLength(condition[1], condition[2], condition[3], hand));
                    break;
            }
        }
        rules_result.push(each_bid);
    }
    return rules_result;
    // return only where all conditions evaluate to true
    var final_result = [];
    for (var i=0; i < rules_result.length; i++) {

    }

}


function hasPoints(points_type, lb, ub, hand) {
    switch (points_type) {
        case 'lp':
            if ((hand.lp.total>=lb) && (hand.lp.total<=ub)) {
                return true;
            }
            else {
                return false;
            }
        case 'hcp':
            if ((hand.hcp.total>=lb) && (hand.hcp.total<=ub)) {
                return true;
            }
            else {
                return false;
            }
        case 'hcp':
            if ((hand.sp.total>=lb) && (hand.sp.total<=ub)) {
                return true;
            }
            else {
                return false;
            }
    }
    return false;
}

function get_suit_name(suit_char) {
    switch (suit_char) {
        case 's':
            return 'spades';
        case 'h':
            return 'hearts';
        case 'd':
            return 'diamonds';
        case 'c':
            return 'clubs';
    }
}



function hasSuitLength(suit, condition, count, hand) {

    suit = get_suit_name(suit);
    var suit_length = hand.count[suit];
    switch (condition) {
        case 'gte':
            if (suit_length >= count) {
                return true;
            }
            else {
                return false;
            }

        case 'eq':
            if (suit_length === count) {
                return true;
            }
            else {
                return false;
            }
    }
}

function isBalanced(hand) {

    var nil = 0;
    var singleton = 0;
    var doubleton = 0;

    function countNil(count) {
        if (count === 0) {
            nil++;
        }
    }

    function countSingleton(count) {
        if (count === 0) {
            singleton++;
        }
    }

    function countDoubleton(count) {
        if (count === 0) {
            doubleton++;
        }
    }

    countNil(hand.count.clubs);
    countSingleton(hand.count.clubs);
    countDoubleton(hand.count.clubs);

    countNil(hand.count.diamonds);
    countSingleton(hand.count.diamonds);
    countDoubleton(hand.count.diamonds);

    countNil(hand.count.hearts);
    countSingleton(hand.count.hearts);
    countDoubleton(hand.count.hearts);;

    countNil(hand.count.spades);
    countSingleton(hand.count.spades);
    countDoubleton(hand.count.spades);

    if (nil >= 1) {
        return false;
    }

    if (singleton >= 1) {
        return false;
    }

    if (doubleton >= 2) {
        return false;
    }
    return true;
}

function no5CardMajor(hand) {
    if ((hand.count.spades < 5) && (hand.count.hearts < 5)) {
        return true;
    }
    return false;
}

function hasSuitHonours(suit, count, hand) {

    var honours_count = 0
    suit = get_suit_name(suit);
    if (hand.honours[suit].jacks == 1) {
        honours_count++;
    }
    if (hand.honours[suit].queens == 1) {
        honours_count++;
    }
    if (hand.honours[suit].kings == 1) {
        honours_count++;
    }
    if (hand.honours[suit].acess == 1) {
        honours_count++;
    }
    return honours_count;
}
*/

function find(bidding_state, previous_bid) {
    //db is global "database" structure
    //    to be replaced with MongoDB
    //find the correct state + prev_bid
    //cr = correct row in db
    console.log('find cr');
    for (var i= 0; i< db.length; i++) {
        var row = db[i];
        console.log(row.state);
        console.log(row.previous_bid);
        if (bidding_state === db[i].state && previous_bid == db[i].previous_bid) {
            //row found
            return db[i];
        }
    }
    return 'not found';
}

function get_next_bid(next_bid, hand) {
     /*
     'next_bid': [
     {'rules': ["hasPointsBand('lp', 0, 5)"], 'bid': 'nb'},
     {'rules': ["hasPointsBand('lp', 6, 9)", "hasSuitLength('h', 'gte', 4)"], 'bid': '1h'}
     ]

     'possible_bids' will contain list of possible bids whose rules evaluate to true
     possible_bids = ['1s', '1h']
     */
    var possible_bids = {};
    for (var i=0; i<next_bid.length; i++) {
        //    {'rules': ["hasPointsBand('lp', 0, 5)", ...], 'bid': 'nb', next_state: 'responder'}
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
    return possible_bids;
}

function select_bid(possible_bids, next_bid_priority) {
    // possible_bids = {1c: responder, 1d: next_state, .....}
    //    returns {2h: next_state}

    var bids = Object.keys(possible_bids);
    if (bids.length == 0) {
        // only one possible bid
        return possible_bids;
    }
    else {
        // select priority bid
        for (var i = 0; i < next_bid_priority.length; i++) {
            // element next_bid_priority[i]
            if (bids.includes(next_bid_priority[i])) {
                var result = {}
                result[next_bid_priority[i]] = possible_bids[next_bid_priority[i]]
                return result;
            }
        }
    }
    console.log('no bid found - problem in definition');
}

function BidManager(teams) {
    /*  Who starts bidding
        Who bids next
        Record sequence of bids
        Checks if next bid is legal

        teams
             {found: true,
             iterations: result.iterations,
             team1: {A: Hand_1,     B: Hand_2},
             team2: {A: Hand_3,     B: Hand_4}
             }

    */
    // team x
    this.xa = teams.teams1.A;
    this.xb = teams.teams1.B;
    // team y
    this.ya = teams.teams1.A;
    this.yb = teams.teams1.B;


}






var hand_sel =  {points: {include: true, type  : 'lp', count: 14 },
    distr  : {include: true, spades: 5,     hearts:3, diamonds:3, clubs:2}};
var combo_sel = {points: {include: false, type  : 'lp',  count: 20},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};

console.log('start');
// very first time bidding starts
var bm = new BidManager();


/*


var hands = new m.make_hand(hand_sel, combo_sel);

//north
var n = hands.team1.A;
//south
var s = hands.team1.B;

// start bidding cycle







var keep_bidding = true;
var bidding_state = 'opener';
var previous_bid = 'none';
var which_hand 

while (keep_bidding) {
    // in db find bidding_state + previous_bid
    // to be replaced by MongoDB
    var db_row = find(bidding_state, previous_bid);
    // get set of next possible bids
    var possible_bids = get_next_bid(db_row.next_bid, n);



// select best bid
console.log(JSON.stringify(possible_bids));
var next_bid = select_bid(possible_bids, db_row.next_bid_priority)
*/
