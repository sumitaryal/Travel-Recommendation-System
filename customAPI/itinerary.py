import pandas as pd
import math


def get_itinerary(locations_to_visit):
    
    # Read the data from JSON file
    df = pd.read_json('traveldata.json')

    # Filter the DataFrame to include only the locations to visit
    df = df[df['title'].isin(locations_to_visit)]
    df['title'] = df['title'].str.title()

    # Create a dictionary that maps the location names to categories
    location_categories = dict(zip(df['location'].unique(), range(1, len(df['location'].unique()) + 1)))

    # Convert the 'location' column to categorical data type using the dictionary
    categories = pd.CategoricalDtype(categories=location_categories, ordered=True)
    df['location'] = df['location'].astype(categories)

    # Sort the DataFrame by the 'location' column
    df = df.sort_values('location')

    number_locations = len(df['location'].unique())

    # create a function to sum the costs in the "costs" list
    def sum_costs(row):
        total_cost = 0
        for cost_obj in row['costs']:
            total_cost += int(cost_obj['cost'])
        return total_cost

    # apply the function to each row to create the "cost" column
    df['costs'] = df.apply(sum_costs, axis=1)

    # Calculate the total cost of the recommended locations
    total_cost = df['costs'].sum() + math.floor(df['time_taken'].sum()) * 3000 + number_locations * 4000

    df = df.reset_index(drop=True)
    df = df.drop(['latitude', 'longitude', 'province'], axis=1)

    # Create a new DataFrame to hold the modified data
    new_df = pd.DataFrame(columns=df.columns)

    if number_locations > 1:
        for i, row in df.iterrows():
            # If this is not the first row and the location has changed, add a new row with the location name
            if i > 0 and row['location'] != df.iloc[i-1]['location']:
                new_row = {'title': "Travelling", 'location': "", 'time_taken': 1, 'costs': 4000, 'activity': f"Travel from {df.iloc[i-1]['location']} to {row['location']}", 'type_visit': "Travel", 'description': f"Travel from {df.iloc[i-1]['location']} to {row['location']}", "rating": ""}
                new_df = pd.concat([new_df, pd.DataFrame([new_row])], ignore_index=True)
            # Add the original row to the new DataFrame
            new_df = pd.concat([new_df, pd.DataFrame([row])], ignore_index=True)

        new_row = {'title': "Travelling", 'location': "", 'time_taken': 1, 'costs': 4000, 'activity': f"Travel from {df.iloc[-1]['location']} to {df.iloc[0]['location']}", 'type_visit': "Travel", 'description': f"Travel from {df.iloc[-1]['location']} to {df.iloc[0]['location']}", "rating": ""}
        new_df = pd.concat([new_df, pd.DataFrame([new_row])], ignore_index=True)
        itinerary = new_df.to_dict('records')
    else:
        itinerary = df.to_dict('records')
    
    return itinerary, total_cost