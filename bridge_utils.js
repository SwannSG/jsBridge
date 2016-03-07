/**
 * Created by swannsg on 2016/03/05.
 */

// known hand with predefined cards
// known bidding sequence
load(['deal.js']);



(function() {

    var global_name = 'bridge_utils';

    var main = function() {

        var selectorsOk = function(hand_sel, combo_sel) {

            var distr_value_ok = function(distr_value) {
                // distr_value = * or 1-13
                if (distr_value==='*') {
                    return true;
                }
                if (distr_value >= 0 && distr_value <= 13) {
                    return true;
                }
                return false;
            };

            var sum_hand_distr_values_ok = function(val1,val2,val3,val4,max_cards) {
                // val1,val2,val3,val4 could contain '*' or number
                var arr = [val1, val2, val3, val4];
                // array of only numbers
                var arrn = arr.filter((function (x) {if (typeof(x) === 'number') {return x;}}));
                if (arrn.length===0) {
                    // all '*'
                    return true;
                }
                var sum_arrn = arrn.reduce(function (x0, x) {return x0 + x;});
                if (arrn.length === 4) {
                    // 4 numeric values, no '*'
                    // cards in hand = 13
                    if (sum_arrn === max_cards) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (sum_arrn <= max_cards) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            };


        var hand_combo_distr_ok = function(hand_sel_distr, combo_sel_distr) {
            arr = ['spades', 'hearts', 'diamonds', 'clubs'];
            for (var i=0;i<arr.length;i++) {
                if (hand_sel_distr[arr[i]]!='*' || combo_sel_distr[arr[i]]!='*') {
                    // hand_sel.distr.suit and combo_sel.distr are both numeric
                    if (hand_sel_distr[arr[i]] > combo_sel_distr[arr[i]]) {
                       // hand_sel.distr.suit may not be more than the combination
                       return false;
                    }
                }
            }
            return true;
        };


        // test distribution
        var errorMsg = '';
        var distrOk = false;
        if (hand_sel.distr.include && combo_sel.distr.include) {
            // hand + combo distr
            if (distr_value_ok(hand_sel.distr.spades) && distr_value_ok(hand_sel.distr.hearts) &&
                distr_value_ok(hand_sel.distr.diamonds) && distr_value_ok(hand_sel.distr.clubs) &&
                distr_value_ok(combo_sel.distr.spades) && distr_value_ok(combo_sel.distr.hearts) &&
                distr_value_ok(combo_sel.distr.diamonds) && distr_value_ok(combo_sel.distr.clubs)) {
                // hand + combo distr values ok
                if (sum_hand_distr_values_ok(hand_sel.distr.spades, hand_sel.distr.hearts, hand_sel.distr.diamonds, hand_sel.distr.clubs,13) &&
                    sum_hand_distr_values_ok(combo_sel.distr.spades, combo_sel.distr.hearts, combo_sel.distr.diamonds, combo_sel.distr.clubs, 26)) {
                    // hand + combo distr sum ok
                    if (hand_combo_distr_ok(hand_sel.distr, combo_sel.distr)) {
                        // hand and combo combine values ok
                        distrOk = true
                    }
                }
                else {
                    // hand + combo distr sum not ok
                    errorMsg = 'hand + combo distr sum not ok';
                }
            }
            else {
                // hand + combo distr values not ok
                errorMsg = 'hand + combo distr values not ok';
            }

        }
        else if (hand_sel.distr.include) {
            // hand only distr
            if (distr_value_ok(hand_sel.distr.spades) && distr_value_ok(hand_sel.distr.hearts) &&
                distr_value_ok(hand_sel.distr.diamonds) && distr_value_ok(hand_sel.distr.clubs)) {
                // hand distr values ok
                if (sum_hand_distr_values_ok(hand_sel.distr.spades, hand_sel.distr.hearts, hand_sel.distr.diamonds, hand_sel.distr.clubs,13)) {
                    // hand distr sum ok
                    distrOk = true;
                }
            }
            else {
                // hand distr values not ok
                errorMsg = 'hand distr values not ok';
            }
        }
        else if (combo_sel.distr.include) {
            // combo distr
            if (distr_value_ok(combo_sel.distr.spades) && distr_value_ok(combo_sel.distr.hearts) &&
                distr_value_ok(combo_sel.distr.diamonds) && distr_value_ok(combo_sel.distr.clubs)) {
                // combo distr values ok
                if (sum_hand_distr_values_ok(combo_sel.distr.spades, combo_sel.distr.hearts, combo_sel.distr.diamonds, combo_sel.distr.clubs, 26)) {
                    // combo distr sum ok
                    distrOk = true;
                }
                else {
                    // combo distr sum not ok
                    errorMsg = 'combo distr sum not ok';
                }
            }
            else {
                // combo distr values not ok
                errorMsg = 'combo distr values not ok';
            }
        }
        else {
            // no hand or combo distr selection
            distrOk = true;
        }
        return distrOk;
    };


        var make_SYM_TO_INT = function (x) {
            temp = {}
            int_list = Object.keys(x);
            for (var i = 0; i < int_list.length; i++) {
                temp[x[int_list[i]]] = int_list[i];
            }
            return temp;
        };

        // {2C:1, 3C:2, ...}
        var SYM_TO_INT = make_SYM_TO_INT(deal.intToSym());

        var symToInt = function (str, SYM_TO_INT) {
            return SYM_TO_INT[str];
        };


        var convert_all = function (all_symbols, SYM_TO_INT) {
            var result = []
            for (var i=0; i < all_symbols.length; i++) {
                result.push(Number(symToInt(all_symbols[i], SYM_TO_INT)));
            }
            return result;
        };




        var split_symbols = function (hand_symbols) {
            // expect hand_symbols = '2C, 4S, ...'
            // return array = ['2C', '4S', ...]
            var temp = hand_symbols.split(',');
            for (var i = 0; i < temp.length; i++) {
                // remove leading and trailing whitespace
                temp[i] = temp[i].trim();
            }
            return temp;
        };


        var check = function (x) {
            // check if entire board of integers is correct
            // duplicates and 52 cards
            if (x.length != 52) {
                return false;
            }
            var temp = _.uniq(x);
            if (temp.length != 52) {
                return false;
            }
            return true;
        };

        var convert = function (static_board) {
            // static_board = [hand1, hand2, hand3, hand4]
            //    where hand1 = '5c,4s,...'
            // returns [hand1 + hand2 + hand3 + hand4] as integers
            var all_symbols = [];
            for (var i = 0; i < static_board.length; i++) {
                var hand_symbols = static_board[i];


                all_symbols = all_symbols.concat(split_symbols(hand_symbols));
            }
            // convert all symbols to integers
            var result = convert_all(all_symbols, SYM_TO_INT);
            if (check(result)) {
                // result is the answer
                return result;
            }
            else {
                console.log('error');
            }
        };
        return {convert: convert, selectorsOk: selectorsOk};
    };

    // test for global window object, as Spider Monkey standalone does not have it
    if (typeof(window) === 'object') {
        //define globally if it doesn't already exist
        if (typeof(window[global_name]) === 'undefined') {
            // add the new name to global space
            window[global_name] = deal();
        }
        else {
            console.log("Library already defined.");
        }
    }
    else {
        // Spider Monkey unknown global name
        // use eval
        var eval_str = global_name + ' = main()';
        eval(eval_str);
    }
})();


