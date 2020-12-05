import requests
from bs4 import BeautifulSoup
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from config.config import DATABASE_URI
from model.model import Base, News

engine = create_engine(DATABASE_URI)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
s = Session()


topic="rajinikanth"
numResults=150
url ="https://www.google.com/search?q="+topic+"&tbm=nws&hl=en&num="+str(numResults)
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')
results = soup.find_all('div', attrs = {'class': 'ZINbbc'})
descriptions = []
timesOfNews = []
sources = []
headers = []

for result in results:
    try:
        description = result.find('div', attrs={'class':'s3v9rd'}).get_text()
        source = result.find('div', attrs={'class' : 'UPmit'}).get_text()
        header = result.find('div', attrs={'class' : 'vvjwJb'}).get_text()
        timeOfNews = result.find('span', attrs={'class' : 'r0bn4c'}).get_text()
        if description != '.':
            if description != '':
                j=description.index('·')
                i=description.index('.')
                descript=description[j+2:i+1]
                descriptions.append(descript)
            if source != '':
                sources.append(source)
            if header != '':
                headers.append(header)
            if timeOfNews != '':
                timesOfNews.append(timeOfNews)
    except:
        continue

for description in descriptions:
    print(description)

for i in range (100):
    #print(sources[i], timesOfNews[i], headers[i], descriptions[i])
    add_news = News(
        time = str(timesOfNews[i]),
        source = str(sources[i]),
        header = str(headers[i]),
        description = str(descriptions[i])
    )
    s.add(add_news)
    s.commit()

print("Added")

