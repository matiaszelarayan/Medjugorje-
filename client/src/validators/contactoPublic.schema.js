import { z } from "zod";

const requiredString = (msg) => z.string().trim().min(1, msg);

export const contactoPublicSchema = z
  .object({
    nombre: requiredString("Por favor ingresa tu nombre"),
    apellido: requiredString("Por favor ingresa tu apellido"),

    email: z.string().trim().email("Por favor ingresa un email válido"),

    sexo: z.enum(["femenino", "masculino", "otro"], {
      errorMap: () => ({ message: "Seleccioná un sexo" }),
    }),

    pais: requiredString("Por favor ingresa tu país"),

    provincia: z.string().optional(),
    ciudad: z.string().optional(),

    celular: requiredString("Por favor ingresa tu celular"),
    instagram: requiredString("Por favor ingresa tu usuario de Instagram"),
    parroquia: requiredString("Por favor ingresa tu parroquia"),

    participa_grupo: z.boolean(),

    fecha_nacimiento: requiredString(
      "Por favor ingresa tu fecha de nacimiento"
    ),

    // ⬇️ ÚNICO campo opcional
    grupo_oracion: z.number().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.pais === "Argentina") {
      if (!data.provincia || data.provincia.trim() === "") {
        ctx.addIssue({
          path: ["provincia"],
          message: "Por favor ingresa tu provincia",
        });
      }

      if (!data.ciudad || data.ciudad.trim() === "") {
        ctx.addIssue({
          path: ["ciudad"],
          message: "Por favor ingresa tu ciudad",
        });
      }
    }
  });
