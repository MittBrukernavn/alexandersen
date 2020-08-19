from flask import Flask

app = Flask(__name__)

@app.route('/pyapi/')
def pyapi():
    return 'Hello World!'


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)