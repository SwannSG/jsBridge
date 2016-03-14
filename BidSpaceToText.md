#Biddin Description

*bid_space_to_text.py* is a Python program that takes a text file in a specified format, and creates two outputs.

Output one is a text output that summarises the bidding system.

Output two is a list object that can be used as Javascript object to simulate a database.

###Input Text File

By default the name of the file is *bidding_space.txt*

# Format of bidding_space.txt

We can have multiple line types.

Comment line.


State line.

Previous bid line

Priority line

Bid and Rules line.

There can be multiple Bid and Rules lines attached to each State. At the end of a Bid and Rules line a short description ca be added. The description must be preceeded by the *@* sign i.e *@Approach club*. 


Valid rules are:

| General                 | Example   | Meaning                                    | Display |
|:------------------------|:----------|:-------------------------------------------|:--------|
| p(points_type, lb, ub)  | p(hp,0,12)| high card points between 0 and 12 inclusive|hp0-12	 |	
| s(suit,condition,count) | s(c,gte,2)| more than 2 clubs						   |♣≥2		 |
| dt(condition,1)		  | dt(lte,1) | less than or equal to 1 doubleton		   |dt≤1	 | 		
| h(suit,condition,count) | h(d,gte,2)|	more than 2 honors in diamonds			   |♢hon≥2	 |	


Options for *points_type* are:

*hp* high card points
*lp* long card points
*sp* short card points 

Options for *suit* are: 
*c* clubs
*d* diamonds
*h* hearts
*s* spades

Options for *condition* are:
*eq* equal
*gte* greater than or equal to
*lte* less than or equal to


Input file layout.

<next_state> may not contain spaces.


```python
"""
input file layout

'#' is a comment line, and is ignored
state: <user defined state as string>
prev_bid: <previous bid as string>
priority: <priority order when selecting bids eg. 2c 2nt 2s 2h 1nt 2s 2h 2d 1d 1c nb as string>
<bid>	<next_state>	<rule_1>	<rule_2>	<rule_3>	<rule_4>	<rule_5>	@<description>
<bid>	<next_state>	<rule_1>	<rule_2>	<rule_3>	<rule_4>	<rule_5>	@<description>
<bid>	<next_state>	<rule_1>	<rule_2>	<rule_3>	<rule_4>	<rule_5>	@<description>
<bid>	<next_state>	<rule_1>	<rule_2>	<rule_3>	<rule_4>	<rule_5>	@<description>

state: <user defined state as string>
prev_bid: <previous bid as string>
priority: <priority order when selecting bids eg. 2c 2nt 2s 2h 1nt 2s 2h 2d 1d 1c nb as string>
<bid>	<next_state>	<rule_1>	<rule_2>	<rule_3>	<rule_4>	<rule_5>	@<description>
<bid>	<next_state>	<rule_1>	<rule_2>	<rule_3>	<rule_4>	<rule_5>	@<description>
<bid>	<next_state>	<rule_1>	<rule_2>	<rule_3>	<rule_4>	<rule_5>	@<description>
<bid>	<next_state>	<rule_1>	<rule_2>	<rule_3>	<rule_4>	<rule_5>	@<description>

"""
``` 

###Output dictionary

The name of the output is **js_list**.

A new row is generated for each **state**.

Each row consists of {state: <current state string>, prevBid: <previous bid string>, rankings: [list of bids in priority order], availableBids: [list of availableBid objects] } 

The key to each row is *state + prevBid*. The *current state* and the *previous bid*.

*availableBids* is a list of *availableBid* objects.

An *availableBid* object contains {bid:<next bid>, state:<next_state>, rules[rule_1, rule_2, ...], desc:<text description>


##Agreed terminology


###Bids

N is a number from 1 to 7

Nnb, pass
Nnt, no trumps
Nc, clubs
Nd, diamonds
Nh, hearts
Ns, spades

Example, 1nt or 1h.

###State

opn0, opener
rsp0, responder

opn1, opener 1st rebid
rsp1, responder 1st rebid

opn2, opener 2nd rebid
rsp2, responder 2nd rebid

















