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

var result = deal.make_hand(hand_sel, combo_sel);

// value of 'result'
{found: true,
 iterations: 105,
 team1: {A: handObj, B: handObj},
 team2: {A: handObj, B: handObj}
}
```
result.true			means a solution was found

result.iterations	shows the number of random hands that were generated to find a solution

result.team1.A		solution Hand object selected by hand_sel

result.team1.B		Hand object to be included in partnership 'team1' selected by combo_sel

result.team2.A		hand for other 'team2'

result.team2.A		hand for other 'team2'



if no solution is found *result* will contain an object like this.

```javascript
// value of 'result'
{found: false,
 iterations: 1000000, // set by MAX_ITERATIONS
}
```

###Hand Object

The Hand object represents a hand that has been dealt to a player. Each card is represented by an integer from 1 to 52.

| Suit    | Integer Range |
|:-------:|:-------------:|
|Clubs    | 1  to 13	  |
|Diamonds |	14 to 26      |
|Hearts	  | 27 to 39	  |	
|Spades   | 40 to 53      | 


## Hand object properties

```javascript

// card representation as integers-------------------------------------------
cards						array of integers representing cards in the hand.
suits.clubs					array of integers representing clubs
suits.diamonds				array of integers representing diamonds
suits.hearts				array of integers representing hearts
suits.spades				array of integers representing spades
// --------------------------------------------------------------------------

// distribution of hand------------------------------------------------------
distr						array [nspades, nhearts, ndiamonds, nclubs]
count.clubs					integer, number of clubs
count.diamonds				integer, number of diamonds
count.hearts				integer, number of hearts
count.spades				integer, number of spades
// --------------------------------------------------------------------------


// description of honours in a hand -----------------------------------------
honours.clubs.tens				numeric 1 or 0				
honours.clubs.jacks				numeric 1 or 0
honours.clubs.queens			numeric 1 or 0
honours.clubs.kings				numeric 1 or 0
honours.clubs.aces				numeric 1 or 0

honours.diamonds.tens			numeric 1 or 0				
honours.diamonds.jacks			numeric 1 or 0
honours.diamonds.queens			numeric 1 or 0
honours.diamonds.kings			numeric 1 or 0
honours.diamonds.aces			numeric 1 or 0

honours.hearts.tens				numeric 1 or 0				
honours.hearts.jacks			numeric 1 or 0
honours.hearts.queens			numeric 1 or 0
honours.hearts.kings			numeric 1 or 0
honours.hearts.aces				numeric 1 or 0

honours.spades.tens				numeric 1 or 0				
honours.spades.jacks			numeric 1 or 0
honours.spades.queens			numeric 1 or 0
honours.spades.kings			numeric 1 or 0
honours.spades.aces				numeric 1 or 0
// --------------------------------------------------------------------------


// high card points 'hcp' (ace=4, king=3, queen=2, jack=1)-------------------
hcp.clubs						integer 0 to 10
hcp.diamonds					integer 0 to 10
hcp.hearts						integer 0 to 10
hcp.spades						integer 0 to 10
hcp.total						integer 0 to 40, total hcp in hand
// --------------------------------------------------------------------------


// long points 'lp' = 'hcp' + (suit_length-4)-------------------------------- 
lp.clubs						integer 0 to 10
lp.diamonds						integer 0 to 10
lp.hearts						integer 0 to 10
lp.spades						integer 0 to 10
lp.total						integer 0 to 40, total hcp in hand
// --------------------------------------------------------------------------


// short points 'sp' = 'hcp' + 3 (void) + 2 (singleton) + 1 (dobleton)------- 
lp.clubs						integer 0 to 10
lp.diamonds						integer 0 to 10
lp.hearts						integer 0 to 10
lp.spades						integer 0 to 10
lp.total						integer 0 to 40, total hcp in hand
// --------------------------------------------------------------------------


// losing trick count 'ltc'--------------------------------------------------
ltc.clubs						integer 0 to 3
ltc.diamonds					integer 0 to 3
ltc.hearts						integer 0 to 3
ltc.spades						integer 0 to 3
ltc.total						integer 0 to 12
//---------------------------------------------------------------------------
```

## Hand object methods

All these methods are held on the Hand.prototype. 

```javascript

var result = deal.make_hand(hand_sel, combo_sel);

// value of 'result'
{found: true,
 iterations: 105,
 team1: {A: handObj, B: handObj},
 team2: {A: handObj, B: handObj}
}

var hand_1_A = result.team1.A


// Hand methods
hand_1_A.toString()										displays the Hand object nicely

hand_1_A.hasPoints(points_type, points)					returns boolean
/*	points_type		'hcp' or 'lp' or 'sp'
	points			integer, exact number of points
*/

hand_1_A.hasPointsBand(points_type, lb, ub)				returns boolean
/*	points_type		'hcp' or 'lp' or 'sp'
	lb 				integer, lower band of points 
	ub 				integer, upper band of points
*/

hand_1_A.hasDistr(nspades, nhearts, ndiamonds, nclubs)	return boolean
/*	nspades			integer, number of spades
	nhearts			integer, number of hearts
	ndiamonds		integer, number of diamonds
	nclubs			integer, number of clubs
*/


hand_1_A.hasSuitLength(suit, condition, count)			return boolean
/*	suit			's' or 'spades'
					'h' or 'hearts'
					'd' or 'diamonds'
					'c' or 'clubs'
	
	condition		'gte' means >=
					'gt'  means >
					'eq'  means =
					'lt'  means <
					'lte' means <=	

	count			integer, number in specified suit 
*/


hand_1_A.hasDoubletons(condition, count)				return boolean
/*	condition		'lte' means <=
	count			integer, number of doubletons in hand
*/

```





