// Rubros en que se divide la sección de proyectos, en el orden en que se muestran.
// `id` es la clave que usan src/data/proyectos.js y src/data/experiencia.js.
//
// Un rubro sin ningún proyecto asignado NO se dibuja en la página: para abrir uno
// basta con etiquetar proyectos con su id. "paisajismo" está declarado y vacío a
// propósito, esperando los primeros encargos del rubro.
export const categorias = [
  { id: "hospitalaria", titulo: "Infraestructura hospitalaria" },
  { id: "aeroportuaria", titulo: "Infraestructura aeroportuaria" },
  { id: "vivienda", titulo: "Vivienda" },
  { id: "paisajismo", titulo: "Paisajismo y contexto" },
  { id: "otros", titulo: "Otros equipamientos e infraestructura" },
];
