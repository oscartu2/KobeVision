import pandas as pd
from requests import get
from bs4 import BeautifulSoup
TEAM_ABBR_TO_TEAM_ID = {"ATL":1,"TRI":1,"MLH":1,"STL":1,"BOS":2, \
                        "BRK":4,"NJA":4,"NYA":4,"NYN":4,"NJN":4, \
                        "CHO":5,"CHH":5,"CHA":5,"CHI":6, \
                        "CLE":7,"DAL":8,"DEN":9,"DNR":9,"DNA":9, \
                        "DET":10,"FTW":10,"GSW":11,"PHW":11,"SFW":11, \
                        "HOU":14,"SDR":14,"IND":15,"INA":15,"LAC":16,"BUF":16,"SDC":16, \
                        "LAL":17,"MNL":17,"MEM":19,"VAN":19, \
                        "MIA":20,"MIL":21,"MIN":22,"NOP":23,"NOH":23,"NOK":23,"NYK":24, \
                        "OKC":25,"SEA":25,"ORL":26,"PHI":27,"SYR":27,"PHO":28,"POR":29, \
                        "SAC":30,"ROC":30,"CIN":30,"KCO":30,"KCK":30,"SAS":31,"DLC":31,"TEX":31,"SAA":31, \
                        "TOR":38,"UTA":40,"NOJ":40,"WAS":41,"CHP":41,"CHZ":41,"BAL":41,"CAP":41,"WSB":41}

TEAM_TO_TEAM_ABBR = {
        'ATLANTA HAWKS': 'ATL',
        'ST. LOUIS HAWKS': 'STL',
        'MILWAUKEE HAWKS': 'MLH',
        'TRI-CITIES BLACKHAWKS': 'TRI',
        'BOSTON CELTICS': 'BOS',
        'BROOKLYN NETS': 'BRK',
        'NEW JERSEY NETS' : 'NJN',
        'NEW YORK NETS' : 'NYN',
        'NEW YORK AMERICANS': 'NYA',
        'NEW JERSEY AMERICANS': 'NJA',
        'CHICAGO BULLS': 'CHI',
        'CHARLOTTE HORNETS': 'CHO',
        'CHARLOTTE BOBCATS' : 'CHA',
        'CLEVELAND CAVALIERS': 'CLE',
        'DALLAS MAVERICKS': 'DAL',
        'DENVER NUGGETS': 'DEN',
        'DETROIT PISTONS': 'DET',
        'FORT WAYNE PISTONS': 'FTW',
        'GOLDEN STATE WARRIORS': 'GSW',
        'SAN FRANCISCO WARRIORS': 'SFW',
        'PHILADELPHIA WARRIORS': 'PHW',
        'HOUSTON ROCKETS': 'HOU',
        'SAN DIEGO ROCKETS': 'SDR',
        'INDIANA PACERS': 'IND',
        'LOS ANGELES CLIPPERS': 'LAC',
        'SAN DIEGO CLIPPERS': 'SDC',
        'BUFFALO BRAVES': 'BUF',
        'LOS ANGELES LAKERS': 'LAL',
        'MINNEAPOLIS LAKERS': 'MNL',
        'MEMPHIS GRIZZLIES': 'MEM',
        'VANCOUVER GRIZZLIES' : 'VAN',
        'MIAMI HEAT': 'MIA',
        'MILWAUKEE BUCKS': 'MIL',
        'MINNESOTA TIMBERWOLVES': 'MIN',
        'NEW ORLEANS PELICANS' : 'NOP',
        'NEW ORLEANS/OKLAHOMA CITY HORNETS' : 'NOK',
        'NEW ORLEANS HORNETS' : 'NOH',
        'NEW YORK KNICKS' : 'NYK',
        'OKLAHOMA CITY THUNDER' : 'OKC',
        'SEATTLE SUPERSONICS' : 'SEA',
        'ORLANDO MAGIC' : 'ORL',
        'PHILADELPHIA 76ERS' : 'PHI',
        'SYRACUSE NATIONALS' : 'SYR',
        'PHOENIX SUNS' : 'PHO',
        'PORTLAND TRAIL BLAZERS' : 'POR',
        'SACRAMENTO KINGS' : 'SAC',
        'KANSAS CITY KINGS' : 'KCK',
        'KANSAS CITY-OMAHA KINGS' : 'KCO',
        'CINCINNATI ROYALS' : 'CIN',
        'ROCHESTER ROYALS': 'ROC',
        'SAN ANTONIO SPURS' : 'SAS',
        'TORONTO RAPTORS' : 'TOR',
        'UTAH JAZZ' : 'UTA',
        'NEW ORLEANS JAZZ' : 'NOJ',
        'WASHINGTON WIZARDS' : 'WAS',
        'WASHINGTON BULLETS' : 'WSB',
        'CAPITAL BULLETS' : 'CAP',
        'BALTIMORE BULLETS' : 'BAL',
        'CHICAGO ZEPHYRS' : 'CHZ',
        'CHICAGO PACKERS' : 'CHP',
}
defunct = {        # DEFUNCT FRANCHISES
        'ANDERSON PACKERS': 'AND',
        'CHICAGO STAGS': 'CHI',
        'INDIANAPOLIS OLYMPIANS': 'IND',
        'SHEBOYGAN RED SKINS': 'SRS',
        'ST. LOUIS BOMBERS': 'SLB',
        'WASHINGTON CAPITOLS' : 'WAS',
        'WATERLOO HAWKS': 'WAT'}
