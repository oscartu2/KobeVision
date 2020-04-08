import csv

with open("file", "rb") as file:
    reader = csv.reader(file)
    with open("file", "wb") as result:
        wtr= csv.writer( result )
        for r in rdr:
            wtr.writerow( (r[0], r[1], r[3], r[4]) )