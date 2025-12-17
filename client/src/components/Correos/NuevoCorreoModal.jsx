import React, { useEffect, useState } from "react";
import ModalBase from "../common/ModalBase/ModalBase";
import styles from "./NuevoCorreoModal.module.css";
import { useGeoArgentina } from "../../hooks/useGeoArgentina";
import { getGrupos } from "../../api/grupoOracionService";

const NuevoCorreoModal = ({ correo, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    asunto: "",
    contenido: "",
    provincia: "",
    ciudad: "",
    grupo: "todos",
    // soloNewsletter: false,
  });

  const [grupos, setGrupos] = useState([]);

   useEffect(() => {
     getGrupos()
       .then(setGrupos)
       .catch((e) => console.error("Error grupos:", e));
   }, []);

  // Carga inicial para edición
  useEffect(() => {
    if (correo) {
      setFormData({
        asunto: correo.asunto || "",
        contenido: correo.contenido || "",
        provincia: correo.provincia || "",
        ciudad: correo.ciudad || "",
        grupo: correo.grupo || "todos",
        // soloNewsletter: correo.soloNewsletter || false
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
      setFormData((prev) => ({ ...prev, provincia: value, ciudad: "" }));
    } else if (name === "grupo_oracion") {
      setFormData((prev) => ({
        ...prev,
        grupo_oracion: value === "" ? null : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  
  // resolver despues
  
  // Contactos por grupo (con filtros activos)
  // const grupoContactCount = gruposOracion.map(grupo => ({
  //   ...grupo,
  //   count: contactos.filter(c =>
  //     (!formData.provincia || c.provincia === formData.provincia) &&
  //     (!formData.ciudad || c.ciudad === formData.ciudad) &&
  //     (!formData.soloNewsletter || c.acepta_newsletter) &&
  //     c.grupo_id === grupo.id
  //   ).length
  // }));

  // Exportar destinatarios actuales a CSV
  // const handleExport = () => {
  //   const header = "ID,Provincia,Ciudad,Grupo,Newsletter\n";
  //   const rows = destinatariosList
  //     .map(c =>
  //       `${c.id},"${c.provincia}","${c.ciudad}","${gruposOracion.find(g => g.id === c.grupo_id)?.nombre_grupo ?? ""}","${c.acepta_newsletter ? "Sí" : "No"}"`
  //     ).join("\n");
  //   const csv = header + rows;
  //   const blob = new Blob([csv], { type: "text/csv" });
  //   const link = document.createElement("a");
  //   link.href = window.URL.createObjectURL(blob);
  //   link.download = "destinatarios.csv";
  //   link.click();
  // };

 const handleSubmit = (e) => {
   e.preventDefault();

   const payload = {
     titulo: formData.asunto,
     asunto: formData.asunto,
     contenido: formData.contenido,
    //  solo_newsletter: formData.soloNewsletter,
     provincia: formData.provincia || null,
     ciudad: formData.ciudad || null,
     grupo_oracion:
       formData.grupo_oracion === "todos" || formData.grupo_oracion === ""
         ? null
         : Number(formData.grupo_oracion),
   };

   onSave(payload);
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
        {/* <div className={styles.formGroupCheckbox}>
          <label>
            <input
              type="checkbox"
              name="soloNewsletter"
              checked={formData.soloNewsletter}
              onChange={handleChange}
            />
            Solo contactos que aceptan newsletter
          </label>
        </div> */}
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
            name="grupo_oracion"
            value={formData.grupo_oracion || ""}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="todos">Todos los grupos</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre_grupo}
              </option>
            ))}
          </select>
        </div>
        {/* <div className={styles.exportWrapper}>
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
        </div> */}
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
