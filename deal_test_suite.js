/**
 * Created by swannsg on 2016/02/14.
 */
// testing suite

load(['deal.js']);
load(['bridge_utils.js']);


function test_results(test_name, r, hand_sel, combo_sel) {
    if (r.found) {
        var fail = false;
        var result = [];
        result.push(test_name);
        if (hand_sel.points.include || hand_sel.distr.include) {
            //    hand is selected

            if (hand_sel.points.include) {
                if (r.team1.A[hand_sel.points.type].total === hand_sel.points.count) {
                    // hand points match
                }
                else {
                    // hand points don't match
                    result.push("error - hand points don't match");
                    fail = true;
                }
            }

            if (hand_sel.distr.include) {
                if (_.isEqual(r.team1.A.distr, [hand_sel.distr.spades, hand_sel.distr.hearts, hand_sel.distr.diamonds, hand_sel.distr.clubs])) {
                    // hand distr match
                }
                else {
                    // hand distr don't match
                    result.push("error - hand distr doesn't match");
                    fail = true;
                }
            }
        }

        if (combo_sel.points.include || combo_sel.distr.include) {
            // combo is selected
            var combo = new deal.Combine(r.team1.A, r.team1.B);

            if (combo_sel.points.include) {
                if (_.isEqual(combo[combo_sel.points.type].total, combo_sel.points.count)) {
                    // combo points ok
                }
                else {
                    // combo points fail
                    result.push("error - combo points don't match");
                    fail = true;
                }
            }

            if (combo_sel.distr.include) {
                if (_.isEqual(combo.distr, [combo_sel.distr.spades, combo_sel.distr.hearts, combo_sel.distr.diamonds, combo_sel.distr.clubs])) {
                    // hand distr match
                }
                else {
                    // hand distr don't match
                    result.push("error - combo distr doesn't match");
                    fail = true;
                }
            }
        }
        if (fail) {
            result.push('test fails');
            return result;
        }
        else {
            return [test_name + ' pass'];
        }
    }
    else {
        // no solution found
        return [test_name + ' no solution found'];
    }
}

function show_test_sel(hand_sel, combo_sel) {
    /*
     display the selection criteria nicely
     */
    if (hand_sel.points.include || hand_sel.distr.include) {
        if (hand_sel.points.include && !hand_sel.distr.include) {
            console.log('hand: ' + hand_sel.points.type + ' ' + hand_sel.points.count);
        }
        else if (!hand_sel.points.include && hand_sel.distr.include) {
            console.log('hand: [' +  hand_sel.distr.spades + ', ' + hand_sel.distr.hearts + ', ' + hand_sel.distr.diamonds + ', ' + hand_sel.distr.clubs + ']');
        }
        else if (hand_sel.points.include && hand_sel.distr.include) {
            console.log('hand: ' + hand_sel.points.type + ' ' + hand_sel.points.count + '  [' +  hand_sel.distr.spades + ', ' + hand_sel.distr.hearts + ', ' + hand_sel.distr.diamonds + ', ' + hand_sel.distr.clubs + ']');
        }
    }

    if (combo_sel.points.include || combo_sel.distr.include) {
        if (combo_sel.points.include && !combo_sel.distr.include) {
            console.log('combo: ' + combo_sel.points.type + ' ' + combo_sel.points.count);
        }
        else if (!combo_sel.points.include && combo_sel.distr.include) {
            console.log('combo: [' +  combo_sel.distr.spades + ', ' + combo_sel.distr.hearts + ', ' + combo_sel.distr.diamonds + ', ' + combo_sel.distr.clubs + ']');
        }
        else if (combo_sel.points.include && combo_sel.distr.include) {
            console.log('combo: ' + combo_sel.points.type + ' ' + combo_sel.points.count + '  [' +  combo_sel.distr.spades + ', ' + combo_sel.distr.hearts + ', ' + combo_sel.distr.diamonds + ', ' + combo_sel.distr.clubs + ']');
        }
    }

    if (!hand_sel.points.include && !hand_sel.distr.include && !combo_sel.points.include && !combo_sel.distr.include) {
        console.log('No selection')
    }
}


function show_test_results(test_name, hand_sel, combo_sel) {
    if (!bridge_utils.selectorsOk(hand_sel, combo_sel)) {
        // hand_sel, combo_sel not ok
        console.log(test_name + ' error in hand_sel, combo_sel');
        return;
    }
    h = new deal.make_hand(hand_sel, combo_sel)
    var t = test_results(test_name, h, hand_sel, combo_sel);
    console.log('*********************************************************************\n');
    // test results
    show_test_sel(hand_sel, combo_sel);
    _.forEach(t, function(x) {console.log(x);});
    console.log('iterations: ' + h.iterations);
    console.log();
    if (combo_sel.points.include || combo_sel.distr.include) {
        // combo, only include combo if required
        console.log(new deal.Combine(h.team1.A, h.team1.B));
    }
    // hand
//    console.log('*********************************************************************\n');
}





