"""
Services for email notifications and other business logic.
"""
from django.core.mail import send_mail
from django.conf import settings


def enviar_email_contacto(contacto):
    """
    Envía un email al equipo de 360 Digital con la información del contacto.
    
    Args:
        contacto: Instancia del modelo FormularioContacto
    """
    # Determinar medio de contacto preferido
    medios_contacto = []
    if contacto.contactar_por_whatsapp:
        medios_contacto.append("📱 WhatsApp")
    if contacto.contactar_por_correo:
        medios_contacto.append("📧 Correo electrónico")
    
    medio_contacto_texto = " o ".join(medios_contacto) if medios_contacto else "No especificado"
    
    # Subject del email
    subject = f"Nuevo mensaje de contacto de {contacto.nombre_completo}"
    
    # Mensaje de texto plano
    message = f"""
NUEVO MENSAJE DE CONTACTO - 360 DIGITAL

INFORMACIÓN DEL CLIENTE:
Nombre: {contacto.nombre_completo}
Correo: {contacto.correo}
Teléfono: {contacto.telefono or 'No proporcionado'}
Prefiere contacto por: {medio_contacto_texto}

MENSAJE DEL CLIENTE:
{contacto.mensaje}

---
Este es un mensaje automático del sistema de contacto de 360 Digital.
Por favor, responde a este cliente lo antes posible.
    """
    
    # Mensaje HTML profesional
    html_message = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }}
        .container {{
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }}
        .header p {{
            margin: 5px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
        }}
        .content {{
            padding: 30px 20px;
        }}
        .section {{
            margin-bottom: 25px;
        }}
        .section-title {{
            font-size: 14px;
            font-weight: 700;
            color: #667eea;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e0e0e0;
        }}
        .info-row {{
            display: flex;
            margin-bottom: 12px;
            padding: 8px 0;
        }}
        .info-label {{
            font-weight: 600;
            color: #555;
            min-width: 140px;
            flex-shrink: 0;
        }}
        .info-value {{
            color: #333;
            word-break: break-word;
        }}
        .message-box {{
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            border-radius: 4px;
            margin-top: 10px;
            line-height: 1.8;
            color: #444;
        }}
        .footer {{
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #666;
        }}
        .footer p {{
            margin: 5px 0;
        }}
        .badge {{
            display: inline-block;
            background-color: #ffd900;
            color: white;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            margin-right: 5px;
            margin-bottom: 5px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📬 Nuevo Mensaje de Contacto</h1>
            <p>360 Digital - Marketing y Desarrollo Digital</p>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="section-title">👤 Información del Cliente</div>
                <div class="info-row">
                    <span class="info-label">Nombre:</span>
                    <span class="info-value"><strong>{contacto.nombre_completo}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Correo:</span>
                    <span class="info-value"><a href="mailto:{contacto.correo}">{contacto.correo}</a></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Teléfono:</span>
                    <span class="info-value">{contacto.telefono or 'No proporcionado'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Preferencia:</span>
                    <span class="info-value">{medio_contacto_texto}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">💬 Mensaje del Cliente</div>
                <div class="message-box">
                    {contacto.mensaje.replace(chr(10), '<br>')}
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>⚠️ Este es un mensaje automático del sistema de contacto 360 Digital</strong></p>
            <p>Por favor, responde a este cliente lo antes posible.</p>
        </div>
    </div>
</body>
</html>
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            ['publicidad360caicedonia@gmail.com'],
            fail_silently=False,
            html_message=html_message,
        )
        return True
    except Exception as e:
        print(f"Error al enviar email: {str(e)}")
        return False
