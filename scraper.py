from basketball_reference_web_scraper import client
from basketball_reference_scraper.players import get_stats, get_game_logs

import pandas as pd
import numpy as np
import multiprocessing
from br_scraper.basketball_reference_scraper.teams import get_roster, get_roster_advanced_stats, get_team_stats, get_opp_stats, get_roster_stats, get_team_misc

team_shortname = ["ATL", "BOS", "BRK", "CHO", "CHI", \
				  "CLE", "DAL", "DEN", "DET", "GSW", \
				  "HOU", "IND", "LAC", "LAL", "MEM", \
				  "MIA", "MIL", "MIN", "NOP", "NYK", \
				  "OKC", "ORL", "PHI", "PHO", "POR", \
				  "SAC", "SAS", "TOR", "UTA", "WAS"]

team_shortname_to_teamid = {"ATL":1,"BOS":2,"BRK":4,"CHO":5,"CHI":6, \
							"CLE":7,"DAL":8,"DEN":9,"DET":10,"GSW":11, \
							"HOU":14,"IND":15,"LAC":16,"LAL":17,"MEM":19, \
							"MIA":20,"MIL":21,"MIN":22,"NOP":23,"NYK":24, \
							"OKC":25,"ORL":26,"PHI":27,"PHO":28,"POR":29, \
							"SAC":30,"SAS":31,"TOR":38,"UTA":40,"WAS":41}

team_shortname_to_season_start = \
{"ATL":[{"TRI":[1950,1951]}, {"MLH":[1952,1955]}, {"STL":[1956,1968]}, {"ATL":[1969,2020]}],\
"BOS":[{"BOS":[1947,2020]}], \
"BRK":[{"NJA":[1968,1968]},{"NYA":[1969,1976]},{"NYN":[1977,1977]},{"NJN":[1978,2012]}, {"BRK":[2013,2020]}], \
"CHO":[{"CHH":[1989,2002]},{"CHA":[2005,2014]},{"CHO":[2015,2020]}], \
"CHI":[{"CHI":[1967,2020]}], \
"CLE":[{"CLE":[1971,2020]}], \
"DAL":[{"DAL":[1981,2020]}], \
"DEN":[{"DNR":[1968,1974]},{"DNA":[1975,1976]},{"DEN":[1977,2020]}], \
"DET":[{"FTW":[1949,1957]},{"DET":[1958,2020]}], \
"GSW":[{"PHW":[1947,1962]},{"SFW":[1963,1971]},{"GSW":[1972,2020]}], \
"HOU":[{"SDR":[1968,1971]},{"HOU":[1972,2020]}], \
"IND":[{"INA":[1968,1976]},{"IND":[1977,2020]}], \
"LAC":[{"BUF":[1971,1978]},{"SDC":[1979,1984]},{"LAC":[1985,2020]}], \
"LAL":[{"MNL":[1949,1960]},{"LAL":[1961,2020]}], \
"MEM":[{"VAN":[1996,2001]},{"MEM":[2002,2020]}], \
"MIA":[{"MIA":[1989,2020]}], \
"MIL":[{"MIL":[1969,2020]}], \
"MIN":[{"MIN":[1990,2020]}], \
"NOP":[{"NOH":[2003,2005]},{"NOK":[2006,2007]},{"NOH":[2008,2013]},{"NOP":[2014,2020]}], \
"NYK":[{"NYK":[1947,2020]}], \
"OKC":[{"SEA":[1968,2008]},{"OKC":[2009,2020]}], \
"ORL":[{"ORL":[1990,2020]}], \
"PHI":[{"SYR":[1950,1963]},{"PHI":[1964,2020]}], \
"PHO":[{"PHO":[1969,2020]}], \
"POR":[{"POR":[1971,2020]}], \
"SAC":[{"ROC":[1949,1957]},{"CIN":[1958,1972]},{"KCO":[1973,1975]},{"KCK":[1976,1985]},{"SAC":[1986,2020]}], \
"SAS":[{"DLC":[1968,1970]},{"TEX":[1971,1971]},{"DLC":[1972,1973]},{"SAA":[1974,1976]},{"SAS":[1977,2020]}], \
"TOR":[{"TOR":[1996,2020]}], \
"UTA":[{"NOJ":[1975,1979]},{"UTA":[1980,2020]}], \
"WAS":[{"CHP":[1962,1962]},{"CHZ":[1963,1963]},{"BAL":[1964,1973]},{"CAP":[1974,1974]},{"WSB":[1975,1997]},{"WAS":[1998,2020]}]}

# CHO has no 2002-03 and 2003-04 season

# GET_ROSTER_STATS(team_shortname, season_year_end, data_format='TOTALS|')
# stats = get_roster_stats('ATL', 1988, data_format='TOTALS', playoffs=False)
# # print(stats)
# print(get_roster('MLH'))
def write_roster_stats():
	for team in team_shortname:
		teamId = team_shortname_to_teamid[team]
		print("Starting teamId: " + str(teamId))
		for old_team in team_shortname_to_season_start[team]:
			val = list(old_team.values())[0]
			team_abrv = list(old_team.keys())[0]
			start = val[0]
			end = val[1]+1
			print("Franchise: " + str(team_abrv) + " from " + str(start) + " to " + str(end-1))
			print("Getting roster stats")
			df = pd.concat([pd.DataFrame(get_roster_advanced_stats(team_abrv, y)) for y in range(start,end)], ignore_index=True)
			df['TEAMID'] = [teamId for i in range(len(df))]
			df['TEAMABRV'] = [team_abrv for i in range(len(df))]
			df.to_csv('advanced.csv', index=False, mode='a', header=False, encoding='utf-8-sig')
	print("Done")

write_roster_stats()

def write_roster():
	for team in team_shortname:
		teamId = team_shortname_to_teamid[team]
		print("Starting teamId: " + str(teamId))
		for old_team in team_shortname_to_season_start[team]:
			val = list(old_team.values())[0]
			team_abrv = list(old_team.keys())[0]
			start = val[0]
			end = val[1]+1
			print("Franchise: " + str(team_abrv) + " from " + str(start) + " to " + str(end-1))
			print("Getting rosters")
			df = pd.concat([pd.DataFrame(get_roster(team_abrv, y)) for y in range(start,end)], ignore_index=True)
			print("Done")
			df['TEAMID'] = [teamId for i in range(len(df))]
			df['TEAMABRV'] = [team_abrv for i in range(len(df))]
			df.to_csv('roster.csv', index=False, mode='a', header=False, encoding='utf-8-sig')
	print("Done")
