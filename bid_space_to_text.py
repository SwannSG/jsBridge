import re

def format_priority(t):
    t = t[1:]
    s = ''
    for each in t:
        if each:
          s = '%s\t%s' % (s, each)  
    return s


def format_rule(name, p1, p2, p3):
    # print format

    def condition(s):
        # unichr(8805) >=
        # unichr(8806) <=
        # unichr(9824) spade
        if s == 'eq':
            return '='
        elif s == 'gte':
            return unichr(8805)
        elif s == 'lt':
            return '<'
        elif s == 'lte':
            return unichr(8804)

    def suit(s):
        if s == 's':
            return unichr(9824) 
        elif s == 'h':
            return unichr(9825)
        elif s == 'd':
            return unichr(9826)
        elif s == 'c':
            return unichr(9827)
        
    if name == 'p':
        # 'p(hcp, 6, 9)'
        temp = '%s%s-%s' % (p1.strip(), p2.strip(), p3.strip())
        return '\t' + temp + ' '*(8-len(temp))
    
    if name == 's':
        return '\t%s%s%s' % (suit(p1).strip(), condition(p2).strip(), p3.strip())

    if name == 'dt':
        return '\tdt%s%s' % (condition(p1).strip(), p2.strip())

    if name == 'h':
        return '\thon%s%s%s' % (suit(p1).strip(), condition(p2).strip(), p3.strip())


def js_rule(name, p1, p2, p3):
    # js format
    if name == 'p':
        # 'p(hcp, 6, 9)'
        if p1 == 'hp':
            p1 = 'hcp'
        p1 = "'%s'" % p1
        return 'hasPointsBand(%s, %s, %s)' % (p1, p2, p3)
    if name == 's':
        # s(h, 'gte', 3)
        p1 = "'%s'" % p1
        p2 = "'%s'" % p2
        return 'hasSuitLength(%s, %s, %s)' % (p1, p2, p3)
    if name == 'dt':
        # dt(lte,1)   
        p1 = "'%s'" % p1
        return 'hasDoubletons(%s, %s)' % (p1, p2)
    if name == 'h':
        # h(d,gte,1)
        p1 = "'%s'" % p1
        p2 = "'%s'" % p2
        return 'hasHonoursLength(%s, %s, %s)' % (p1, p2, p3)

def js_priority(t):
    # ('priority', '2nt', '1s', '1h', '1nt', '1d', '1c')
    r = []
    t = t[1:]
    for each in t:
        if each:
            r.append(each)
    return r
        
# RE expressions
re_comment = re.compile(ur'^\s*#')
re_state = re.compile(ur'^\s*(state)\s*:\s*(\w+)')
re_prev_bid = re.compile(ur'^\s*(prev_bid)\s*:\s*(\w+)')
re_priority = re.compile(ur'^\s*(priority)\s*:\s*(\w{0,3})\s*(\w{0,3})\s*(\w{0,3})\s*(\w{0,3})\s*(\w{0,3})\s*(\w{0,3})\s*(\w{0,3})\s*(\w{0,3})\s*(\w{0,3})\s*(\w{0,3})\s*(\w{0,3})')
re_rule = re.compile(ur'^\s*(\w+)\s*([a-zA-z0-9_\-]+)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)')

re_points = re.compile(ur'^\s*(p)\(\s*([a-z]{2,3})\s*,\s*(\d{1,2})\s*,\s*(\d{1,2})')
re_suit = re.compile(ur'^\s*(s)\(\s*([s|h|d|c])\s*,\s*([a-z]{2,3})\s*,\s*(\d{1,2})')
re_doubletons = re.compile(ur'^\s*(dt)\s*\(\s*([a-z]{2,3})\s*,\s*(\d)')
re_honours = re.compile(ur'^\s*(h)\(\s*([s|h|d|c])\s*,\s*([a-z]{2,3})\s*,\s*(\d{1,2})')

re_text = re.compile(ur"[\sA-Za-z0-9,()'_\-]*@([A-Za-z0-9, \-]*)")



