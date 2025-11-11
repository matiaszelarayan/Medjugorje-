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

const EnvioCorreoModal = ({ correo, destinatarios, onClose, onSend }) => {
  const [enviando, setEnviando] = useState(false);

  const handleSend = () => {
    if (enviando) return;
    setEnviando(true);
    setTimeout(() => {
      onSend();
      setEnviando(false);
      onClose();
    }, 3000);
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

      {/* Tres tarjetas de info */}
      <div className={styles.infoRow}>
        <InfoCard icon={UserIcon} value={destinatarios || 0} label="Destinatarios" color={{bg:"#f2f6fc",icon:"#3572b4"}} />
        <InfoCard icon={EmailIcon} value={destinatarios || 0} label="Emails válidos" color={{bg:"#eaf9f2",icon:"#2a8567"}} />
        <InfoCard icon={ClockIcon} value="1 minuto" label="Tiempo est." color={{bg:"#fff2e2",icon:"#c57a38"}} />
      </div>

      {/* Cuadro azul informativo */}
      <div className={styles.simulacionBox}>
        <span className={styles.simulacionIcon}>ⓘ</span>
        <div>
          <span className={styles.simulacionTitle}>Simulación activada:</span>
          <span className={styles.simulacionText}> El envío será simulado. Para envíos reales, configura SendGrid en el backend.</span>
        </div>
      </div>

      {/* Filtros */}
      {correo?.soloNewsletter && (
        <div className={styles.filtros}>
          <span className={styles.newsletterBadge}></span>
          Solo newsletter
        </div>
      )}

      {/* Botones */}
      <div className={styles.actions}>
        <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={enviando}>
          Cancelar
        </button>
        <button type="button" onClick={handleSend} className={styles.sendBtn} disabled={enviando}>
          {enviando ? <span className={styles.loader}></span> : (
            <>
              <svg width="19" height="19" fill="none" style={{marginRight:6,verticalAlign:"middle"}}><path d="m2.68 8.38 12.14-5.16c.85-.36 1.66.45 1.3 1.3L10.96 16c-.36.85-1.54.86-1.9.01l-2.72-6.34-6.34-2.72c-.84-.36-.85-1.54-.01-1.9Z" stroke="#fff" strokeWidth="1.6"/></svg>
              Enviar Ahora
            </>
          )}
        </button>
      </div>
    </ModalBase>
  );
};

export default EnvioCorreoModal;
