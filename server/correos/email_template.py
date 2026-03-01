def crear_plantilla_email(contenido, asunto=""):
    """
    Envuelve el contenido del correo en una plantilla HTML profesional
    con header, footer y estilos de la Fundación Medjugorje.
    """
    
    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{asunto}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <!-- Contenedor principal -->
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        
                        <!-- HEADER -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #2179bb 0%, #1a5a8a 100%); padding: 30px 40px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                    AAsociación Centro Medjugorje Argentina
                                </h1>
                                <p style="margin: 8px 0 0 0; color: #e8f4f8; font-size: 14px;">
                                    Paz y Bien
                                </p>
                            </td>
                        </tr>
                        
                        <!-- CONTENIDO -->
                        <tr>
                            <td style="padding: 40px 40px 30px 40px; color: #333333; font-size: 16px; line-height: 1.6;">
                                {contenido}
                            </td>
                        </tr>
                        
                        <!-- SEPARADOR -->
                        <tr>
                            <td style="padding: 0 40px;">
                                <div style="border-top: 1px solid #e0e0e0;"></div>
                            </td>
                        </tr>
                        
                        <!-- FOOTER -->
                        <tr>
                            <td style="padding: 30px 40px; background-color: #f9f9f9; text-align: center;">
                                <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; font-weight: 600;">
                                    Fundación Medjugorje Argentina
                                </p>
                                <p style="margin: 0 0 15px 0; color: #888888; font-size: 13px; line-height: 1.5;">
                                    📧 Contacto: info@fundacionmedjugorje.org<br>
                                    🌐 www.fundacionmedjugorje.org
                                </p>
                                <p style="margin: 15px 0 0 0; color: #999999; font-size: 12px;">
                                    Recibiste este correo porque formas parte de nuestra comunidad.
                                </p>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    return html
