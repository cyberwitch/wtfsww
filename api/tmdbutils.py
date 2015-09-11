import tmdbsimple


class TMDBUtils():
    def __init__(self, api_key):
        tmdbsimple.API_KEY = api_key
        self.config = tmdbsimple.Configuration().info()
        return

    def transform_result(self, result):
        image_url = None
        year = None

        if result['poster_path']:
            image_url = \
                self.config['images']['base_url'] + \
                    self.config['images']['poster_sizes'][0] + \
                    result['poster_path']

        if result.get('release_date', None):
            release_date = result['release_date']
            year = release_date[:release_date.index('-')]

        return {
            'tmdb_id': result['id'],
            'title': result['title'],
            'image_url': image_url,
            'year': year
        }

    def search(self, query):
        tmdb_search = tmdbsimple.Search()
        response = tmdb_search.movie(query=query, search_type='ngram')

        return [self.transform_result(movie) for movie in response['results'][:5]]

    def get_movie(self, tmdb_id):
        tmdb_movie = tmdbsimple.Movies(id=tmdb_id)
        return self.transform_result(tmdb_movie.info())
