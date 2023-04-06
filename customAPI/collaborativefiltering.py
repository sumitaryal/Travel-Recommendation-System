#CODE TO CREATE RANDOM RATINGS DATA

'''

import random
import csv

# Set the random seed for reproducibility
random.seed(69)

# Define the list of places and users
places = ['Pashupatinath Temple', 'Boudhanath Stupa', 'Swayambhunath Stupa', 'Patan Durbar Square', 'Kathmandu Durbar Square', 'Changu Narayan', 'Shivapuri National Park', 'Nagarkot', 'Bagmati River', 'Phulchowki Hill', 'Narayanhiti Palace Museum', 'Garden of Dreams', 'Thamel', 'Bhaktapur Durbar Square', 'National Museum of Nepal', 'Budhanilkantha Temple', 'Godavari Botanical Garden', 'Kapan Monastry', 'Chandragiri Hill', 'Pharping', 'Phewa Lake', 'World Peace Pagoda', 'Bindabasini Temple', 'David Falls', 'Hemja', 'Mahendra Cave', 'Chamero Gufa', 'Sarangkot', 'International Mountain Museum', 'Begnas Lake', 'Gupteshwor Mahadev Cave', 'Seti River Gorge', 'Rupa Lake', 'Phumdikot', 'Old Bazar', 'Chitwan National Park', 'Tharu Village', 'Elephant Breeding Center', 'Jalbire Waterfall', 'Devghat', 'Bishazari Tal', 'Sauraha Art Gallery', 'Ranipohkari', 'Siraichuli Hills', 'Narayani River', 'Chitwan Tharu Museum', 'Maula Kalika Temple']

users = ['sumitaryal', 'rishavbhattarai', 'takshakbist', 'sumit', 'rishav', 'takshak', 'hello', 'bro', 'unknown', 'anonymous', 'ram', 'sam', 'hari', 'sita', 'krishna']

# Define the possible ratings and their weights
ratings = ['', 1, 2, 3, 4, 5]
weights = [0.4, 0.025, 0.05, 0.2, 0.2, 0.125]  # corresponds to [1, 2, 3, 4, 5]

# Generate random ratings for each user and place
ratings_data = []
for place in places:
    for user in users:
        rating = random.choices(ratings, weights=weights)[0]
        ratings_data.append([place, user, rating])

# Save the data to a CSV file
with open('ratings.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['title', 'user', 'rating'])
    writer.writerows(ratings_data)
'''


import pandas as pd
import numpy as np
from cosineSimilarity import cosine_similarity

def get_collaborative(location, ratings,n=12):
    # Read the ratings data
    ratings_data = pd.read_csv('ratings.csv')

    travel_data = pd.read_json('traveldata.json')
    travel_data['title'] = travel_data['title'].str.title()

    # Drop the columns that are not needed
    travel_data = travel_data.drop(['latitude', 'longitude', 'province'], axis=1)

    # create a function to sum the costs in the "costs" list
    def sum_costs(row):
        total_cost = 0
        for cost_obj in row['costs']:
            total_cost += int(cost_obj['cost'])
        return total_cost
    
    # apply the function to each row to create the "cost" column
    travel_data['costs'] = travel_data.apply(sum_costs, axis=1)

    new_ratings_data = pd.DataFrame(ratings)
    ratings_data = pd.concat([ratings_data, new_ratings_data], ignore_index=True)


    # Convert the rating dataframe into a user-item matrix
    title_user_matrix = pd.pivot_table(ratings_data, values='rating', index='title', columns='user')

    # Fill missing values with 0
    title_user_matrix.fillna(0, inplace=True)

    similarity_scores = cosine_similarity(title_user_matrix)
    index = np.where(title_user_matrix.index==location)[0][0]
    similar_items = sorted(list(enumerate(similarity_scores[index])),key=lambda x:x[1],reverse=True)[1:n+1]

    recommendations = []
    for item in similar_items:
        temp_df = travel_data[travel_data['title']==title_user_matrix.index[item[0]]]
        recommendations.extend(temp_df.to_dict('records'))
    
    return recommendations