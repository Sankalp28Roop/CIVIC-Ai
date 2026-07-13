# summary.py

# Generates an AI-style complaint summary.


def generate_summary(
    category,
    severity,
    location,
    detected_object,
    confidence
):
    """
    Generate a complaint summary.

    Args:
        category (str)
        severity (str)
        location (str)
        detected_object (str)
        confidence (float)

    Returns:
        dict
    """

    confidence_percent = round(confidence * 100)

    summary = (
        f"A {severity.lower()} priority civic issue has been detected. "
        f"The AI identified '{detected_object}' "
        f"under the '{category}' category with "
        f"{confidence_percent}% confidence. "
        f"The issue is reported near {location}. "
        f"This complaint should be reviewed by the responsible department."
    )

    return {
        "title": f"{category} Issue Report",
        "summary": summary
    }