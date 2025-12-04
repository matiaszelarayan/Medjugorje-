import React, { useState } from "react";
import ModalBase from "../common/ModalBase/ModalBase";
import styles from "./EnvioCorreoModal.module.css";

const EnvelopeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ verticalAlign: "middle" }}>
    <rect width="22" height="22" rx="5" fill="#e4f3f8"/>
    <path d="M5 7.5V14.5C5 15.0523 5.44772 15.5 6 15.5H16C16.5523 15.5 17 15.0523 17 14.5V7.5M5 7.5L11 12.5L17 7.5M5 7.5H17"
      stroke="#2179bb" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InfoCard = ({ icon, value, label, color }) => (
  <div className={styles.infoCard} style={{ background: color?.bg || undefined }}>
    <span className={styles.infoIcon} style={{ color: color?.icon || undefined }}>{icon}</span>
    <div>
      <div className={styles.infoValue}>{value}</div>
      <div className={styles.infoLabel}>{label}</div>
    </div>
  </div>
);

const UserIcon = (
  <svg width="24" height="24" fill="none">
    <path stroke="#3572b4" strokeWidth="1.7" d="M12 13c2.5 0 6 1.23 6 3.69V18H6v-1.31C6 14.23 9.5 13 12 13Zm0-1a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
  </svg>
);
const EmailIcon = (
  <svg width="24" height="24" fill="none">
    <path stroke="#2a8567" strokeWidth="1.7" d="M5 8.5v7A1.5 1.5 0 0 0 6.5 17h11a1.5 1.5 0 0 0 1.5-1.5v-7l-7 5.5-7-5.5Zm0-1.5h14" />
  </svg>
);
const ClockIcon = (
  <svg width="24" height="24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#c57a38" strokeWidth="1.7" />
    <path d="M12 8v5h3" stroke="#c57a38" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

/**
 * ============================================================================
 * MODAL DE CONFIRMACIÓN DE ENVÍO DE CORREOS MASIVOS
 * ============================================================================
 * 
 * FLUJO DE INTEGRACIÓN CON BACKEND:
 * 
 * 1. El usuario hace clic en "Enviar Ahora"
 * 2. Se invoca handleSend() que llama a onSend()
 * 3. onSend() debe disparar una petición POST al backend (ver comentarios abajo)
 * 4. El backend procesa el envío y retorna confirmación
 * 5. El modal se cierra y el correo pasa a estado "Enviado"
 * 
 * ============================================================================
 */

const EnvioCorreoModal = ({ correo, destinatarios, onClose, onSend }) => {
  const [enviando, setEnviando] = useState(false);

  /**
   * HANDLER: Inicia el proceso de envío
   * 
   * PRÓXIMA IMPLEMENTACIÓN (Backend Integration):
   * Reemplazar este setTimeout simulado por una llamada real al API:
   * 
   * const handleSend = async () => {
   *   if (enviando) return;
   *   setEnviando(true);
   *   try {
   *     const response = await fetch("/api/correos/enviar", {
   *       method: "POST",
   *       headers: { "Content-Type": "application/json" },
   *       body: JSON.stringify({
   *         correoId: correo.id,
   *         asunto: correo.asunto,
   *         contenido: correo.contenido,
   *         destinatarios: destinatarios,
   *         provincia: correo.provincia || null,
   *         ciudad: correo.ciudad || null,
   *         grupo: correo.grupo || null,
   *         soloNewsletter: correo.soloNewsletter
   *       })
   *     });
   *     if (!response.ok) throw new Error("Error al enviar");
   *     onSend();
   *     onClose();
   *     toast.success("Correo enviado exitosamente");
   *   } catch (error) {
   *     console.error("Error:", error);
   *     toast.error("Error al enviar el correo");
   *   } finally {
   *     setEnviando(false);
   *   }
   * };
   */

  const handleSend = async () => {
    if (enviando) return;

    setEnviando(true);

    try {
      await onSend(); // aquí se ejecuta enviarCorreo(id)
      onClose(); // cierra modal
    } catch (error) {
      console.error("Error enviando correo:", error);
    } finally {
      setEnviando(false);
    }
  };


  return (
    <ModalBase onClose={onClose}>
      <h2 className={styles.title}>
        <EnvelopeIcon />
        Confirmar Envío de Correo Masivo
      </h2>
      <p className={styles.subtitle}>Revisa los detalles antes de enviar</p>

      {/* Bloque blanco con asunto y cuerpo */}
      <div className={styles.summaryCard}>
        <div>
          <span className={styles.summaryLabel}>Asunto</span>
          <span className={styles.summaryValue}>{correo?.asunto || correo?.titulo || "-"}</span>
        </div>
        <div style={{ marginTop: '0.35em' }}>
          <span className={styles.summaryLabel}>Cuerpo del mensaje</span>
          <span className={styles.summaryValue}>{correo?.contenido || "-"}</span>
        </div>
      </div>

      {/* 
        NOTA PARA BACKEND DEVELOPERS:
        
        Las tres tarjetas a continuación muestran información sobre los destinatarios.
        El valor "Emails válidos" actualmente es igual a "Destinatarios".
        
        En la integración real, el backend DEBE validar direcciones de email 
        y retornar:
        - total_destinatarios: cantidad de contactos que cumplen los filtros
        - emails_validos: cantidad de emails validados (sin errores de formato)
        - emails_invalidos: cantidad de emails con formato incorrecto (para logging)
        
        Esto mejorará la precisión del envío y evitará rebotes.
      */}
      
      <div className={styles.infoRow}>
        <InfoCard 
          icon={UserIcon} 
          value={destinatarios || 0} 
          label="Destinatarios" 
          color={{bg:"#f2f6fc",icon:"#3572b4"}} 
        />
        <InfoCard 
          icon={EmailIcon} 
          value={destinatarios || 0} 
          label="Emails válidos" 
          color={{bg:"#eaf9f2",icon:"#2a8567"}} 
        />
        <InfoCard 
          icon={ClockIcon} 
          value="1 minuto" 
          label="Tiempo est." 
          color={{bg:"#fff2e2",icon:"#c57a38"}} 
        />
      </div>

      {/* 
        CUADRO INFORMATIVO DE SIMULACIÓN
        
        INSTRUCCIONES PARA BACKEND:
        1. Implementar servicio de email (SendGrid, Mailgun, AWS SES, etc.)
        2. Crear endpoint POST /api/correos/enviar que:
           - Reciba los parámetros del correo (asunto, contenido, destinatarios, etc.)
           - Valide que el correoId existe y está en estado "Borrador"
           - Filtre destinatarios según criterios (provincia, ciudad, grupo, newsletter)
           - Envíe emails reales a través del servicio configurado
           - Registre la transacción en BD (fecha, cantidad enviada, estado)
           - Retorne { success: true, mensajeSend: "Correos enviados exitosamente" }
        
        3. Manejar errores:
           - 400: Validación fallida (correo no encontrado, datos incompletos)
           - 500: Error al enviar (problema con servicio de email)
        
        4. Respuesta esperada del endpoint:
           {
             "success": true,
             "mensaje": "Correos enviados exitosamente",
             "cantidad_enviada": 3,
             "timestamp": "2025-11-14T12:00:00Z"
           }
      */}
      
      <div className={styles.simulacionBox}>
        <span className={styles.simulacionIcon}>ⓘ</span>
        <div>
          <span className={styles.simulacionTitle}>Simulación activada:</span>
          <span className={styles.simulacionText}> El envío será simulado. Para envíos reales, configura SendGrid en el backend.</span>
        </div>
      </div>

      {/* 
        FILTROS APLICADOS
        
        Este badge indica que el correo solo se enviará a contactos que:
        - Acepten recibir newsletters (campo: acepta_newsletter = true en BD)
        
        El backend DEBE filtrar los destinatarios considerando:
        - Provincia: si está seleccionada, solo contactos de esa provincia
        - Ciudad: si está seleccionada, solo contactos de esa ciudad
        - Grupo: si está seleccionado, solo contactos de ese grupo (o todos si = "todos")
        - Solo Newsletter: si está activo, solo contactos con acepta_newsletter = true
      */}
      
      {correo?.soloNewsletter && (
        <div className={styles.filtros}>
          <span className={styles.newsletterBadge}></span>
          Solo newsletter
        </div>
      )}

      {/* Botones de acción */}
      <div className={styles.actions}>
        <button 
          type="button" 
          onClick={onClose} 
          className={styles.cancelBtn} 
          disabled={enviando}
        >
          Cancelar
        </button>
        <button 
          type="button" 
          onClick={handleSend} 
          className={styles.sendBtn} 
          disabled={enviando}
        >
          {enviando ? <span className={styles.loader}></span> : (
            <>
              <svg width="19" height="19" fill="none" style={{marginRight:6,verticalAlign:"middle"}}>
                <path d="m2.68 8.38 12.14-5.16c.85-.36 1.66.45 1.3 1.3L10.96 16c-.36.85-1.54.86-1.9.01l-2.72-6.34-6.34-2.72c-.84-.36-.85-1.54-.01-1.9Z" stroke="#fff" strokeWidth="1.6"/>
              </svg>
              Enviar Ahora
            </>
          )}
        </button>
      </div>
    </ModalBase>
  );
};

export default EnvioCorreoModal;

/**
 * ============================================================================
 * RESUMEN DE INTEGRACIÓN BACKEND - CHECKLIST PARA DEVELOPERS
 * ============================================================================
 * 
 * ✓ [ ] Crear endpoint POST /api/correos/enviar
 * ✓ [ ] Configurar servicio de email (SendGrid/Mailgun/SES)
 * ✓ [ ] Implementar filtrado de destinatarios (provincia, ciudad, grupo, newsletter)
 * ✓ [ ] Validar formato de emails antes de enviar
 * ✓ [ ] Registrar historial de envíos en BD
 * ✓ [ ] Cambiar estado del correo a "Enviado" después del envío exitoso
 * ✓ [ ] Manejar errores y reintentos automáticos
 * ✓ [ ] Implementar logging y monitoreo de entregas
 * ✓ [ ] Reemplazar handleSend() en frontend con llamada real al API
 * 
 * ============================================================================
 */
