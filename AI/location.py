
# location.py

# Location validation utilities.


from math import radians, sin, cos, sqrt, atan2


EARTH_RADIUS = 6371000  # meters


def is_valid_coordinates(latitude, longitude):
    """
    Check if latitude and longitude are valid.
    """

    if latitude is None or longitude is None:
        return False

    if latitude < -90 or latitude > 90:
        return False

    if longitude < -180 or longitude > 180:
        return False

    return True


def distance_between_points(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two GPS coordinates in meters.
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


def is_within_service_area(
    latitude,
    longitude,
    center_lat,
    center_lon,
    radius=50000
):
    """
    Check if the complaint is inside the supported area.

    radius is in meters.
    """

    distance = distance_between_points(
        latitude,
        longitude,
        center_lat,
        center_lon
    )

    return {
        "inside": distance <= radius,
        "distance": round(distance, 2)
    }


def validate_location(latitude, longitude):
    """
    Complete location validation.
    """

    if not is_valid_coordinates(latitude, longitude):
        return {
            "success": False,
            "message": "Invalid GPS coordinates."
        }

    # Example: Srinagar city center
    CENTER_LAT = 34.0837
    CENTER_LON = 74.7973

    area = is_within_service_area(
        latitude,
        longitude,
        CENTER_LAT,
        CENTER_LON,
        radius=50000
    )

    if not area["inside"]:
        return {
            "success": False,
            "message": "Location is outside the service area.",
            "distance": area["distance"]
        }

    return {
        "success": True,
        "message": "Location verified.",
        "distance": area["distance"]
    }