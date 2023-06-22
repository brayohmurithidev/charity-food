from flask_mail import Message
from decimal import Decimal


def send_email_method(title, recipients, body, mail):
    try:
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                /* Define your CSS styles here */
                body {{
                    font-family: Arial, sans-serif;
                }}
                .email-container {{
                    background-color: #f5f5f5;
                    padding: 20px;
                    border-radius: 5px;
                }}
                .title {{
                    color: #333;
                    font-size: 24px;
                    margin-bottom: 10px;
                }}
                .content {{
                    color: #555;
                    font-size: 16px;
                }}
                .token {{
                    font-weight: bold;
                    color: teal;
                }}
                .footer {{
                    margin-top: 20px;
                    text-align: center;
                    font-size: 14px;
                }}
                .footer a {{
                    color: teal;
                    text-decoration: none;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <h1 class="title">{title}</h1>
                <p class="content">Your password reset OTP is <span class="token">{body}</span></p>
                
                <div class="footer">
                    <a href="http://127.0.0.1:3000">CHARITY FOOD - Food For All</a>
                </div>
            </div>
        </body>
        </html>
        """

        msg = Message(title, sender='info@johnteacher.tech',
                      recipients=[recipients])
        msg.html = html_body
        mail.send(msg)
        return True
    except Exception as e:
        raise ValueError(str(e))


# Custom function to handle Decimal serialization
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return str(obj)
    raise TypeError(
        f"Object of type {type(obj).__name__} is not JSON serializable")
