import pymongo
from pandas import DataFrame

# utility functions for accessing mongodb


class Database():
    def __init__(self, uri):
        self.client = pymongo.MongoClient(uri)
        self.db = self.client.get_default_database()
        self.songs = self.db['songs']
        self.models = self.db['models']

    def get_songs(self, query={}, formatObj={
        "liveness": 1,
        "tempo": 1,
        "energy": 1,
        "danceability": 1,
        "speechiness": 1,
        "acousticness": 1,
        "instrumentalness": 1,
        "valence": 1,
        "_id": 1,
    }):
        '''
        Returns all songs in the database. Keeps only the fields necessary for the gmm analysis.
        :param dict query: query to filter the songs. {} by default
        :param dict formatObj: format of the returned songs. By default, only relevant fields are returned.
        '''
        res = self.songs.find(query, formatObj)
        return DataFrame(list(res))

    def update_song(self, query, value):
        '''
        Updates a song in the database.
        :param dict query: query to filter the songs.
        :param dict value: value to update the song with.
        '''
        self.songs.update_one(query, {"$set": value})

    def get_model(self):
        return self.models.find({})[0]['model']
    
    def update_model(self, query, value):
        '''
        Updates the model parameter
        '''
        self.models.update_one(query, {"$set": value})
