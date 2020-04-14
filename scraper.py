from basketball_reference_web_scraper import client
# from basketball_reference_scraper.teams import get_roster, get_team_stats, get_opp_stats, get_roster_stats, get_team_misc
from basketball_reference_scraper.players import get_stats, get_game_logs

from br_scraper.basketball_reference_scraper.teams import get_roster

team_shortname = ["ATL", "BOS", "BRK", "CHO", "CHI", \
				  "CLE", "DAL", "DEN", "DET", "GSW", \
				  "HOU", "IND", "LAC", "LAL", "MEM", \
				  "MIA", "MIL", "MIN", "NOP", "NYK", \
				  "OKC", "ORL", "PHI", "PHO", "POR", \
				  "SAC", "SAS", "TOR", "UTA", "WAS"]

team_shortname_to_season_start = \
{"ATL":[{"TRI":[1950,1951]}, {"MLH":[1952,1955]}, {"STL":[1956,1968]}, {"ATL":[1969,2020]}],\
"BOS":[{"BOS":[1947,2020]}], \
"BRK":[{"NJA":[1968,1968],"NYA":[1969,1977],"NJN":[1978,2012], "BRK":[2013,2020]}], \
"CHO":[{"CHH":[1989,2002],"CHA":[2005,2014],"CHO":[2015,2020]}], \
"CHI":[{"CHI":[1967,2020]}], \
"CLE":[{"CLE":[1971,2020]}], \
"DAL":[{"DAL":[1981,2020]}], \
"DEN":[{"DNR":[1968,1974],"DEN":[1975,2020]}], \
"DET":[{"FTW":[1949,1957],"DET":[1958,2020]}], \
"GSW":[{"PHW":[1947,1962],"SFW":[1963,1971],"GSW":[1972,2020]}], \
"HOU":[{"SDR":[1968,1971],"HOU":[1972,2020]}], \
"IND":[{"INA":[1968,1976],"IND":[1977,2020]}], \
"LAC":[{"BUF":[1971,1978],"SDC":[1979,1984],"LAC":[1985,2020]}], \
"LAL":[{"MNL":[1949,1960],"LAL":[1961,2020]}], \
"MEM":[{"VAN":[1996,2001],"MEM":[2002,2020]}], \
"MIA":[{"MIA":[1989,2020]}], \
"MIL":[{"MIL":[1969,2020]}], \
"MIN":[{"MIN":[1990,2020]}], \
"NOP":[{"NOH":[2003,2005],"NOK":[2006,2007],"NOH":[2008,2013], "NOP":[2014,2020]}], \
"NYK":[{"CHH":[1947,2020]}], \
"OKC":[{"SEA":[1968,2008],"OKC":[2009,2020]}], \
"ORL":[{"CHH":[1989,2002],"CHA":[2005,2014],"CHO":[2015,2020]}], \
"PHI":[{"CHH":[1989,2002],"CHA":[2005,2014],"CHO":[2015,2020]}], \
"PHO":[{"CHH":[1989,2002],"CHA":[2005,2014],"CHO":[2015,2020]}], \
"POR":[{"CHH":[1989,2002],"CHA":[2005,2014],"CHO":[2015,2020]}], \
"SAC":[{"CHH":[1989,2002],"CHA":[2005,2014],"CHO":[2015,2020]}], \
"SAS":[{"CHH":[1989,2002],"CHA":[2005,2014],"CHO":[2015,2020]}], \
"TOR":[{"CHH":[1989,2002],"CHA":[2005,2014],"CHO":[2015,2020]}], \
"UTA":[{"CHH":[1989,2002],"CHA":[2005,2014],"CHO":[2015,2020]}], \
"WAS":[{"CHH":[1989,2002],"CHA":[2005,2014],"CHO":[2015,2020]}]}

# CHO has no 2002-03 and 2003-04 season

# season_totals = client.players_season_totals(season_end_year=2018)

# GET_ROSTER_STATS(team_shortname, season_year_end, data_format='TOTALS|')
# stats = get_roster_stats('ATL', 1988, data_format='TOTALS', playoffs=False)
# # print(stats)
# print(get_roster('MLH'))
print("Starting")
for old_team in team_shortname_to_season_start['ATL']:
	print("######"+str(old_team)+"######")
	start = list(old_team.values())[0][0]
	end = list(old_team.values())[0][1]+1
	for y in range(start, end):
		team_abrv = list(old_team.keys())[0]
		df = get_roster(team_abrv, y)
		df['teamId'] = [1 for i in range(len(df))]
		df['TeamAbrv'] = [team_abrv for i in range(len(df))]
		df.to_csv('roster.csv', index=False, mode='a', header=True, encoding='utf-8')
	# for y in range(int(team_shortname_to_season_start[team]), 2021):
	# 	try:
	# 		df = get_roster(team, y)
	# 	except:
	# 		print(team, y)
	# 		print("has no data, is wrong team etc.")
	# 		continue
	# 	df.to_csv('roster.csv', index=False, header=False, encoding='utf-8')
print("Done")

