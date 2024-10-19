from geopy.distance import geodesic

def max_const(arr_Concerts, user):
    max_prices = arr_Concerts[0]
    max_distance = arr_Concerts[0]
    for Concert in arr_Concerts:
        if Concert.prices > max_prices.prices:
            max_prices = Concert
        if Concert.distance_difference(user) > max_distance.distance_difference(user):
            max_distance = Concert
    return (max_prices.prices, max_distance.distance_difference(user))


class Concert:
    # location is tuple (latitude, longitude)
    # artist is a set 
    # prices is a number
    # rating is from 1 to 5
    def __init__(self, title, rating, location, artist, prices):
        self.title = title
        self.rating = rating
        self.location = location
        self.artist = artist
        self.prices = prices
    def __str__(self):
        return "{0}".format(self.title)
    def distance_difference(self, user):
        return abs(geodesic(user.location, self.location).kilometers)
    def artist_diffference(self, user):
        total = len(self.artist)
        matched = 0
        for art in user.likedArtist:
            if art in self.artist:
                matched += 1
        return total - matched
    def prices_difference(self, user):
        return abs(self.prices - user.budget)
    def ranking_score(self, user, max_distance, max_prices):
        return self.rating - (self.distance_difference(user) / max_distance) - \
            (self.artist_diffference(user) / len(user.likedArtist)) - \
            (self.prices_difference(user) / max_prices)
             

        

class User:
    def __init__(self, location, budget, likedArtist):
        self.location = location
        self.budget = budget
        self.likedArtist = likedArtist

def quick_sort(arr, user, max_bpm, max_distance):
    if len(arr) <= 0:
        return arr
    elif (arr) == 1:
        return [(arr[0], arr[0].ranking_score(user, max_distance, max_prices))]
    else:
        # Select a pivot element (using the last element here for simplicity)
        pivot = arr[-1]
        left = []
        right = []
        pivot_score = pivot.ranking_score(user, max_distance, max_prices)
        for Concert in arr[:-1]:
            if Concert.ranking_score(user, max_distance, max_prices) > pivot_score:
                left.append(Concert)
            else:
                right.append(Concert)
            
        
        # Recursively apply quick_sort to 'left' and 'right', and combine with pivot
        return quick_sort(left, user, max_bpm, max_distance) + [(pivot, pivot_score)] + quick_sort(right, user, max_bpm, max_distance)
    
concert1 = Concert("Rock in Rio", 5, (22.911014, -43.209373), {"Metallica", "Iron Maiden"}, 150)
concert2 = Concert("Tomorrowland", 5, (51.091526, 4.385689), {"David Guetta", "Calvin Harris"}, 250)
concert3 = Concert("Coachella", 4, (33.682222, -116.237222), {"Beyoncé", "The Weeknd"}, 399)
concert4 = Concert("Lollapalooza", 4, (41.873076, -87.629167), {"Imagine Dragons", "Green Day"}, 130)
concert5 = Concert("Glastonbury", 5, (51.158101, -2.583294), {"Coldplay", "Ed Sheeran"}, 275)
concert6 = Concert("Woodstock", 4, (42.364538, -74.577132), {"Jimi Hendrix", "Santana"}, 80)
concert7 = Concert("Sunburn Festival", 3, (15.299326, 74.123996), {"DJ Snake", "Afrojack"}, 120)
concert8 = Concert("Electric Daisy Carnival", 5, (36.085600, -115.154083), {"Zedd", "Tiesto"}, 200)
concert9 = Concert("Fuji Rock Festival", 5, (36.690147, 138.775326), {"Sia", "Halsey"}, 185)
concert10 = Concert("Exit Festival", 4, (45.252869, 19.845175), {"Martin Garrix", "Steve Aoki"}, 90)

arr = [concert1, concert2, concert3, concert4, concert5, concert6, concert7, concert8, concert9, concert10]
user = User((37.7749, -122.4194), 100, {"Coldplay", "Ed Sheeran"})
const_max = max_const(arr, user)
max_prices = const_max[0]
max_distance = const_max[1]
sorted_arr = quick_sort(arr, user, max_prices, max_distance)
highest = sorted_arr[0][1]

final_result = []
for concert in sorted_arr:

    percentage = concert[1] / highest * 100
    final_result.append((concert[0], percentage))
    print(final_result[-1][0])
    print("Recommendation Rate: " + str(round(final_result[-1][1], 2)) + "%")



