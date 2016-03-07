/**
 * Created by swannsg on 2016/03/07.
 */
load(['bridge_utils.js']);


function assert(x,y,cmp, test) {
    switch (cmp) {
        case 'eq':
            if (_.isEqual(x,y)) {
                console.log('test: ' + test + ' passed');
            }
            else {
                console.log('test: ' + test + ' failed');
            }
    }

}


// bridge_utils.convert(hand1, hand2, hand3, hand4)
// hand represented as a string of comma delimited symbols
var result = bridge_utils.convert(
    ['2C,3C,4C,5C,2D,3D,4D,2H,3H,4H,2S,3S,4S',
    '6C,7C,8C,9C,5D,6D,7D,5H,6H,7H,5S,6S,7S',
    'TC,JC,QC,KC,8D,9D,TD,8H,9H,TH,8S,9S,TS',
    'AC,JD,QD,KD,AD,JH,QH,KH,AH,JS,QS,KS,AS']);

var ans = [ 1,2,3,4,14,15,16,27,28,29,40,41,42,
            5,6,7,8,   17,18,19,30,31,32,43,44,45,
            9, 10,11,12,20,21,22,33,34,35,46,47,48,
            13,23,24,25,26,36,37,38,39,49,50,51,52 ]

assert(result, ans, 'eq', 1);


hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: false, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
result = bridge_utils.selectorsOk(hand_sel, combo_sel);
assert(result, true, 'eq', 2);

hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 5,     hearts:3, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
result = bridge_utils.selectorsOk(hand_sel, combo_sel);
assert(result, true, 'eq', 3);

hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 5,     hearts:4, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
result = bridge_utils.selectorsOk(hand_sel, combo_sel);
assert(result, false, 'eq', 4);

hand_sel =  {points: {include: false, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 5,     hearts:2, diamonds:3, clubs:2}};
combo_sel = {points: {include: false, type  : 'hcp',  count: 9},
    distr  : {include: false, spades: 8,     hearts:6, diamonds:6, clubs:6}};
result = bridge_utils.selectorsOk(hand_sel, combo_sel);
assert(result, false, 'eq', 5);
