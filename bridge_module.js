var INT_TO_SYM =  {
      1:'2C', 2:'3C', 3:'4C', 4:'5C', 5:'6C', 6:'7C', 7:'8C', 8:'9C', 9:'TC', 10:'JC', 11:'QC', 12:'KC', 13:'AC',
      14:'2D', 15:'3D', 16:'4D', 17:'5D', 18:'6D', 19:'7D', 20:'8D', 21:'9D', 22:'TD', 23:'JD', 24:'QD', 25:'KD', 26:'AD',
      27:'2H', 28:'3H', 29:'4H', 30:'5H', 31:'6H', 32:'7H', 33:'8H', 34:'9H', 35:'TH', 36:'JH', 37:'QH', 38:'KH', 39:'AH',
      40:'2S', 41:'3S', 42:'4S', 43:'5S', 44:'6S', 45:'7S', 46:'8S', 47:'9S', 48:'TS', 49:'JS', 50:'QS', 51:'KS', 52:'AS'
      }

function get_card_symbols(cards) {
	/* cards: array of integers
		returns: array of symbols
	*/
	r = [];
	for (var i=0; i < cards.length; i++) {
		r.push(INT_TO_SYM[cards[i]]);
	}
	return r
}


function sort_cards(cards) {
	return cards.sort(function(a, b){return b-a});
}


function get_cards(all, subset) {
	var r;	
	r = all.filter(function(n) {
    		  	     return subset.indexOf(n) != -1;
					});
	return sort_cards(r);
}

function sum_arrays(a1, a2) {
	// a1, a2 are numeric arrays of equal size
	// returns sum of elements
	var r=[];
	for(var i = 0; i < a1.length; i++){
	   r.push(a1[i] + a2[i]);
	}
	return r;
}


