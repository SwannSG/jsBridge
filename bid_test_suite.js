/**
 * Created by swannsg on 2016/03/06.
 */
load(['deal.js']);
load(['bridge_utils.js']);
//load(['bid.js']);


hand_sel =  {points: {include: true, type  : 'hcp', count: 14 },
    distr  : {include: true, spades: 4,     hearts:5, diamonds:'*', clubs:'*'}};
combo_sel = {points: {include: true, type  : 'hcp',  count: 9},
    distr  : {include: true, spades: 7,     hearts:8, diamonds:'*', clubs:'*'}};


if (bridge_utils.selectorsOk(hand_sel, combo_sel)) {
    var board = deal.make_hand(hand_sel, combo_sel)
    if (board.found) {
        var static_board = [team1.A.cards, team1.B.cards, team2.A.cards, team2.B.cards];
    }
    else {
        console.log('no solution');
    }
}
else {
    console.log('error: hand_sel, combo_sel');
}
