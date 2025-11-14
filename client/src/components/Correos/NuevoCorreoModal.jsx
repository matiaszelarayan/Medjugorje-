import React, { useEffect, useState } from "react";
import ModalBase from "../common/ModalBase/ModalBase";
import styles from "./NuevoCorreoModal.module.css";
import { useGeoArgentina } from "../../hooks/useGeoArgentina";

// Simulados (en real vendrán de la API BD)
const gruposOracion = [
  { id: 1, nombre_grupo: "Grupo Esperanza" },
  { id: 2, nombre_grupo: "Renacer" },
  { id: 3, nombre_grupo: "Camino de Fe" },
];
const contactos = [
  { id: 1, provincia: "Buenos Aires", ciudad: "Junín", grupo_id: 1, acepta_newsletter: true },
  { id: 2, provincia: "Buenos Aires", ciudad: "Pergamino", grupo_id: 2, acepta_newsletter: false },
  { id: 3, provincia: "Córdoba", ciudad: "Villa María", grupo_id: 1, acepta_newsletter: true },
  { id: 4, provincia: "Santa Fe", ciudad: "Rosario", grupo_id: 3, acepta_newsletter: true },
];

const NuevoCorreoModal = ({ correo, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    asunto: "",
    contenido: "",
    provincia: "",
    ciudad: "",
    grupo: "todos",
    soloNewsletter: false,
  });

  // Carga inicial para edición
  useEffect(() => {
    if (correo) {
      setFormData({
        asunto: correo.asunto || "",
        contenido: correo.contenido || "",
        provincia: correo.provincia || "",
        ciudad: correo.ciudad || "",
        grupo: correo.grupo || "todos",
        soloNewsletter: correo.soloNewsletter || false
      });
    }
  }, [correo]);

  // Hook de provincias/localidades
  const {
    provincias,
    localidades,
    loadingProv,
    loadingLoc,
    errorProv,
    errorLoc,
  } = useGeoArgentina(formData.provincia);

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "provincia") {
      setFormData((prev) => ({
        ...prev,
        provincia: value,
        ciudad: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Lista de destinatarios filtrados
  const destinatariosList = contactos.filter((c) => {
    const matchProvincia = !formData.provincia || c.provincia === formData.provincia;
    const matchCiudad = !formData.ciudad || c.ciudad === formData.ciudad;
    const matchGrupo = formData.grupo === "todos" || c.grupo_id === parseInt(formData.grupo);
    const matchNewsletter = !formData.soloNewsletter || c.acepta_newsletter;
    return matchProvincia && matchCiudad && matchGrupo && matchNewsletter;
  });
  const destinatarios = destinatariosList.length;

  // Contactos por grupo (con filtros activos)
  const grupoContactCount = gruposOracion.map(grupo => ({
    ...grupo,
    count: contactos.filter(c =>
      (!formData.provincia || c.provincia === formData.provincia) &&
      (!formData.ciudad || c.ciudad === formData.ciudad) &&
      (!formData.soloNewsletter || c.acepta_newsletter) &&
      c.grupo_id === grupo.id
    ).length
  }));

  // Exportar destinatarios actuales a CSV
  const handleExport = () => {
    const header = "ID,Provincia,Ciudad,Grupo,Newsletter\n";
    const rows = destinatariosList
      .map(c =>
        `${c.id},"${c.provincia}","${c.ciudad}","${gruposOracion.find(g => g.id === c.grupo_id)?.nombre_grupo ?? ""}","${c.acepta_newsletter ? "Sí" : "No"}"`
      ).join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "destinatarios.csv";
    link.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, destinatarios });
    onClose();
  };

  return (
    <ModalBase onClose={onClose}>
      <h2 className={styles.title}>Nuevo Correo Masivo</h2>
      <p className={styles.subtitle}>
        Crea un nuevo correo masivo con filtros de segmentación
      </p>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Asunto *</label>
          <input
            type="text"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Mensaje *</label>
          <textarea
            name="contenido"
            value={formData.contenido}
            onChange={handleChange}
            required
            className={styles.textarea}
            rows={6}
          />
        </div>
        <div className={styles.formGroupCheckbox}>
          <label>
            <input
              type="checkbox"
              name="soloNewsletter"
              checked={formData.soloNewsletter}
              onChange={handleChange}
            />
            Solo contactos que aceptan newsletter
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Provincia</label>
          {loadingProv ? (
            <select className={styles.select} disabled>
              <option>Cargando provincias...</option>
            </select>
          ) : errorProv ? (
            <select className={styles.select} disabled>
              <option>{errorProv}</option>
            </select>
          ) : (
            <select
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Todas</option>
              {provincias.map((p) => (
                <option key={p.id} value={p.nombre}>
                  {p.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Ciudad / Localidad</label>
          {formData.provincia && loadingLoc ? (
            <select className={styles.select} disabled>
              <option>Cargando localidades...</option>
            </select>
          ) : errorLoc ? (
            <select className={styles.select} disabled>
              <option>{errorLoc}</option>
            </select>
          ) : (
            <select
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              className={styles.select}
              disabled={!formData.provincia}
            >
              <option value="">Todas</option>
              {localidades.map((l) => (
                <option key={l.id} value={l.nombre}>
                  {l.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Grupo de Oración</label>
          <select
            name="grupo"
            value={formData.grupo}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="todos">Todos los grupos</option>
            {grupoContactCount.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre_grupo} ({g.count})
              </option>
            ))}
          </select>
        </div>
        <div className={styles.exportWrapper}>
          <p className={styles.destinatarios}>
            Destinatarios: {destinatarios} contactos
          </p>
          <button
            type="button"
            className={styles.exportBtn}
            onClick={handleExport}
            disabled={destinatarios === 0}
          >
            Exportar contactos
          </button>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.submitBtn}>
            Guardar Borrador
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

export default NuevoCorreoModal;