filename = '/home/swannsg/development/jsBridge/bidding_space_2.txt'
fp = open(filename, 'r')
# print output list
o = []
# js literal object
js_list = []
for line in fp:
    # comment line
    r = re_comment.match(line)
    if r is not None:
        # comment, so do nothing
        continue

    # 'state:' line
    r = re_state.match(line) 
    if r is not None:
        # state
        print 'state'
        r = r.groups()
        state = r[1]
        continue

    # 'prevBid': line (previously called 'prev_bid)
    r = re_prev_bid.match(line)
    if r is not None:
        # previous bid
        print 'prevBid'
        r = r.groups()
        prev_bid = r[1]
        o.append('')
        o.append('%s (%s)' % (state, prev_bid))
        # rules:
        try:
            js_list.append(js_state_obj)
        except:
            pass
        js_state_obj = {'state': state, 'prevBid': prev_bid, 'rankings': [], 'availableBids': []}
        continue

    # 'rankings:' line (previously called 'priority')
    r = re_priority.match(line) 
    if r is not None:
        # priority
        print 'available bids'
        r = r.groups()
        # ('priority', '2nt', '1s', '1h', '1nt', '1d', '1c')
        o.append('rankings %s' % format_priority(r))
        js_state_obj['rankings'] = js_priority(r)
        continue

    # availableBid line (previously called rule line)
    r = re_rule.match(line)
    if r is not None:
        # availableBid line
        r = r.groups()
        # ('nb', 'responder\tp', '(hp,0,12)', '', '', '', '', '', '', '', '')
        rule_list = []
        # start new object
        js_next_bid= {'bid': '', 'state': '','rules': [], 'desc':''}
        for index, each in enumerate(r):
            rule_obj = {}
            if index == 0:
                # bid
                next_bid = each
                rule_list.append(next_bid)
                rule_obj['bid'] = next_bid
                js_next_bid['bid'] = next_bid
                print '\tbid'

                # 'desc'
                r_text = re_text.match(line)
                if r_text is not None:
                    r_text_groups = r_text.groups()
                    js_next_bid['desc'] = r_text_groups[0].strip()
                    print '\t' + js_next_bid['desc']
                    
            elif index == 1:
                # state
                next_state = each
                print next_state
                rule_list.append(next_state)
                rule_obj['state'] = next_state
                js_next_bid['state'] = next_state
                print '\tstate'
            else:
                # rules
                # function of form 'p(lp,6,9)' or 's(s,gte,4) or doubletons(lte,1)'
                m = re_points.match(each)
                if m is not None:
                    # points rule 'p(lp,6,9)'
                    m = m.groups()
                    formatted_rule = format_rule(m[0], m[1], m[2], m[3])
                    rule_list.append(formatted_rule)
                    js_rule_str = js_rule(m[0], m[1], m[2], m[3]) 
                    js_next_bid['rules'].append(js_rule_str)
                    print '\t\tpoints'    
                    continue
                m = re_suit.match(each)
                if m is not None:
                    # suit rule 's(s,gte,4)'
                    m = m.groups()
                    formatted_rule = format_rule(m[0], m[1], m[2], m[3])
                    rule_list.append(formatted_rule)
                    js_rule_str = js_rule(m[0], m[1], m[2], m[3])
                    js_next_bid['rules'].append(js_rule_str)
                    print '\t\tsuit'
                    continue
                m = re_doubletons.match(each)
                if m is not None:
                    # doubletons    dt(lte,1)
                    m = m.groups()
                    formatted_rule = format_rule(m[0], m[1], m[2], '')
                    rule_list.append(formatted_rule)
                    js_rule_str = js_rule(m[0], m[1], m[2], '')
                    js_next_bid['rules'].append(js_rule_str)
                    print '\t\tdoubletom'
                    continue
                m = re_honours.match(each)
                if m is not None:
                    # honours    h(d,gte,2)
                    m = m.groups()
                    formatted_rule = format_rule(m[0], m[1], m[2], m[3])
                    rule_list.append(formatted_rule)
                    js_rule_str = js_rule(m[0], m[1], m[2], m[3])
                    js_next_bid['rules'].append(js_rule_str)
                    print '\t\thonours'
                    continue




        js_state_obj['availableBids'].append(js_next_bid)

        rule_str = ''
        for each in rule_list:
            rule_str = rule_str + ' ' + each
        rule_str = rule_str + '\t'*(12 - len(rule_list)) + '\t' + js_next_bid['desc']
        o.append(rule_str)

fp.close()

# file out
filename = '/home/swannsg/development/jsBridge/test_output.txt'
fp = open(filename, 'wb')
for each in o:
    s = each + '\n'
    s = s.encode('utf-8')
    fp.write(s)
fp.close()

# write out js_list in correct format
js_list.append(js_state_obj)

# copy output of js_list into js db variable









