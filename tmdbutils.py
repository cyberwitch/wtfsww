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

        if result.get('release_date', None):
            release_date = result['release_date']
            year = release_date[:release_date.index('-')]

        return {
            'id': result['id'],
            'title': result['title'],
            'image_url': image_url,
            'year': year
        }

    def search(self, query, suggestions=False):
        tmdb_search = tmdb.Search()
        search_type = 'ngram' if suggestions else 'phrase'
        response = tmdb_search.movie(query=query, search_type=search_type)

        return list(map(self.transform_result, response['results'][:5]))

    def get_movie(self, tmdb_id):
        tmdb_movie = tmdb.Movies(id=tmdb_id)
        return self.transform_result(tmdb_movie.info())