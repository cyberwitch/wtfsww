from json import dumps

from flask import Flask, render_template, request, send_from_directory

from tmdbutils import TMDBUtils


app = Flask(__name__, static_url_path='')
tmdb = TMDBUtils('1c9fdf67f8e8f9df79a09809f463bc25')


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/v1.0/search/<query>', methods=['GET'])
def suggestions(query):
    return dumps(tmdb.search(query, True))


@app.route('/show/<tmdb_id>')
def show(tmdb_id):
    show = tmdb.get_show(tmdb_id)
    return render_template('show.html', show=show)


@app.route('/api/show/<tmdb_id>/season/<season_number>')
def show_season(tmdb_id, season_number):
    return dumps(tmdb.get_season(tmdb_id, season_number))

if __name__ == '__main__':
    app.run(debug=True)