function get_clubs(cards) {
	return get_cards(cards, [1,2,3,4,5,6,7,8,9,10,11,12,13]);


function get_diamonds(cards) {
	return get_cards(cards, [14,15,16,17,18,19,20,21,22,23,24,25,26]);
}

function get_hearts(cards) {
	return get_cards(cards, [27,28,29,30,31,32,33,34,35,36,37,38,39]);
}

function get_spades(cards) {
	return get_cards(cards, [40,41,42,43,44,45,46,47,48,49,50,51,52]);
}


function get_honours(cards) {
	return {tens: get_cards(cards, [9, 22, 35, 48]).length,
			jacks: get_cards(cards, [10, 23, 36, 49]).length,
			queens: get_cards(cards, [11, 24, 37, 50]).length,
			kings: get_cards(cards, [12, 25, 38, 51]).length,
 			aces: get_cards(cards, [13, 26, 39, 52]).length};
}

function calc_hcp(honours) {
	
	return honours.jacks*1 + honours.queens*2 + honours.kings*3 + honours.aces*4 
}


function get_long_points(suit_length) {
	if (suit_length > 4) {
		return suit_length - 4;
	}
	else {
		return 0;
	}
}

function get_short_points(suit_length) {
	if (suit_length === 0) {return 3;}
	else if (suit_length === 1) {return 2;}
	else if (suit_length === 2) {return 1;}
	else {return 0;}
}


function get_ltc(suit_count, suit_honours) {
	// get losing trick count

	var nwinners=0;
	if  (suit_honours.aces === 1 && suit_count === 1) {
		nwinners = 1;}
	else if (suit_honours.aces === 1 && suit_honours.kings === 1) {
		nwinners = 2;}
	else if (suit_honours.aces === 1 && suit_honours.kings === 1 && suit_honours.queens === 1) {
		nwinners = 3;}
	else if (suit_honours.aces === 1 && suit_honours.queens === 1 && suit_count >= 3) {
		nwinners = 2;}
	else if (suit_honours.queens === 1 && suit_honours.jacks === 1 && suit_count === 2) {
		nwinners = 0;}
	else if (suit_honours.queens === 1 && suit_honours.jacks === 1 && suit_count > 2) {
		nwinners = 1;}
	else if (suit_honours.aces === 1 && suit_honours.jacks === 1 && suit_honours.tens === 1) {
		nwinners = 1.5;}
	else if (suit_honours.queens === 1 && suit_honours.tens === 1 && suit_count >= 3) {
		nwinners = 1;}
	else if (suit_honours.aces === 1 && suit_honours.queens === 1 && suit_count === 2) {
		nwinners = 1.5;}
	else if (suit_honours.aces === 1) {
		nwinners = 1}
	else if (suit_honours.kings === 1) {
		nwinners = 1;}
	else if (suit_honours.queens === 1 && suit_count >= 3) {
		nwinners = 0.5;}
	if (suit_count > 3) {
		suit_count = 3;
	}
	ltc = suit_count - nwinners
	return ltc
}


function Hand(cards) {

	function get_clubs() {
		return get_in_cards(this.cards, [1,2,3,4,5,6,7,8,9,10,11,12,13]);
	}

    function get_diamonds() {
        return get_cards(this.cards, [14,15,16,17,18,19,20,21,22,23,24,25,26]);
    }

    function get_hearts() {
        return get_cards(this.cards, [27,28,29,30,31,32,33,34,35,36,37,38,39]);
    }

    function get_spades() {
        return get_cards(this.cards, [40,41,42,43,44,45,46,47,48,49,50,51,52]);
    }

    function pointsOk(points_sel, npoints) {
		switch (points_sel) {
			case 0:
				// don't care
				return true
				break
			case 1:
				// lp
				if (this.lp.total === npoints) {
					return true;}
				else {
					return false;
					} 
				break
			case 2:
				// hcp
				if (this.hcp.total === npoints) {
					return true;}
				else {
					return false;
					} 
				break
			case 3:
				// sp
				if (this.sp.total === npoints) {
					return true;}
				else {
					return false;
					} 
				break
		}
		return false;
	}

	var r;
	this.cards = cards
	this.suits = {clubs: get_clubs.call(this),
		 		  diamonds: get_diamonds.call(this),
		 		  hearts: get_hearts.call(this),
		 		  spades: get_spades.call(this)}
	this.honours = {clubs: get_honours(this.suits.clubs), 
			 	 	diamonds: get_honours(this.suits.diamonds),
				 	hearts: get_honours(this.suits.hearts),
			 		spades: get_honours(this.suits.spades),
			 		total: get_honours(cards)}; 
	this.hcp = {clubs: calc_hcp(this.honours.clubs), 
			 	diamonds: calc_hcp(this.honours.diamonds),
			 	hearts: calc_hcp(this.honours.hearts),
			 	spades: calc_hcp(this.honours.spades)};
	this.hcp.total = this.hcp.clubs + this.hcp.diamonds + this.hcp.hearts +this.hcp.spades;
	this.count = {clubs: this.suits.clubs.length, 
	 		 	  diamonds: this.suits.diamonds.length,
			 	  hearts: this.suits.hearts.length,
			 	  spades: this.suits.spades.length};
	this.distr = [this.count.spades, this.count.hearts, this.count.diamonds, this.count.clubs]; 
	this.lp = {	clubs: get_long_points(this.count.clubs) + this.hcp.clubs,
				diamonds: get_long_points(this.count.diamonds) + this.hcp.diamonds,
				hearts: get_long_points(this.count.hearts) + this.hcp.hearts,
				spades: get_long_points(this.count.spades) + this.hcp.spades};
	this.lp.total = this.lp.clubs + this.lp.diamonds + this.lp.hearts +this.lp.spades;
	this.sp = {	clubs: get_short_points(this.count.clubs) + this.hcp.clubs,
				diamonds: get_short_points(this.count.diamonds) + this.hcp.diamonds,
				hearts: get_short_points(this.count.hearts) + this.hcp.hearts,
				spades: get_short_points(this.count.spades) + this.hcp.spades};
	this.sp.total = this.sp.clubs + this.sp.diamonds + this.sp.hearts +this.sp.spades;
	this.ltc = {clubs: get_ltc(this.count.clubs, this.honours.clubs),
				diamonds: get_ltc(this.count.diamonds, this.honours.diamonds),
				hearts: get_ltc(this.count.hearts, this.honours.hearts),
				spades: get_ltc(this.count.spades, this.honours.spades)};
	this.ltc.total = this.ltc.clubs + this.ltc.diamonds + this.ltc.hearts +this.ltc.spades;

	this.display_cards = function(cards) {return get_card_symbols(cards);};

	this.isSelected = function(points_sel=0, npoints=10, distr_sel=false, distr=[3,3,3,4]) {
		/* 	points_sel: 0 (don't care, default), 1 (lp), 2 (hcp), 3 (sp)
			points: integer number of points
			distr_sel: true or false
 			distr: [nspades, nhearts, ndiamonds, nclubs]
			
			returns true if selection conditions satisfied
		*/

		if (distr_sel) {
			// include distribution in selection criteria 
			if (pointsOk.call(this, points_sel, npoints)) {
				if (distr.toString()===this.distr.toString()) {
					return true;
					}
				else {
					return false;
				}
			}
			else {
				return false;
				}
		}	
		else {
			// exclude distribution in selection criteria 
			return pointsOk.call(this, points_sel, npoints);
		}
	};

	this.toString = function() {
		return 'hand : ' + this.display_cards(sort_cards(this.cards)) + '\n'
		+ 'distr: ' + this.distr + '\n'
		+ 'hcp  : ' + this.hcp.total + '\n'
		+ 'lp   : ' + this.lp.total + '\n'
		+ 'sp   : ' + this.sp.total + '\n'
		+ 'ltc  : ' + this.ltc.total + '\n';
	}
}




function Deal() {
	/* deal random cards
	   returns object o
			o.a		hand1
			o.b		hand2
			o.c		hand3
			o.d		hand4
	*/
	var result = [];
	var deck = [1,2,3,4,5,6,7,8,9,10,11,12,13,
				14,15,16,17,18,19,20,21,22,23,24,25,26,
				27,28,29,30,31,32,33,34,35,36,37,38,39,
				40,41,42,43,44,45,46,47,48,49,50,51,52];
	var i = 1;
	while (i <= 52) {
		result.push( deck.splice( Math.round( Math.random()* (deck.length-1) ) ,1 ).pop() );
		i++;
	}
	this.a = result.slice(0,13);
	this.b = result.slice(13,26);
	this.c = result.slice(26,39);
	this.d = result.slice(39,52);	

	this.toString = function () {
								return 'hand1: ' + get_card_symbols(sort_cards(this.a))
										 + '\nhand2: ' + get_card_symbols(sort_cards(this.b))
									  	 + '\nhand3: ' + get_card_symbols(sort_cards(this.c))
										 + '\nhand4: ' + get_card_symbols(sort_cards(this.d));
								};
}

function Combine(hand1, hand2) {
	// comine two Hand objects

	this.count = {clubs: hand1.count.clubs + hand2.count.clubs,
				  diamonds: hand1.count.diamonds + hand2.count.diamonds,
				  hearts: hand1.count.hearts + hand2.count.hearts,
				  spades: hand1.count.spades + hand2.count.spades};
	this.hcp = {total: hand1.hcp.total + hand1.hcp.total}
	this.lp = {total: hand1.lp.total + hand1.lp.total}
	this.sp = {total: hand1.sp.total + hand1.sp.total}
}









var deal = new Deal();
h1 = new Hand(deal.a);
console.log(h1);
ltc_spades = get_ltc(h1.count.spades, h1.honours.spades);
ltc_hearts = get_ltc(h1.count.hearts, h1.honours.hearts);
ltc_diamonds = get_ltc(h1.count.diamonds, h1.honours.diamonds);
ltc_clubs = get_ltc(h1.count.clubs, h1.honours.clubs);
console.log(  'ltc spades  : ' + ltc_spades + '\n'
			+ 'ltc_hearts  : ' + ltc_hearts + '\n'
			+ 'ltc_diamonds: ' + ltc_diamonds + '\n'
			+ 'ltc_clubs   : ' + ltc_clubs + '\n');

