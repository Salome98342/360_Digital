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
            background: linear-gradient(135deg, #cd1d1d 0%, #390202 100%);
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
            color: #cd1d1d;
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
            background-color: #f5f5f5;
            border-left: 4px solid #cd1d1d;
            padding: 15px;
            border-radius: 4px;
            margin-top: 10px;
            line-height: 1.8;
            color: #444;
        }}
        .footer {{
            background-color: #ffffff;
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
            background-color: #ffffff;
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


def enviar_confirmacion_contacto(contacto):
    """
    Envía un email de confirmación al cliente informando que su mensaje fue recibido.
    
    Args:
        contacto: Instancia del modelo FormularioContacto
    """
    # Determinar medio de contacto preferido
    medios_contacto_lista = []
    if contacto.contactar_por_whatsapp:
        medios_contacto_lista.append("WhatsApp")
    if contacto.contactar_por_correo:
        medios_contacto_lista.append("correo electrónico")
    
    medios_texto = " y ".join(medios_contacto_lista) if medios_contacto_lista else "los canales que indicó"
    
    # Subject del email
    subject = "✓ Hemos recibido tu mensaje - 360 Digital"
    
    # Mensaje de texto plano
    message = f"""
Hola {contacto.nombre_completo},

¡Gracias por contactarnos! Hemos recibido tu mensaje exitosamente en 360 Digital.

Detalles de tu solicitud:
- Mensaje recibido correctamente
- Te contactaremos por {medios_texto}
- Fecha de recepción: {contacto.fecha_envio.strftime('%d/%m/%Y a las %H:%M')}

Por favor, mantén tu dispositivo a mano para que no pierdas nuestra respuesta. 
Nos pondremos en contacto lo antes posible.

Si tienes más preguntas o necesitas información adicional, no dudes en contactarnos nuevamente.

---
Equipo 360 Digital
Marketing y Desarrollo Digital
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
            background: linear-gradient(135deg, #cd1d1d 0%, #390202 100%);
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
            opacity: 0.95;
        }}
        .content {{
            padding: 30px 20px;
        }}
        .greeting {{
            font-size: 16px;
            margin-bottom: 20px;
            color: #333;
        }}
        .greeting strong {{
            color: #28a745;
        }}
        .info-box {{
            background-color: #f0f8f4;
            border-left: 4px solid #28a745;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }}
        .info-item {{
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }}
        .info-item-icon {{
            margin-right: 10px;
            font-size: 18px;
        }}
        .info-item-text {{
            color: #555;
        }}
        .channels {{
            background-color: #e8f4f8;
            border-left: 4px solid #cd1d1d;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }}
        .channels strong {{
            color: #cd1d1d;
            display: block;
            margin-bottom: 10px;
        }}
        .channel-list {{
            margin-left: 20px;
        }}
        .channel-item {{
            padding: 8px 0;
            color: #555;
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
        .footer strong {{
            color: #333;
        }}
        .checkmark {{
            color: #28a745;
            font-weight: bold;
            font-size: 20px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✓ ¡Mensaje Recibido!</h1>
            <p>360 Digital - Marketing y Desarrollo Digital</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hola <strong>{contacto.nombre_completo}</strong>,
            </div>
            
            <p>¡Gracias por contactarnos! Hemos recibido tu mensaje exitosamente.</p>
            
            <div class="info-box">
                <div class="info-item">
                    <span class="info-item-icon checkmark">✓</span>
                    <span class="info-item-text">Mensaje recibido correctamente</span>
                </div>
                <div class="info-item">
                    <span class="info-item-icon">📅</span>
                    <span class="info-item-text">{contacto.fecha_envio.strftime('%d/%m/%Y a las %H:%M')}</span>
                </div>
                <div class="info-item">
                    <span class="info-item-icon">📧</span>
                    <span class="info-item-text">{contacto.correo}</span>
                </div>
            </div>
            
            <div class="channels">
                <strong>Canales de contacto seleccionados:</strong>
                <div class="channel-list">
    """
    
    if contacto.contactar_por_whatsapp:
        html_message += """
                    <div class="channel-item">📱 WhatsApp - Te contactaremos por aquí</div>
        """
    if contacto.contactar_por_correo:
        html_message += f"""
                    <div class="channel-item">📧 Correo electrónico ({contacto.correo}) - Te contactaremos por aquí</div>
        """
    
    html_message += """
                </div>
            </div>
            
            <p style="color: #666; font-size: 14px;">
                <strong>Por favor, mantén tu dispositivo a mano</strong> para que no pierdas nuestra respuesta. 
                Nos pondremos en contacto lo antes posible.
            </p>
            
            <p style="color: #666; font-size: 14px;">
                Si tienes más preguntas o necesitas información adicional, no dudes en contactarnos nuevamente 
                a través de nuestro formulario de contacto.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Equipo 360 Digital</strong></p>
            <p>Marketing y Desarrollo Digital</p>
            <p style="margin-top: 10px; color: #999;">Este es un email automático, por favor no responders a este correo.</p>
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
            [contacto.correo],
            fail_silently=False,
            html_message=html_message,
        )
        return True
    except Exception as e:
        print(f"Error al enviar email de confirmación: {str(e)}")
        return False
