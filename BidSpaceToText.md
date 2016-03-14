#Biddin Description

*bid_space_to_text.py* is a Python program that takes a text file in a specified format, and creates two outputs.

Output one is a text output that summarises the bidding system.

Output two is a dictionary object that can be used as Javascript object to simulate a database.

###Input Text File

By default the name of the file is *bidding_space.txt*




# Format of bidding_space.txt

We can have multiple line types.

Comment line.


State line.
Previous bid line
Priority line
Bid and Rules line. There can be multiple Bid and Rules lines attached to each State. At the end of a Bid and Rules line a short description ca be added. The description must be preceeded by the *@* sign i.e *@Approach club*. 


Valid rules are:

| General                 | Example   | Meaning                                    |
|:------------------------|:----------|:-------------------------------------------|
| p(points_type, lb, ub)  | p(hp,0,12)| high card points between 0 and 12 inclusive|
| s(suit,condition,count) | s(c,gte,2)| more than 2 clubs						   |
| dt(condition,1)		  | dt(lte,1) | less than or equal to 1 doubleton		   |		



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


```python
"""
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

