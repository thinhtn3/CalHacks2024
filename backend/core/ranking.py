import requests
import json
response = requests.get('https://edmtrain.com/api/events?client=40b7a9a1-1336-48bf-9055-de9d1abf9822')
from geopy.distance import geodesic
import random

class Concert:
    # location is tuple (latitude, longitude)
    # artist is a set 
    # prices is a number
    # rating is from 1 to 5
    def __init__(self, title, location, artist, imageURL):
        self.title = title
        self.rating = round(random.uniform(1, 5), 1)
        self.location = location
        self.artist = artist
        self.prices = random.randint(100, 1000)
        self.imageURL = imageURL
        self.percentage = -1
    def to_dict(self):
        return {
            'title': self.title,
            'rating': self.rating,
            'location': self.location,
            'artist': [artist['name'] for artist in self.artist],  # Assuming artist data structure is consistent
            'prices': self.prices,
            'imageURL': self.imageURL,
            'percentage': self.percentage
        }
    def __str__(self):
        return "{0} Recommendation Percentage {1}".format(self.title, self.percentage)
    def distance_difference(self, user):
        return abs(geodesic(user.location, self.location).kilometers)
    def artist_diffference(self, user):
        total = len(self.artist)
        matched = 0
        for userLike in user.likedArtist:
            for haveArtist in self.artist:
                if userLike == haveArtist["name"]:
                    match += 1
        return total - matched
    def prices_difference(self, user):
        return abs(self.prices - user.budget)
    def assign_percentage(self, percent):
        self.percentage = percent
    def ranking_score(self, user, max_distance, max_prices):
        return max(self.rating - (self.distance_difference(user) / max_distance) - \
            (self.artist_diffference(user) / len(user.likedArtist)) - \
            (self.prices_difference(user) / max_prices), 0)

def max_const(arr_Concerts, user):
    max_prices = arr_Concerts[0]
    max_distance = arr_Concerts[0]
    for Concert in arr_Concerts:
        if Concert.prices > max_prices.prices:
            max_prices = Concert
        if Concert.distance_difference(user) > max_distance.distance_difference(user):
            max_distance = Concert
    return (max_prices.prices, max_distance.distance_difference(user))

        

class User:
    def __init__(self, location, budget, likedArtist):
        self.location = location
        self.budget = budget
        self.likedArtist = likedArtist

def quick_sort(arr, user, max_prices, max_distance):
    if len(arr) <= 1:
        return [(x, x.ranking_score(user, max_distance, max_prices)) for x in arr]
    else:
        pivot = arr[-1]
        left = []
        right = []
        pivot_score = pivot.ranking_score(user, max_distance, max_prices)
        for concert in arr[:-1]:
            if concert.ranking_score(user, max_distance, max_prices) > pivot_score:
                left.append(concert)
            else:
                right.append(concert)
        sorted_left = quick_sort(left, user, max_prices, max_distance)
        sorted_right = quick_sort(right, user, max_prices, max_distance)
        return sorted_left + [(pivot, pivot_score)] + sorted_right
            

async def recommendaditon(): 
    concerts_json = response.json()["data"]
    all_concerts = []
    for concert in concerts_json:
        if concert["name"] == None:
            continue
        venue = concert["venue"]
        new_c = Concert(concert["name"], (venue["latitude"], venue["longitude"]), concert["artistList"], concert["link"])
        all_concerts.append(new_c)

    user = User((37.7749, -122.4194), 300, {"Frank & Tony", "Adi", "Tal"})
    const_max = max_const(all_concerts, user)
    max_prices = const_max[0]
    max_distance = const_max[1]
    sorted_concerts = quick_sort(all_concerts, user, max_prices, max_distance)

    highest = sorted_concerts[0][1]
    final_result = []
    count = 0
    for concert in sorted_concerts:
        if (count >= 30):
            break
        percentage = concert[1] / highest * 100
        concert[0].assign_percentage(round(percentage, 1))
        final_result.append(concert[0])
        count += 1
    return json.dumps([concert.to_dict() for concert in final_result])

