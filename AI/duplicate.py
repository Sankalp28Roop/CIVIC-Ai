# duplicate.py

# Checks whether a newly submitted complaint is a duplicate
# based on category and nearby location.

from math import radians, sin, cos, sqrt, atan2


def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two GPS coordinates (meters).
    """

    R = 6371000  # Earth's radius in meters

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c


def find_duplicate(new_complaint, existing_complaints, max_distance=50):
    """
    Check whether a complaint already exists.

    Args:
        new_complaint (dict)
        existing_complaints (list)
        max_distance (int): meters

    Returns:
        dict
    """

    for complaint in existing_complaints:

        # Categories should match
        if complaint["category"].lower() != new_complaint["category"].lower():
            continue

        distance = calculate_distance(
            new_complaint["latitude"],
            new_complaint["longitude"],
            complaint["latitude"],
            complaint["longitude"],
        )

        if distance <= max_distance:
            return {
                "duplicate": True,
                "existing_id": complaint["id"],
                "distance": round(distance, 2),
                "message": "Similar complaint already exists."
            }

    return {
        "duplicate": False,
        "message": "No duplicate complaint found."
    }