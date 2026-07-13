import os
import uuid
from PIL import Image

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def save_image(file):
    """
    Save uploaded image
    """

    extension = file.filename.split(".")[-1]

    filename = f"{uuid.uuid4()}.{extension}"

    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath, "wb") as buffer:
        buffer.write(file.file.read())

    return filepath


def resize_image(path, size=(640, 640)):
    """
    Resize image
    """

    image = Image.open(path)

    image = image.resize(size)

    image.save(path)

    return path


def image_exists(path):
    return os.path.exists(path)