console.log('*****************START******************');

// no hand, combo selection
hand_sel =  {points: {include: false, type  : 'hcp', count: 10 },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'lp',  count: 20},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
show_test_results('test 1', hand_sel, combo_sel);

// hand only selection, no combo
//  hand points only
hand_sel = {points: {include: true, type: 'hcp', count: 10 },
    distr:  {include: false, spades: 5, hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type: 'lp', count: 20},
    distr:  {include: false, spades: 8, hearts:6, diamonds:6, clubs:6}};
show_test_results('test 2', hand_sel, combo_sel);


// hand distr only
hand_sel = {points: {include: false, type: 'hcp', count: 10 },
    distr:  {include: true, spades: 5, hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type: 'lp', count: 20},
    distr:  {include: false, spades: 8, hearts:6, diamonds:6, clubs:6}};
show_test_results('test 3', hand_sel, combo_sel);


// hand points and distr only
hand_sel = {points: {include: true, type: 'hcp', count: 10 },
    distr:  {include: true, spades: 5, hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type: 'lp', count: 20},
    distr:  {include: false, spades: 8, hearts:6, diamonds:6, clubs:6}};
show_test_results('test 4', hand_sel, combo_sel);


// combo only selection, no hand
//  combo points only
hand_sel = {points: {include: false, type: 'hcp', count: 10 },
    distr:  {include: false, spades: 5, hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: true, type: 'lp', count: 20},
    distr : {include: false, spades: 8, hearts:6, diamonds:6, clubs:6}};
show_test_results('test 5', hand_sel, combo_sel);

// combo distr only
hand_sel = {points: {include: false, type: 'hcp', count: 10 },
    distr:  {include: false, spades: 5, hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type: 'lp', count: 20},
    distr:  {include: true, spades: 8, hearts:6, diamonds:6, clubs:6}};
show_test_results('test 6', hand_sel, combo_sel);

// combo points and distr only
hand_sel = {points: {include: false, type: 'hcp', count: 10 },
    distr:  {include: false, spades: 5, hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: true, type: 'lp', count: 20},
    distr:  {include: true, spades: 8, hearts:6, diamonds:6, clubs:6}};
show_test_results('test 7', hand_sel, combo_sel);

// combo and hand selection
//  points only, combo and hand
hand_sel = {points: {include: true, type: 'hcp', count: 10 },
    distr:  {include: false, spades: 5, hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: true, type: 'hcp', count: 20},
    distr:  {include: false, spades: 8, hearts:6, diamonds:6, clubs:6}};
show_test_results('test 8', hand_sel, combo_sel);


//  distr only, combo and hand
hand_sel = {points: {include: false, type: 'hcp', count: 10 },
    distr:  {include: true, spades: 5, hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type: 'hcp', count: 20},
    distr:  {include: true, spades: 8, hearts:6, diamonds:6, clubs:6}};
show_test_results('test 9', hand_sel, combo_sel);

//  points and distr, combo and hand
hand_sel = {points: {include: true, type: 'hcp', count: 10 },
    distr:  {include: true, spades: 5, hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: true, type: 'hcp', count: 20},
    distr:  {include: true, spades: 8, hearts:6, diamonds:6, clubs:6}};
show_test_results('test 10', hand_sel, combo_sel);

// some nasty edge cases
// edge case 1
hand_sel = {points: {include: false, type: 'hcp', count: 25 },
    distr:  {include: true, spades: 7, hearts:3, diamonds:2, clubs:1}};
combo_sel = {points: {include: false, type: 'hcp', count: 20},
    distr:  {include: false, spades: 8, hearts:6, diamonds:6, clubs:6}};
show_test_results('test 11', hand_sel, combo_sel);

// edge case 2
hand_sel = {points: {include: true, type: 'hcp', count: 25 },
    distr:  {include: true, spades: 5, hearts:3, diamonds:2, clubs:3}};
combo_sel = {points: {include: false, type: 'hcp', count: 20},
    distr:  {include: false, spades: 8, hearts:6, diamonds:6, clubs:6}};
show_test_results('test 12', hand_sel, combo_sel);

/*
// nasty edge case 3
hand_sel = {points: {include: true, type: 'hcp', count: 25 },
    distr:  {include: true, spades: 5, hearts:3, diamonds:2, clubs:3}};
combo_sel = {points: {include: true, type: 'hcp', count: 6},
    distr:  {include: false, spades: 8, hearts:6, diamonds:6, clubs:6}};
show_test_results('test 13', hand_sel, combo_sel);
*/


