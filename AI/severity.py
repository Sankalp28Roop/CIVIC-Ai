# severity.py
# Assigns a severity level to a detected civic issue.


def calculate_severity(category, confidence=0.8):
    """
    Returns the severity of a civic issue.

    Args:
        category (str): Detected issue category.
        confidence (float): AI confidence score (0-1).

    Returns:
        dict: Severity information.
    """

    category = category.lower()

    severity_map = {
        "pothole": {
            "severity": "High",
            "priority": 3,
            "department": "Roads Department"
        },
        "road crack": {
            "severity": "Medium",
            "priority": 2,
            "department": "Roads Department"
        },
        "garbage": {
            "severity": "Medium",
            "priority": 2,
            "department": "Sanitation Department"
        },
        "overflowing garbage": {
            "severity": "High",
            "priority": 3,
            "department": "Sanitation Department"
        },
        "water leakage": {
            "severity": "High",
            "priority": 3,
            "department": "Water Department"
        },
        "streetlight": {
            "severity": "Low",
            "priority": 1,
            "department": "Electricity Department"
        },
        "fallen tree": {
            "severity": "Critical",
            "priority": 4,
            "department": "Disaster Management"
        }
    }

    if category in severity_map:
        result = severity_map[category]
    else:
        result = {
            "severity": "Unknown",
            "priority": 0,
            "department": "General"
        }

    # Increase severity if confidence is very high
    if confidence >= 0.95 and result["priority"] < 4:
        result["priority"] += 1

        if result["priority"] == 2:
            result["severity"] = "Medium"
        elif result["priority"] == 3:
            result["severity"] = "High"
        elif result["priority"] == 4:
            result["severity"] = "Critical"

    return result