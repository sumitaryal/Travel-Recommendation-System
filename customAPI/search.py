import pandas as pd

def get_locations(location):
    # Read the data from JSON file
    travel_df = pd.read_json('traveldata.json')

    # Convert the 'location' to title case
    location = str(location).title()
    travel_df['title'] = travel_df['title'].str.title()

    # Filter the DataFrame to include only the locations to visit
    travel_df = travel_df.loc[travel_df['location'] == location]

    # Reset the index
    travel_df = travel_df.reset_index(drop=True)

    # Drop the columns that are not needed
    travel_df = travel_df.drop(['latitude', 'longitude', 'province'], axis=1)

    # create a function to sum the costs in the "costs" list
    def sum_costs(row):
        total_cost = 0
        for cost_obj in row['costs']:
            total_cost += int(cost_obj['cost'])
        return total_cost
    
    # apply the function to each row to create the "cost" column
    travel_df['costs'] = travel_df.apply(sum_costs, axis=1)

    return travel_df.to_dict('records')
