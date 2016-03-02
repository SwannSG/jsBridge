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

Combo stands for combination (or parthenership) and looks at the combined attributes of the two hands. 

#####hand_sel

**hand_sel** is an object literal.

|Property Name				| Value					| Meaning										  |
|:-------------------------:|:---------------------:|:-----------------------------------------------:|
|hand_sel.points.include	| true/false			| Select hand based on hand points if true		  |			
|hand_sel.points.type		| 'hcp' or 'lp' or 'sp'	| High card points or Long points or Short points |
|hand_sel.points.count 		| numeric				| Desired point count							  |		
|hand_sel.distr.include		| true/false			| Select hand based on hand distribution		  |
|hand_sel.distr.spades		| numeric				| Desired number of spades						  |	
|hand_sel.distr.hearts		| numeric				| Desired number of hearts						  |	
|hand_sel.distr.diamonds	| numeric				| Desired number of diamonds					  |	
|hand_sel.distr.clubs		| numeric				| Desired number of clubs						  |	





