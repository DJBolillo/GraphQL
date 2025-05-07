const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

let tareas = [];
let idActual = 1;

// Esquema GraphQL
const schema = buildSchema(`
  type Tarea {
    id: ID!
    titulo: String!
    completado: Boolean!
  }

  type Query {
    obtenerTareas: [Tarea]
    obtenerTarea(id: ID!): Tarea
  }

  type Mutation {
    crearTarea(titulo: String!): Tarea
    actualizarTarea(id: ID!, titulo: String, completado: Boolean): Tarea
    eliminarTarea(id: ID!): Boolean
  }
`);

// Resolvers
const root = {
  obtenerTareas: () => tareas,
  obtenerTarea: ({ id }) => tareas.find(t => t.id === id),
  crearTarea: ({ titulo }) => {
    const nuevaTarea = { id: String(idActual++), titulo, completado: false };
    tareas.push(nuevaTarea);
    return nuevaTarea;
  },
  actualizarTarea: ({ id, titulo, completado }) => {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) throw new Error("Tarea no encontrada");
    if (titulo !== undefined) tarea.titulo = titulo;
    if (completado !== undefined) tarea.completado = completado;
    return tarea;
  },
  eliminarTarea: ({ id }) => {
    const index = tareas.findIndex(t => t.id === id);
    if (index === -1) return false;
    tareas.splice(index, 1);
    return true;
  }
};

// Servidor Express
const app = express();
app.use("/graphql", graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true, // Interfaz web para probar consultas
}));

app.listen(4000, () => console.log("Servidor GraphQL en http://localhost:4000/graphql"));
