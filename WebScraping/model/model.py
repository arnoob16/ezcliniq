from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Date

Base = declarative_base()


class News(Base):
    __tablename__ = 'webnews'
    id = Column(Integer, primary_key=True)
    time = Column(String)
    source = Column(String)
    header = Column(String)
    description = Column(String)

    def __repr__(self):
        return "<News(time='{}', source='{}', header={}, description={})>" \
            .format(self.time, self.source, self.header, self.description)