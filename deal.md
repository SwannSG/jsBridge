#deal.js

*deal.js* is a module to deal bridge card hands.

By default it attaches a property name of **deal** to the global object.

The simplest way to a generate new board is to use the **deal.make_hand()** method.

**deal.make_hand()** takes two parameters **hand_sel** and **combo_sel**.

These parameters select the hand and partnership attributes respectively. 


```javascript
// selection criteria to choose a hand
hand_sel = {points: {include: false	, type  : 'hcp', count : 10 },
    		distr:  {include: false	, spades: 5	   , hearts: 3, diamonds:3, clubs:2}};

// selection criteria for combination or partnership between two hands
combo_sel = {points: {include: false, type  : 'lp', count: 20},
    		 distr:  {include: false, spades:  8,   hearts:6, diamonds:6, clubs:6}};

var board = deal.make_hand(hand_sel, combo_sel)

/*
board, returned by deal.make_hand()
{found: true,
 iterations: 0,
 team1: {A: handObj, B: handObj},
 team2: {A: handObj, B: handObj}}

board.team1.A always contains the selected hand based on hand_sel
board.team1.A and board.team1.B always contains the selected partnership based on combo_sel

*/
```

###Understanding the hand and combo selectors 


**hand_sel** is an object literal. It is used as a hand selector.  

|Property Name				| Value					| Meaning (applies to selected hand)										  |
|:-------------------------:|:---------------------:|:-----------------------------------------------:|
|hand_sel.points.include	| true/false			| Select hand based on hand points if true		  |			
|hand_sel.points.type		| 'hcp' or 'lp' or 'sp'	| High card points or Long points or Short points |
|hand_sel.points.count 		| numeric				| Desired point count							  |		
|hand_sel.distr.include		| true/false			| Select hand based on hand distribution if true  |
|hand_sel.distr.spades		| numeric				| Desired number of spades						  |	
|hand_sel.distr.hearts		| numeric				| Desired number of hearts						  |	
|hand_sel.distr.diamonds	| numeric				| Desired number of diamonds					  |	
|hand_sel.distr.clubs		| numeric				| Desired number of clubs						  |	


**combo_sel** is an object literal. It is used as a partnership selector.

Combo stands for combination (or parthenership) and looks at the combined points and distribution of the two hands. 

|Property Name				| Value					| Meaning (applies to selected hand)										  |
|:-------------------------:|:---------------------:|:-----------------------------------------------:|
|combo_sel.points.include	| true/false			| Select hand based on hand points if true		  |			
|combo_sel.points.type		| 'hcp' or 'lp' or 'sp'	| High card points or Long points or Short points |
|combo_sel.points.count 	| numeric				| Desired point count							  |		
|combo_sel.distr.include	| true/false			| Select hand based on hand distribution if true6  |
|combo_sel.distr.spades		| numeric				| Desired number of spades						  |	
|combo_sel.distr.hearts		| numeric				| Desired number of hearts						  |	
|combo_sel.distr.diamonds	| numeric				| Desired number of diamonds					  |	
|hand_sel.distr.clubs		| numeric				| Desired number of clubs						  |	


Example of **hand_sel and combo_sel** to generate a hand with a 5-card major (hearts) and sufficient partnership points and distribution for game.

```javascript
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
```

### Understanding what deal.make_hand(hand_sel, combo_sel) returns

**var result = deal.make_hand(hand_sel, combo_sel);**


If a solution is found *result* will contain an object like this.

```javascript
// value of 'result'
{found: true,
 iterations: 105,
 team1: {A: handObj, B: handObj},
 team2: {A: handObj, B: handObj}
}
```
result.true			means a solution was found
result.iterations	shows the number of random hands that were generated to find a solution
result.team1.A		solution hand
result.team1.B		solution hand to be included in partnership 'team1'
result.team2.A		hand for other 'team2'
result.team2.A		hand for other 'team2'



if no solution is found *result* will contain an object like this.

```javascript
// value of 'result'
{found: false,
 iterations: 1000000, // set by MAX_ITERATIONS
}
```




