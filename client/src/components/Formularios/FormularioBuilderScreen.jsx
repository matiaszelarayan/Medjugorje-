import React, { useState } from "react";
import styles from "./FormularioBuilderScreen.module.css";
import MainLayout from "../MainLayout/MainLayout";

// Campos tipo iniciales
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
  const [formName, setFormName] = useState("");
  const [slug, setSlug] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  // Handlers para campos dinámicos
  const addField = () =>
    setFields([...fields, { label: "", type: "text", required: false }]);
  const updateField = (index, key, value) => {
    setFields(fields.map((f, i) => (i === index ? { ...f, [key]: value } : f)));
  };
  const removeField = (index) =>
    setFields(fields.filter((_, i) => i !== index));

  // Generar slug SEO
  const handleGenerateSlug = () => {
    setSlug(
      formName
        .trim()
        .toLocaleLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
    );
  };

  // Previsualización y guardado (mock)
  const handlePreview = () => setIsPreview((prev) => !prev);
  const handleSave = () => {
    alert(
      "Formulario guardado. Enlace: " +
        window.location.origin +
        "/formulario/" +
        slug
    );
  };

  // Solo Admin/Colaborador
  if (!["administrador", "colaborador"].includes(user?.role)) {
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
                URL: /formulario/<b>{slug}</b>
              </span>
            )}
          </div>

          <button onClick={addField} className="actionButtonGlobal">
            ➕ Agregar campo
          </button>

          {fields.map((field, idx) => (
            <div key={idx} className={styles.fieldEditor}>
              <input
                type="text"
                placeholder="Etiqueta"
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
                <option value="provincia">Provincia/Estado</option>
                <option value="localidad">Ciudad/Localidad</option>
                <option value="checkbox">Checkbox</option>
                <option value="textarea">Área de texto</option>
              </select>
              <label className={styles.fieldLabel}>
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) =>
                    updateField(idx, "required", e.target.checked)
                  }
                  className={styles.checkboxRequired}
                />
                Requerido
              </label>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => removeField(idx)}
                title="Quitar campo"
              >
                🗑️
              </button>
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            <button onClick={handlePreview} className="actionButtonGlobal">
              {isPreview ? "Editar" : "Previsualizar"}
            </button>
            <button
              onClick={handleSave}
              disabled={!formName || fields.length === 0}
              className="actionButtonGlobal"
            >
              Guardar y Generar Enlace
            </button>
          </div>

          {isPreview && (
            <div className={styles.preview}>
              <h3 className={styles.previewTitle}>Previsualización</h3>
              <form>
                {fields.map((field, idx) => (
                  <div key={idx} className={styles.formPreviewField}>
                    <label>
                      {field.label}
                      {field.required && "*"}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        required={field.required}
                        className={styles.inputPreview}
                      />
                    ) : field.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        required={field.required}
                        className={styles.inputPreview}
                      />
                    ) : field.type === "provincia" ? (
                      <input
                        type="text"
                        required={field.required}
                        placeholder="Conectar provincias API"
                        className={styles.inputPreview}
                        disabled
                      />
                    ) : field.type === "localidad" ? (
                      <input
                        type="text"
                        required={field.required}
                        placeholder="Conectar localidades API"
                        className={styles.inputPreview}
                        disabled
                      />
                    ) : (
                      <input
                        type={field.type}
                        required={field.required}
                        className={styles.inputPreview}
                      />
                    )}
                  </div>
                ))}
              </form>
              <div>
                <strong>Enlace público:</strong>
                <span>
                  {slug && `${window.location.origin}/formulario/${slug}`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FormularioBuilderScreen;
