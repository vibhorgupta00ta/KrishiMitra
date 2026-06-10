import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

def train_model():
    # Paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, 'dataset', 'Crop Recommendation dataset.csv')
    model_dir = os.path.join(base_dir, 'model')
    model_path = os.path.join(model_dir, 'random_forest_model.pkl')

    print(f"Loading dataset from {dataset_path}...")
    df = pd.read_csv(dataset_path)

    # Features and Target
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']

    # Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Model Training
    print("Training Random Forest Classifier...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)

    # Evaluation
    y_pred = rf_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model trained with accuracy: {accuracy * 100:.2f}%")

    # Save Model
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)

    print(f"Saving model to {model_path}...")
    joblib.dump(rf_model, model_path)
    print("Model saved successfully.")

if __name__ == "__main__":
    train_model()
