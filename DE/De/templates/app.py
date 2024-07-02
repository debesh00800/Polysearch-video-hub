from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def login_page():
    return render_template('login.html')

@app.route('/template/index.html')
def video_search():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
