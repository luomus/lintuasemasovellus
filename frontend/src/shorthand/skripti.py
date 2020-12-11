with open('birdlonger.json', 'r') as f, open('output.txt', 'w') as fo:
    for line in f:
        if "key" in line:
            x = line.split('"')
            fo.write("    "+ '"'+x[3]+'"' + " : {\n")
        elif "{" not in line:
            fo.write(line)