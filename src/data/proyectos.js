import scfa from "./scfa.json";
import clinica from "./clinica.json";

// Un objeto por proyecto del portafolio. `vistas` son las láminas que genera
// tools/brandkit/laminas.js; `portada` es la ruta de la vista destacada.
export const proyectos = [
  {
    slug: "clinica",
    tag: "Salud",
    titulo: "Clínica y Centro Médico Dental",
    cliente: { nombre: "GITC", logo: "/clientes/gitc.png" },
    portada: "/proyectos/clinica/portada.webp",
    portadaPie: "Vista exterior noreste",
    parrafos: [
      "Modelamos la arquitectura y la estructura del edificio: catorce niveles, desde los ocho subterráneos hasta la cubierta, con recintos clínicos, mobiliario y equipamiento médico modelados pieza por pieza.",
    ],
    alcance: [
      { k: "Modelación", v: "Arquitectura y estructura del edificio, 14 niveles, con recintos clínicos, mobiliario y equipamiento médico." },
      { k: "Coordinación", v: "Arquitectura y estructura en modelos vinculados, revisados por nivel sobre el propio modelo." },
      { k: "Documentación", v: "Plantas, cortes, láminas de recinto y tablas de cantidades generadas desde el modelo." },
    ],
    ficha: [
      { k: "Tipo", v: "Edificio clínico y dental" },
      { k: "Especialidades", v: "Arquitectura + Estructura" },
      { k: "Niveles", v: "14, de subterráneo −8 a cubierta" },
      { k: "Estado", v: "En desarrollo" },
    ],
    galeria: "Cuatro láminas: exteriores y una planta por nivel",
    vistas: clinica,
  },
  {
    slug: "scfa",
    tag: "Aeropuerto",
    titulo: "Aeropuerto Andrés Sabella",
    cliente: { nombre: "IDOM", logo: "/clientes/idom.png" },
    portada: "/proyectos/scfa/portada.webp",
    portadaPie: "Terminal de pasajeros",
    parrafos: [
      "Modelamos y coordinamos el sistema de corrientes débiles de los dieciséis edificios del recinto: desde el terminal de pasajeros y la torre de control hasta las subestaciones, el complejo de carga y los puestos de control.",
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
    galeria: "Cuatro láminas con los 16 edificios del recinto",
    vistas: scfa,
  },
];
