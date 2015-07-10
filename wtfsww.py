from json import dumps

from flask import Flask, render_template, request, send_from_directory

from flask_cors import CORS

from tmdbutils import TMDBUtils


app = Flask(__name__)
cors = CORS(app)
tmdb = TMDBUtils('1c9fdf67f8e8f9df79a09809f463bc25')


@app.route('/api/v1.0/movies', methods=['GET'])
def search_movies():
    return dumps(tmdb.search(request.args.get('query')))


@app.route('/api/v1.0/movies/<tmdb_id>', methods=['GET'])
def get_movie(tmdb_id):
    return dumps(tmdb.get_movie(tmdb_id))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')