def get_roster(team, season_end_year):
    r = get(f'https://widgets.sports-reference.com/wg.fcgi?css=1&site=bbr&url=%2Fteams%2F{team}%2F{season_end_year}.html&div=div_roster')
    df = None
    if r.status_code==200:
        encoding = r.encoding if 'charset' in r.headers.get('content-type', '').lower() else None
        soup = BeautifulSoup(r.content, 'html.parser', from_encoding=encoding)
        print("Finding table for: " + str(season_end_year) + " " + str(team))
        table = soup.find('table')
        print("Reading html")
        df = pd.read_html(str(table))[0]
        print("Done")
        soup.decompose()
        print("Transforming df")
        df.columns = ['NUMBER', 'PLAYER', 'POS', 'HEIGHT', 'WEIGHT', 'BIRTH_DATE',
                        'NATIONALITY', 'EXPERIENCE', 'COLLEGE']
        df['BIRTH_DATE'] = df['BIRTH_DATE'].apply(lambda x: pd.to_datetime(x))
        df['NATIONALITY'] = df['NATIONALITY'].apply(lambda x: x.upper() if type(x) == str else "N/A")
        df['YEAR'] = [str(season_end_year-1)+"-"+str(season_end_year)[-2:] for _ in range(len(df))]
        print("Done")
    return df

def get_team_stats(team, season_end_year, data_format='PER_GAME'):
    if data_format=='TOTAL':
        selector = 'div_team-stats-base'
    elif data_format=='PER_GAME':
        selector = 'div_team-stats-per_game'
    elif data_format=='PER_POSS':
        selector = 'div_team-stats-per_poss'
    r = get(f'https://widgets.sports-reference.com/wg.fcgi?css=1&site=bbr&url=%2Fleagues%2FNBA_{season_end_year}.html&div={selector}')
    df = None
    if r.status_code==200:
        soup = BeautifulSoup(r.content, 'html.parser')
        table = soup.find('table')
        df = pd.read_html(str(table))[0]
        league_avg_index = df[df['Team']=='League Average'].index[0]
        df = df[:league_avg_index]
        df['Team'] = df['Team'].apply(lambda x: x.replace('*', '').upper())
        df['TEAM'] = df['Team'].apply(lambda x: TEAM_TO_TEAM_ABBR[x])
        df = df.drop(['Rk', 'Team'], axis=1)
        df.loc[:, 'SEASON'] = f'{season_end_year-1}-{str(season_end_year)[2:]}'
        s = df[df['TEAM']==team]
        return pd.Series(index=list(s.columns), data=s.values.tolist()[0])

def get_opp_stats(team, season_end_year, data_format='PER_GAME'):
    if data_format=='TOTAL':
        selector = 'div_opponent-stats-base'
    elif data_format=='PER_GAME':
        selector = 'div_opponent-stats-per_game'
    elif data_format=='PER_POSS':
        selector = 'div_opponent-stats-per_poss'
    r = get(f'https://widgets.sports-reference.com/wg.fcgi?css=1&site=bbr&url=%2Fleagues%2FNBA_{season_end_year}.html&div={selector}')
    df = None
    if r.status_code==200:
        soup = BeautifulSoup(r.content, 'html.parser')
        table = soup.find('table')
        df = pd.read_html(str(table))[0]
        league_avg_index = df[df['Team']=='League Average'].index[0]
        df = df[:league_avg_index]
        df['Team'] = df['Team'].apply(lambda x: x.replace('*', '').upper())
        df['TEAM'] = df['Team'].apply(lambda x: TEAM_TO_TEAM_ABBR[x])
        df = df.drop(['Rk', 'Team'], axis=1)
        df.columns = list(map(lambda x: 'OPP_'+x, list(df.columns)))
        df.rename(columns={'OPP_TEAM': 'TEAM'}, inplace=True)
        df.loc[:, 'SEASON'] = f'{season_end_year-1}-{str(season_end_year)[2:]}'
        s = df[df['TEAM']==team]
        return pd.Series(index=list(s.columns), data=s.values.tolist()[0])

