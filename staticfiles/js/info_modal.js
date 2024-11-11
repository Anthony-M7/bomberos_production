// Obtener elementos
const info_modal = document.getElementById("info_modal");

document.querySelectorAll(".button-info").forEach((button) => {
  button.onclick = function () {
    const id = this.getAttribute("data-id");
    const id_tipo_procedimiento = this.getAttribute("data-id_procedimiento");

    fetch(`/api/procedimientos/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        let baseInfo = "";
        let solicitante;
        if (data.solicitante_externo == "") {
          solicitante = data.solicitante;
        } else {
          solicitante = data.solicitante_externo;
        }
        let division = data.division;
        if (
          division == "Rescate" ||
          division == "Operaciones" ||
          division == "Prevencion" ||
          division == "GRUMAE" ||
          division == "PreHospitalaria"
        ) {
          baseInfo = ` 
              <article class="section-left">
                <section class="datos_division">
                  <h4>Division</h4>
                  <p><b>Division: </b> ${data.division}</p>
                  <p><b>ID Procedimiento: </b> #${data.id}</p>
                </section>
                <section class="datos_operacion">
                  <h4>Operacion</h4>
                  <p><b>Solicitante: </b> ${solicitante}</p>
                  <p><b>Jefe de Comision: </b> ${data.jefe_comision}</p>
                  <p><b>Unidad Enviada: </b> ${data.unidad}</p>
                  <p><b>Efectivos Enviados: </b> ${data.efectivos}</p>
                </section>
                <section class="datos_ubicacion">
                  <h4>Ubicacion</h4>
                  <p><b>Parroquia: </b> ${data.parroquia}</p>
                  <p><b>Municipio: </b> ${data.municipio}</p>
                  <p><b>Direccion: </b> ${data.direccion}</p>
                  <p><b>Fecha: </b> ${data.fecha}</p>
                  <p><b>Hora: </b> ${data.hora}</p>
                </section>`;
        }
        if (division == "Enfermeria") {
          baseInfo = ` 
              <article class="section-left">
                <section class="datos_division">
                  <h4>Division</h4>
                  <p><b>Division: </b> ${data.division}</p>
                  <p><b>ID Procedimiento: </b> #${data.id}</p>
                </section>
                <section class="datos_operacion">
                  <h4>Operacion</h4>
                  <p><b>Dependencia: </b> ${data.dependencia}</p>
                  <p><b>Jefe de Area: </b> ${solicitante}</p>
                </section>
                <section class="datos_ubicacion">
                  <h4>Ubicacion</h4>
                  <p><b>Parroquia: </b> ${data.parroquia}</p>
                  <p><b>Municipio: </b> ${data.municipio}</p>
                  <p><b>Direccion: </b> ${data.direccion}</p>
                  <p><b>Fecha: </b> ${data.fecha}</p>
                  <p><b>Hora: </b> ${data.hora}</p>
                </section>`;
        }
        if (division == "Servicios Medicos") {
          baseInfo = ` 
              <article class="section-left">
                <section class="datos_division">
                  <h4>Division</h4>
                  <p><b>Division: </b> ${data.division}</p>
                  <p><b>ID Procedimiento: </b> #${data.id}</p>
                </section>
                <section class="datos_operacion">
                  <h4>Operacion</h4>
                  <p><b>Tipo de Servicio: </b> ${data.tipo_servicio}</p>
                  <p><b>Jefe de Area: </b> ${solicitante}</p>
                </section>
                <section class="datos_ubicacion">
                  <h4>Ubicacion</h4>
                  <p><b>Parroquia: </b> ${data.parroquia}</p>
                  <p><b>Municipio: </b> ${data.municipio}</p>
                  <p><b>Direccion: </b> ${data.direccion}</p>
                  <p><b>Fecha: </b> ${data.fecha}</p>
                  <p><b>Hora: </b> ${data.hora}</p>
                </section>`;
        }
        if (division == "Psicologia") {
          baseInfo = ` 
              <article class="section-left">
                <section class="datos_division">
                  <h4>Division</h4>
                  <p><b>Division: </b> ${data.division}</p>
                  <p><b>ID Procedimiento: </b> #${data.id}</p>
                  <p><b>Jefe de Area: </b> ${solicitante}</p>
                </section>
                <section class="datos_ubicacion">
                  <h4>Ubicacion</h4>
                  <p><b>Parroquia: </b> ${data.parroquia}</p>
                  <p><b>Municipio: </b> ${data.municipio}</p>
                  <p><b>Direccion: </b> ${data.direccion}</p>
                  <p><b>Fecha: </b> ${data.fecha}</p>
                  <p><b>Hora: </b> ${data.hora}</p>
                </section>`;
        }
        if (division == "Capacitacion") {
          baseInfo = ` 
              <article class="section-left">
                <section class="datos_division">
                  <h4>Division</h4>
                  <p><b>Division: </b> ${data.division}</p>
                  <p><b>ID Procedimiento: </b> #${data.id}</p>
                </section>
                <section class="datos_operacion">
                  <h4>Operacion</h4>
                  <p><b>Solicitante: </b> ${solicitante}</p>
                  <p><b>Instructor: </b> ${data.jefe_comision}</p>
                  <p><b>Dependencia: </b> ${data.dependencia}</p>
                </section>
                <section class="datos_ubicacion">
                  <h4>Ubicacion</h4>
                  <p><b>Parroquia: </b> ${data.parroquia}</p>
                  <p><b>Municipio: </b> ${data.municipio}</p>
                  <p><b>Direccion: </b> ${data.direccion}</p>
                  <p><b>Fecha: </b> ${data.fecha}</p>
                  <p><b>Hora: </b> ${data.hora}</p>
                </section>`;
        }
        let detalles = "";

        // Estructura if-else para manejar cada tipo de procedimiento
        switch (id_tipo_procedimiento) {
          case "Abastecimiento de agua":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data, "ente_suministrado")}
                </section>
                <section>
                  <h4>Comunidad</h4>
                  <p><b>Personas Atendidas: </b> ${data.personas_atendidas}</p>
                  <p><b>Nombre Persona Presente: </b> ${data.nombres}</p>
                  <p><b>Apellidos Persona Presente: </b> ${data.apellidos}</p>
                  <p><b>Cedula Persona Presente: </b> ${data.cedula}</p>
                  <p><b>Litros de Agua Suministrada: </b> ${data.ltrs_agua} L</p>
                </section>`;
            break;
          case "Apoyo a Otras Unidades":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data, "tipo_apoyo", "unidad_apoyada")}
                </section>`;
            break;
          case "Guardia de Prevencion":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data, "motivo_prevencion")}
                </section>`;
            break;
          case "Atendido No Efectuado":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data)}
                </section> 
                `;
            break;
          case "Despliegue de Seguridad":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data, "motivo_despliegue")}
                </section>`;
            break;
          case "Falsa Alarma":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data, "motivo_alarma")}
                </section> 
                `;
            break;
          case "Atenciones Paramedicas":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  <p><b>Tipo de Procedimiento: </b> ${data.tipo_procedimiento}</p>
                  <p><b>Tipo de Atencion: </b> ${data.tipo_atencion}</p>
                `;
            if (data.emergencia) {
              detalles += `
                  </section>
                  <section class="detalles_procedimiento">
                    <h4>Atendido</h4>
                    <p><b>Nombres: </b> ${data.nombres}</p>
                    <p><b>Apellidos: </b> ${data.apellidos}</p>
                    <p><b>Cedula: </b> ${data.cedula}</p>
                    <p><b>Edad: </b> ${data.edad}</p>
                    <p><b>Sexo: </b> ${data.sexo}</p>
                  </section>
                  <section class="detalles_procedimiento">
                    <h4>Emergencia</h4>
                    <p><b>IDX: </b> ${data.idx}</p>
                    <p><b>Descripcion: </b> ${data.descripcion}</p>
                    <p><b>Material Utilizado: </b> ${data.material_utilizado}</p>
                    <p><b>Status: </b> ${data.status}</p>
                  </section>`;
              if (data.traslado) {
                detalles += `
                    <section class="detalles_procedimiento">
                      <h4>Traslado</h4>
                      <p><b>Hospital: </b> ${data.hospital}</p>
                      <p><b>Medico: </b> ${data.medico}</p>
                      <p><b>MPPS CMT: </b> ${data.mpps_cmt}</p>
                    </section>`;
              }
            }
            if (data.accidente) {
              detalles += `
                  <p><b>Tipo de Accidente: </b> ${data.tipo_accidente}</p>
                  <p><b>Cantidad Lesionados: </b> ${data.cantidad_lesionados}</p>
                  <p><b>Material Utilizado: </b> ${data.material_utilizado}</p>
                  <p><b>Status: </b> ${data.status}</p>
                </section>`;

              // Verificamos si hay vehículos
              if (data.vehiculos && data.vehiculos.length > 0) {
                data.vehiculos.forEach((vehiculo, index) => {
                  // Creamos una sección para cada vehículo
                  detalles += `
                      <section class="detalles_procedimiento">
                        <h4>Vehículo ${index + 1}</h4>
                        <p><b>Marca:</b> ${vehiculo.marca}</p>
                        <p><b>Modelo:</b> ${vehiculo.modelo}</p>
                        <p><b>Color:</b> ${vehiculo.color}</p>
                        <p><b>Año:</b> ${vehiculo.año}</p>
                        <p><b>Placa:</b> ${vehiculo.placas}</p>
                      </section>`;
                });
              } else {
              }

              // Verificamos si hay lesionados
              if (data.lesionados && data.lesionados.length > 0) {
                data.lesionados.forEach((lesionado, index) => {
                  // Creamos una sección para cada lesionado
                  detalles += `
                  <section class="detalles_lesionados">
                  <div>
                  <h4>Lesionado ${index + 1}</h4>
                  <p><b>Nombre:</b> ${lesionado.nombre}</p>
                  <p><b>Apellidos:</b> ${lesionado.apellidos}</p>
                  <p><b>Cedula:</b> ${lesionado.cedula}</p>
                  <p><b>Edad:</b> ${lesionado.edad}</p>
                  <p><b>Sexo:</b> ${lesionado.sexo}</p>
                  <p><b>Descripción:</b> ${lesionado.descripcion}</p>
                  </div>
                  `;
                  // Verificamos si el lesionado tiene traslados asociados
                  if (lesionado.traslados && lesionado.traslados.length > 0) {
                    lesionado.traslados.forEach((traslado, trasladoIndex) => {
                      // Añadimos una sub-sección para cada traslado
                      detalles += `
                      <div>
                      <h4>Traslado</h4>
                      <p><b>Hospital:</b> ${traslado.hospital}</p>
                      <p><b>Médico receptor:</b> ${traslado.medico}</p>
                      <p><b>MPPS CMT:</b> ${traslado.mpps_cmt}</p>
                      </div>
                        </section>`;
                    });
                  } else {
                    detalles += `</section>`;
                  }
                });
              } else {
              }
            }
            break;
          case "Servicios Especiales":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data, "tipo_servicio")}
                </section>`;
            break;
          case "Rescate":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  <p><b>Tipo de Procedimiento: </b> ${data.tipo_procedimiento}</p>
                  <p><b>Tipo de Rescate: </b> ${data.tipo_rescate}</p>
                  <p><b>Material Utilizado: </b> ${data.material_utilizado}</p>
                  <p><b>Status: </b> ${data.status}</p>
                </section>
                 `;
            if (data.tipo_rescate === "Rescate de Animal") {
              detalles += `
                   <section class="detalles_rescate_animal">
                     <h4>Animal</h4>
                     <p><b>Especie: </b> ${data.especie}</p>
                     <p><b>Descripcion: </b> ${data.descripcion}</p>
                   </section>
                   `;
            } else {
              detalles += `
                   <section class="detalles_rescate_persona">
                     <h4>Persona</h4>
                     <p><b>Nombre: </b> ${data.nombres}</p>
                     <p><b>Apellido: </b> ${data.apellidos}</p>
                     <p><b>Cedula: </b> ${data.cedula}</p>
                     <p><b>Edad: </b> ${data.edad}</p>
                     <p><b>Sexo: </b> ${data.sexo}</p>
                     <p><b>Descripcion: </b> ${data.descripcion}</p>
                   </section>`;
            }

            break;
          case "Incendios":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data, "tipo_incendio")}
                </section>
                ${
                  data.persona
                    ? `
                  <section class="detalles_persona_sitio">
                    <h4>Persona en el Sitio</h4>
                    <p><b>Nombre: </b> ${data.nombre}</p>
                    <p><b>Apellido: </b> ${data.apellidos}</p>
                    <p><b>Cedula: </b> ${data.cedula}</p>
                    <p><b>Edad: </b> ${data.edad}</p>
                  </section>`
                    : ""
                }
                ${
                  data.vehiculo
                    ? `
                  <section class="detalles_vehiculo">
                    <h4>Vehiculo</h4>
                    <p><b>Modelo: </b> ${data.modelo}</p>
                    <p><b>Marca: </b> ${data.marca}</p>
                    <p><b>Color: </b> ${data.color}</p>
                    <p><b>Año: </b> ${data.año}</p>
                    <p><b>Placas: </b> ${data.placas}</p>
                  </section>`
                    : ""
                }`;
            break;
          case "Fallecidos":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data, "motivo_fallecimiento")}
                </section>
                <section class="detalles_procedimiento">
                  <h4>Fallecido</h4>
                  <p><b>Nombre: </b> ${data.nombres}</p>
                  <p><b>Apellido: </b> ${data.apellidos}</p>
                  <p><b>Cedula: </b> ${data.cedula}</p>
                  <p><b>Edad: </b> ${data.edad}</p>
                  <p><b>Sexo: </b> ${data.sexo}</p>
                </section>`;
            break;
          case "Mitigación de Riesgos":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data, "tipo_servicio")}
                </section>`;
            break;
          case "Puesto de Avanzada":
            detalles = `
                        <section class="detalles_procedimiento">
                        <h4>Detalles</h4>
                        ${generateCommonDetails(data, "tipo_de_servicio")}
                        </section>`;
            break;
          case "Evaluación de Riesgos":
            if (data.tipo_estructura) {
              if (data.division == "Prevencion") {
                detalles = `
                <section class="detalles_procedimiento">
                <h4>Detalles</h4>
                ${generateCommonDetails(
                  data,
                  "tipo_de_evaluacion",
                  "tipo_estructura"
                )}
                </section>
                <section class="detalles_procedimiento">
                <h4>Persona Presente</h4>
                <p><b>Nombre: </b> ${data.nombre}</p>
                <p><b>Apellido: </b> ${data.apellido}</p>
                <p><b>Cedula: </b> ${data.cedula}</p>
                <p><b>Telefono: </b> ${data.telefono}</p>
                </section>`;
              } else {
                detalles = `
                <section class="detalles_procedimiento">
                <h4>Detalles</h4>
                ${generateCommonDetails(
                  data,
                  "tipo_de_evaluacion",
                  "tipo_estructura"
                )}
                </section>`;
              }
            } else {
              if (data.division == "Prevencion") {
                detalles = `
                  <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data, "tipo_de_evaluacion")}
                  </section>
                  <section class="detalles_procedimiento">
                  <h4>Persona Presente</h4>
                  <p><b>Nombre: </b> ${data.nombre}</p>
                  <p><b>Apellido: </b> ${data.apellido}</p>
                  <p><b>Cedula: </b> ${data.cedula}</p>
                  <p><b>Telefono: </b> ${data.telefono}</p>
                  </section>`;
              } else {
                detalles = `
                  <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data, "tipo_de_evaluacion")}
                  </section>`;
              }
            }
            break;
          case "Asesoramiento":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data)}
                </section>
                <section class="detalles_procedimiento">
                  <h4>Informacion del Comercio</h4>
                  <p><b>Nombre del Comercio: </b> ${data.nombre_comercio}</p>
                  <p><b>RIF del Comercio: </b> ${data.rif_comercio}</p>
                </section>
                <section class="detalles_procedimiento">
                  <h4>Persona Solicitante</h4>
                  <p><b>Nombre: </b> ${data.nombre}</p>
                  <p><b>Apellido: </b> ${data.apellido}</p>
                  <p><b>Cedula: </b> ${data.cedula}</p>
                  <p><b>Sexo: </b> ${data.sexo}</p>
                  <p><b>Telefono: </b> ${data.telefono}</p>
                </section>`;
            break;
          case "Inspeccion":
            switch (data.tipo_inspeccion) {
              case "Prevención":
                detalles += `
                  <section class="detalles_procedimiento">
                      <h4>Detalles</h4>
                      ${generateCommonDetails(data, "tipo_inspeccion")}
                  </section>
                  <section class="detalles_procedimiento">
                      <h4>Información del Comercio</h4>
                      <p><b>Nombre del Comercio: </b> ${data.nombre_comercio}</p>
                      <p><b>Propietario: </b> ${data.propietario}</p>
                      <p><b>Cédula del Propietario: </b> ${
                        data.cedula_propietario
                      }</p>
                  </section>
                  <section class="detalles_procedimiento">
                      <h4>Persona en el Sitio</h4>
                      <p><b>Nombre: </b> ${data.persona_sitio_nombre}</p>
                      <p><b>Apellido: </b> ${data.persona_sitio_apellido}</p>
                      <p><b>Cédula: </b> ${data.persona_sitio_cedula}</p>
                      <p><b>Teléfono: </b> ${data.persona_sitio_telefono}</p>
                  </section>`;
                break;

              case "Asesorias Tecnicas":
                detalles += `
                  <section class="detalles_procedimiento">
                      <h4>Detalles</h4>
                      ${generateCommonDetails(data, "tipo_inspeccion")}
                  </section>
                  <section class="detalles_procedimiento">
                      <h4>Información del Comercio</h4>
                      <p><b>Nombre del Comercio: </b> ${data.nombre_comercio}</p>
                      <p><b>Propietario: </b> ${data.propietario}</p>
                      <p><b>Cédula del Propietario: </b> ${
                        data.cedula_propietario
                      }</p>
                  </section>
                  <section class="detalles_procedimiento">
                      <h4>Persona en el Sitio</h4>
                      <p><b>Nombre: </b> ${data.persona_sitio_nombre}</p>
                      <p><b>Apellido: </b> ${data.persona_sitio_apellido}</p>
                      <p><b>Cédula: </b> ${data.persona_sitio_cedula}</p>
                      <p><b>Teléfono: </b> ${data.persona_sitio_telefono}</p>
                  </section>`;
                break;

              case "Habitabilidad":
                detalles += `
                  <section class="detalles_procedimiento">
                      <h4>Detalles</h4>
                      ${generateCommonDetails(data, "tipo_inspeccion")}
                  </section>
                  <section class="detalles_procedimiento">
                      <h4>Persona en el Sitio</h4>
                      <p><b>Nombre: </b> ${data.persona_sitio_nombre}</p>
                      <p><b>Apellido: </b> ${data.persona_sitio_apellido}</p>
                      <p><b>Cédula: </b> ${data.persona_sitio_cedula}</p>
                      <p><b>Teléfono: </b> ${data.persona_sitio_telefono}</p>
                  </section>`;
                break;

              case "Otros":
                detalles += `
                  <section class="detalles_procedimiento">
                      <h4>Procedimiento</h4>
                      <p><b>Tipo de Procedimiento: </b> ${data.tipo_procedimiento}</p>
                      <p><b>Tipo de Inspeccion: </b> ${data.tipo_inspeccion}</p>
                      <p><b>Especifique: </b> ${data.especifique}</p>
                    </section>
                    <section class="detalles_procedimiento">
                      <h4>Detalles</h4>
                      <p><b>Descripcion: </b> ${data.descripcion}</p>
                      <p><b>Materia Utilizado: </b> ${data.material_utilizado}</p>
                      <p><b>Status: </b> ${data.status}</p>
                  </section>
                  <section class="detalles_procedimiento">
                      <h4>Persona en el Sitio</h4>
                      <p><b>Nombre: </b> ${data.persona_sitio_nombre}</p>
                      <p><b>Apellido: </b> ${data.persona_sitio_apellido}</p>
                      <p><b>Cédula: </b> ${data.persona_sitio_cedula}</p>
                      <p><b>Teléfono: </b> ${data.persona_sitio_telefono}</p>
                  </section>`;
                break;

              case "Árbol":
                detalles += `
                  <section class="detalles_procedimiento">
                      <h4>Detalles</h4>
                      ${generateCommonDetails(data, "tipo_inspeccion")}
                  </section>
                  <section class="detalles_procedimiento">
                      <h4>Detalles del Árbol</h4>
                      <p><b>Especie: </b> ${data.especie}</p>
                      <p><b>Altura Aproximada: </b> ${data.altura_aprox}</p>
                      <p><b>Ubicación: </b> ${data.ubicacion_arbol}</p>
                  </section>
                  <section class="detalles_procedimiento">
                      <h4>Persona en el Sitio</h4>
                      <p><b>Nombre: </b> ${data.persona_sitio_nombre}</p>
                      <p><b>Apellido: </b> ${data.persona_sitio_apellido}</p>
                      <p><b>Cédula: </b> ${data.persona_sitio_cedula}</p>
                      <p><b>Teléfono: </b> ${data.persona_sitio_telefono}</p>
                  </section>`;
                break;

              default:
                detalles += `<p>No se encontraron detalles para este tipo de inspección.</p>`;
            }

            break;
          case "Investigacion":
              detalles = `
                <section class="detalles_procedimiento">
                    <h4>Informacion De Detalles</h4>
                    <p><b>Tipo de Procedimiento: </b> ${data.tipo_procedimiento}</p>
                    <p><b>Tipo de Investigacion: </b> ${data.tipo_investigacion}</p>
                    <p><b>Tipo Siniestro: </b> ${data.tipo_siniestro}</p>
                </section>
              `
              switch (data.tipo_siniestro){
                case "Vehiculo":
                    detalles += `
                        <section class="detalles_procedimiento">
                          <h4>Detalles del Vehículo</h4>
                          <p><b>Marca: </b> ${data.marca}</p>
                          <p><b>Modelo: </b> ${data.modelo}</p>
                          <p><b>Color: </b> ${data.color}</p>
                          <p><b>Placas: </b> ${data.placas}</p>
                          <p><b>Año: </b> ${data.año}</p>
                        </section>
                        <section class="detalles_procedimiento">
                          <h4>Información del Propietario</h4>
                          <p><b>Nombre: </b> ${data.nombre_propietario}</p>
                          <p><b>Apellido: </b> ${data.apellido_propietario}</p>
                          <p><b>Cedula: </b> ${data.cedula_propietario}</p>
                        </section>
                        <section class="detalles_procedimiento">
                          <h4>Descripción</h4>
                          <p><b>Descripcion: </b> ${data.descripcion}</p>
                          <p><b>Material Utilizado: </b> ${data.material_utilizado}</p>
                          <p><b>Status: </b> ${data.status}</p>
                        </section>`;
                    break;

                case "Comercio":
                    detalles += `
                        <section class="detalles_procedimiento">
                          <h4>Información del Comercio</h4>
                          <p><b>Nombre del Comercio: </b> ${data.nombre_comercio_investigacion}</p>
                          <p><b>RIF del Comercio: </b> ${data.rif_comercio_investigacion}</p>
                        </section>
                        <section class="detalles_procedimiento">
                          <h4>Información del Propietario</h4>
                          <p><b>Nombre: </b> ${data.nombre_propietario_comercio}</p>
                          <p><b>Apellido: </b> ${data.apellido_propietario_comercio}</p>
                          <p><b>Cedula: </b> ${data.cedula_propietario_comercio}</p>
                        </section>
                        <section class="detalles_procedimiento">
                          <h4>Descripción</h4>
                          <p><b>Descripcion: </b> ${data.descripcion_comercio}</p>
                          <p><b>Material Utilizado: </b> ${data.material_utilizado_comercio}</p>
                          <p><b>Status: </b> ${data.status_comercio}</p>
                        </section>`;
                    break;

                case "Estructura":
                    detalles += `
                        <section class="detalles_procedimiento">
                          <h4>Información</h4>
                          <p><b>Tipo de Estructura: </b> ${data.tipo_estructura}</p>
                          <p><b>Nombre: </b> ${data.nombre_propietario_estructura}</p>
                          <p><b>Apellido: </b> ${data.apellido_propietario_estructura}</p>
                          <p><b>Cedula: </b> ${data.cedula_propietario_estructura}</p>
                        </section>
                        <section class="detalles_procedimiento">
                          <h4>Descripción</h4>
                          <p><b>Descipcion: </b> ${data.descripcion_estructura}</p>
                          <p><b>Material Utilizado: </b> ${data.material_utilizado_estructura}</p>
                          <p><b>Status: </b> ${data.status_estructura}</p>
                        </section>`;
                    break;
                
                case "Vivienda":
                    detalles += `
                        <section class="detalles_procedimiento">
                          <h4>Información</h4>
                          <p><b>Tipo de Vivienda: </b> ${data.tipo_estructura}</p>
                          <p><b>Nombre: </b> ${data.nombre_propietario_estructura}</p>
                          <p><b>Apellido: </b> ${data.apellido_propietario_estructura}</p>
                          <p><b>Cedula: </b> ${data.cedula_propietario_estructura}</p>
                        </section>
                        <section class="detalles_procedimiento">
                          <h4>Descripción</h4>
                          <p><b>Descripcion: </b> ${data.descripcion_estructura}</p>
                          <p><b>Material Utilizado: </b> ${data.material_utilizado_estructura}</p>
                          <p><b>Status: </b> ${data.status_estructura}</p>
                        </section>`;
                    break;
                  }
                  break;
          case "Reinspeccion de Prevención":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data)}
                </section>
                <section class="detalles_procedimiento">
                  <h4>Informacion del Comercio</h4>
                  <p><b>Nombre del Comercio: </b> ${data.nombre_comercio}</p>
                  <p><b>Rif del Comercio: </b> ${data.rif_comercio}</p>
                </section>
                <section class="detalles_procedimiento">
                  <h4>Persona Solicitante</h4>
                  <p><b>Nombre: </b> ${data.nombre}</p>
                  <p><b>Apellido: </b> ${data.apellido}</p>
                  <p><b>Cedula: </b> ${data.cedula}</p>
                  <p><b>Sexo: </b> ${data.sexo}</p>
                  <p><b>Telefono: </b> ${data.telefono}</p>
                </section>`;
            break;
          case "Retención Preventiva":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data, "tipo_retencion")}
                </section>
                <section class="detalles_procedimiento">
                  <h4>Datos del Cilindro</h4>
                  <p><b>Tipo de Cilindro: </b> ${data.tipo_cilindro}</p>
                  <p><b>Capacidad: </b> ${data.capacidad} Kg</p>
                  <p><b>serial: </b> ${data.serial}</p>
                  <p><b>Numero de Constancia de Retencion: </b>#${
                    data.nro_constancia
                  }</p>
                </section>`;
            break;
          case "Traslados":
            detalles = `
                <section class="detalles_procedimiento">
                  <h4>Detalles</h4>
                  ${generateCommonDetails(data, "traslado")}
                </section>
                <section class="detalles_procedimiento">
                  <h4>Persona Trasladada</h4>
                  <p><b>Nombre: </b> ${data.nombre}</p>
                  <p><b>Apellido: </b> ${data.apellido}</p>
                  <p><b>Cedula: </b> ${data.cedula}</p>
                  <p><b>Edad: </b> ${data.edad}</p>
                  <p><b>Sexo: </b> ${data.sexo}</p>
                  <p><b>idx: </b> ${data.idx}</p>
                </section>
                <section class="detalles_procedimiento">
                  <h4>Hopsital De Traslado</h4>
                  <p><b>Hospital: </b> ${data.hospital}</p>
                  <p><b>Medico Receptor: </b> ${data.medico}</p>
                  <p><b>MPPS CMT: </b> ${data.mpps}</p>
                </section>`;
            break;
          case "Artificios Pirotécnicos":
            detalles = `
            <section class="detalles_procedimiento">
              <h4>Detalles</h4>
              <p><b>Tipo De Procedimiento: </b> ${data.tipo_procedimiento}</p>
              <p><b>Tipo de Procedimiento Por Artificio: </b> ${data.tipo_procedimiento_art}</p>
              <p><b>Nombre del Distribuidor: </b> ${data.nombre_comercio}</p>
              <p><b>RIF Del Distribuidor: </b> ${data.rif_comercio}</p>
            </section>`;

            if (
              data.tipo_procedimiento_art ===
              "Incendio por Artificio Pirotecnico"
            ) {
              detalles += `
              <section class="detalles_procedimiento">
                <h4>Informacion del Incendio</h4>
                <p><b>Tipo De Incendio: </b> ${data.tipo_incendio}</p>
                <p><b>Descripcion: </b> ${data.descripcion}</p>
                <p><b>Material Utilizado: </b> ${data.material_utilizado}</p>
                <p><b>Status: </b> ${data.status}</p>
              </section>`;
              if (data.person == true) {
                detalles += `
                <section class="detalles_procedimiento">
                  <h4>Persona Presente</h4>
                  <p><b>Nombre: </b> ${data.nombre}</p>
                  <p><b>Apellido: </b> ${data.apellidos}</p>
                  <p><b>Cedula: </b> ${data.cedula}</p>
                  <p><b>Edad: </b> ${data.edad}</p>
                </section>`;
              }
              if (data.carro == true) {
                detalles += `
                <section class="detalles_procedimiento">
                  <h4>Datos del Vehiculo</h4>
                  <p><b>Modelo: </b> ${data.modelo}</p>
                  <p><b>Marca: </b> ${data.marca}</p>
                  <p><b>Color: </b> ${data.color}</p>
                  <p><b>Año: </b> ${data.año}</p>
                  <p><b>Placas: </b> ${data.placas}</p>
                </section>`;
              }
            }
            if (
              data.tipo_procedimiento_art ===
              "Lesionado por Artificio Pirotecnico"
            ) {
              detalles += `
              <section class="detalles_procedimiento">
                <h4>Informacion del Lesionado</h4>
                <p><b>Nombre: </b> ${data.nombres}</p>
                <p><b>Apellido: </b> ${data.apellidos}</p>
                <p><b>Cedula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
              </section>
              <section class="detalles_procedimiento">
                <h4>Detalles Incidente</h4>
                <p><b>IDX: </b> ${data.idx}</p>
                <p><b>Descripcion: </b> ${data.descripcion}</p>
                <p><b>Status: </b> ${data.status}</p>
              </section>`;
            }
            if (
              data.tipo_procedimiento_art ===
              "Fallecido por Artificio Pirotecnico"
            ) {
              detalles += `
              <section class="detalles_procedimiento">
                <h4>Informacion del Fallecido</h4>
                <p><b>Motivo Fallcimiento: </b> ${data.motivo_fallecimiento}</p>
                <p><b>Nombre: </b> ${data.nombres}</p>
                <p><b>Apellido: </b> ${data.apellidos}</p>
                <p><b>Cedula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
              </section>
              <section class="detalles_procedimiento">
                <h4>Detalles Incidente</h4>
                <p><b>Descripcion: </b> ${data.descripcion}</p>
                <p><b>Material Utilizado: </b> ${data.material_utilizado}</p>
                <p><b>Status: </b> ${data.status}</p>
              </section>`;
            }
            break;
          case "Inspeccion Establecimiento por Artificios Pirotecnicos":
            detalles = `
            <section class="detalles_procedimiento">
              <h4>Detalles</h4>
              ${generateCommonDetails(data)}
            </section>
            <section class="detalles_procedimiento">
              <h4>Informacion del Comercio</h4>
              <p><b>Nombre del Comercio: </b> ${data.nombre_comercio}</p>
              <p><b>RIF del Comercio: </b> ${data.rif_comercio}</p>
            </section>
            <section class="detalles_procedimiento">
              <h4>Informacion del Encargado</h4>
              <p><b>Nombres: </b> ${data.encargado_nombre}</p>
              <p><b>Apellidos: </b> ${data.encargado_apellidos}</p>
              <p><b>Cedula: </b> ${data.encargado_cedula}</p>
              <p><b>Sexo: </b> ${data.encargado_sexo}</p>
            </section>`;
            break;
          case "Valoración Medica":
            detalles = `
            <section class="detalles_procedimiento">
              <h4>Detalles</h4>
              ${generateCommonDetails(data)}
            </section>
            <section class="detalles_procedimiento">
              <h4>Atendido</h4>
              <p><b>Nombres: </b> ${data.nombres}</p>
              <p><b>Apellidos: </b> ${data.apellidos}</p>
              <p><b>Cedula: </b> ${data.cedula}</p>
              <p><b>Edad: </b> ${data.edad}</p>
              <p><b>Sexo: </b> ${data.sexo}</p>
              <p><b>Telefono: </b> ${data.telefono}</p>
            </section>`;
            break;
          case "Jornada Medica":
            detalles = `
            <section class="detalles_procedimiento">
              <h4>Detalles</h4>
              ${generateCommonDetails(data)}
            </section>
            <section class="detalles_procedimiento">
              <h4>Atendido</h4>
              <p><b>Nombre de la Jornada: </b> ${data.nombre_jornada}</p>
              <p><b>Cantidad Personas Atendidas: </b> ${data.cant_personas}</p>
            </section>`;
            break;
          case "Administración de Tratamiento":
            detalles = `
              <section class="detalles_procedimiento">
                <h4>Detalles</h4>
                ${generateCommonDetails(data)}
              </section>
              <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
                <p><b>Teléfono: </b> ${data.telefono}</p>
              </section>`;
            break;
          case "Administración de Medicamentos":
            detalles = `
              <section class="detalles_procedimiento">
                <h4>Detalles</h4>
                ${generateCommonDetails(data)}
              </section>
              <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
                <p><b>Teléfono: </b> ${data.telefono}</p>
              </section>`;
            break;
          case "Aerosolterapia":
            detalles = `
              <section class="detalles_procedimiento">
                <h4>Detalles</h4>
                ${generateCommonDetails(data)}
              </section>
              <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
                <p><b>Teléfono: </b> ${data.telefono}</p>
              </section>`;
            break;
          case "Atención Local":
            detalles = `
              <section class="detalles_procedimiento">
                <h4>Detalles</h4>
                ${generateCommonDetails(data)}
              </section>
              <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
                <p><b>Teléfono: </b> ${data.telefono}</p>
              </section>`;
            break;
          case "Atención Prehospitalaria":
            detalles = `
              <section class="detalles_procedimiento">
                <h4>Detalles</h4>
                ${generateCommonDetails(data)}
              </section>
              <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
                <p><b>Teléfono: </b> ${data.telefono}</p>
              </section>`;
            break;
          case "Cuantificación de Presión Arterial":
            detalles = `
              <section class="detalles_procedimiento">
                <h4>Detalles</h4>
                ${generateCommonDetails(data)}
              </section>
              <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
                <p><b>Teléfono: </b> ${data.telefono}</p>
              </section>`;
            break;
          case "Cuantificación de Signos Vitales":
            detalles = `
              <section class="detalles_procedimiento">
                <h4>Detalles</h4>
                ${generateCommonDetails(data)}
              </section>
              <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
                <p><b>Teléfono: </b> ${data.telefono}</p>
              </section>`;
            break;
          case "Cura":
            detalles = `
              <section class="detalles_procedimiento">
                <h4>Detalles</h4>
                ${generateCommonDetails(data)}
              </section>
              <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
                <p><b>Teléfono: </b> ${data.telefono}</p>
              </section>`;
            break;
          case "Otro":
            detalles = `
              <section class="detalles_procedimiento">
                <h4>Detalles</h4>
                ${generateCommonDetails(data)}
              </section>
              <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
                <p><b>Teléfono: </b> ${data.telefono}</p>
              </section>`;
            break;
          case "Certificado de Salud Mental":
            detalles = `
               <section class="detalles_procedimiento">
               <h4>Detalles</h4>
                ${generateCommonDetails(data)}
               </section>
               <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
               </section>`;
            break;
          case "Consulta Bombero Activo":
            detalles = `
               <section class="detalles_procedimiento">
               <h4>Detalles</h4>
                ${generateCommonDetails(data)}
               </section>
               <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
               </section>`;
            break;
          case "Consulta Integrante Brigada Juvenil":
            detalles = `
               <section class="detalles_procedimiento">
               <h4>Detalles</h4>
                ${generateCommonDetails(data)}
               </section>
               <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
               </section>`;
            break;
          case "Consulta Paciente Externo":
            detalles = `
               <section class="detalles_procedimiento">
               <h4>Detalles</h4>
                ${generateCommonDetails(data)}
               </section>
               <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
               </section>`;
            break;
          case "Evaluación Psicológica Postvacacional":
            detalles = `
               <section class="detalles_procedimiento">
               <h4>Detalles</h4>
                ${generateCommonDetails(data)}
               </section>
               <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
               </section>`;
            break;
          case "Evaluación Psicológica Prevacacional":
            detalles = `
               <section class="detalles_procedimiento">
               <h4>Detalles</h4>
                ${generateCommonDetails(data)}
               </section>
               <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
               </section>`;
            break;
          case "Evaluación Personal Nuevo Ingreso":
            detalles = `
               <section class="detalles_procedimiento">
               <h4>Detalles</h4>
                ${generateCommonDetails(data)}
               </section>
               <section class="detalles_procedimiento">
                <h4>Atendido</h4>
                <p><b>Nombres: </b> ${data.nombres}</p>
                <p><b>Apellidos: </b> ${data.apellidos}</p>
                <p><b>Cédula: </b> ${data.cedula}</p>
                <p><b>Edad: </b> ${data.edad}</p>
                <p><b>Sexo: </b> ${data.sexo}</p>
               </section>`;
            break;
          case "Capacitación":
            if (data.dependencia === "Capacitacion") {
              detalles = `
              <section class="detalles_procedimiento">
              <h4>Capacitacion</h4>
              <p><b>Tipo de Capacitacion: </b> ${data.tipo_capacitacion}</p>
              <p><b>Clasificacion: </b> ${data.tipo_clasificacion}</p>
              <p><b>Personas Beneficiadas: </b> ${data.personas_beneficiadas}</p>
              </section>
              <section class="detalles_procedimiento">
              <h4>Detalles</h4>
              <p><b>Descripcion: </b> ${data.descripcion}</p>
              <p><b>Material Utilizado: </b> ${data.material_utilizado}</p>
              <p><b>Status: </b> ${data.status}</p>
              </section>`;
            }
            if (data.dependencia === "Frente Preventivo") {
              detalles = `
              <section class="detalles_procedimiento">
              <h4>Capacitacion</h4>
              <p><b>Nombre de la Actividad: </b> ${data.nombre_actividad}</p>
              <p><b>Estrategia: </b> ${data.estrategia}</p>
              <p><b>Personas Beneficiadas: </b> ${data.personas_beneficiadas}</p>
              </section>
              <section class="detalles_procedimiento">
              <h4>Detalles</h4>
              <p><b>Descripcion: </b> ${data.descripcion}</p>
              <p><b>Material Utilizado: </b> ${data.material_utilizado}</p>
              <p><b>Status: </b> ${data.status}</p>
              </section>`;
            }
            break;
          default:
            detalles = "<h2>Error: Tipo de Procedimiento no válido</h2>";
        }

        info_modal.innerHTML = baseInfo + detalles + "</article>";
      })
      .catch((error) => console.error("Error:", error));
  };
});

function generateCommonDetails(
  data,
  additionalField = "",
  additionalField2 = ""
) {
  return `
      <p><b>Tipo de Procedimiento: </b> ${data.tipo_procedimiento}</p>
      ${
        additionalField
          ? `<p><b>${additionalField
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}: </b> ${
              data[additionalField]
            }</p>`
          : ""
      }
      ${
        additionalField2
          ? `<p><b>${additionalField2
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}: </b> ${
              data[additionalField2]
            }</p>`
          : ""
      }
      <p><b>Descripcion: </b> ${data.descripcion}</p>
      <p><b>Material Utilizado: </b> ${data.material_utilizado}</p>
      <p><b>Status: </b> ${data.status}</p>
    `;
}
