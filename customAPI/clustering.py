# Import necessary modules
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Read the JSON file into a pandas DataFrame
df = pd.read_json('traveldata.json')

# Extract the latitude and longitude columns as numpy arrays
X = df[['latitude', 'longitude']].values

# Initialize the cluster centroids randomly
centroids = np.array([[27.7172, 85.3240],
                     [28.2096, 83.9856],
                     [27.5320, 84.4163]])

# Define the number of clusters and maximum number of iterations
K = centroids.shape[0]
max_iter = 1000

# Iterate until convergence or max number of iterations is reached
for i in range(max_iter):
    # Compute the distances between each data point and each centroid
    distances = np.linalg.norm(X[:, np.newaxis, :] - centroids, axis=2)

    # Assign each data point to the nearest centroid
    labels = np.argmin(distances, axis=1)

    # Update the centroids based on the mean of the data points in each cluster
    for j in range(K):
        centroids[j] = np.mean(X[labels == j], axis=0)

# Add the cluster labels to the DataFrame
df['cluster'] = labels

# Visualize the clusters
plt.scatter(df['longitude'], df['latitude'], c=df['cluster'])
plt.xlabel('Longitude')
plt.ylabel('Latitude')
plt.show()