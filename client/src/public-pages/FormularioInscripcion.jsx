import React, { useState, useEffect } from "react";
import { useGeoArgentina } from "../hooks/useGeoArgentina";
import axios from "axios";
import styles from "../components/ContactFormModal/ContactFormModal.module.css";
import { contactoPublicSchema } from "../validators/contactoPublic.schema";


const API_COUNTRIES = import.meta.env.VITE_API_COUNTRIES;
const API_URL = import.meta.env.VITE_API_URL;
const API_PUBLIC_CONTACTO = `${API_URL}/api/contactos/public/`;
const API_GRUPOS = `${API_URL}/api/grupo-oracion/public/`;

function FormularioInscripcionPublic() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    sexo: "",
    pais: "Argentina",
    provincia: "",
    ciudad: "",
    celular: "",
    instagram: "",
    parroquia: "",
    participa_grupo: false,
    fecha_nacimiento: "",
    grupo_oracion: null,
  });

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [errorCountries, setErrorCountries] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [errores, setErrores] = useState({});
  


  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const res = await axios.get(API_GRUPOS);
        setGrupos(res.data);
      } catch (error) {
        console.error("Error al obtener los grupos:", error);
      }
    };
    fetchGrupos();
  }, []);

  // --- CARGA DE PAÍSES ---
  useEffect(() => {
    fetch(API_COUNTRIES)
      .then((res) => res.json())
      .then((data) => {
        let list = data.map((c) => c.name.common).filter(Boolean);
        list = [
          "Argentina",
          ...list
            .filter((p) => p !== "Argentina")
            .sort((a, b) => a.localeCompare(b)),
        ];
        setCountries(list);
        setLoadingCountries(false);
      })
      .catch(() => {
        setErrorCountries("Error cargando países");
        setLoadingCountries(false);
      });
  }, []);

  useEffect(() => {
    if (Object.keys(errores).length === 0) return;

    const timer = setTimeout(() => {
      setErrores({});
    }, 5000);

    return () => clearTimeout(timer);
  }, [errores]);

  // --- HOOK PROVINCIAS/LOCALIDADES ---
  const {
    provincias,
    localidades,
    loadingProv,
    loadingLoc,
    errorProv,
    errorLoc,
  } = useGeoArgentina(form.provincia);

  // --- MANEJO DE FORM ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
      return;
    }

    if (name === "pais") {
      setForm({
        ...form,
        pais: value,
        provincia: "",
        ciudad: "",
      });
    } else if (name === "provincia") {
      setForm({
        ...form,
        provincia: value,
        ciudad: "",
      });
    } else if (name === "grupo_oracion") {
      setForm({
        ...form,
        grupo_oracion: value === "" ? null : Number(value),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // --- ENVÍO A API ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores({});

    const result = contactoPublicSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = {};
       result.error.issues.forEach((err) => {
         fieldErrors[err.path[0]] = err.message;
       });
      setErrores(fieldErrors);
      return;
    }

    try {
      await axios.post(API_PUBLIC_CONTACTO, result.data);

      setForm({
        nombre: "",
        apellido: "",
        email: "",
        sexo: "",
        pais: "Argentina",
        provincia: "",
        ciudad: "",
        celular: "",
        instagram: "",
        parroquia: "",
        participa_grupo: false,
        fecha_nacimiento: "",
        grupo_oracion: null,
      });

      setMensaje("¡Gracias por tu inscripción!");
      setTimeout(() => setMensaje(null), 5000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2 className={styles.title}>Formulario de Inscripción</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className={styles.input}
          />
          {errores.nombre && (
            <div className={styles.errorText}>{errores.nombre}</div>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Apellido</label>
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            required
            className={styles.input}
          />
          {errores.apellido && (
            <div className={styles.errorText}>{errores.apellido}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
          {errores.email && (
            <div className={styles.errorText}>{errores.email}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Sexo</label>
          <select
            className={styles.select}
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar…</option>
            <option value="femenino">Femenino</option>
            <option value="masculino">Masculino</option>
            <option value="otro">Otro</option>
          </select>
          {errores.sexo && (
            <div className={styles.errorText}>{errores.sexo}</div>
          )}
        </div>

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
              className={styles.select}
              name="pais"
              value={form.pais}
              onChange={handleChange}
            >
              <option value="">Seleccione país…</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
          {errores.pais && (
            <div className={styles.errorText}>{errores.pais}</div>
          )}
        </div>

        {/* ARGENTINA: provincias/localidades */}
        {form.pais === "Argentina" && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Provincia</label>
              {loadingProv ? (
                <select className={styles.select} disabled>
                  <option>Cargando provincias…</option>
                </select>
              ) : errorProv ? (
                <select className={styles.select} disabled>
                  <option>{errorProv}</option>
                </select>
              ) : (
                <select
                  name="provincia"
                  value={form.provincia}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Seleccione provincia...</option>
                  {provincias.map((p) => (
                    <option key={p.id} value={p.nombre}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              )}
              {errores.provincia && (
                <div className={styles.errorText}>{errores.provincia}</div>
              )}
            </div>
            <div className={styles.formGroup}>
              {/* Localidades */}
              <label className={styles.label}>Localidad</label>
              {loadingLoc ? (
                <select className={styles.select} disabled>
                  <option>Cargando localidades…</option>
                </select>
              ) : errorLoc ? (
                <select className={styles.select} disabled>
                  <option>{errorLoc}</option>
                </select>
              ) : (
                <select
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  disabled={!form.provincia}
                  className={styles.select}
                >
                  <option value="">Seleccione localidad...</option>
                  {localidades.map((l) => (
                    <option key={l.id} value={l.nombre}>
                      {l.nombre}
                    </option>
                  ))}
                </select>
              )}
              {errores.ciudad && (
                <div className={styles.errorText}>{errores.ciudad}</div>
              )}
            </div>
          </>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Celular</label>
          <input
            name="celular"
            value={form.celular}
            onChange={handleChange}
            className={styles.input}
          />
          {errores.celular && (
            <div className={styles.errorText}>{errores.celular}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Instagram</label>
          <input
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            className={styles.input}
          />
          {errores.instagram && (
            <div className={styles.errorText}>{errores.instagram}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Parroquia</label>
          <input
            name="parroquia"
            value={form.parroquia}
            onChange={handleChange}
            className={styles.input}
          />
          {errores.parroquia && (
            <div className={styles.errorText}>{errores.parroquia}</div>
          )}
        </div>
        <div className={styles.formGroupCheckbox}>
          <label className={styles.label}>
            ¿Participa en un grupo de oración?
          </label>
          <input
            type="checkbox"
            name="participa_grupo"
            checked={form.participa_grupo}
            onChange={handleChange}
            className={styles.checkbox}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Fecha de Nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            className={styles.input}
          />
          {errores.fecha_nacimiento && (
            <div className={styles.errorText}>{errores.fecha_nacimiento}</div>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Grupo de Oración</label>
          <select
            name="grupo_oracion"
            value={form.grupo_oracion || ""}
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
            Si el grupo aún no está disponible, dejá este campo vacío. El
            administrador lo cargará y podrás actualizarlo luego.
          </small>
        </div>
        {mensaje && (
          <p style={{ color: "green", marginBottom: "10px" }}>{mensaje}</p>
        )}
        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn}>
            Enviar inscripción
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioInscripcionPublic;
