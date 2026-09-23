import scfa from "./scfa.json";
import clinica from "./clinica.json";

// Un objeto por proyecto del portafolio. `vistas` viene del manifiesto que genera
// tools/brandkit/proyecto-imagenes.js; `portada` es el código de la vista destacada.
export const proyectos = [
  {
    slug: "clinica",
    tag: "Salud",
    titulo: "Clínica y Centro Médico Dental",
    cliente: { nombre: "GITC", logo: "/clientes/gitc.png" },
    portada: "EXT-NE",
    parrafos: [
      "Modelamos la arquitectura completa del edificio: catorce niveles, desde los ocho subterráneos hasta la cubierta, con recintos clínicos, mobiliario y equipamiento médico modelados pieza por pieza.",
      "Las vistas se generan desde el propio modelo con plantillas de vista, no como renders aparte. Cada planta se corta a la altura del nivel para revisar la distribución en tres dimensiones, y las cuatro esquinas exteriores muestran el volumen tal como se percibe desde la calle.",
    ],
    alcance: [
      { k: "Modelación", v: "Arquitectura completa del edificio, 14 niveles, con recintos clínicos, mobiliario y equipamiento médico." },
      { k: "Coordinación", v: "Modelo vinculado con estructura y topografía, revisado por nivel sobre el propio modelo." },
      { k: "Documentación", v: "Plantas, cortes, láminas de recinto y tablas de cantidades generadas desde el modelo." },
    ],
    ficha: [
      { k: "Tipo", v: "Edificio clínico y dental" },
      { k: "Especialidad", v: "Arquitectura" },
      { k: "Niveles", v: "14, de subterráneo −8 a cubierta" },
      { k: "Estado", v: "En desarrollo" },
    ],
    galeria: "Cuatro vistas exteriores y una por planta",
    vistas: clinica,
  },
  {
    slug: "scfa",
    tag: "Aeropuerto",
    titulo: "Aeropuerto Andrés Sabella",
    cliente: { nombre: "IDOM", logo: "/clientes/idom.png" },
    portada: "PAX",
    parrafos: [
      "Modelamos y coordinamos el sistema de corrientes débiles de los dieciséis edificios del recinto: desde el terminal de pasajeros y la torre de control hasta las subestaciones, el complejo de carga y los puestos de control.",
      "Cada edificio se documenta con una axonometría donde el sistema se lee sobre la arquitectura y la estructura. Así el trazado de bandejas, los gabinetes y los puntos se revisan —y se corrigen— sobre el modelo, antes de que lleguen a terreno.",
    ],
    alcance: [
      { k: "Modelación", v: "Sistema de corrientes débiles de los 16 edificios: bandejas, gabinetes y puntos." },
      { k: "Coordinación", v: "Cruce con arquitectura y estructura de cada edificio, con resolución de interferencias sobre el modelo." },
      { k: "Documentación", v: "Una axonometría por edificio, con el sistema leído sobre la arquitectura." },
    ],
    ficha: [
      { k: "Tipo", v: "Infraestructura aeroportuaria" },
      { k: "Ubicación", v: "Antofagasta, Chile" },
      { k: "Especialidad", v: "Corrientes débiles" },
      { k: "Edificios", v: "16 del recinto aeroportuario" },
      { k: "Estado", v: "En desarrollo" },
    ],
    galeria: "Los 16 edificios del recinto",
    vistas: scfa,
  },
];