def get_team_misc(season_end_year):
    r = get(f'https://widgets.sports-reference.com/wg.fcgi?css=1&site=bbr&url=%2Fleagues%2FNBA_{season_end_year}.html&div=div_misc_stats')
    df = None
    if r.status_code==200:
        soup = BeautifulSoup(r.content, 'html.parser')
        table = soup.find('table')
        df = pd.read_html(str(table))[0]
        df.columns = list(map(lambda x: x[1], list(df.columns)))
        league_avg_index = df[df['Team']=='League Average'].index[0]
        df = df[:league_avg_index]
        df['Team'] = df['Team'].apply(lambda x: x.replace('*', '').upper())
        df = df.drop(df[df['Team'].isin(defunct)].index)
        df = df.drop(['Rk', 'Age'], axis=1)
        df.rename(columns = {'Pace': 'PACE', 'Arena': 'ARENA', 'Attend.': 'ATTENDANCE', 'Attend./G': 'ATTENDANCE/G'}, inplace=True)
        df.loc[:, 'YEAR'] = f'{season_end_year-1}-{str(season_end_year)[2:]}'
        df['TEAMABRV'] = df['Team'].apply(lambda x: TEAM_TO_TEAM_ABBR[x])
        df['TEAMID'] = df['TEAMABRV'].apply(lambda x: TEAM_ABBR_TO_TEAM_ID[x])
        return df

def get_roster_stats(team, season_end_year, data_format='PER_GAME', playoffs=False):
    if playoffs:
        period = 'playoffs'
    else:
        period = 'leagues'
    selector = data_format.lower()
    r = get(f'https://widgets.sports-reference.com/wg.fcgi?css=1&site=bbr&url=%2F{period}%2FNBA_{season_end_year}_{selector}.html&div=div_{selector}_stats')
    df = None
    if r.status_code==200:
        soup = BeautifulSoup(r.content, 'html.parser')
        table = soup.find('table')
        df2 = pd.read_html(str(table))[0]
        for index, row in df2.iterrows():
            if row['Tm']==team:
                if df is None:
                    df = pd.DataFrame(columns=list(row.index)+['SEASON'])
                row['SEASON'] = f'{season_end_year-1}-{str(season_end_year)[2:]}'
                df = df.append(row)
        df.rename(columns = {'Player': 'PLAYER', 'Age': 'AGE', 'Tm': 'TEAM', 'Pos': 'POS'}, inplace=True)
        df = df.reset_index().drop(['Rk', 'index'], axis=1)
        return df

def get_roster_advanced_stats(team, season_end_year):
    r = get(f'https://widgets.sports-reference.com/wg.fcgi?css=1&site=bbr&url=%2Fteams%2F{team}%2F{season_end_year}.html&div=div_advanced')
    if r.status_code==200:
        soup = BeautifulSoup(r.content, 'html.parser')
        table = soup.find('table')
        df = pd.read_html(str(table))[0]
        soup.decompose()
        columns = ['Rk', 'Unnamed: 1', 'Age', 'G', 'MP', 'PER', 'TS%', '3PAr', 'FTr', 'ORB%',
       'DRB%', 'TRB%', 'AST%', 'STL%', 'BLK%', 'TOV%', 'USG%', 'Unnamed: 17', 'OWS', 'DWS', 'WS', 'WS/48',
       'Unnamed: 22', 'OBPM', 'DBPM', 'BPM', 'VORP']
        empty = ['' for _ in range(len(df))]
        new_df = pd.DataFrame(columns=columns)
        for i in range(len(columns)):
            if columns[i] in df.columns:
                new_df[columns[i]] = df[columns[i]]
            else:
                new_df[columns[i]] = empty
        new_df['YEAR'] = [str(season_end_year-1)+"-"+str(season_end_year)[-2:] for _ in range(len(df))]
    return new_df