"""
db.teams.update({teamId: 1}, {$set: {"TeamAbrv":"ATL"}},false,true )
WriteResult({ "nMatched" : 71, "nUpserted" : 0, "nModified" : 71 })
> db.teams.update({teamId: 2}, {$set: {"TeamAbrv":"BOS"}},false,true )
WriteResult({ "nMatched" : 74, "nUpserted" : 0, "nModified" : 74 })
> db.teams.update({teamId: 4}, {$set: {"TeamAbrv":"BRK"}},false,true )
WriteResult({ "nMatched" : 53, "nUpserted" : 0, "nModified" : 53 })
> db.teams.update({teamId: 5}, {$set: {"TeamAbrv":"CHO"}},false,true )
WriteResult({ "nMatched" : 30, "nUpserted" : 0, "nModified" : 30 })
> db.teams.update({teamId: 6}, {$set: {"TeamAbrv":"CHI"}},false,true )
WriteResult({ "nMatched" : 54, "nUpserted" : 0, "nModified" : 54 })
> db.teams.update({teamId: 7}, {$set: {"TeamAbrv":"CLE"}},false,true )
WriteResult({ "nMatched" : 50, "nUpserted" : 0, "nModified" : 50 })
> db.teams.update({teamId: 8}, {$set: {"TeamAbrv":"DAL"}},false,true )
WriteResult({ "nMatched" : 40, "nUpserted" : 0, "nModified" : 40 })
> db.teams.update({teamId: 9}, {$set: {"TeamAbrv":"DEN"}},false,true )
WriteResult({ "nMatched" : 53, "nUpserted" : 0, "nModified" : 53 })
> db.teams.update({teamId: 10}, {$set: {"TeamAbrv":"DET"}},false,true )
WriteResult({ "nMatched" : 72, "nUpserted" : 0, "nModified" : 72 })
> db.teams.update({teamId: 11}, {$set: {"TeamAbrv":"GSW"}},false,true )
WriteResult({ "nMatched" : 74, "nUpserted" : 0, "nModified" : 74 })
> db.teams.update({teamId: 14}, {$set: {"TeamAbrv":"HOU"}},false,true )
WriteResult({ "nMatched" : 53, "nUpserted" : 0, "nModified" : 53 })
> db.teams.update({teamId: 15}, {$set: {"TeamAbrv":"IND"}},false,true )
WriteResult({ "nMatched" : 53, "nUpserted" : 0, "nModified" : 53 })
> db.teams.update({teamId: 16}, {$set: {"TeamAbrv":"LAC"}},false,true )
WriteResult({ "nMatched" : 50, "nUpserted" : 0, "nModified" : 50 })
> db.teams.update({teamId: 17}, {$set: {"TeamAbrv":"LAL"}},false,true )
WriteResult({ "nMatched" : 72, "nUpserted" : 0, "nModified" : 72 })
> db.teams.update({teamId: 19}, {$set: {"TeamAbrv":"MEM"}},false,true )
WriteResult({ "nMatched" : 25, "nUpserted" : 0, "nModified" : 25 })
> db.teams.update({teamId: 20}, {$set: {"TeamAbrv":"MIA"}},false,true )
WriteResult({ "nMatched" : 32, "nUpserted" : 0, "nModified" : 32 })
> db.teams.update({teamId: 21}, {$set: {"TeamAbrv":"MIL"}},false,true )
WriteResult({ "nMatched" : 52, "nUpserted" : 0, "nModified" : 52 })
> db.teams.update({teamId: 22}, {$set: {"TeamAbrv":"MIN"}},false,true )
WriteResult({ "nMatched" : 31, "nUpserted" : 0, "nModified" : 31 })
> db.teams.update({teamId: 23}, {$set: {"TeamAbrv":"NOP"}},false,true )
WriteResult({ "nMatched" : 18, "nUpserted" : 0, "nModified" : 18 })
> db.teams.update({teamId: 24}, {$set: {"TeamAbrv":"NYK"}},false,true )
WriteResult({ "nMatched" : 74, "nUpserted" : 0, "nModified" : 74 })
> db.teams.update({teamId: 25}, {$set: {"TeamAbrv":"OKC"}},false,true )
WriteResult({ "nMatched" : 53, "nUpserted" : 0, "nModified" : 53 })
> db.teams.update({teamId: 26}, {$set: {"TeamAbrv":"ORL"}},false,true )
WriteResult({ "nMatched" : 31, "nUpserted" : 0, "nModified" : 31 })
> db.teams.update({teamId: 27}, {$set: {"TeamAbrv":"PHI"}},false,true )
WriteResult({ "nMatched" : 71, "nUpserted" : 0, "nModified" : 71 })
> db.teams.update({teamId: 28}, {$set: {"TeamAbrv":"PHO"}},false,true )
WriteResult({ "nMatched" : 52, "nUpserted" : 0, "nModified" : 52 })
> db.teams.update({teamId: 29}, {$set: {"TeamAbrv":"POR"}},false,true )
WriteResult({ "nMatched" : 50, "nUpserted" : 0, "nModified" : 50 })
> db.teams.update({teamId: 30}, {$set: {"TeamAbrv":"SAC"}},false,true )
WriteResult({ "nMatched" : 72, "nUpserted" : 0, "nModified" : 72 })
> db.teams.update({teamId: 31}, {$set: {"TeamAbrv":"SAS"}},false,true )
WriteResult({ "nMatched" : 53, "nUpserted" : 0, "nModified" : 53 })
> db.teams.update({teamId: 38}, {$set: {"TeamAbrv":"TOR"}},false,true )
WriteResult({ "nMatched" : 25, "nUpserted" : 0, "nModified" : 25 })
> db.teams.update({teamId: 40}, {$set: {"TeamAbrv":"UTA"}},false,true )
WriteResult({ "nMatched" : 46, "nUpserted" : 0, "nModified" : 46 })
> db.teams.update({teamId: 41}, {$set: {"TeamAbrv":"WAS"}},false,true )
WriteResult({ "nMatched" : 59, "nUpserted" : 0, "nModified" : 59 })
"""