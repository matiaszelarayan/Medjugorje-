from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Personalization
import logging

logger = logging.getLogger(__name__)


def enviar_multiples_correos(destinatarios, asunto, contenido_html):
    """
    Envía correo separado por cada destinatario
    """

    sg = SendGridAPIClient(settings.SENDGRID_API_KEY)

    for email in destinatarios:
        message = Mail(
            from_email=settings.SENDGRID_FROM_EMAIL,
            to_emails=email,
            subject=asunto,
            html_content=contenido_html
        )

        try:
            response = sg.send(message)
            logger.info(f"Correo enviado a {email}: {response.status_code}")

        except Exception as e:
            logger.error(f"Error enviando a {email}: {str(e)}")

    return True
