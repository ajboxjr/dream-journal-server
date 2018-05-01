# def sillycase(string):
#     half = int(len(string)/2)
#     print(string[:half].lower() +string[half:].upper())

def sillycase(o):
    h = len(o)//2
    f = "".join(o[:h])
    s = "".join(o[h:])
    m = f.lower() + s.upper()
    print(m)
    return m

sillycase("treehouse")
