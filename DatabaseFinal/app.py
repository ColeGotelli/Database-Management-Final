from flask import Flask, render_template, flash, redirect, request, url_for, session
from flaskext.mysql import MySQL
from werkzeug.security import check_password_hash, generate_password_hash
import os
import csv


app = Flask(__name__)

app.secret_key = os.urandom(16)

mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'Cole'
app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
app.config['MYSQL_DATABASE_DB'] = 'FinalProject'
app.config['MYSQL_DATABASE_HOST'] = '35.233.156.45'

mysql.init_app(app)

conn = mysql.connect()
cur = conn.cursor()


@app.route('/sign-up.html', methods=('GET', 'POST'))
def signUp():
    if request.method == 'POST':
        username = request.form['username']
        firstName = request.form['firstname']
        lastName = request.form['lastname']
        password = request.form['password']

        error = None

        # Checks to see if the user exists
        cur.execute("SELECT id FROM Users WHERE username = %s", (username,))
        exists = cur.fetchone()

        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'
        elif exists is not None:
            error = 'That Username already exists'

        password = generate_password_hash(password)

        if error is None:
            # Creates a user with the information input by the user
            cur.execute(
                "INSERT INTO Users (username, FirstName, LastName, password) VALUES (%s, %s, %s, %s)", (username, firstName, lastName, password))
            conn.commit()
            return redirect('/index.html')

        flash(error)
    return render_template('/sign-up.html')


