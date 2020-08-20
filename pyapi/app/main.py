from flask import Flask
from tensorflow.keras.models import load_model

app = Flask(__name__)

@app.route('/pyapi/')
def pyapi():
    return 'Hello World!'


yelp_model = load_model('yelp-model')
@app.route('/pyapi/yelp/<path:text>')
def yelp(text):
    print(text)
    prob = yelp_model.predict([text])[0][0]
    return f'{prob}'

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)