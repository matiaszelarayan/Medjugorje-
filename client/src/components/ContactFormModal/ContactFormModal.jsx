import React, { useState, useEffect } from "react";
import ModalBase from "../common/ModalBase/ModalBase";
import styles from "./ContactFormModal.module.css";
import { useGeoArgentina } from "../../hooks/useGeoArgentina";

const API_COUNTRIES = import.meta.env.VITE_API_COUNTRIES;

import PropTypes from "prop-types";

// ... (existing imports and code)

const ContactFormModal = ({ contact, onClose, onSave, grupos }) => {
  const [formData, setFormData] = useState({
    nombre: contact?.nombre || "",
    apellido: contact?.apellido || "",
    email: contact?.email || "",
    sexo: contact?.sexo || "",
    pais: contact?.pais || "Argentina",
    provincia: contact?.provincia || "",
    ciudad: contact?.ciudad || "",
    celular: contact?.celular || "",
    instagram: contact?.instagram || "",
    parroquia: contact?.parroquia || "",
    participa_grupo: contact?.participa_grupo || false,
    fecha_nacimiento: contact?.fecha_nacimiento || "",
    grupo_oracion: contact?.grupo_oracion || null,
  });

  // --- Países ---
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [errorCountries, setErrorCountries] = useState(null);

  useEffect(() => {
    fetch(API_COUNTRIES)
      .then((res) => res.json())
      .then((data) => {
        let countryList = data.map((c) => c.name.common).filter(Boolean);
        countryList = [
          "Argentina",
          ...countryList.filter((p) => p !== "Argentina").sort((a, b) => a.localeCompare(b)),
        ];
        setCountries(countryList);
        setLoadingCountries(false);
      })
      .catch(() => {
        setErrorCountries("Error cargando países");
        setLoadingCountries(false);
      });
  }, []);

  // --- Hook provincias/localidades centralizado ---
  const {
    provincias,
    localidades,
    loadingProv,
    loadingLoc,
    errorProv,
    errorLoc,
  } = useGeoArgentina(formData.provincia);

  const isEdit = !!contact;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    if (name === "pais") {
      setFormData((prev) => ({
        ...prev,
        pais: val,
        provincia: "",
        ciudad: "",
      }));
    } else if (name === "provincia") {
      setFormData((prev) => ({
        ...prev,
        provincia: value,
        ciudad: "",
      }));
    } else if (name === "grupo_oracion") {
      setFormData((prev) => ({
        ...prev,
        grupo_oracion: value === "" ? null : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      id: contact?.id || undefined, // si existe se edita, si no se crea
    };

    onSave(payload);
    onClose();
  };


  return (
    <ModalBase onClose={onClose}>
      <h2 className={styles.title}>
        {isEdit ? "Editar Contacto" : "Crear Nuevo Contacto"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Datos personales primero */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Sexo</label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">Seleccionar</option>
            <option value="femenino">Femenino</option>
            <option value="masculino">Masculino</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <hr className={styles.separator} />

        <div className={styles.formGroup}>
          <label className={styles.label}>País</label>
          {loadingCountries ? (
            <select className={styles.select} disabled>
              <option>Cargando países...</option>
            </select>
          ) : errorCountries ? (
            <select className={styles.select} disabled>
              <option>{errorCountries}</option>
            </select>
          ) : (
            <select
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Seleccione país...</option>
              {countries.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          )}
        </div>

        {/* Provincias y localidades SOLO si país Argentina */}
        {formData.pais === "Argentina" ? (
          <>
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
                  required
                  className={styles.select}
                >
                  <option value="">Seleccione provincia...</option>
                  {provincias.map((p) => (
                    <option key={p.id} value={p.nombre}>{p.nombre}</option>
                  ))}
                </select>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ciudad</label>
              {loadingLoc ? (
                <select className={styles.select} disabled>
                  <option>Cargando ciudades...</option>
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
                  required
                  className={styles.select}
                >
                  <option value="">Seleccione ciudad...</option>
                  {localidades.map((l) => (
                    <option key={l.id} value={l.nombre}>{l.nombre}</option>
                  ))}
                </select>
              )}
            </div>
          </>
        ) : (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Provincia/Estado</label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </>
        )}

        <hr className={styles.separator} />

        <div className={styles.formGroup}>
          <label className={styles.label}>Celular</label>
          <input
            type="text"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Instagram</label>
          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Parroquia</label>
          <input
            type="text"
            name="parroquia"
            value={formData.parroquia}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Fecha de Nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Participa en Grupo de Oración</label>
          <input
            type="checkbox"
            name="participa_grupo"
            checked={formData.participa_grupo}
            onChange={handleChange}
            className={styles.checkbox}
          />
        </div>

        {formData.participa_grupo && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Grupo de Oración</label>
            <select
              name="grupo_oracion"
              value={formData.grupo_oracion || ""}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Seleccione un grupo</option>
              {grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nombre_grupo}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.buttonContainer}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancelar
          </button>
          <button type="submit" className={styles.submitBtn}>
            {isEdit ? "Guardar Cambios" : "Crear Contacto"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

ContactFormModal.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    email: PropTypes.string,
    sexo: PropTypes.string,
    pais: PropTypes.string,
    provincia: PropTypes.string,
    ciudad: PropTypes.string,
    celular: PropTypes.string,
    instagram: PropTypes.string,
    parroquia: PropTypes.string,
    participa_grupo: PropTypes.bool,
    fecha_nacimiento: PropTypes.string,
    grupo_oracion: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  grupos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre_grupo: PropTypes.string.isRequired,
    })
  ).isRequired,
};
export default ContactFormModal;
