# category.py

# Maps detected objects to civic issue categories.


CATEGORY_MAP = {
    # Roads
    "pothole": "Road",
    "road crack": "Road",
    "broken road": "Road",

    # Garbage
    "garbage": "Garbage",
    "trash": "Garbage",
    "dustbin": "Garbage",
    "overflowing garbage": "Garbage",

    # Water
    "water leakage": "Water",
    "water pipe": "Water",
    "flood": "Water",

    # Streetlight
    "streetlight": "Streetlight",
    "electric pole": "Streetlight",
    "broken light": "Streetlight",

    # Trees
    "fallen tree": "Tree",

    # Drainage
    "drain": "Drainage",
    "open drain": "Drainage",

    # Others
    "graffiti": "Public Property",
    "wall damage": "Public Property"
}


def get_category(detected_objects):
    """
    Determine the complaint category from detected objects.

    Args:
        detected_objects (list)

    Example:
        ["car", "pothole"]

    Returns:
        dict
    """

    if not detected_objects:
        return {
            "category": "Unknown",
            "detected_object": None
        }

    for obj in detected_objects:
        name = obj.lower()

        if name in CATEGORY_MAP:
            return {
                "category": CATEGORY_MAP[name],
                "detected_object": name
            }

    return {
        "category": "Other",
        "detected_object": detected_objects[0]
    }