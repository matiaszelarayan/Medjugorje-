# utils.py
from contactos.models import Contacto

def obtener_contactos_para_correo(correo):
    """
    Devuelve un queryset de Contacto filtrado según:
    - solo_newsletter
    - provincia
    - ciudad
    - grupo_oracion (LOS SUMA AUNQUE NO COINCIDAN provincia/ciudad)

    También devuelve la cantidad final.
    """
    # esto se puede mejorar cuadno pasemos a psotrgres
    

    
    # contactos por provincia/ciudad (base)
    contactos_prov_ciudad = Contacto.objects.all()

    if correo.solo_newsletter:
        contactos_prov_ciudad = contactos_prov_ciudad.filter(participa_grupo=True)

    if correo.provincia and correo.provincia.strip():
        contactos_prov_ciudad = contactos_prov_ciudad.filter(
            provincia__iexact=correo.provincia.strip()
        )

    if correo.ciudad and correo.ciudad.strip():
        contactos_prov_ciudad = contactos_prov_ciudad.filter(
            ciudad__iexact=correo.ciudad.strip()
        )

    # contactos por grupo (independientes)
    # if correo.grupo_oracion:
    #     contactos_grupo = Contacto.objects.filter(grupo_oracion=correo.grupo_oracion)
    # else:
    #     contactos_grupo = Contacto.objects.none()

    # si selecciona todos los grupos va a venir null, entoces incluimos todos
    if correo.grupo_oracion is None:
        # incluir todos los grupos 
        contactos_grupo = Contacto.objects.all()
    else:
        contactos_grupo = Contacto.objects.filter(grupo_oracion=correo.grupo_oracion)

    # unir en un solo set de IDs para evitar duplicados
    contactos_ids = set()
    contactos_ids.update(contactos_prov_ciudad.values_list("id", flat=True))
    contactos_ids.update(contactos_grupo.values_list("id", flat=True))

    contactos_finales = Contacto.objects.filter(id__in=contactos_ids)

    return contactos_finales, contactos_finales.count()