hand_sel =  {points: {include: true, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 3,     hearts:5, diamonds:3, clubs:2}};
combo_sel = {points: {include: true, type  : 'hcp',  count: 9},
    distr  : {include: true, spades: 4,     hearts:3, diamonds:2, clubs:4}};
show_test_results('test 14', hand_sel, combo_sel);


hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
show_test_results('test 15', hand_sel, combo_sel);


hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
show_test_results('test 16', hand_sel, combo_sel);


hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 5,     hearts:4, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
show_test_results('test 17', hand_sel, combo_sel);


hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 5,     hearts:2, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
show_test_results('test 18', hand_sel, combo_sel);


hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 5,     hearts:2, diamonds:'*', clubs:'*'}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
show_test_results('test 19', hand_sel, combo_sel);


hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: '*',     hearts:'*', diamonds:'*', clubs:'*'}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
show_test_results('test 20', hand_sel, combo_sel);


hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 3,     hearts:4, diamonds:14, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
show_test_results('test 21', hand_sel, combo_sel);


hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 3,     hearts:4, diamonds:'$', clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
show_test_results('test 22', hand_sel, combo_sel);

hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: true, spades: 8,     hearts:6, diamonds:6, clubs:6}};
show_test_results('test 23', hand_sel, combo_sel);


hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: true, spades: 8,     hearts:'*', diamonds:6, clubs:6}};
show_test_results('test 24', hand_sel, combo_sel);


hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: true, spades: 10,     hearts:'*', diamonds:8, clubs:10}};
show_test_results('test 25', hand_sel, combo_sel);


// test points
hand_sel =  {points: {include: true, type  : 'hcp', count: 14 },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 10,     hearts:'*', diamonds:8, clubs:10}};
show_test_results('test 26', hand_sel, combo_sel);


hand_sel =  {points: {include: true, type  : 'hcp', count: 114 },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 10,     hearts:'*', diamonds:8, clubs:10}};
show_test_results('test 27', hand_sel, combo_sel);


hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: true, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 10,     hearts:'*', diamonds:8, clubs:10}};
show_test_results('test 28', hand_sel, combo_sel);



hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: true, type  : 'hcp',  count: 69},
    distr  : {include: false, spades: 10,     hearts:'*', diamonds:8, clubs:10}};
show_test_results('test 29', hand_sel, combo_sel);


hand_sel =  {points: {include: true, type  : 'hcp', count: 14 },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: true, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 10,     hearts:'*', diamonds:8, clubs:10}};
show_test_results('test 30', hand_sel, combo_sel);


hand_sel =  {points: {include: true, type  : 'hcp', count: 14 },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: true, type  : 'hcp',  count: 20},
    distr  : {include: false, spades: 10,     hearts:'*', diamonds:8, clubs:10}};
show_test_results('test 31', hand_sel, combo_sel);


hand_sel =  {points: {include: true, type  : 'hcp', count: 14 },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: true, type  : 'hcp',  count: 9},
    distr  : {include: true, spades: 10,     hearts:'*', diamonds:8, clubs:10}};
show_test_results('test 32', hand_sel, combo_sel);


hand_sel =  {points: {include: true, type  : 'hcp', count: 14 },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: true, type  : 'hcp',  count:21},
    distr  : {include: true, spades: 8,     hearts:6, diamonds:8, clubs:4}};
show_test_results('test 33', hand_sel, combo_sel);


hand_sel =  {points: {include: true, type  : 'hcp', count: '6-9' },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count:21},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:8, clubs:4}};
show_test_results('test 33', hand_sel, combo_sel);

hand_sel =  {points: {include: true, type  : 'hcp', count: ' 6 - 9 ' },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count:21},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:8, clubs:4}};
show_test_results('test 33', hand_sel, combo_sel);

hand_sel =  {points: {include: true, type  : 'hcp', count: '+6' },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count:21},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:8, clubs:4}};
show_test_results('test 33', hand_sel, combo_sel);





console.log('*****************END******************');


/*
* 5-card major hand and partnership game
* hand_sel = {};
* hand_sel.points.include    = true;
* hand_sel.points.type       = 'hcp';
* hand_sel.points.count      = 14;
* hand_sel.distr.include     = true;
* hand_sel.distr.spades      = 3
* hand_sel.distr..hearts     = 5
* hand_sel.distr..diamonds   = 3
* hand_sel.distr..clubs      = 2
*
* combo_sel = {};
* combo_sel.points.include   = true;
* combo_sel.points.type      = 'hcp';
* combo_sel.points.count     = 11;
* combo_sel.distr.include    = true;
* combo_sel.distr.spades     = 4
* combo_sel.distr..hearts    = 3
* combo_sel.distr..diamonds  = 3
* combo_sel.distr..clubs     = 3
*/