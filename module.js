var m = (function() {

    function perf_median(sequence) {
        sequence.sort();  // note that direction doesn't matter
        return sequence[Math.ceil(sequence.length / 2)];
    }

    var INT_TO_SYM = {
        1: '2C',
        2: '3C',
        3: '4C',
        4: '5C',
        5: '6C',
        6: '7C',
        7: '8C',
        8: '9C',
        9: 'TC',
        10: 'JC',
        11: 'QC',
        12: 'KC',
        13: 'AC',
        14: '2D',
        15: '3D',
        16: '4D',
        17: '5D',
        18: '6D',
        19: '7D',
        20: '8D',
        21: '9D',
        22: 'TD',
        23: 'JD',
        24: 'QD',
        25: 'KD',
        26: 'AD',
        27: '2H',
        28: '3H',
        29: '4H',
        30: '5H',
        31: '6H',
        32: '7H',
        33: '8H',
        34: '9H',
        35: 'TH',
        36: 'JH',
        37: 'QH',
        38: 'KH',
        39: 'AH',
        40: '2S',
        41: '3S',
        42: '4S',
        43: '5S',
        44: '6S',
        45: '7S',
        46: '8S',
        47: '9S',
        48: 'TS',
        49: 'JS',
        50: 'QS',
        51: 'KS',
        52: 'AS'
    };


    var sort_cards = function (cards) {
        return cards.sort(function (a, b) {
            return b - a
        });
    };


    var get_card_symbols = function (cards) {
        /* cards: array of integers
         returns: array of symbols
         */
        r = [];
        for (var i = 0; i < cards.length; i++) {
            r.push(INT_TO_SYM[cards[i]]);
        }
        return r;
    };


    var get_cards = function (all, subset) {
        var r;
        r = all.filter(function (n) {
            return subset.indexOf(n) != -1;
        });
        return sort_cards(r);
    }

    var get_clubs = function(cards) {
        return get_cards(cards, [1,2,3,4,5,6,7,8,9,10,11,12,13]);
    }

    var get_diamonds = function(cards) {
        return get_cards(cards, [14,15,16,17,18,19,20,21,22,23,24,25,26]);
    }

    var get_hearts = function (cards) {
        return get_cards(cards, [27,28,29,30,31,32,33,34,35,36,37,38,39]);
    }

    var get_spades = function (cards) {
        return get_cards(cards, [40,41,42,43,44,45,46,47,48,49,50,51,52]);
    }

    var get_honours = function (cards) {
        return {tens: get_cards(cards, [9, 22, 35, 48]).length,
            jacks: get_cards(cards, [10, 23, 36, 49]).length,
            queens: get_cards(cards, [11, 24, 37, 50]).length,
            kings: get_cards(cards, [12, 25, 38, 51]).length,
            aces: get_cards(cards, [13, 26, 39, 52]).length};
    }


    var calc_hcp = function (honours) {
        return honours.jacks*1 + honours.queens*2 + honours.kings*3 + honours.aces*4
    }

    var get_long_points = function (suit_length) {
        if (suit_length > 4) {
            return suit_length - 4;
        }
        else {
            return 0;
        }
    }

    var get_short_points = function (suit_length) {
        if (suit_length === 0) {return 3;}
        else if (suit_length === 1) {return 2;}
        else if (suit_length === 2) {return 1;}
        else {return 0;}
    }

    var pointsOk = function (points_sel, npoints) {
        switch (points_sel) {
            case 0:
                // don't care
                return true
                break
            case 1:
                // lp
                if (this.lp.total === npoints) {
                    return true;}
                else {
                    return false;
                }
                break
            case 2:
                // hcp
                if (this.hcp.total === npoints) {
                    return true;}
                else {
                    return false;
                }
                break
            case 3:
                // sp
                if (this.sp.total === npoints) {
                    return true;}
                else {
                    return false;
                }
                break
        }
        return false;
    }

    var get_ltc = function (suit_count, suit_honours) {
        // get losing trick count

        var nwinners=0;
        if  (suit_honours.aces === 1 && suit_count === 1) {
            nwinners = 1;}
        else if (suit_honours.aces === 1 && suit_honours.kings === 1) {
            nwinners = 2;}
        else if (suit_honours.aces === 1 && suit_honours.kings === 1 && suit_honours.queens === 1) {
            nwinners = 3;}
        else if (suit_honours.aces === 1 && suit_honours.queens === 1 && suit_count >= 3) {
            nwinners = 2;}
        else if (suit_honours.queens === 1 && suit_honours.jacks === 1 && suit_count === 2) {
            nwinners = 0;}
        else if (suit_honours.queens === 1 && suit_honours.jacks === 1 && suit_count > 2) {
            nwinners = 1;}
        else if (suit_honours.aces === 1 && suit_honours.jacks === 1 && suit_honours.tens === 1) {
            nwinners = 1.5;}
        else if (suit_honours.queens === 1 && suit_honours.tens === 1 && suit_count >= 3) {
            nwinners = 1;}
        else if (suit_honours.aces === 1 && suit_honours.queens === 1 && suit_count === 2) {
            nwinners = 1.5;}
        else if (suit_honours.aces === 1) {
            nwinners = 1}
        else if (suit_honours.kings === 1) {
            nwinners = 1;}
        else if (suit_honours.queens === 1 && suit_count >= 3) {
            nwinners = 0.5;}
        if (suit_count > 3) {
            suit_count = 3;
        }
        ltc = suit_count - nwinners
        return ltc
    }


    var hasPoints = function(points_type, points) {
        switch (points_type) {
            case 'hcp':
                if (this.hcp.total === points) {
                    return true;
                }
                break;
            case 'lp':
                if (this.lp.total === points) {
                    return true;
                }
                break;
            case 'sp':
                if (this.sp.total === points) {
                    return true;
                }
                break;
        }
        return false;
    };

    var hasDistr = function(nspades, nhearts, ndiamonds, nclubs) {
        if (this.count.spades === nspades && this.count.hearts === nhearts &&
            this.count.diamonds === ndiamonds && this.count.clubs === nclubs) {
            return true;
        }
        return false
    };

    var Deal = function () {
        /* deal random cards
         returns object o
         o.a		hand1
         o.b		hand2
         o.c		hand3
         o.d		hand4
         */

        var displayObj = function () {
            return 'hand1: ' + get_card_symbols(sort_cards(this.a))
                + '\nhand2: ' + get_card_symbols(sort_cards(this.b))
                + '\nhand3: ' + get_card_symbols(sort_cards(this.c))
                + '\nhand4: ' + get_card_symbols(sort_cards(this.d));
        };

        var result = [];
        var deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
            14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
            27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
            40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];
        var i = 1;
        while (i <= 52) {
            result.push(deck.splice(Math.round(Math.random() * (deck.length - 1)), 1).pop());
            i++;
        }
        this.a = result.slice(0, 13);
        this.b = result.slice(13, 26);
        this.c = result.slice(26, 39);
        this.d = result.slice(39, 52);

        this.toString = displayObj;
    }


    var Hand = function(cards) {

        var displayObj = function() {
                            return 'hand : ' + this.display_cards(sort_cards(this.cards)) + '\n'
                                + 'distr: ' + this.distr + '\n'
                                + 'hcp  : ' + this.hcp.total + '\n'
                                + 'lp   : ' + this.lp.total + '\n'
                                + 'sp   : ' + this.sp.total + '\n'
                                + 'ltc  : ' + this.ltc.total + '\n';
                        }


        this.cards = cards;

        this.suits =    {clubs: get_clubs(this.cards),
                        diamonds: get_diamonds(this.cards),
                        hearts: get_hearts(this.cards),
                        spades: get_spades(this.cards)};

        this.honours = {clubs: get_honours(this.suits.clubs),
                        diamonds: get_honours(this.suits.diamonds),
                        hearts: get_honours(this.suits.hearts),
                        spades: get_honours(this.suits.spades),
                        total: get_honours(cards)};

        this.hcp =      {clubs: calc_hcp(this.honours.clubs),
                        diamonds: calc_hcp(this.honours.diamonds),
                        hearts: calc_hcp(this.honours.hearts),
                        spades: calc_hcp(this.honours.spades)};
        this.hcp.total = this.hcp.clubs + this.hcp.diamonds + this.hcp.hearts +this.hcp.spades;

        this.count = {clubs: this.suits.clubs.length,
                      diamonds: this.suits.diamonds.length,
                      hearts: this.suits.hearts.length,
                      spades: this.suits.spades.length};

        this.distr = [this.count.spades, this.count.hearts, this.count.diamonds, this.count.clubs];

        this.lp =   {clubs: get_long_points(this.count.clubs) + this.hcp.clubs,
                    diamonds: get_long_points(this.count.diamonds) + this.hcp.diamonds,
                    hearts: get_long_points(this.count.hearts) + this.hcp.hearts,
                    spades: get_long_points(this.count.spades) + this.hcp.spades};
        this.lp.total = this.lp.clubs + this.lp.diamonds + this.lp.hearts +this.lp.spades;

        this.sp = {	clubs: get_short_points(this.count.clubs) + this.hcp.clubs,
                    diamonds: get_short_points(this.count.diamonds) + this.hcp.diamonds,
                    hearts: get_short_points(this.count.hearts) + this.hcp.hearts,
                    spades: get_short_points(this.count.spades) + this.hcp.spades};
        this.sp.total = this.sp.clubs + this.sp.diamonds + this.sp.hearts +this.sp.spades;

        this.ltc = {clubs: get_ltc(this.count.clubs, this.honours.clubs),
                    diamonds: get_ltc(this.count.diamonds, this.honours.diamonds),
                    hearts: get_ltc(this.count.hearts, this.honours.hearts),
                    spades: get_ltc(this.count.spades, this.honours.spades)};
        this.ltc.total = this.ltc.clubs + this.ltc.diamonds + this.ltc.hearts +this.ltc.spades;

        this.display_cards = function(cards) {return get_card_symbols(cards);};

        this.hasPoints = hasPoints;
        this.hasDistr = hasDistr;

        this.toString = displayObj;
    };


    var Combine = function (hand1, hand2) {
        // combine two Hand objects

        var displayObj = function() {
            return 'Combine' + '\n'
                   + 'distr: ' + [this.count.spades, this.count.hearts, this.count.diamonds, this.count.clubs] + '\n'
                   + 'hcp: ' + this.hcp.total + '\n'
                   + 'lp: ' + this.lp.total + '\n'
                   + 'sp: ' + this.sp.total + '\n'
        }

        this.count = {spades: hand1.count.spades + hand2.count.spades,
                      hearts: hand1.count.hearts + hand2.count.hearts,
                      diamonds: hand1.count.diamonds + hand2.count.diamonds,
                      clubs: hand1.count.clubs + hand2.count.clubs};
        this.hcp = {total: hand1.hcp.total + hand2.hcp.total};
        this.lp = {total: hand1.lp.total + hand2.lp.total};
        this.sp = {total: hand1.sp.total + hand2.sp.total};

        this.hasPoints = hasPoints;
        this.hasDistr = hasDistr;

        this.toString = displayObj;
    };

    var make_hand = function(hand_sel, combo_sel) {

        var perf_getStamp = dateNow;

        var perf_t0, perf_t1;
        var perf_deal = [];
        var perf_hands = []

        var max_iterations = 1000;
        var k = 0;
        while (k < max_iterations) {
            var hand_found = false;

            perf_t0 = perf_getStamp();
            deal = new Deal();
            perf_t1 = perf_getStamp();
            perf_deal.push(perf_t1 - perf_t0);

            perf_t0 = perf_getStamp();
            hands = [new Hand(deal.a), new Hand(deal.b), new Hand(deal.b), new Hand(deal.d)];
            perf_t1 = perf_getStamp();
            perf_hands.push(perf_t1 - perf_t0);


            for (var i = 0; i < 4; i++) {
                // test each hand
                if (hand_sel.points.include && hand_sel.distr.include) {
                    // points and distribution selection criteria
                    if (hands[i].hasPoints(hand_sel.points.type, hand_sel.points.count) &&
                        hands[i].hasDistr(hand_sel.distr.spades, hand_sel.distr.hearts, hand_sel.distr.diamonds, hand_sel.distr.clubs)) {
                        //  hand found
                        var hand_found = true;
                        break;
                    }
                }
                else if (hand_sel.points.include) {
                    // points only criteria
                    if (hands[i].hasPoints(hand_sel.points.type, hand_sel.points.count)) {
                        var hand_found = true;
                        break;
                    }
                }
                else if (hand_sel.distr.include) {
                    // distr only criteria
                    if (hands[i].hasPoints(hand_sel.points.type, hand_sel.points.count) &&
                        hands[i].hasDistr(hand_sel.distr.spades, hand_sel.distr.hearts, hand_sel.distr.diamonds, hand_sel.distr.clubs)) {
                        var hand_found = true;
                        break;
                    }
                }
                else {
                    // no hand selection criteria, just return first hand
                    var hand_found = true;
                    break;
                }
            }
            if (hand_found === true) {
                break;
            }
            k++;
        }
        console.log('iterations: ' + k);
        var result = {hand_found: hand_found};
        if (hand_found) {
            result.index = i;
            result.hands = hands;
        }
        return result;
    };


/*
                perf_deal: perf_deal,
                perf_deal_median: perf_median(perf_deal),
                perf_hands: perf_hands,
                perf_hands_median: perf_median(perf_hands)};
*/


/*
    teams = {1: {A:hand1, B:hand2},
             2: {A:hand3, B:hand4}};
    return teams
*/

//  make public
    return {
        Deal       : Deal,          // Deal constructor, deal = new moduleName.Deal()
        Hand       : Hand,          // Hand constructor, hand - new moduleName.Hand(deal.a)
        Combine    : Combine,        // Combine constructor, combo = new moduleName.Combine(hand1, hand2)
        make_hand  : make_hand
    }

})();


deal = new m.Deal();
hand1 = new m.Hand(deal.a);
console.log(hand1);
hand2 = new m.Hand(deal.b);
console.log(hand2);
combo = new m.Combine(hand1, hand2);
console.log(combo);

hand_sel = {points: {include: false, type: 'hcp', count: 10 },
            distr:  {include: false, spades: 5, hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type: 'hcp', count: 13},
            distr:  {include: false, spades: 4, hearts:3, diamonds:3, clubs:3}};
var p = m.make_hand(hand_sel, combo_sel);

if (p.hand_found) {
    console.log(p.hands[p.index]);
}
else {console.log('No hand found');}