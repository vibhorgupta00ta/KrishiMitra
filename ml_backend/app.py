from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import json

try:
    import tensorflow as tf
except ImportError:
    tf = None

app = Flask(__name__)
CORS(app)

# Load the model
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, 'model', 'random_forest_model.pkl')

try:
    model = joblib.load(model_path)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.json
        # Extract features
        N = data.get('nitrogen', 0)
        P = data.get('phosphorus', 0)
        K = data.get('potassium', 0)
        temperature = data.get('temperature', 0)
        humidity = data.get('humidity', 0)
        ph = data.get('ph', 0)
        rainfall = data.get('rainfall', 0)

        # Ensure values are float
        features = [[
            float(N), 
            float(P), 
            float(K), 
            float(temperature), 
            float(humidity), 
            float(ph), 
            float(rainfall)
        ]]

        # Predict
        prediction = model.predict(features)
        
        return jsonify({
            'predictedCrop': prediction[0]
        })

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 400

import io
from PIL import Image
import numpy as np

disease_model_path = os.path.join(base_dir, 'model', 'disease_model.h5')
classes_path = os.path.join(base_dir, 'model', 'disease_classes.json')

try:
    if os.path.exists(disease_model_path) and os.path.exists(classes_path):
        if tf is not None:
            disease_model = tf.keras.models.load_model(disease_model_path)
            with open(classes_path, 'r') as f:
                disease_classes = json.load(f)
            print("Disease model loaded successfully.")
        else:
            print("Error: TensorFlow not installed. Cannot load disease model.")
            disease_model = None
            disease_classes = []
    else:
        disease_model = None
        disease_classes = []
except Exception as e:
    print(f"Error loading disease model: {e}")
    disease_model = None
    disease_classes = []

@app.route('/predict_disease', methods=['POST'])
def predict_disease():
    if disease_model is None:
        return jsonify({'error': 'Disease model not loaded. Train the model first.'}), 500

    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
            
        file = request.files['image']
        image_bytes = file.read()
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img = img.resize((224, 224))
        
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, 0) # Create batch axis

        predictions = disease_model.predict(img_array)
        score = tf.nn.softmax(predictions[0])
        
        predicted_class = disease_classes[np.argmax(score)]
        confidence = 100 * np.max(score)

        return jsonify({
            'disease': predicted_class,
            'confidence': confidence
        })

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Run on port 5001
    app.run(host='0.0.0.0', port=5001, debug=True)