@app.route('/index.html', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        error = None

        # Compares login info with the list of users in the database
        cur.execute("SELECT * FROM Users WHERE username = %s", (username,))
        user = cur.fetchone()

        if user is None:
            error = 'Incorrect username.'
        elif not check_password_hash(user[2], password):
            error = 'Incorrect password.'
        if error is None:
            session.clear()
            session['user_id'] = user[0]
            return redirect(url_for('main.html'))

        flash(error)

    return render_template('/index.html')


@app.route('/main.html', methods=('GET', 'POST'))
def homePage():
    # Grabs all of the relevant attributes from the Movie table and displays them
    movie = "SELECT title, Movies.year, D.director, G.genre, Movies.length, rating, Buttons " \
            "FROM Movies JOIN Genre G ON Movies.G_id = G.id JOIN Director D ON Movies.D_id = D.id"
    cur.execute(movie)
    data = cur.fetchall()
    conn.commit()

    return render_template('/main.html', data=data)


@app.route('/my-reel.html', methods=('GET', 'POST'))
def myReel():
    # Grabs all of the relevant attributes from the MyReel table and displays them
    myReelMovie = "SELECT M.title, M.year, D.director, G.genre, M.length, M.rating FROM MyReel " \
                  "JOIN Users U ON MyReel.U_id = U.id " \
                  "JOIN Movies M ON MyReel.M_id  = M.id " \
                  "JOIN Genre G ON M.G_id = G.id " \
                  "JOIN Director D ON M.D_id = D.id " \
                  "WHERE U_id = 7"
    cur.execute(myReelMovie)
    data = cur.fetchall()
    conn.commit()

    return render_template('/my-reel.html', data=data)


@app.route('/favorites.html', methods=('GET', 'POST'))
def favorites():
    # Grabs all of the relevant attributes from the MyReel table and displays them
    favorite = "SELECT M.title, M.year, D.director, G.genre, M.length, M.rating FROM Favorites " \
                  "JOIN Users U ON Favorites.U_id = U.id " \
                  "JOIN Movies M ON Favorites.M_id  = M.id " \
                  "JOIN Genre G ON M.G_id = G.id " \
                  "JOIN Director D ON M.D_id = D.id " \
                  "WHERE U_id = 7"
    cur.execute(favorite)
    data = cur.fetchall()
    conn.commit()
    return render_template('/favorites.html', data=data)


@app.route('/addButton')
def addMovie():
    # A function the adds a movie to the MyReel table when the user presses an HTML button
    add = "INSERT INTO MyReel (U_id, M_id) VALUES (%s, %s)"
    cur.execute(add, (7, 1))
    conn.commit()
    return render_template('/my-reel.html')


@app.route('/favorite')
def favorite():
    # A function the adds a movie to the MyReel and Favorites tables when the user presses an HTML button
    add = "INSERT INTO MyReel (U_id, M_id) VALUES (%s, %s)"
    cur.execute(add, (7, 1))
    fav = "INSERT INTO Favorites (U_id, M_id) VALUES (%s, %s)"
    cur.execute(fav, (7, 1))
    conn.commit()
    return render_template('/favorites.html')


@app.route('/remove')
def remove():
    # A function the removes a movie to the MyReel table when the user presses an HTML button
    # Note: the page will not load if there is nothing in the table
    removeReel = "DELETE FROM MyReel WHERE U_id = 7 LIMIT 1"
    cur.execute(removeReel)
    removeFav = "DELETE FROM Favorites WHERE U_id = 7 LIMIT 1"
    cur.execute(removeFav)
    conn.commit()
    return redirect(url_for('main.html'))
    return render_template('/main.html')


@app.route('/search', methods=('GET', 'POST'))
def search():
    # Allows the user to input anything into a search bar
    # And search all the records of the a given table
    # that is selected using the drop down menu
    if request.method == 'POST':
        drop = request.form.get('dropdown')
        word = request.form.get('search_text')
        options = ['', 'title', 'D.director', 'G.genre', 'year']
        word = word + '%'

        cur.execute("SELECT title, Movies.year, D.director, G.genre, Movies.length, rating, Buttons " \
                     "FROM Movies JOIN Genre G ON Movies.G_id = G.id JOIN Director D ON Movies.D_id = D.id " \
                     "WHERE {} ".format(options[int(drop)]) + "LIKE %s", str(word))
        data = cur.fetchall()
        print data
        conn.commit()
        return render_template('/main.html', data=data)

    return render_template('/main.html')


@app.route('/searchFav', methods=('GET', 'POST'))
def searchFav():
    # Same functionality as search(), but requires a new app.route and slightly different query
    if request.method == 'POST':
        drop = request.form.get('dropdown')
        word = request.form.get('search_text')
        options = ['', 'title', 'D.director', 'G.genre', 'year']
        word = word + '%'

        cur.execute("SELECT M.title, M.year, D.director, G.genre, M.length, M.rating FROM Favorites "
                    "JOIN Users U ON Favorites.U_id = U.id "
                    "JOIN Movies M ON Favorites.M_id  = M.id "
                    "JOIN Genre G ON M.G_id = G.id "
                    "JOIN Director D ON M.D_id = D.id "
                    "WHERE U_id = 7 AND {} ".format(options[int(drop)]) + "LIKE %s", str(word))
        data = cur.fetchall()
        print data
        conn.commit()
        return render_template('/favorites.html', data=data)

    return render_template('/favorites.html')


@app.route('/searchReel', methods=('GET', 'POST'))
def searchReel():
    # Same functionality as search(), but requires a new app.route and slightly different query
    if request.method == 'POST':
        drop = request.form.get('dropdown')
        word = request.form.get('search_text')
        options = ['', 'title', 'D.director', 'G.genre', 'year']
        word = word + '%'

        cur.execute("SELECT M.title, M.year, D.director, G.genre, M.length, M.rating FROM MyReel "
                    "JOIN Users U ON MyReel.U_id = U.id "
                    "JOIN Movies M ON MyReel.M_id  = M.id "
                    "JOIN Genre G ON M.G_id = G.id "
                    "JOIN Director D ON M.D_id = D.id "
                    "WHERE U_id = 7 AND {} ".format(options[int(drop)]) + "LIKE %s", str(word))
        data = cur.fetchall()
        conn.commit()
        return render_template('/my-reel.html', data=data)

    return render_template('/my-reel.html')


@app.route('/mainCsv')
def mainCSV():
    # Generates a CSV of the movies in the Movies table (the WatchList database)
    count = "SELECT * FROM Movies"
    cur.execute(count)
    cur.fetchall()

    stmt = "SELECT title, Movies.year, D.director, G.genre, Movies.length, rating " \
           "FROM Movies " \
           "JOIN Genre G ON Movies.G_id = G.id " \
           "JOIN Director D ON Movies.D_id = D.id "

    cur.execute(stmt)
    result = cur.fetchall()
    conn.commit()

    fieldnames = ['title', 'year', 'director', 'genre', 'length', 'rating']
    c = csv.writer(open('WatchList.csv', 'wb'))
    c.writerow(fieldnames)
    for x in result:
        c.writerow(x)

    return render_template('/main.html')


@app.route('/favCsv')
def favCSV():
    # Generates a CSV of the movies in the Favorites table
    count = "SELECT * FROM Favorites"
    cur.execute(count)
    cur.fetchall()

    stmt = "SELECT M.title, M.year, D.director, G.genre, M.length, M.rating FROM MyReel " \
                  "JOIN Users U ON MyReel.U_id = U.id " \
                  "JOIN Movies M ON MyReel.M_id  = M.id " \
                  "JOIN Genre G ON M.G_id = G.id " \
                  "JOIN Director D ON M.D_id = D.id "

    cur.execute(stmt)
    result = cur.fetchall()
    conn.commit()

    fieldnames = ['title', 'year', 'director', 'genre', 'length', 'rating']
    c = csv.writer(open('WatchList.csv', 'wb'))
    c.writerow(fieldnames)
    for x in result:
        c.writerow(x)

    return render_template('/favorites.html')


@app.route('/reelCsv')
def reelCSV():
    # Generates a CSV of the movies in the MyReel table
    count = "SELECT * FROM MyReel"
    cur.execute(count)
    cur.fetchall()

    stmt = "SELECT M.title, M.year, D.director, G.genre, M.length, M.rating FROM MyReel " \
                  "JOIN Users U ON MyReel.U_id = U.id " \
                  "JOIN Movies M ON MyReel.M_id  = M.id " \
                  "JOIN Genre G ON M.G_id = G.id " \
                  "JOIN Director D ON M.D_id = D.id "

    cur.execute(stmt)
    result = cur.fetchall()
    conn.commit()

    fieldnames = ['title', 'year', 'director', 'genre', 'length', 'rating']
    c = csv.writer(open('WatchList.csv', 'wb'))
    c.writerow(fieldnames)
    for x in result:
        c.writerow(x)

    return render_template('/my-reel.html')


if __name__ == '__main__':
    app.run()