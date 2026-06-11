from datetime import datetime
import os
from time import sleep
from flask import Flask, request, jsonify
from typing import Any, Callable
from flask_mail import Mail, Message

class EmailService:
    """Service for handling all system-generated emails."""

    def __init__(self, app) -> None:
        self.flask_app = app
        # Pull the globally initialized mail extension from the app context
        self.mail = app.extensions.get('mail') or Mail(app)

    def send_message(self, title, recipient, body=None, html=None):
        msg = Message(
            subject=title,
            recipients=[recipient],
            body=body,
            html=html
        )
        try:
            self.mail.send(msg)
            return True, f"Email '{title}' sent to '{recipient}' successfully!"
        except Exception as e:
            return False, f"Failed to send email: {str(e)}"

# Dynamic formatting system storage
formatters: dict[Any, Callable[..., str]] = {}

def set_formatter(level, message_template="- {level}\n {timestamp} - {msg}"):
    """Registers a message template formatter safely."""
    def formatter_func(msg_content: str) -> str:
        timestamp = datetime.now()
        return message_template.format(
            level=level,
            timestamp=timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            msg=msg_content
        )
    formatters[level] = formatter_func
    return formatter_func

def get_formatter(level, default_template=None):
    """Retrieves or creates a fallback formatter to prevent KeyErrors."""
    if level not in formatters:
        # Automatically register a default fallback if it doesn't exist
        fallback = default_template or "- {level} {timestamp}: Hello <{msg}>!"
        set_formatter(level, fallback)
    return formatters[level]

def create_app():
    app = Flask(__name__)

    # SMTP Server Configurations (Remove quotes to read actual environment variables)
    app.config['TESTING'] = True
    app.config['MAIL_SERVER'] = '://gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'mock_user@gmail.com')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', 'mock_password')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@gmail.com')

    # Initialize the extension once globally onto the app
    Mail(app)

    default_template = "- {level} {timestamp}: Hello <{msg}>!"

    @app.route("/<string:recipient>")
    def EmailAPI(recipient: str):
        level = request.args.get("type", "Notification").capitalize()
        template = request.args.get("template")
        force_update = request.args.get("update_temp", "false").lower() == "true"

        if force_update and template:
            formatter = set_formatter(level, template)
        else:
            formatter = get_formatter(level, default_template)

        try:
            # Format the title text safely
            formatted_title = formatter(recipient)
            mail_serv = EmailService(app)

            success, message = mail_serv.send_message(
                title=formatted_title,
                recipient=recipient,
                body="This is the body",
                html="<h1>This is HTML</h1>"
            )
        except Exception as e:
            return jsonify({"error": str(e), "success": False}), 400
        else:
            if success:
                return jsonify({"success": True, "error": False, "message": message}), 200
            else:
                return jsonify({"error": "Unexpected error", "success": False, "message": message}), 500

    return app

def test_main():
    app = create_app()
    app.run(debug=True)

if __name__ == '__main__':
    test_main()
