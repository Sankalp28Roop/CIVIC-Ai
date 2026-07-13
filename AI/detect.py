# detect.py          # Detect issue from uploaded image
# Load the YOLO model only once when the file is imported
# Replace "yolov8n.pt" with your custom trained model if you have one.


from ultralytics import YOLO
import os


model = YOLO("yolov8n.pt")


def detect_objects(image_path):
    """
    Detect objects in an image.

    Args:
        image_path (str): Path to the uploaded image.

    Returns:
        list: List of detected objects.
    """

    if not os.path.exists(image_path):
        return {
            "success": False,
            "message": "Image not found."
        }

    results = model(image_path)

    detected = []

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            detected.append({
                "object": model.names[class_id],
                "confidence": round(confidence, 2)
            })

    return {
        "success": True,
        "detections": detected
    }