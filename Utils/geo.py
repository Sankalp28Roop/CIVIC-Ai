from math import radians, sin, cos, sqrt, atan2

EARTH_RADIUS = 6371


def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Distance between two GPS points in KM
    """

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return EARTH_RADIUS * c


def is_duplicate_location(lat1, lon1, lat2, lon2, threshold=0.2):
    """
    Returns True if distance is less than threshold (KM)
    Default = 200 meters
    """

    distance = calculate_distance(lat1, lon1, lat2, lon2)

    return distance <= threshold


def validate_coordinates(latitude, longitude):
    """
    Check GPS validity
    """

    if latitude < -90 or latitude > 90:
        return False

    if longitude < -180 or longitude > 180:
        return False

    return True