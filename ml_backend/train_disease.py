import tensorflow as tf
from tensorflow.keras import layers, models
import os
import json

def train_disease_model():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_dir = os.path.join(base_dir, 'dataset', 'disease_images')
    model_dir = os.path.join(base_dir, 'model')
    model_path = os.path.join(model_dir, 'disease_model.h5')
    classes_path = os.path.join(model_dir, 'disease_classes.json')

    # Check if dataset directory exists and has subfolders
    if not os.path.exists(dataset_dir):
        print(f"Error: Dataset directory {dataset_dir} does not exist.")
        return

    classes = [d for d in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, d))]
    if len(classes) == 0:
        print("Error: No class folders found in disease_images/. Please add images in subfolders.")
        return

    print(f"Found {len(classes)} classes: {classes}")

    # Hyperparameters
    batch_size = 32
    img_height = 224
    img_width = 224
    epochs = 10

    # Load dataset
    print("Loading dataset...")
    train_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=(img_height, img_width),
        batch_size=batch_size
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=(img_height, img_width),
        batch_size=batch_size
    )

    class_names = train_ds.class_names
    print("Class names:", class_names)

    # Save class names mapping
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
        
    with open(classes_path, 'w') as f:
        json.dump(class_names, f)

    # Cache and prefetch for performance
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    # Data augmentation
    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal", input_shape=(img_height, img_width, 3)),
        layers.RandomRotation(0.1),
        layers.RandomZoom(0.1),
    ])

    # Build model using MobileNetV2 (transfer learning)
    print("Building model...")
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(img_height, img_width, 3),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False # Freeze the base model

    model = models.Sequential([
        data_augmentation,
        tf.keras.layers.Rescaling(1./127.5, offset=-1), # MobileNetV2 expects [-1, 1] input
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.2),
        layers.Dense(len(class_names), activation='softmax')
    ])

    model.compile(
        optimizer='adam',
        loss=tf.keras.losses.SparseCategoricalCrossentropy(),
        metrics=['accuracy']
    )

    # Train model
    print("Training model...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs
    )

    # Save model
    print(f"Saving model to {model_path}...")
    model.save(model_path)
    print("Training complete and model saved.")

if __name__ == "__main__":
    train_disease_model()
