import re

p = re.compile(ur'[\sA-Za-z0-9,()]*@([A-Za-z0-9, \-]*)')
p = re.compile(ur'^\s*(\w+)\s*(\w+)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)\s*([a-z0-9,()]*)')


test_str = '1c	responder	p(hp,13,22)	s(c,gte,2)	s(d,lt,4) s(h,lte,4) s(s,lte,3)'
m = p.match(test_str)
print m
