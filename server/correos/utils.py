from contactos.models import Contacto

def obtener_contactos_para_correo(correo):
    """
    Filtra contactos según:
    1) Provincia
    2) Ciudad (dentro de la provincia)
    3) Grupo de oración (se suma al filtro anterior)
    Devuelve queryset y cantidad.
    """

    # Filtrado por provincia/ciudad
    contactos_prov_ciudad = Contacto.objects.all()
    
    if correo.provincia:
        contactos_prov_ciudad = contactos_prov_ciudad.filter(
            provincia__iexact=correo.provincia.strip()
        )
    
        if correo.ciudad:
            contactos_prov_ciudad = contactos_prov_ciudad.filter(
                ciudad__iexact=correo.ciudad.strip()
            )
    
    # Filtrado por grupo de oración
    if correo.grupo_oracion:
        contactos_grupo = Contacto.objects.filter(grupo_oracion=correo.grupo_oracion)
    else:
        contactos_grupo = Contacto.objects.all()  # incluye todos si no se indica grupo

    # Unir IDs para evitar duplicados
    contactos_ids = set(contactos_prov_ciudad.values_list("id", flat=True))
    contactos_ids.update(contactos_grupo.values_list("id", flat=True))

    contactos_finales = Contacto.objects.filter(id__in=contactos_ids)

    return contactos_finales, contactos_finales.count()
