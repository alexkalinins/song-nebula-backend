from sklearn.mixture import GaussianMixture
import pandas as pd
from mongodb import Database
import sys
from tqdm import tqdm

'''
Recalculates gaussian mixture model for ALL datapoints in the database. 
Saves the updated model parameters to the database.
'''


# smallest number of clusters (inclusive)
CLUSTER_MIN = 15

# largest number of clusters (exclusive)
CLUSTER_MAX = 30

db = Database(sys.argv[1])
songs = db.get_songs()

best_score = 0
best_model = None

X = songs.drop(['_id'], axis=1)

# picking the best cluster count
for k in range(CLUSTER_MIN, CLUSTER_MAX):
    gmm = GaussianMixture(n_components=k, covariance_type='full')
    gmm = gmm.fit(X)
    score = gmm.bic(X) + gmm.aic(X)
    if score < best_score or k == CLUSTER_MIN:
        best_score = score
        best_model = gmm


# save model to database
db.update_model({'param': 'means'}, best_model.means_.tolist())
db.update_model({'param': 'covariances'}, best_model.covariances_.tolist())
db.update_model({'param': 'weights'}, best_model.weights_.tolist())

labels = best_model.predict(X)
songs['cluster'] = labels

for index, row in songs.iterrows():
    db.update_song({'_id': row['_id']}, {'cluster': row['cluster']})
