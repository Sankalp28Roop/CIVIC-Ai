import logging

logging.basicConfig(level=logging.INFO)


def send_email(receiver, subject, body):
    """
    Dummy Email Function
    Replace with SMTP or SendGrid later
    """
    logging.info(f"""
    EMAIL SENT
    To: {receiver}
    Subject: {subject}

    {body}
    """)

    return True


def send_sms(phone, message):
    """
    Dummy SMS Function
    Replace with Twilio
    """
    logging.info(f"SMS sent to {phone}: {message}")

    return True


def send_push_notification(user_id, title, body):
    """
    Placeholder for Firebase Notification
    """
    logging.info(f"Push Notification -> {user_id}")

    logging.info(title)

    logging.info(body)

    return True