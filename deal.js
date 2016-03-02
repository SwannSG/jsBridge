load(['../jspy/py_lite.js']);


(function() {

    var global_name = 'deal'

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

    var MAX_ITERATIONS = 1000000;

        var sort_cards = function (cards) {
            // sort array of cards in descending order
            return cards.sort(function (a, b) {
                return b - a
            });
        };


    var main = function() {
        var get_card_symbols = function (cards) {
            /*
             cards: array of integers
             returns: array of symbols         */
            return cards.map(function (x) {
                return INT_TO_SYM[x]
            })
        };


        var get_honours = function (cards) {
            return {
                tens: _.intersection(cards, [9, 22, 35, 48]).length,
                jacks: _.intersection(cards, [10, 23, 36, 49]).length,
                queens: _.intersection(cards, [11, 24, 37, 50]).length,
                kings: _.intersection(cards, [12, 25, 38, 51]).length,
                aces: _.intersection(cards, [13, 26, 39, 52]).length
            };
        };


        var calc_hcp = function (honours) {
            return honours.jacks * 1 + honours.queens * 2 + honours.kings * 3 + honours.aces * 4
        };

        var get_long_points = function (suit_length) {
            if (suit_length > 4) {
                return suit_length - 4;
            }
            else {
                return 0;
            }
        };

        var get_short_points = function (suit_length) {
            if (suit_length === 0) {
                return 3;
            }
            else if (suit_length === 1) {
                return 2;
            }
            else if (suit_length === 2) {
                return 1;
            }
            else {
                return 0;
            }
        };

        var pointsOk = function (points_sel, npoints) {
            switch (points_sel) {
                case 0:
                    // don't care
                    return true;
                    break;
                case 1:
                    // lp
                    if (this.lp.total === npoints) {
                        return true;
                    }
                    else {
                        return false;
                    }
                    break;
                case 2:
                    // hcp
                    if (this.hcp.total === npoints) {
                        return true;
                    }
                    else {
                        return false;
                    }
                    break;
                case 3:
                    // sp
                    if (this.sp.total === npoints) {
                        return true;
                    }
                    else {
                        return false;
                    }
                    break;
            }
            return false;
        };

        var get_ltc = function (suit_count, suit_honours) {
            // get losing trick count

            var nwinners = 0;
            if (suit_honours.aces === 1 && suit_count === 1) {
                nwinners = 1;
            }
            else if (suit_honours.aces === 1 && suit_honours.kings === 1) {
                nwinners = 2;
            }
            else if (suit_honours.aces === 1 && suit_honours.kings === 1 && suit_honours.queens === 1) {
                nwinners = 3;
            }
            else if (suit_honours.aces === 1 && suit_honours.queens === 1 && suit_count >= 3) {
                nwinners = 2;
            }
            else if (suit_honours.queens === 1 && suit_honours.jacks === 1 && suit_count === 2) {
                nwinners = 0;
            }
            else if (suit_honours.queens === 1 && suit_honours.jacks === 1 && suit_count > 2) {
                nwinners = 1;
            }
            else if (suit_honours.aces === 1 && suit_honours.jacks === 1 && suit_honours.tens === 1) {
                nwinners = 1.5;
            }
            else if (suit_honours.queens === 1 && suit_honours.tens === 1 && suit_count >= 3) {
                nwinners = 1;
            }
            else if (suit_honours.aces === 1 && suit_honours.queens === 1 && suit_count === 2) {
                nwinners = 1.5;
            }
            else if (suit_honours.aces === 1) {
                nwinners = 1
            }
            else if (suit_honours.kings === 1) {
                nwinners = 1;
            }
            else if (suit_honours.queens === 1 && suit_count >= 3) {
                nwinners = 0.5;
            }
            if (suit_count > 3) {
                suit_count = 3;
            }
            return suit_count - nwinners;
        };


        var hasPoints = function (points_type, points) {
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


        var hasDistr = function (nspades, nhearts, ndiamonds, nclubs) {
            if (this.count.spades === nspades && this.count.hearts === nhearts &&
                this.count.diamonds === ndiamonds && this.count.clubs === nclubs) {
                return true;
            }
            else {
                return false;
            }

        };

        var test_combo = function (hand1, hand2, combo_sel) {
            combo = new Combine(hand1, hand2);
            if (combo_sel.points.include && combo_sel.distr.include) {
                // Combo selection based on points and distribution
                if (combo.hasPoints(combo_sel.points.type, combo_sel.points.count) &&
                    combo.hasDistr(combo_sel.distr.spades, combo_sel.distr.hearts, combo_sel.distr.diamonds, combo_sel.distr.clubs)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (combo_sel.points.include) {
                // Combo selection based on points only
                if (combo.hasPoints(combo_sel.points.type, combo_sel.points.count)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (combo_sel.distr.include) {
                // Combo selection based on distribution only
                if (combo.hasDistr(combo_sel.distr.spades, combo_sel.distr.hearts, combo_sel.distr.diamonds, combo_sel.distr.clubs)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        };


        var get_suit_name = function (suit_char) {
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


        var hasDoubletons = function (condition, count) {
            // test if hand has a certain number of doubletons
            var no_of_doubletons = 0;
            if (this.count.spades == 2) {
                no_of_doubletons++;
            }
            if (this.count.hearts == 2) {
                no_of_doubletons++;
            }
            if (this.count.diamonds == 2) {
                no_of_doubletons++;
            }
            if (this.count.clubs == 2) {
                no_of_doubletons++;
            }
            switch (condition) {
                case 'lte':
                    if (no_of_doubletons <= count) {
                        return true;
                    }
                    else {
                        return false;
                    }
            }
            console.log('hasDoubletons - no solution found')
        };


        var hasPointsBand = function (points_type, lb, ub) {
            // lb = lower bound inclusive, ub = upper bound inclusive
            switch (points_type) {
                case 'hcp':
                    if (this.hcp.total >= lb && this.hcp.total <= ub) {
                        return true;
                    }
                    break;
                case 'lp':
                    if (this.lp.total >= lb && this.lp.total <= ub) {
                        return true;
                    }
                    break;
                case 'sp':
                    if (this.sp.total >= lb && this.sp.total <= ub) {
                        return true;
                    }
                    break;
            }
            return false;
        };


        var hasSuitLength = function (suit, condition, count) {
            suit = get_suit_name(suit);
            var suit_length = this.count[suit];
            switch (condition) {
                case 'gte':
                    if (suit_length >= count) {
                        return true;
                    }
                    else {
                        return false;
                    }

                case 'gt':
                    if (suit_length > count) {
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

                case 'lt':
                    if (suit_length < count) {
                        return true;
                    }
                    else {
                        return false;
                    }

                case 'lte':
                    if (suit_length <= count) {
                        return true;
                    }
                    else {
                        return false;
                    }
            }
        };


        var displayCombineObj = function () {
            return 'Combine' + '\n'
                + 'distr: ' + [this.count.spades, this.count.hearts, this.count.diamonds, this.count.clubs] + '\n'
                + 'hcp: ' + this.hcp.total + '\n'
                + 'lp: ' + this.lp.total + '\n'
                + 'sp: ' + this.sp.total + '\n'
        };


        var displayHandObj = function () {
            return 'hand : ' + get_card_symbols(sort_cards(this.cards)) + '\n'
                + 'distr: ' + this.distr + '\n'
                + 'hcp  : ' + this.hcp.total + '\n'
                + 'lp   : ' + this.lp.total + '\n'
                + 'sp   : ' + this.sp.total + '\n'
                + 'ltc  : ' + this.ltc.total + '\n';
        };

        var displayDealObj = function () {
            return 'hand1: ' + get_card_symbols(sort_cards(this.a))
                + '\nhand2: ' + get_card_symbols(sort_cards(this.b))
                + '\nhand3: ' + get_card_symbols(sort_cards(this.c))
                + '\nhand4: ' + get_card_symbols(sort_cards(this.d));
        };


        /* Deal constructor
         *   Takes no parameters, x = new Deal()
         *   Returns
         *        {o.a: [...] hand1 integers,
         *         o.b: [...] hand2 integers,
         *         o.c: [...] hand3 integers,
         *         o.d: [...] hand4 integers}
         */
        var Deal = function () {
            var deck = _.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
                27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
                40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52])

            this.a = deck.slice(0, 13);
            this.b = deck.slice(13, 26);
            this.c = deck.slice(26, 39);
            this.d = deck.slice(39, 52);

        }
        Deal.prototype = {
            constructor: Deal,
            toString: displayDealObj
        };


        /* Hand constructor
         *   Takes a shuffled pack [cards as integers] as single parameter, x = new Hand(deal)
         *   Returns
         *       {cards  : [shuffled pack passed to constructor],
         *        suits  : {clubs: [..], diamonds: [..], hearts: [..], spades: [..]},
         *        honours: {clubs : {T:n, J:n, Q:n, K:n, A:n}, diamonds: {T:n, J:n, Q:n, K:n, A:n},
         *                  hearts: {T:n, J:n, Q:n, K:n, A:n}, spades  : {T:n, J:n, Q:n, K:n, A:n}},
         *        hcp    : {clubs:n, diamonds:n, hearts:n, spades:n, total:n},
         *        lp    : {clubs:n, diamonds:n, hearts:n, spades:n, total:n},
         *        sp    : {clubs:n, diamonds:n, hearts:n, spades:n, total:n},
         *        ltc    : {clubs:n, diamonds:n, hearts:n, spades:n}}
         *
         *   Methods
         *       hasPoints(points_type, points)
         *           parameters
         *              points_type: 'hcp' or 'lp' or 'sp'
         *           returns boolean
         *               true if hand has the number of points
         *
         *       hasDistr(nspades, nhearts, ndiamonds, nclubs)
         *           parameters
         *               number of spades, hearts, diamonds, clubs
         *           returns boolean
         *               true if hand has the specified distribution
         * */
        var Hand = function (cards) {

            this.cards = cards;

            this.suits = {
                clubs: _.intersection(this.cards, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]),
                diamonds: _.intersection(this.cards, [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]),
                hearts: _.intersection(this.cards, [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]),
                spades: _.intersection(this.cards, [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52])
            };

            this.honours = {
                clubs: get_honours(this.suits.clubs),
                diamonds: get_honours(this.suits.diamonds),
                hearts: get_honours(this.suits.hearts),
                spades: get_honours(this.suits.spades),
                total: get_honours(cards)
            };

            this.hcp = {
                clubs: calc_hcp(this.honours.clubs),
                diamonds: calc_hcp(this.honours.diamonds),
                hearts: calc_hcp(this.honours.hearts),
                spades: calc_hcp(this.honours.spades)
            };
            this.hcp.total = this.hcp.clubs + this.hcp.diamonds + this.hcp.hearts + this.hcp.spades;

            this.count = {
                clubs: this.suits.clubs.length,
                diamonds: this.suits.diamonds.length,
                hearts: this.suits.hearts.length,
                spades: this.suits.spades.length
            };

            this.distr = [this.count.spades, this.count.hearts, this.count.diamonds, this.count.clubs];

            this.lp = {
                clubs: get_long_points(this.count.clubs) + this.hcp.clubs,
                diamonds: get_long_points(this.count.diamonds) + this.hcp.diamonds,
                hearts: get_long_points(this.count.hearts) + this.hcp.hearts,
                spades: get_long_points(this.count.spades) + this.hcp.spades
            };
            this.lp.total = this.lp.clubs + this.lp.diamonds + this.lp.hearts + this.lp.spades;

            this.sp = {
                clubs: get_short_points(this.count.clubs) + this.hcp.clubs,
                diamonds: get_short_points(this.count.diamonds) + this.hcp.diamonds,
                hearts: get_short_points(this.count.hearts) + this.hcp.hearts,
                spades: get_short_points(this.count.spades) + this.hcp.spades
            };
            this.sp.total = this.sp.clubs + this.sp.diamonds + this.sp.hearts + this.sp.spades;

            this.ltc = {
                clubs: get_ltc(this.count.clubs, this.honours.clubs),
                diamonds: get_ltc(this.count.diamonds, this.honours.diamonds),
                hearts: get_ltc(this.count.hearts, this.honours.hearts),
                spades: get_ltc(this.count.spades, this.honours.spades)
            };
            this.ltc.total = this.ltc.clubs + this.ltc.diamonds + this.ltc.hearts + this.ltc.spades;

            if (_.isFunction(hasPoints) !== 'function') {
                Hand.prototype.hasPoints = hasPoints;
            }

            if (_.isFunction(hasDistr) !== 'function') {
                Hand.prototype.hasDistr = hasDistr;
            }

            if (_.isFunction(hasPointsBand) !== 'function') {
                Hand.prototype.hasPointsBand = hasPointsBand;
            }

            if (_.isFunction(hasSuitLength) !== 'function') {
                Hand.prototype.hasSuitLength = hasSuitLength;
            }

            if (_.isFunction(hasDoubletons) !== 'function') {
                Hand.prototype.hasDoubletons = hasDoubletons;
            }


        };
        Hand.prototype = {
            constructor: Hand,
            toString: displayHandObj
        };
        Hand.prototype = {
            constructor: Hand,
            hasPoints: hasPoints
        };
        Hand.prototype = {
            constructor: Hand,
            hasDistr: hasDistr
        };

        Hand.prototype = {
            constructor: Hand,
            hasPointsBand: hasPointsBand
        };

        Hand.prototype = {
            constructor: Hand,
            hasSuitLength: hasSuitLength
        };

        Hand.prototype = {
            constructor: Hand,
            hasDoubletons: hasDoubletons
        };


        /* Combine constructor
         *   Takes two Hand objects as parameters, new Combine(hand1, hand2)
         *   Combines both hand1 and hand2 to get partnership count
         *   Returns
         *       {count: {spades:n, hearts:n, diamonds:n, clubs:n},
         *        hcp  : {total: n},
         *        lp   : {total: n},
         *        sp   : {total: n}}
         *   Methods
         *       hasPoints(points_type, points)
         *           parameters
         *              points_type: 'hcp' or 'lp' or 'sp'
         *           returns boolean
         *               true if hand has the number of points
         *
         *       hasDistr(nspades, nhearts, ndiamonds, nclubs)
         *           parameters
         *               number of spades, hearts, diamonds, clubs
         *           returns boolean
         *               true if hand has the specified distribution
         * */


        var Combine = function (hand1, hand2) {
            // combine two Hand objects


            this.count = {
                spades: hand1.count.spades + hand2.count.spades,
                hearts: hand1.count.hearts + hand2.count.hearts,
                diamonds: hand1.count.diamonds + hand2.count.diamonds,
                clubs: hand1.count.clubs + hand2.count.clubs
            };
            this.hcp = {total: hand1.hcp.total + hand2.hcp.total};
            this.lp = {total: hand1.lp.total + hand2.lp.total};
            this.sp = {total: hand1.sp.total + hand2.sp.total};
            this.distr = [this.count.spades, this.count.hearts, this.count.diamonds, this.count.clubs];

            if (_.isFunction(hasPoints)) {
                Combine.prototype.hasPoints = hasPoints;
            }

            if (_.isFunction(hasDistr)) {
                Combine.prototype.hasDistr = hasDistr;
            }
        };
        Combine.prototype = {
            constructor: Combine,
            toString: displayCombineObj
        };


        var find_hand = function (hand_sel, combo_sel) {
            // find hand that meets hand_sel criteria
            var k = 0;
            while (k < MAX_ITERATIONS) {
                var hand_found = false;
                var deal = new Deal();
                var hands = [new Hand(deal.a), new Hand(deal.b), new Hand(deal.c), new Hand(deal.d)];
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
                        if (hands[i].hasDistr(hand_sel.distr.spades, hand_sel.distr.hearts, hand_sel.distr.diamonds, hand_sel.distr.clubs)) {
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
            var result = {hand_found: hand_found, iterations: k};
            if (hand_found) {
                result.index = i;
                result.hands = hands;
            }
            return result;
        };

        var find_combo_hand_selected = function (find_hand_result, combo_sel) {
            // find combination with hand already selected
            var combo_found = false;
            var other_indexes = _.xor([find_hand_result.index], [0, 1, 2, 3]);
            var combinations = [[find_hand_result.index, other_indexes[0]],
                [find_hand_result.index, other_indexes[1]],
                [find_hand_result.index, other_indexes[2]]];
            for (var j = 0; j < combinations.length; j++) {
                if (test_combo(find_hand_result.hands[combinations[j][0]], find_hand_result.hands[combinations[j][1]], combo_sel)) {
                    combo_found = true;
                    var team2_indexes = _.xor([0, 1, 2, 3], [combinations[j][0], combinations[j][1]]);
                    result = {
                        combo_found: combo_found,
                        team1: {
                            A: find_hand_result.hands[combinations[j][0]],
                            B: find_hand_result.hands[combinations[j][1]]
                        },
                        team2: {
                            A: find_hand_result.hands[team2_indexes[0]],
                            B: find_hand_result.hands[team2_indexes[1]]
                        }
                    };
                    break;
                }
            }
            if (combo_found) {
                return result;
            }
            else {
                return {combo_found: false};
            }
        };


        var find_combo_no_hand_selected = function (combo_sel) {
            // find combination

            var combo_found, deal, hands, j, result;
            var combinations = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
            combo_found = false;
            var k = 0;

            while (k < MAX_ITERATIONS) {
                deal = new Deal();
                hands = [new Hand(deal.a), new Hand(deal.b), new Hand(deal.c), new Hand(deal.d)];
                // test all combinations
                for (j = 0; j < combinations.length; j++) {
                    if (test_combo(hands[combinations[j][0]], hands[combinations[j][1]], combo_sel)) {
                        combo_found = true;
                        var team2_indexes = _.xor([0, 1, 2, 3], [combinations[j][0], combinations[j][1]]);
                        result = {
                            combo_found: combo_found,
                            iterations: k,
                            team1: {A: hands[combinations[j][0]], B: hands[combinations[j][1]]},
                            team2: {A: hands[team2_indexes[0]], B: hands[team2_indexes[1]]}
                        };
                        break;
                    }
                }
                if (combo_found) {
                    break;
                }
                k++;
            }
            if (combo_found) {
                return result;
            }
            else {
                return {combo_found: false, iterations: k};
            }
        }


        /*
         * Wrapper function
         *   Pass hand_sel and combo_sel objects
         *   Returns
         *       if hand or combo is found
         *
         *          { found     : boolean,
         *             iterations: k,
         *             team1: { A: hand_1, B: hands_2 },
         *             team2: { A: hand_3, B: hand_4  } }
         *                   team1 contains the selected combination
         *
         *       hand or combo not found
         *           {found: false, iterations: k}
         *
         * */
        var make_hand = function (hand_sel, combo_sel) {
            if ((hand_sel.points.include === false && hand_sel.distr.include === false) &&
                (combo_sel.points.include === false && combo_sel.distr.include === false)) {
                // no hand or combo selection criteria
                var deal = new Deal();
                var hands = [new Hand(deal.a), new Hand(deal.b), new Hand(deal.c), new Hand(deal.d)];
                return {
                    found: true,
                    iterations: 0,
                    team1: {A: hands[0], B: hands[1]},
                    team2: {A: hands[2], B: hands[3]}
                };
            }

            else if ((hand_sel.points.include === true || hand_sel.distr.include === true) &&
                (combo_sel.points.include === false && combo_sel.distr.include === false)) {
                // only hand selection criteria
                var result = find_hand(hand_sel, combo_sel);
                if (result.hand_found) {
                    other_indexes = _.xor(result.index, [0, 1, 2, 3]);
                    return {
                        found: true,
                        iterations: result.iterations,
                        team1: {A: result.hands[result.index], B: result.hands[other_indexes[0]]},
                        team2: {A: result.hands[other_indexes[1]], B: result.hands[other_indexes[2]]}
                    };
                }
                else {
                    return {found: false, iterations: result.iterations};
                }
            }

            else if ((hand_sel.points.include === false && hand_sel.distr.include === false) &&
                (combo_sel.points.include === true || combo_sel.distr.include === true)) {
                // only combo selection criteria
                var result = find_combo_no_hand_selected(combo_sel);
                if (result.combo_found) {
                    return {
                        found: true,
                        iterations: result.iterations,
                        team1: result.team1,
                        team2: result.team2
                    };
                }
                else {
                    return {found: false, iterations: result.iterations};
                }
            }

            else if ((hand_sel.points.include === true || hand_sel.distr.include === true) &&
                (combo_sel.points.include === true || combo_sel.distr.include === true)) {
                // hand and combo selection criteria

                // need to do multiple iterations
                var iterations = 0;
                var k = 0;
                while (k < MAX_ITERATIONS) {
                    var find_hand_result = find_hand(hand_sel, combo_sel);
                    iterations = iterations + find_hand_result.iterations;
                    if (find_hand_result.hand_found) {
                        var combo_result = find_combo_hand_selected(find_hand_result, combo_sel);
                        if (combo_result.combo_found) {
                            return {
                                found: true,
                                iterations: iterations,
                                team1: combo_result.team1,
                                team2: combo_result.team2
                            };
                        }
                    }
                    else {
                        // hand not found, keep going
                    }
                    k++;
                }
                return {found: false, iterations: iterations};
            }
        };


        //  make public
        return {
            make_hand: make_hand,
            Combine: Combine,

            // methods below are only exposed for debugging
            Deal: Deal,
            Hand: Hand,
            hasPoints: hasPoints
        };
    };

    // test for global window object, as Spider Monkey standalone does not have it
    if (typeof(window) === 'object')
    //define globally if it doesn't already exist
        if(typeof(window[global_name]) === 'undefined'){
            // add the new name to global space
            window[global_name] = deal();
        }
        else{
            console.log("Library already defined.");
        }
    else {
        // Spider Monkey unknown global name
        // use eval
        deal = main();
    }
})();


/*
hand_sel = {points: {include: true, type: 'hcp', count: 10 },
    distr:  {include: false, spades: 5, hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type: 'lp', count: 20},
    distr:  {include: false, spades: 8, hearts:6, diamonds:6, clubs:6}};

var d = new deal.Deal();
h = new deal.Hand(d.a);
*/
