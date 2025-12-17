from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import logging

logger = logging.getLogger(__name__)


def enviar_multiples_correos(destinatarios, asunto, contenido_html):
    """
    Envía un correo individual por cada destinatario.
    Devuelve un resumen del envío.
    """

    sg = SendGridAPIClient(settings.SENDGRID_API_KEY)

    enviados = []
    errores = []

    for email in destinatarios:
        message = Mail(
            from_email=settings.SENDGRID_FROM_EMAIL,
            to_emails=email,
            subject=asunto,
            html_content=contenido_html,
        )

        try:
            response = sg.send(message)

            enviados.append(email)
            logger.info(
                f"Correo enviado a {email} - status {response.status_code}"
            )

        except Exception as e:
            errores.append({
                "email": email,
                "error": str(e)
            })
            logger.error(
                f"Error enviando correo a {email}: {str(e)}",
                exc_info=True
            )

    return {
        "total": len(destinatarios),
        "enviados": len(enviados),
        "errores": len(errores),
        "detalle_errores": errores,
    }
