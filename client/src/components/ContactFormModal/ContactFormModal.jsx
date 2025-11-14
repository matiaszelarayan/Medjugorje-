import React, { useState, useEffect } from "react";
import ModalBase from "../common/ModalBase/ModalBase";
import styles from "./ContactFormModal.module.css";
import { useGeoArgentina } from "../../hooks/useGeoArgentina";

const API_COUNTRIES = "https://restcountries.com/v3.1/all?fields=name";

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
    grupo_oracion: contact?.grupo_oracion || "",
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
    } else {
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newContact = isEdit
      ? { ...formData, id: contact.id }
      : { ...formData, id: Date.now() };
    onSave(newContact);
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
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro</option>
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
                  required
                  className={styles.select}
                  disabled={!formData.provincia}
                >
                  <option value="">Seleccione localidad...</option>
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
                required
                className={styles.input}
                placeholder="Ingrese provincia o estado"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ciudad / Localidad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Ingrese ciudad/localidad"
              />
            </div>
          </>
        )}

        {/* ... El resto de tus campos opcionales igual ... */}
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
        <div className={styles.formGroupCheckbox}>
          <label className={styles.label}>
            ¿Participa en un grupo de oración?
          </label>
          <input
            type="checkbox"
            name="participa_grupo"
            checked={formData.participa_grupo}
            onChange={handleChange}
            className={styles.checkbox}
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
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Grupo de Oración</label>
          <select
            name="grupo_oracion"
            value={formData.grupo_oracion || ""}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">-- Seleccionar grupo --</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre_grupo}
              </option>
            ))}
          </select>
          <small className={styles.helpText}>
            Si el grupo aún no está disponible, dejá este campo vacío. El administrador lo cargará y podrás actualizarlo luego.
          </small>
        </div>
        <div className={styles.actions}>
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

export default ContactFormModal;
