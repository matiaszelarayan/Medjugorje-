import React, { useState } from "react";
import styles from "./FormularioBuilderScreen.module.css";
import MainLayout from "../MainLayout/MainLayout";
import { Plus, Save, X, Edit2, Trash2, ArrowUp, ArrowDown } from "lucide-react";

// Tipos de campos iniciales
const initialFields = [
  { label: "Nombre", type: "text", required: true },
  { label: "Apellido", type: "text", required: true },
  { label: "Fecha de nacimiento", type: "date", required: false },
  { label: "Email", type: "email", required: true },
  { label: "País", type: "text", required: true },
  { label: "Provincia/Estado", type: "provincia", required: true },
  { label: "Ciudad/Localidad", type: "localidad", required: true },
  { label: "Acepta recibir newsletter", type: "checkbox", required: false },
];

const FormularioBuilderScreen = ({ user }) => {
  const [fields, setFields] = useState(initialFields);
  const [formName, setFormName] = useState("Formulario de Inscripción");
  const [slug, setSlug] = useState("formulario-de-inscripcion");
  const [isPreview, setIsPreview] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handlers para campos dinámicos
  const addField = () => {
    setFields([...fields, { label: "Nuevo Campo", type: "text", required: false }]);
    setSuccessMessage(null);
  };

  const updateField = (index, key, value) => {
    setFields(fields.map((f, i) => (i === index ? { ...f, [key]: value } : f)));
    setSuccessMessage(null);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
    setSuccessMessage(null);
  };

  // Mover campos arriba/abajo
  const moveFieldUp = (index) => {
    if (index === 0) return;
    const newFields = [...fields];
    const temp = newFields[index - 1];
    newFields[index - 1] = newFields[index];
    newFields[index] = temp;
    setFields(newFields);
  };

  const moveFieldDown = (index) => {
    if (index === fields.length - 1) return;
    const newFields = [...fields];
    const temp = newFields[index + 1];
    newFields[index + 1] = newFields[index];
    newFields[index] = temp;
    setFields(newFields);
  };

  // Generar slug SEO
  const handleGenerateSlug = () => {
    const generatedSlug = formName
      .trim()
      .toLocaleLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  };

  const handlePreview = () => setIsPreview((prev) => !prev);

  const handleSave = () => {
    const formUrl = `${window.location.origin}/formulario/${slug}`;
    setSuccessMessage({
      name: formName,
      url: formUrl,
    });
    // Simula guardar en backend
    console.log("Formulario a guardar:", { name: formName, slug, fields });
  };

  if (!["administrador", "colaborador", "Admin", "Colaborador"].includes(user?.role)) {
    return (
      <div className={`${styles.screenWrapper} screenWrapperGlobal`}>
        Acceso no autorizado
      </div>
    );
  }

  return (
    <MainLayout>
      <div className={`${styles.screenWrapper} screenWrapperGlobal`}>
        <div className={styles.formBuilderContainer}>
          <h2 className={styles.title}>Constructor de Formularios</h2>
          <div className={styles.inputField}>
            <input
              type="text"
              placeholder="Nombre del formulario"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              onBlur={handleGenerateSlug}
              className={styles.inputFormName}
            />
            {slug && (
              <span className={styles.slugLabel}>
                URL pública: /formulario/<b>{slug}</b>
              </span>
            )}
          </div>

          {/* Botón Agregar campo */}
          <button onClick={addField} className={`${styles.btnGreen} ${styles.addFieldButton}`}>
            <Plus size={18} style={{ marginRight: 8 }} />
            Agregar campo
          </button>

          {/* Lista de campos */}
          {fields.map((field, idx) => (
            <div key={idx} className={styles.fieldEditor}>
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(idx, "label", e.target.value)}
                className={styles.inputField}
              />
              <select
                value={field.type}
                onChange={(e) => updateField(idx, "type", e.target.value)}
                className={styles.selectFieldType}
              >
                <option value="text">Texto</option>
                <option value="email">Email</option>
                <option value="number">Número</option>
                <option value="date">Fecha</option>
                <option value="checkbox">Checkbox</option>
                <option value="textarea">Área de texto</option>
                <option value="provincia">Provincia/Estado</option>
                <option value="localidad">Ciudad/Localidad</option>
              </select>
              <label className={styles.fieldLabel}>
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField(idx, "required", e.target.checked)}
                  className={styles.checkboxRequired}
                />
                Requerido
              </label>
              <button type="button" className={styles.btnEdit} title="Editar">
                <Edit2 size={16} />
              </button>
              <button
                type="button"
                className={styles.btnMove}
                title="Subir"
                onClick={() => moveFieldUp(idx)}
                disabled={idx === 0}
              >
                <ArrowUp size={16} />
              </button>
              <button
                type="button"
                className={styles.btnMove}
                title="Bajar"
                onClick={() => moveFieldDown(idx)}
                disabled={idx === fields.length - 1}
              >
                <ArrowDown size={16} />
              </button>
              <button
                type="button"
                className={styles.btnRed}
                onClick={() => removeField(idx)}
                title="Eliminar campo"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* Botones de acción */}
          <div className={styles.actionButtons}>
            <button
              onClick={handlePreview}
              className={`${styles.btnOrange} actionButtonGlobal`}
            >
              <Save size={16} style={{ marginRight: 8 }} />
              {isPreview ? "Volver a Editar" : "Previsualizar Formulario"}
            </button>
            <button
              onClick={handleSave}
              disabled={!formName || fields.length === 0}
              className={`${styles.btnGreen} actionButtonGlobal`}
            >
              <Save size={16} style={{ marginRight: 8 }} />
              Guardar y Generar Enlace
            </button>
            <button
              onClick={() => setIsPreview(false)}
              className={`${styles.btnGray} actionButtonGlobal`}
              style={{ marginLeft: 8 }}
            >
              <X size={16} style={{ marginRight: 8 }} />
              Cancelar
            </button>
          </div>

          {successMessage && (
            <div className={styles.successMessage}>
              ✅ Formulario <strong>"{successMessage.name}"</strong> guardado con éxito.
              <span>
                <strong>Enlace generado:</strong> {successMessage.url}
              </span>
            </div>
          )}

          {isPreview && (
            <div className={styles.preview}>
              <h3 className={styles.previewTitle}>
                Previsualización: {formName}
              </h3>
              <form>
                {fields.map((field, idx) => (
                  <div key={idx} className={styles.formPreviewField}>
                    <label>
                      {field.label}
                      {field.required && <span style={{color: 'red', marginLeft: '4px'}}>*</span>}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        required={field.required}
                        className={styles.inputPreview}
                        placeholder={`Escribe tu ${field.label.toLowerCase()}...`}
                      />
                    ) : field.type === "checkbox" ? (
                      <div style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
                        <input
                          type="checkbox"
                          required={field.required}
                          className={styles.inputPreview}
                          style={{width: 'auto', marginRight: '8px'}}
                        />
                      </div>
                    ) : (
                      <input
                        type={
                          field.type === "provincia" || field.type === "localidad"
                            ? "text"
                            : field.type
                        }
                        required={field.required}
                        className={styles.inputPreview}
                        placeholder={
                          field.type === "provincia"
                            ? "Seleccionar Provincia/Estado (API)"
                            : field.type === "localidad"
                            ? "Seleccionar Ciudad/Localidad (API)"
                            : field.label
                        }
                        disabled={field.type === "provincia" || field.type === "localidad"}
                      />
                    )}
                  </div>
                ))}
                <button type="submit" className="actionButtonGlobal" style={{marginTop: '1rem'}}>
                  Enviar Formulario
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FormularioBuilderScreen;
