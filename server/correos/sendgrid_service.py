from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import logging
from .email_template import crear_plantilla_email

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
        # Envolver el contenido en la plantilla HTML profesional
        contenido_formateado = crear_plantilla_email(contenido_html, asunto)
        
        message = Mail(
            from_email=settings.SENDGRID_FROM_EMAIL,
            to_emails=email,
            subject=asunto,
            html_content=contenido_formateado,
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
        "enviados_exitosos": enviados,  # Lista de emails enviados exitosamente
        "detalle_errores": errores,
    }
