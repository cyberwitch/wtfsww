import tmdbsimple as tmdb


class TMDBUtils():
    def __init__(self, api_key):
        tmdb.API_KEY = api_key
        self.config = tmdb.Configuration().info()
        return

    def transform_result(self, result):
        image_url = None
        year = None

        if result['poster_path']:
            image_url = \
                self.config['images']['base_url'] + \
                    self.config['images']['poster_sizes'][0] + \
                    result['poster_path']

        if result.get('first_air_date', None):
            first_air_date = result['first_air_date']
            year = first_air_date[:first_air_date.index('-')]

        return {
            'id': result['id'],
            'name': result['name'],
            'overview': result.get('overview', None),
            'seasons': result.get('seasons', None),
            'episodes': result.get('episodes', None),
            'image_url': image_url,
            'year': year
        }

    def search(self, query, suggestions=False):
        tmdb_search = tmdb.Search()
        search_type = 'ngram' if suggestions else 'phrase'
        response = tmdb_search.tv(query=query, search_type=search_type)

        return list(map(self.transform_result, response['results'][:5]))

    def get_show(self, tmdb_id):
        tmdb_tv = tmdb.TV(id=tmdb_id)
        return self.transform_result(tmdb_tv.info())

    def get_season(self, tmdb_id, season_number):
        return self.transform_result(
            tmdb.TV_Seasons(tmdb_id, season_number).info())