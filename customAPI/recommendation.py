# Import necessary modules
import pandas as pd
import numpy as np
import math
from cosineSimilarity import cosine_similarity
from tfidfVectorizer import TfidfVectorizer

def get_budget_recommendations(destination, location_type, days, budget):
    
    # Load the data
    df = pd.read_json('traveldata.json')

    # Prepare the data
    # Remove missing values
    df['type_visit'] = df['type_visit'].str.title()
    df['title'] = df['title'].str.title()
    destination = str(destination).title()

    # create a function to sum the costs in the "costs" list
    def sum_costs(row):
        total_cost = 0
        for cost_obj in row['costs']:
            total_cost += int(cost_obj['cost'])
        return total_cost
    
    # apply the function to each row to create the "cost" column
    df['costs'] = df.apply(sum_costs, axis=1)

    df = df.loc[df['location'] == destination]
    df = df.reset_index(drop=True)
    df = df.drop(['latitude', 'longitude', 'province'], axis=1)

    # Train the model

    # Convert the "type" column to a numerical feature matrix using the TF-IDF weighting
    tfidf = TfidfVectorizer()
    type_matrix = tfidf.fit(df['type_visit']).transform(df['type_visit'])

    # Compute the cosine similarity between each pair of locations
    cos_sim = cosine_similarity(type_matrix)

    # Convert location_type to title case
    location_type = location_type.title()

    # Get the location_id of the given location_type
    location_type_id = df.loc[df['type_visit'] == location_type].index[0]

    # Get the indices of the most similar locations
    sim_indices = np.argsort(cos_sim[location_type_id])[::-1]

    # Initialize an empty list to store the recommended locations
    recommended_locations = []

    df = df.drop('location', axis=1)

    # Loop through the top indices and add the location data to the recommended_locations list
    for index in sim_indices:
        location = df.iloc[index]
        time_taken = location['time_taken']
        cost = location['costs']

        # Check if the total time_taken of the recommended locations is less than or equal to the days input
        # and the total cost is less than or equal to the budget
        if sum([loc['time_taken'] for loc in recommended_locations]) + time_taken <= days and sum([loc['costs'] for loc in recommended_locations] + [loc['time_taken'] for loc in recommended_locations] * 3000) + cost <= budget:
            # Check if the current location cost is less than the remaining budget
            if cost <= budget - sum([loc['costs'] for loc in recommended_locations] + [loc['time_taken'] for loc in recommended_locations] * 3000):
                recommended_locations.append(location.to_dict())
            # If not, skip this location and move on to the next one
            else:
                continue

    # Calculate the total cost of the recommended locations
    total_cost = sum([loc['costs'] for loc in recommended_locations]) + math.floor(sum([loc['time_taken'] for loc in recommended_locations])) * 3000

    # Return the recommended locations and the total cost
    return recommended_locations, total_cost

def get_recommendations(destination, location_types, days, budget, sim_threshold=0.1):
    
    # Load the data
    df = pd.read_json('traveldata.json')

    # Prepare the data
    # Remove missing values
    df['type_visit'] = df['type_visit'].str.title()
    df['title'] = df['title'].str.title()
    destination = str(destination).title()

    # create a function to sum the costs in the "costs" list
    def sum_costs(row):
        total_cost = 0
        for cost_obj in row['costs']:
            total_cost += int(cost_obj['cost'])
        return total_cost
    
    # apply the function to each row to create the "cost" column
    df['costs'] = df.apply(sum_costs, axis=1)

    df = df.loc[df['location'] == destination]
    df = df.reset_index(drop=True)
    df = df.drop(['latitude', 'longitude', 'province'], axis=1)

    # Train the model

    # Convert the "type" column to a numerical feature matrix using the TF-IDF weighting
    tfidf = TfidfVectorizer()
    type_matrix = tfidf.fit(df['type_visit']).transform(df['type_visit'])

    # Compute the cosine similarity between each pair of locations
    cos_sim = cosine_similarity(type_matrix)

    # Initialize an empty list to store the recommended locations
    recommended_locations = []
    recommendations = []

    df = df.drop('location', axis=1)

    if not location_types:
        # If location_types is an empty list, sort the dataframe by rating and select top locations
        recommendations = df.sort_values(by='rating', ascending=False)
    else:
        # Convert location_type to title case
        for location_type in location_types:
            # Convert location_type to title case
            location_type = location_type.title()

            # Get the location_id of the given location_type
            location_type_id = df.loc[df['type_visit'] == location_type].index[0]

            # Get the indices of the most similar locations
            sim_indices = np.argsort(cos_sim[location_type_id])[::-1]

            # Filter out locations with low similarity scores
            sim_scores = cos_sim[location_type_id][sim_indices] 
            top_indices = sim_indices[sim_scores >= sim_threshold]
            recommendations += df.iloc[top_indices].to_dict('records')

        recommendations = pd.DataFrame(recommendations)
        recommendations = recommendations.sort_values(by='rating',ascending=False)


    # Loop through the recommended locations dataframe and add the location data to the recommended_locations list
    for index, location in recommendations.iterrows():
        time_taken = location['time_taken']
        cost = location['costs']
        # Check if the total time_taken of the recommended locations is less than or equal to the days input
        # and the total cost is less than or equal to the budget
        if sum([loc['time_taken'] for loc in recommended_locations]) + time_taken <= days and sum([loc['costs'] for loc in recommended_locations] + [loc['time_taken'] for loc in recommended_locations] * 3000) + cost <= budget:
            # Check if the current location cost is less than the remaining budget
            if cost <= budget - sum([loc['costs'] for loc in recommended_locations] + [loc['time_taken'] for loc in recommended_locations] * 3000):
                recommended_locations.append(location.to_dict())
            # If not, skip this location and move on to the next one
            else:
                continue

    # Calculate the total cost of the recommended locations
    total_cost = sum([loc['costs'] for loc in recommended_locations]) + math.floor(sum([loc['time_taken'] for loc in recommended_locations])) * 3000


    # Return the recommended locations and the total cost
    return recommended_locations, total_cost