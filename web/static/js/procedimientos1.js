function eliminarOpciones(select_id, opc) {
  const select = document.getElementById(`${select_id}`);
  const opcionesAEliminar = [`${opc}`]; // Valores de las opciones a eliminar

  for (let i = select.options.length - 1; i >= 0; i--) {
      if (opcionesAEliminar.includes(select.options[i].value)) {
          select.remove(i);
      }
  }
}

eliminarOpciones("id_form2-solicitante", "4")
eliminarOpciones("id_form2-jefe_comision", "4")
eliminarOpciones("id_form2-jefe_comision", "0")

const opcionesPorCategoriaUnidad = {
  "": [{ value: "-", text: "Elige Una Division" }],
  // Rescate
  1: [
    { value: "16", text: "R-1 (Elevación)" },
  ],
  // Operaciones
  2: [
    { value: "5", text: "Supresión 01" },
    { value: "6", text: "Supresión 02" },
    { value: "7", text: "Supresión 03" },
    { value: "8", text: "Supresión 04" },
    { value: "9", text: "Cisterna 01" },
    { value: "10", text: "Cisterna 02" },
    { value: "11", text: "Cisterna 03" },
    { value: "12", text: "Moto 45" },
    { value: "13", text: "Moto 47" },
    { value: "14", text: "Logistica 31" },
    { value: "15", text: "Logistica 36" },
  ],
  // Grumae
  4: [
    { value: "17", text: "Lince 01" },
    { value: "18", text: "Lince 02" },
    { value: "19", text: "Lince 03" },
    { value: "20", text: "Lince 04" },
    { value: "21", text: "Lince 05" },
    { value: "22", text: "Lince 06" },
    { value: "23", text: "Lince 07" },
    { value: "24", text: "Lince 08" },
    { value: "25", text: "Lince 09" },
  ],
  // PreHospitalaria
  5: [
    { value: "2", text: "Alfa 1" },
    { value: "3", text: "Alfa 2" },
    { value: "4", text: "Alfa 3" },
    { value: "1", text: "Alfa 4" },
  ],
};

const selectOpciones_Unidad = document.getElementById("id_form1-opciones");
const selectUnidad = document.getElementById("id_form2-unidad");

// Función para actualizar las opciones del segundo select
function actualizarOpcionesUnidad() {
  hideAllForms();
  const selectedValueUnidad = selectOpciones_Unidad.value;

  // Limpia las opciones actuales del segundo select
  selectUnidad.innerHTML = "";

  // Si hay opciones para la categoría seleccionada, agrégalas
  if (opcionesPorCategoriaUnidad[selectedValueUnidad]) {
    // Agrega una opción predeterminada
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione una Opción";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectUnidad.appendChild(defaultOption);

    // Agrega las opciones correspondientes
    opcionesPorCategoriaUnidad[selectedValueUnidad].forEach((optionData) => {
      const optionElement = document.createElement("option");
      optionElement.value = optionData.value;
      optionElement.textContent = optionData.text;
      selectUnidad.appendChild(optionElement);
    });
  }
}

actualizarOpcionesUnidad();
// Evento cuando cambia el primer select
selectOpciones_Unidad.addEventListener("change", actualizarOpcionesUnidad);



function ocultElement(element) {
  document.getElementById(`${element}`).style.display = "none";
  document
    .getElementById(`${element}`)
    .querySelectorAll("input, select")
    .forEach((ele) => {
      ele.removeAttribute("required");
    });
}
function mostrarElement(element) {
  document.getElementById(`${element}`).style.display = "flex";
  document
    .getElementById(`${element}`)
    .querySelectorAll("input, select")
    .forEach((ele) => {
      ele.setAttribute("required", "true");
    });
}
function mostrarElementBlock(element) {
  document.getElementById(`${element}`).style.display = "block";
  document
    .getElementById(`${element}`)
    .querySelectorAll("input, select")
    .forEach((ele) => {
      ele.setAttribute("required", "true");
    });
}

document
  .getElementById("id_form1-opciones")
  .addEventListener("change", function () {
    switch (this.value) {
      case "1":
        // rescate
        ocultElement("capacitacion")
        ocultElement("form_enfermeria");
        mostrarElement("form_general");
        ocultElement("servicios_medicos");
        ocultElement("psicologia")
        mostrarElement("tipos_procedimientos_title")
        mostrarElement("tipos_procedimientos")
        document.getElementById("id_form2-unidad").parentElement.style.display = "flex"
        document.getElementById("id_form2-unidad").setAttribute("required", true)
        requiredFalse()
        break;
      case "2":
        // operaciones
        ocultElement("form_enfermeria");
        mostrarElement("form_general");
        ocultElement("servicios_medicos");
        ocultElement("psicologia")
        mostrarElement("tipos_procedimientos_title")
        mostrarElement("tipos_procedimientos")
        requiredFalse()
        document.getElementById("id_form2-unidad").parentElement.style.display = "flex"
        document.getElementById("id_form2-unidad").setAttribute("required", true)
        break;
      case "3":
        // Prevencion
        ocultElement("capacitacion")
        ocultElement("form_enfermeria");
        mostrarElement("form_general");
        ocultElement("servicios_medicos");
        ocultElement("psicologia")
        mostrarElement("tipos_procedimientos_title")
        mostrarElement("tipos_procedimientos")
        document.getElementById("id_form2-unidad").parentElement.style.display = "none"
        document.getElementById("id_form2-unidad").removeAttribute("required")
        requiredFalse()
        break;
      case "4":
        // Grumae
        ocultElement("capacitacion")
        ocultElement("form_enfermeria");
        mostrarElement("form_general");
        ocultElement("servicios_medicos");
        ocultElement("psicologia")
        mostrarElement("tipos_procedimientos_title")
        mostrarElement("tipos_procedimientos")
        document.getElementById("id_form2-unidad").parentElement.style.display = "flex"
        document.getElementById("id_form2-unidad").setAttribute("required", true)
        requiredFalse()
        break;
      case "5":
        // prehospitalaria
        ocultElement("capacitacion")
        ocultElement("form_enfermeria");
        ocultElement("servicios_medicos");
        ocultElement("psicologia")
        mostrarElement("form_general");
        mostrarElement("tipos_procedimientos_title")
        mostrarElement("tipos_procedimientos")
        document.getElementById("id_form2-unidad").parentElement.style.display = "flex"
        document.getElementById("id_form2-unidad").setAttribute("required", true)
        requiredFalse()
        break;
      case "6":
        // enfermeria
        ocultElement("capacitacion")
        ocultElement("form_general");
        ocultElement("servicios_medicos");
        mostrarElement("form_enfermeria");
        ocultElement("psicologia")
        mostrarElement("tipos_procedimientos")
        mostrarElement("tipos_procedimientos_title")
        document.getElementById("id_form4-tipo_procedimiento").parentElement.querySelector("label").textContent = "Tipo de Atencion"
        requiredFalse()
        break;
      case "7":
        // servicios Medicos
        ocultElement("form_general");
        ocultElement("form_enfermeria");
        mostrarElement("servicios_medicos")
        ocultElement("capacitacion")
        ocultElement("psicologia")
        mostrarElement("tipos_procedimientos")
        mostrarElement("tipos_procedimientos_title")
        requiredFalse()
        break;
      case "8":
        // psicologia
        ocultElement("form_general");
        ocultElement("form_enfermeria");
        ocultElement("servicios_medicos")
        ocultElement("capacitacion")
        mostrarElement("psicologia")
        mostrarElement("tipos_procedimientos")
        mostrarElement("tipos_procedimientos_title")
        requiredFalse()
        break;
      case "9":
        // capacitacion
        ocultElement("form_general");
        ocultElement("form_enfermeria");
        ocultElement("servicios_medicos")
        ocultElement("psicologia")
        ocultElement("tipos_procedimientos")
        ocultElement("tipos_procedimientos_title")
        mostrarElement("capacitacion")
        requiredFalse()
        let input_solicitante = document.getElementById("id_form_capacitacion-solicitante")
        let seleccion = document.getElementById("id_form_capacitacion-dependencia")
        
        document.getElementById("id_form_capacitacion-solicitante_externo").parentElement.style.display = "none"
        document.getElementById("id_form_capacitacion-solicitante_externo").removeAttribute("required")

        input_solicitante.addEventListener("change", function () {
          if (this.value === "0"){
            document.getElementById("id_form_capacitacion-solicitante_externo").parentElement.style.display = "flex"
            document.getElementById("id_form_capacitacion-solicitante_externo").setAttribute("required", "true")
          } else{
            document.getElementById("id_form_capacitacion-solicitante_externo").parentElement.style.display = "none"
            document.getElementById("id_form_capacitacion-solicitante_externo").removeAttribute("required")
          }
        })

        seleccion.addEventListener("change", function () {
          if (this.value === "Capacitacion") {
            mostrarElementBlock("detalles_capacitacion")
            ocultElement("detalles_frente_preventivo")
            document.getElementById("button_submit").style.display = "block";
            
          } else {
            mostrarElementBlock("detalles_frente_preventivo")
            ocultElement("detalles_capacitacion")
            document.getElementById("button_submit").style.display = "block";
          }
        })

        break;
    }
  });

// < !--Script para cambiar el menu desplegable de tipo de procedimiento segun la division-- >
// Define las opciones por categoría
var inputExterno = document.getElementById("id_form2-solicitante_externo");

// Luego selecciona el div que es el padre del input
var divContainer = inputExterno.parentElement;

// Ocultar el div
divContainer.style.display = "none";
inputExterno.removeAttribute("required");

document
  .getElementById("id_form2-solicitante")
  .addEventListener("change", function () {
    if (this.value == "0") {
      // Ajusta el valor de "1" según tu lógica
      divContainer.style.display = "flex";
      inputExterno.setAttribute("required", "required");
    } else {
      divContainer.style.display = "none"; // Ocultar solicitante_externo
      inputExterno.removeAttribute("required");
    }
  });

const opcionesPorCategoria = {
  "": [{ value: "-", text: "Elige Una Division" }],
  1: [
    { value: "2", text: "Apoyo a Otras Unidades" },
    { value: "3", text: "Guardia de Prevención" },
    { value: "6", text: "Falsa Alarma" },
    { value: "7", text: "Atenciones Paramedicas" },
    { value: "9", text: "Servicios Especiales" },
    { value: "10", text: "Rescate" },
    { value: "11", text: "Incendios" },
    { value: "13", text: "Mitigación de Riesgos" },
    { value: "14", text: "Evaluación de Riesgos" },
    { value: "15", text: "Puesto de Avanzada" },
    { value: "22", text: "Artificios Piroctenicos" },
  ],
  2: [
    { value: "1", text: "Abastecimiento de agua" },
    { value: "2", text: "Apoyo a Otras Unidades" },
    { value: "3", text: "Guardia de Prevención" },
    { value: "4", text: "Atendido No Efectuado" },
    { value: "5", text: "Despliegue de Seguridad" },
    { value: "6", text: "Falsa Alarma" },
    { value: "7", text: "Atenciones Paramedicas" },
    { value: "9", text: "Servicios Especiales" },
    { value: "10", text: "Rescate" },
    { value: "11", text: "Incendios" },
    { value: "12", text: "Fallecidos" },
    { value: "13", text: "Mitigación de Riesgos" },
    { value: "14", text: "Evaluación de Riesgos" },
    { value: "22", text: "Artificios Piroctenicos" },
  ],
  3: [
    { value: "14", text: "Evaluacion de Riesgos" },
    { value: "17", text: "Asesoramiento" },
    { value: "18", text: "Inspeccion" },
    { value: "19", text: "Investigacion" },
    { value: "20", text: "Reinspeccion de Prevencion" },
    { value: "21", text: "Retencion Preventiva" },
    {
      value: "23",
      text: "Inspeccion Establecimiento por Artificios Piroctenicos",
    },
  ],
  4: [
    { value: "1", text: "Abastecimiento de agua" },
    { value: "2", text: "Apoyo a Otras Unidades" },
    { value: "3", text: "Guardia de Prevención" },
    { value: "4", text: "Atendido No Efectuado" },
    { value: "6", text: "Falsa Alarma" },
    { value: "7", text: "Atenciones Paramedicas" },
    { value: "9", text: "Servicios Especiales" },
    { value: "10", text: "Rescate" },
    { value: "11", text: "Incendios" },
    { value: "12", text: "Fallecidos" },
    { value: "13", text: "Mitigación de Riesgos" },
    { value: "14", text: "Evaluación de Riesgos" },
    { value: "15", text: "Puesto de Avanzada" },
    { value: "22", text: "Artificios Piroctenicos" },
  ],
  5: [
    { value: "3", text: "Guardia de Prevención" },
    { value: "4", text: "Atendido No Efectuado" },
    { value: "6", text: "Falsa Alarma" },
    { value: "7", text: "Atenciones Paramedicas" },
    { value: "9", text: "Servicios Especiales" },
    { value: "12", text: "Fallecidos" },
    { value: "15", text: "Puesto de Avanzada" },
    { value: "16", text: "Traslados" },
  ],
  6: [
    { value: "29", text: "Atencion Local" },
    { value: "26", text: "Administración de Medicamentos" },
    { value: "30", text: "Atención Prehospitalaria" },
    { value: "31", text: "Cuantificación de Presion Arterial" },
    { value: "32", text: "Cuantificación de Signos Vitales" },
    { value: "33", text: "Cura" },
    { value: "27", text: "Administración de Tratamiento" },
    { value: "28", text: "Aerosolterapia" },
    { value: "34", text: "Otro" },
  ],
  7: [
    { value: "24", text: "Valoración Medica" },
    { value: "25", text: "Jornada Medica" },
  ],
  8: [{ value: "35", text: "Certificado de Salud Mental" },
      { value: "36", text: "Consulta Bombero Activo" },
      { value: "37", text: "Consulta Integrante Brigada Juvenil" },
      { value: "38", text: "Consulta Paciente Externo" },
      { value: "39", text: "Evaluacion Psicológica Postvacacional" },
      { value: "40", text: "Evaluacion Psicológica Prevacacional" },
      { value: "41", text: "Evaluacion Personal Nuevo Ingreso" },
  ],
  // Puedes agregar más categorías según sea necesario
};

const selectOpciones = document.getElementById("id_form1-opciones");
const selectTipoProcedimiento = document.getElementById(
  "id_form4-tipo_procedimiento"
);

// Función para actualizar las opciones del segundo select
function actualizarOpciones() {
  hideAllForms();
  const selectedValue = selectOpciones.value;

  // Limpia las opciones actuales del segundo select
  selectTipoProcedimiento.innerHTML = "";

  // Si hay opciones para la categoría seleccionada, agrégalas
  if (opcionesPorCategoria[selectedValue]) {
    // Agrega una opción predeterminada
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione una Opción";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectTipoProcedimiento.appendChild(defaultOption);

    // Agrega las opciones correspondientes
    opcionesPorCategoria[selectedValue].forEach((optionData) => {
      const optionElement = document.createElement("option");
      optionElement.value = optionData.value;
      optionElement.textContent = optionData.text;
      selectTipoProcedimiento.appendChild(optionElement);
    });
  }
}

actualizarOpciones();
// Evento cuando cambia el primer select
selectOpciones.addEventListener("change", actualizarOpciones);

function hideAllForms() {
  const forms = document.querySelectorAll(".disp-none");
  forms.forEach((form) => {
    form.style.display = "none";
  });
}

function requiredFalse() {
  const campos = document
    .getElementById("detalles-form")
    .querySelectorAll("select, input");
  campos.forEach((campo) => {
    campo.removeAttribute("required");
  });
}

function requiredExceptions(elements) {
  const campos = elements;
  campos.forEach((campo) => {
    campo.removeAttribute("required");
  });
}

// <!--Script para el manejo de formularios-- >
document
  .getElementById("id_form4-tipo_procedimiento")
  .addEventListener("change", function () {
    const elementsToHide = [
      "abast_agua",
      "apoyo_unid",
      "guard_prev",
      "atend_no_efect",
      "desp_seguridad",
      "falsa_alarm",
      "serv_especiales",
      "fallecidos",
      "rescate",
      "rescate_animal",
      "rescate_persona",
      "incendio_form",
      "persona_presente",
      "detalles_vehiculo",
      "atenciones_paramedicas",
      "emergencias_medicas",
      "traslados_emergencias",
      "accidentes_transito",
      "vehiculo_accidente",
      "otro_vehiculo_accidente",
      "otro_vehiculo_accidente2",
      "lesionado_accidente",
      "lesionado_accidente2",
      "lesionado_accidente3",
      "traslado_accidente",
      "traslado_accidente2",
      "traslado_accidente3",
      "evaluacion_riesgo",
      "mitigacion_riesgo",
      "puesto_avanzada",
      "traslados_prehospitalaria",
      "asesoramiento_form",
      "form_persona_presente",
      "reinspeccion_prevencion",
      "retencion_preventiva",
      "artificios_pirotecnico",
      "lesionados",
      "incendio_art",
      "fallecidos_art",
      "detalles_vehiculo_art",
      "persona_presente_art",
      "inspeccion_art_pir",
      "valoracion_medica",
      "detalles_enfermeria",
      "detalles_psicologia",
      "detalles_capacitacion",
      "detalles_frente_preventivo",
      "jornada_medica",
      "form_inpecciones",
      "form_inspecciones_prevencion",
      "form_inspecciones_habitabilidad",
      "form_inspecciones_arbol",
      "form_inspecciones_otros",
      "form_investigacion",
      "form_inv_vehiculo",
      "form_inv_comercio",
      "form_inv_estructura",
    ];

    const showElements = (elementsToShow) => {
      // Primero ocultamos todos los elementos, usando la clase 'non-visible'
      elementsToHide.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          element.style.display = "none";
        }
      });

      // Luego mostramos los elementos específicos, usando la clase 'visible'
      elementsToShow.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          element.style.display = "block";
        }
      });
    };

    let campos;
    switch (this.value) {
      case "1":
        requiredFalse();
        showElements(["abast_agua"]);
        campos = document
          .getElementById("abast_agua")
          .querySelectorAll("select, input");
        setRequired(campos, true); // Agregar required a la nueva sección
        document.getElementById("button_submit").style.display = "flex";
        break;
      case "2":
        requiredFalse();
        showElements(["apoyo_unid"]);
        campos = document
          .getElementById("apoyo_unid")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "3":
        requiredFalse();
        showElements(["guard_prev"]);
        campos = document
          .getElementById("guard_prev")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "4":
        requiredFalse();
        showElements(["atend_no_efect"]);
        campos = document
          .getElementById("atend_no_efect")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "5":
        requiredFalse();
        showElements(["desp_seguridad"]);
        campos = document
          .getElementById("desp_seguridad")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "6":
        requiredFalse();
        showElements(["falsa_alarm"]);
        campos = document
          .getElementById("falsa_alarm")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "7":
        requiredFalse();
        showElements(["atenciones_paramedicas"]);
        document.getElementById("button_submit").style.display = "none";

        // Obtener los campos de "atenciones_paramedicas"
        campos = document
          .getElementById("atenciones_paramedicas")
          .querySelectorAll("select, input");
        setRequired(campos, true); // Establecer required en true para los campos de la sección actual

        document
          .getElementById("id_atenciones_paramedicas-tipo_atencion")
          .addEventListener("change", function () {
            // Remover required de los campos de "atenciones_paramedicas" cuando se cambie la opción
            // setRequired(campos, false);

            if (this.value === "Emergencias Medicas") {
              requiredFalse();
              showElements(["atenciones_paramedicas", "emergencias_medicas"]);
              document.getElementById("button_submit").style.display = "block";

              // Obtener los campos de "emergencias_medicas" y establecer required
              let emergenciaCampos = document
                .getElementById("emergencias_medicas")
                .querySelectorAll("select, input");
              let accidentesTransito = document
                .getElementById("accidentes_transito")
                .querySelectorAll("select, input");
              let emergenciaCampos_no = document
                .getElementById("emergencias_medicas")
                .querySelectorAll("input[type='checkbox']");

              setRequired(emergenciaCampos, true);
              requiredExceptions(emergenciaCampos_no);
              requiredExceptions(accidentesTransito);

              document
                .getElementById("traslados_emergencias")
                .querySelectorAll("select, input")
                .forEach((ele) => {
                  ele.removeAttribute("required");
                });

              document
                .getElementById("id_emergencias_medicas-trasladado")
                .addEventListener("change", function () {
                  if (this.checked) {
                    document.getElementById(
                      "traslados_emergencias"
                    ).style.display = "block";
                    document
                      .getElementById("traslados_emergencias")
                      .querySelectorAll("select, input")
                      .forEach((ele) => {
                        ele.setAttribute("required", true);
                      });
                  } else {
                    document.getElementById(
                      "traslados_emergencias"
                    ).style.display = "none";
                    document
                      .getElementById("traslados_emergencias")
                      .querySelectorAll("select, input")
                      .forEach((ele) => {
                        ele.removeAttribute("required");
                      });
                  }
                });
            } else if (this.value === "Accidentes de Transito") {
              requiredFalse();
              showElements(["atenciones_paramedicas", "accidentes_transito"]);
              document.getElementById("button_submit").style.display = "block";

              // Obtener los campos de "accidentes_transito" y establecer required
              let accidenteCampos = document
                .getElementById("accidentes_transito")
                .querySelectorAll("select, input");
              let emergenciaCampos = document
                .getElementById("emergencias_medicas")
                .querySelectorAll("select, input");
              let accidenteCampos_no = document
                .getElementById("accidentes_transito")
                .querySelectorAll("input[type='checkbox']");

              setRequired(accidenteCampos, true);
              requiredExceptions(accidenteCampos_no);
              requiredExceptions(emergenciaCampos);

              requiredExceptions(
                document
                  .getElementById("vehiculo_accidente")
                  .querySelectorAll("select, input")
              );
              requiredExceptions(
                document
                  .getElementById("otro_vehiculo_accidente")
                  .querySelectorAll("select, input")
              );
              requiredExceptions(
                document
                  .getElementById("lesionado_accidente")
                  .querySelectorAll("select, input")
              );
              requiredExceptions(
                document
                  .getElementById("lesionado_accidente2")
                  .querySelectorAll("select, input")
              );
              requiredExceptions(
                document
                  .getElementById("lesionado_accidente3")
                  .querySelectorAll("select, input")
              );
              requiredExceptions(
                document
                  .getElementById("traslado_accidente")
                  .querySelectorAll("select, input")
              );
              requiredExceptions(
                document
                  .getElementById("traslado_accidente2")
                  .querySelectorAll("select, input")
              );
              requiredExceptions(
                document
                  .getElementById("traslado_accidente3")
                  .querySelectorAll("select, input")
              );
              requiredExceptions(
                document
                  .getElementById("otro_vehiculo_accidente2")
                  .querySelectorAll("select, input")
              );

              document
                .getElementById(
                  "id_formulario_accidentes_transito-agg_vehiculo"
                )
                .addEventListener("change", function () {
                  if (this.checked) {
                    document.getElementById(
                      "vehiculo_accidente"
                    ).style.display = "flex";

                    document
                      .getElementById("vehiculo_accidente")
                      .querySelectorAll("select, input")
                      .forEach((ele) => {
                        ele.setAttribute("required", true);
                      });

                    requiredExceptions(
                      document
                        .getElementById("accidentes_transito")
                        .querySelectorAll("input[type='checkbox']")
                    );
                  } else {
                    document.getElementById(
                      "vehiculo_accidente"
                    ).style.display = "none";
                    document
                      .getElementById("vehiculo_accidente")
                      .querySelectorAll("select, input")
                      .forEach((ele) => {
                        ele.removeAttribute("required");
                      });
                  }

                  document
                    .getElementById(
                      "id_detalles_vehiculos_accidentes-agg_vehiculo"
                    )
                    .addEventListener("change", function () {
                      if (this.checked) {
                        document
                          .getElementById("otro_vehiculo_accidente")
                          .querySelectorAll("select, input")
                          .forEach((ele) => {
                            ele.setAttribute("required", true);
                          });
                        document.getElementById(
                          "otro_vehiculo_accidente"
                        ).style.display = "flex";
                        requiredExceptions(
                          document
                            .getElementById("accidentes_transito")
                            .querySelectorAll("input[type='checkbox']")
                        );
                      } else {
                        document
                          .getElementById("otro_vehiculo_accidente")
                          .querySelectorAll("select, input")
                          .forEach((ele) => {
                            ele.removeAttribute("required");
                          });
                        document.getElementById(
                          "otro_vehiculo_accidente"
                        ).style.display = "none";
                      }
                    });
                  document
                    .getElementById(
                      "id_detalles_vehiculos_accidentes2-agg_vehiculo"
                    )
                    .addEventListener("change", function () {
                      if (this.checked) {
                        document
                          .getElementById("otro_vehiculo_accidente2")
                          .querySelectorAll("select, input")
                          .forEach((ele) => {
                            ele.setAttribute("required", true);
                          });
                        document.getElementById(
                          "otro_vehiculo_accidente2"
                        ).style.display = "flex";
                        requiredExceptions(
                          document
                            .getElementById("accidentes_transito")
                            .querySelectorAll("input[type='checkbox']")
                        );
                      } else {
                        document
                          .getElementById("otro_vehiculo_accidente2")
                          .querySelectorAll("select, input")
                          .forEach((ele) => {
                            ele.removeAttribute("required");
                          });
                        document.getElementById(
                          "otro_vehiculo_accidente2"
                        ).style.display = "none";
                      }
                    });
                });

              document
                .getElementById(
                  "id_formulario_accidentes_transito-agg_lesionado"
                )
                .addEventListener("change", function () {
                  if (this.checked) {
                    document
                      .getElementById("lesionado_accidente")
                      .querySelectorAll("select, input")
                      .forEach((ele) => {
                        ele.setAttribute("required", true);
                      });
                    document.getElementById(
                      "lesionado_accidente"
                    ).style.display = "flex";

                    requiredExceptions(
                      document
                        .getElementById("accidentes_transito")
                        .querySelectorAll("input[type='checkbox']")
                    );

                    document
                      .getElementById(
                        "id_detalles_lesionados_accidentes-otro_lesionado"
                      )
                      .addEventListener("change", function () {
                        if (this.checked) {
                          document
                            .getElementById("lesionado_accidente2")
                            .querySelectorAll("select, input")
                            .forEach((ele) => {
                              ele.setAttribute("required", true);
                            });
                          document.getElementById(
                            "lesionado_accidente2"
                          ).style.display = "flex";

                          requiredExceptions(
                            document
                              .getElementById("accidentes_transito")
                              .querySelectorAll("input[type='checkbox']")
                          );

                          document
                            .getElementById(
                              "id_detalles_lesionados_accidentes2-otro_lesionado"
                            )
                            .addEventListener("change", function () {
                              if (this.checked) {
                                document
                                  .getElementById("lesionado_accidente3")
                                  .querySelectorAll("select, input")
                                  .forEach((ele) => {
                                    ele.setAttribute("required", true);
                                  });
                                document.getElementById(
                                  "lesionado_accidente3"
                                ).style.display = "flex";
                                requiredExceptions(
                                  document
                                    .getElementById("accidentes_transito")
                                    .querySelectorAll("input[type='checkbox']")
                                );
                              } else {
                                document
                                  .getElementById("lesionado_accidente3")
                                  .querySelectorAll("select, input")
                                  .forEach((ele) => {
                                    ele.removeAttribute("required");
                                  });
                                document.getElementById(
                                  "lesionado_accidente3"
                                ).style.display = "none";
                              }
                            });

                          document
                            .getElementById(
                              "id_detalles_lesionados_accidentes3-trasladado"
                            )
                            .addEventListener("change", function () {
                              if (this.checked) {
                                document
                                  .getElementById("traslado_accidente3")
                                  .querySelectorAll("select, input")
                                  .forEach((ele) => {
                                    ele.setAttribute("required", true);
                                  });
                                document.getElementById(
                                  "traslado_accidente3"
                                ).style.display = "flex";
                                requiredExceptions(
                                  document
                                    .getElementById("accidentes_transito")
                                    .querySelectorAll("input[type='checkbox']")
                                );
                              } else {
                                document
                                  .getElementById("traslado_accidente3")
                                  .querySelectorAll("select, input")
                                  .forEach((ele) => {
                                    ele.removeAttribute("required");
                                  });
                                document.getElementById(
                                  "traslado_accidente3"
                                ).style.display = "none";
                              }
                            });
                        } else {
                          document
                            .getElementById("lesionado_accidente2")
                            .querySelectorAll("select, input")
                            .forEach((ele) => {
                              ele.removeAttribute("required");
                            });
                          document.getElementById(
                            "lesionado_accidente2"
                          ).style.display = "none";
                        }
                      });

                    document
                      .getElementById(
                        "id_detalles_lesionados_accidentes2-trasladado"
                      )
                      .addEventListener("change", function () {
                        if (this.checked) {
                          document
                            .getElementById("traslado_accidente2")
                            .querySelectorAll("select, input")
                            .forEach((ele) => {
                              ele.setAttribute("required", true);
                            });
                          requiredExceptions(
                            document
                              .getElementById("accidentes_transito")
                              .querySelectorAll("input[type='checkbox']")
                          );
                          document.getElementById(
                            "traslado_accidente2"
                          ).style.display = "flex";
                        } else {
                          document
                            .getElementById("traslado_accidente2")
                            .querySelectorAll("select, input")
                            .forEach((ele) => {
                              ele.removeAttribute("required");
                            });
                          document.getElementById(
                            "traslado_accidente2"
                          ).style.display = "none";
                        }
                      });
                  } else {
                    document
                      .getElementById("lesionado_accidente")
                      .querySelectorAll("select, input")
                      .forEach((ele) => {
                        ele.removeAttribute("required");
                      });
                    document.getElementById(
                      "lesionado_accidente"
                    ).style.display = "none";
                  }

                  document
                    .getElementById(
                      "id_detalles_lesionados_accidentes-trasladado"
                    )
                    .addEventListener("change", function () {
                      if (this.checked) {
                        document
                          .getElementById("traslado_accidente")
                          .querySelectorAll("select, input")
                          .forEach((ele) => {
                            ele.setAttribute("required", true);
                          });
                        document.getElementById(
                          "traslado_accidente"
                        ).style.display = "flex";
                        requiredExceptions(
                          document
                            .getElementById("accidentes_transito")
                            .querySelectorAll("input[type='checkbox']")
                        );
                      } else {
                        document
                          .getElementById("traslado_accidente")
                          .querySelectorAll("select, input")
                          .forEach((ele) => {
                            ele.removeAttribute("required");
                          });
                        document.getElementById(
                          "traslado_accidente"
                        ).style.display = "none";
                      }
                    });
                });
            }

            // // Al final, establecer required en true para los campos de la sección activa
            // campos = document.getElementById("atenciones_paramedicas").querySelectorAll("select, input");
            // setRequired(campos, true);
          });
        break;
      case "9":
        requiredFalse();
        showElements(["serv_especiales"]);
        campos = document
          .getElementById("serv_especiales")
          .querySelectorAll("select, input");
        setRequired(campos, true); // Agregar required a la nueva sección
        document.getElementById("button_submit").style.display = "block";
        break;
      case "10":
        requiredFalse();
        showElements(["rescate"]);
        campos = document
          .getElementById("rescate")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "none";
        document
          .getElementById("id_rescate_form-tipo_rescate")
          .addEventListener("change", function () {
            if (this.value == "1") {
              requiredExceptions(
                document
                  .getElementById("rescate_persona")
                  .querySelectorAll("select, input")
              );
              showElements(["rescate", "rescate_animal"]);
              let campos2 = document
                .getElementById("rescate_animal")
                .querySelectorAll("select, input");
              setRequired(campos2, true);
              document.getElementById("button_submit").style.display = "block";
            } else if (this.value != "1") {
              let rescate_persona = document
                .getElementById("rescate_persona")
                .querySelector("h4");
              let titulo = this.options[this.selectedIndex].text;
              // console.log(rescate_persona, titulo)
              rescate_persona.textContent = titulo;
              requiredExceptions(
                document
                  .getElementById("rescate_animal")
                  .querySelectorAll("select, input")
              );
              showElements(["rescate", "rescate_persona"]);
              let campos2 = document
                .getElementById("rescate_persona")
                .querySelectorAll("select, input");
              setRequired(campos2, true);
              document.getElementById("button_submit").style.display = "block";
            }
          });
        break;
      case "11":
        requiredFalse();
        showElements(["incendio_form"]);
        campos = document
          .getElementById("incendio_form")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        requiredExceptions(
          document
            .getElementById("detalles_vehiculo")
            .querySelectorAll("select, input")
        );
        requiredExceptions(
          document
            .getElementById("persona_presente")
            .querySelectorAll("select, input")
        );
        requiredExceptions(
          document
            .getElementById("incendio_form")
            .querySelectorAll("input[type='checkbox']")
        );

        document
          .getElementById("id_incendio_form-check_agregar_persona")
          .addEventListener("change", function () {
            if (this.checked) {
              let campo2 = document
                .getElementById("persona_presente")
                .querySelectorAll("select, input");
              setRequired(campo2, true);
              document.getElementById("persona_presente").style.display =
                "flex";
            } else {
              let campo2 = document
                .getElementById("persona_presente")
                .querySelectorAll("select, input");
              requiredExceptions(campo2);
              document.getElementById("persona_presente").style.display =
                "none";
            }
          });
        document
          .getElementById("id_incendio_form-tipo_incendio")
          .addEventListener("change", function () {
            if (this.value == "2") {
              let campo2 = document
                .getElementById("detalles_vehiculo")
                .querySelectorAll("select, input");
              setRequired(campo2, true);
              document.getElementById("detalles_vehiculo").style.display =
                "flex";
            } else {
              let campo2 = document
                .getElementById("detalles_vehiculo")
                .querySelectorAll("select, input");
              requiredExceptions(campo2);
              document.getElementById("detalles_vehiculo").style.display =
                "none";
            }
          });
        document.getElementById("button_submit").style.display = "block";
        break;
      case "12":
        requiredFalse();
        showElements(["fallecidos"]);
        campos = document
          .getElementById("fallecidos")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "13":
        requiredFalse();
        showElements(["mitigacion_riesgo"]);
        campos = document
          .getElementById("mitigacion_riesgo")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "14":
        let select_vivienda = document
          .getElementById("evaluacion_riesgo")
          .querySelector(".form-style > div:nth-of-type(2)");
        console.log(select_vivienda);
        select_vivienda.style.display = "none";
        requiredFalse();
        showElements(["evaluacion_riesgo"]);
        campos = document
          .getElementById("evaluacion_riesgo")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        let campos2 = document
          .getElementById("form_persona_presente")
          .querySelectorAll("select, input");

        document
          .getElementById("id_evaluacion_riesgo_form-tipo_riesgo")
          .addEventListener("change", function () {
            if (this.value === "1") {
              select_vivienda.style.display = "flex";
              select_vivienda.querySelector("select").value = ""; // Borra la selección
              let campos3 = select_vivienda.querySelectorAll("select, input");
              setRequired(campos3, "true");
            } else {
              select_vivienda.style.display = "none";
              select_vivienda.querySelector("select").value = ""; // Borra la selección
              requiredExceptions(
                select_vivienda.querySelectorAll("select, input")
              );
            }
          });

        query = document.getElementById("id_form1-opciones");
        if (query.value === "3") {
          showElements(["evaluacion_riesgo"]);
          setRequired(campos2, true);
          document.getElementById("form_persona_presente").style.display =
            "flex";
        } else {
          requiredExceptions(campos2);
        }
        break;
      case "15":
        requiredFalse();
        showElements(["puesto_avanzada"]);
        campos = document
          .getElementById("puesto_avanzada")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "16":
        requiredFalse();
        showElements(["traslados_prehospitalaria"]);
        campos = document
          .getElementById("traslados_prehospitalaria")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "17":
        requiredFalse();
        showElements(["asesoramiento_form"]);
        campos = document
          .getElementById("asesoramiento_form")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "18":
        requiredFalse();
        showElements(["form_inpecciones"]);
        campos = document
          .getElementById("form_inpecciones")
          .querySelectorAll("select, input");
        setRequired(campos, true);

        document.getElementById("id_form_inspecciones-tipo_inspeccion").addEventListener("change", function () {
          switch (this.value){
            case "Prevención":
              ocultElement("form_inspecciones_arbol")
              ocultElement("form_inspecciones_habitabilidad")
              ocultElement("form_inspecciones_otros")
              mostrarElementBlock("form_inspecciones_prevencion")
              document.getElementById("form_inspecciones_prevencion").querySelector("h4").textContent = "Inspeccion de Prevencion"
              document.getElementById("button_submit").style.display = "block";
              break;

            case "Árbol":
              ocultElement("form_inspecciones_prevencion")
              ocultElement("form_inspecciones_habitabilidad")
              ocultElement("form_inspecciones_otros")
              mostrarElementBlock("form_inspecciones_arbol")
              document.getElementById("form_inspecciones_arbol").querySelector("h4").textContent = "Inspeccion de Árbol"
              document.getElementById("button_submit").style.display = "block";
              break;

            case "Asesorias Tecnicas":
              ocultElement("form_inspecciones_arbol")
              ocultElement("form_inspecciones_habitabilidad")
              ocultElement("form_inspecciones_otros")
              mostrarElementBlock("form_inspecciones_prevencion")
              document.getElementById("form_inspecciones_prevencion").querySelector("h4").textContent = "Asesorias Tecnicas"
              document.getElementById("button_submit").style.display = "block";
              break;

            case "Habitabilidad":
              ocultElement("form_inspecciones_arbol")
              ocultElement("form_inspecciones_prevencion")
              ocultElement("form_inspecciones_otros")
              mostrarElementBlock("form_inspecciones_habitabilidad")
              document.getElementById("form_inspecciones_habitabilidad").querySelector("h4").textContent = "Inspeccion de Habitabilidad"
              document.getElementById("button_submit").style.display = "block";
              break;

            case "Otros":
              ocultElement("form_inspecciones_arbol")
              ocultElement("form_inspecciones_prevencion")
              ocultElement("form_inspecciones_habitabilidad")
              mostrarElementBlock("form_inspecciones_otros")
              document.getElementById("form_inspecciones_otros").querySelector("h4").textContent = "Inspecciones (Otros)"
              document.getElementById("button_submit").style.display = "block";
              break;

          }
        })
        
        break;
      case "19":
        requiredFalse();
        showElements(["form_investigacion"]);
        campos = document
          .getElementById("form_investigacion")
          .querySelectorAll("select, input");
        setRequired(campos, true);

        document.getElementById("id_form_investigacion-tipo_siniestro").addEventListener("change", function () {
          switch (this.value){
            case "Comercio":
              ocultElement("form_inv_vehiculo")
              ocultElement("form_inv_estructura")
              mostrarElementBlock("form_inv_comercio")
              document.getElementById("form_inv_comercio").querySelector("h4").textContent = "Investigacion Comercio"
              document.getElementById("button_submit").style.display = "block";
              break;

            case "Estructura":
              ocultElement("form_inv_vehiculo")
              ocultElement("form_inv_comercio")
              mostrarElementBlock("form_inv_estructura")
              document.getElementById("form_inv_estructura").querySelector("h4").textContent = "Investigacion de Estructura"
              document.getElementById("button_submit").style.display = "block";
              break;

            case "Vehiculo":
              ocultElement("form_inv_estructura")
              ocultElement("form_inv_comercio")
              mostrarElementBlock("form_inv_vehiculo")
              document.getElementById("form_inv_vehiculo").querySelector("h4").textContent = "Investigacion Vehiculo"
              document.getElementById("button_submit").style.display = "block";
              break;

            case "Vivienda":
              ocultElement("form_inv_vehiculo")
              ocultElement("form_inv_comercio")
              mostrarElementBlock("form_inv_estructura")
              document.getElementById("form_inv_estructura").querySelector("h4").textContent = "Investigacion de Vivienda"
              document.getElementById("button_submit").style.display = "block";
              break;
          }
        })
        
        break;
      case "20":
        requiredFalse();
        showElements(["reinspeccion_prevencion"]);
        campos = document
          .getElementById("reinspeccion_prevencion")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "21":
        requiredFalse();
        showElements(["retencion_preventiva"]);
        campos = document
          .getElementById("retencion_preventiva")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "22":
        requiredFalse();
        showElements(["artificios_pirotecnico"]);
        campos = document
          .getElementById("artificios_pirotecnico")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        requiredExceptions(
          document
            .getElementById("detalles_vehiculo_art")
            .querySelectorAll("select, input")
        );
        requiredExceptions(
          document
            .getElementById("persona_presente_art")
            .querySelectorAll("select, input")
        );
        document
          .getElementById("id_artificios_pirotecnico-tipo_procedimiento")
          .addEventListener("change", function () {
            switch (this.value) {
              case "1":
                showElements(["artificios_pirotecnico", "incendio_art"]);
                campos = document
                  .getElementById("incendio_art")
                  .querySelectorAll("select, input");
                setRequired(campos, true);
                requiredExceptions(
                  document
                    .getElementById("detalles_vehiculo_art")
                    .querySelectorAll("select, input")
                );
                requiredExceptions(
                  document
                    .getElementById("persona_presente_art")
                    .querySelectorAll("select, input")
                );
                requiredExceptions(
                  document
                    .getElementById("incendio_art")
                    .querySelectorAll("input[type='checkbox']")
                );

                requiredExceptions(
                  document
                    .getElementById("lesionados")
                    .querySelectorAll("select, input")
                );
                requiredExceptions(
                  document
                    .getElementById("fallecidos_art")
                    .querySelectorAll("select, input")
                );

                document
                  .getElementById("id_incendio_art-check_agregar_persona")
                  .addEventListener("change", function () {
                    if (this.checked) {
                      let campo2 = document
                        .getElementById("persona_presente_art")
                        .querySelectorAll("select, input");
                      setRequired(campo2, true);
                      document.getElementById(
                        "persona_presente_art"
                      ).style.display = "flex";
                    } else {
                      let campo2 = document
                        .getElementById("persona_presente_art")
                        .querySelectorAll("select, input");
                      requiredExceptions(campo2);
                      document.getElementById(
                        "persona_presente_art"
                      ).style.display = "none";
                    }
                  });
                document
                  .getElementById("id_incendio_art-tipo_incendio")
                  .addEventListener("change", function () {
                    if (this.value == "2") {
                      let campo2 = document
                        .getElementById("detalles_vehiculo_art")
                        .querySelectorAll("select, input");
                      setRequired(campo2, true);
                      document.getElementById(
                        "detalles_vehiculo_art"
                      ).style.display = "flex";
                    } else {
                      let campo2 = document
                        .getElementById("detalles_vehiculo_art")
                        .querySelectorAll("select, input");
                      requiredExceptions(campo2);
                      document.getElementById(
                        "detalles_vehiculo_art"
                      ).style.display = "none";
                    }
                  });
                document.getElementById("button_submit").style.display =
                  "block";
                break;
              case "2":
                showElements(["artificios_pirotecnico", "lesionados"]);
                campos = document
                  .getElementById("lesionados")
                  .querySelectorAll("select, input");
                setRequired(campos, true);
                requiredExceptions(
                  document
                    .getElementById("fallecidos_art")
                    .querySelectorAll("select, input")
                );
                requiredExceptions(
                  document
                    .getElementById("incendio_art")
                    .querySelectorAll("select, input")
                );
                console.log("Holaaa");
                document.getElementById("button_submit").style.display =
                  "block";
                break;
              case "3":
                showElements(["artificios_pirotecnico", "fallecidos_art"]);
                campos = document
                  .getElementById("fallecidos_art")
                  .querySelectorAll("select, input");
                setRequired(campos, true);
                requiredExceptions(
                  document
                    .getElementById("lesionados")
                    .querySelectorAll("select, input")
                );
                requiredExceptions(
                  document
                    .getElementById("incendio_art")
                    .querySelectorAll("select, input")
                );
                document.getElementById("button_submit").style.display =
                  "block";
                break;
            }
          });

        break;
      case "23":
        requiredFalse();
        showElements(["inspeccion_art_pir"]);
        campos = document
          .getElementById("inspeccion_art_pir")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        // requiredExceptions(document.getElementById("detalles_vehiculo_art").querySelectorAll("select, input"))
        // requiredExceptions(document.getElementById("persona_presente_art").querySelectorAll("select, input"))
        break;
      case "24":
        requiredFalse();
        showElements(["valoracion_medica"]);
        campos = document
          .getElementById("valoracion_medica")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "25":
        requiredFalse();
        showElements(["jornada_medica"]);
        campos = document
          .getElementById("jornada_medica")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("button_submit").style.display = "block";
        break;
      case "26":
        requiredFalse();
        showElements(["detalles_enfermeria"]);
        campos = document
          .getElementById("detalles_enfermeria")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_enfermeria").querySelector("h4").textContent = "Administración de Medicamentos"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "27":
        requiredFalse();
        showElements(["detalles_enfermeria"]);
        campos = document
          .getElementById("detalles_enfermeria")
          .querySelectorAll("select, input");
        setRequired(campos, true);
         document.getElementById("detalles_enfermeria").querySelector("h4").textContent = "Administración de Tratamientos"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "28":
        requiredFalse();
        showElements(["detalles_enfermeria"]);
        campos = document
          .getElementById("detalles_enfermeria")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_enfermeria").querySelector("h4").textContent = "Aerosolterapia"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "29":
        requiredFalse();
        showElements(["detalles_enfermeria"]);
        campos = document
          .getElementById("detalles_enfermeria")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_enfermeria").querySelector("h4").textContent = "Atención Local"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "30":
        requiredFalse();
        showElements(["detalles_enfermeria"]);
        campos = document
          .getElementById("detalles_enfermeria")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_enfermeria").querySelector("h4").textContent = "Atención Prehospitalaria"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "31":
        requiredFalse();
        showElements(["detalles_enfermeria"]);
        campos = document
          .getElementById("detalles_enfermeria")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_enfermeria").querySelector("h4").textContent = "Cuantificación de Presión Arterial"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "32":
        requiredFalse();
        showElements(["detalles_enfermeria"]);
        campos = document
          .getElementById("detalles_enfermeria")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_enfermeria").querySelector("h4").textContent = "Cuantificación de Signos Vitales"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "33":
        requiredFalse();
        showElements(["detalles_enfermeria"]);
        campos = document
          .getElementById("detalles_enfermeria")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_enfermeria").querySelector("h4").textContent = "Cura"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "34":
        requiredFalse();
        showElements(["detalles_enfermeria"]);
        campos = document
          .getElementById("detalles_enfermeria")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_enfermeria").querySelector("h4").textContent = "Otro"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "35":
        requiredFalse();
        showElements(["detalles_psicologia"]);
        campos = document
          .getElementById("detalles_psicologia")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_psicologia").querySelector("h4").textContent = "Certificado de Salud Mental"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "36":
        requiredFalse();
        showElements(["detalles_psicologia"]);
        campos = document
          .getElementById("detalles_psicologia")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_psicologia").querySelector("h4").textContent = "Consulta Bombero Activo"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "37":
        requiredFalse();
        showElements(["detalles_psicologia"]);
        campos = document
          .getElementById("detalles_psicologia")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_psicologia").querySelector("h4").textContent = "Consulta Integrante Brigada Juvenil"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "38":
        requiredFalse();
        showElements(["detalles_psicologia"]);
        campos = document
          .getElementById("detalles_psicologia")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_psicologia").querySelector("h4").textContent = "Consulta Paciente Externo"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "39":
        requiredFalse();
        showElements(["detalles_psicologia"]);
        campos = document
          .getElementById("detalles_psicologia")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_psicologia").querySelector("h4").textContent = "Evaluacion Psicologica Postvacacional"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "40":
        requiredFalse();
        showElements(["detalles_psicologia"]);
        campos = document
          .getElementById("detalles_psicologia")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_psicologia").querySelector("h4").textContent = "Evaluacion Psicologica Prevacacional"
        document.getElementById("button_submit").style.display = "block";
        break;
      case "41":
        requiredFalse();
        showElements(["detalles_psicologia"]);
        campos = document
          .getElementById("detalles_psicologia")
          .querySelectorAll("select, input");
        setRequired(campos, true);
        document.getElementById("detalles_psicologia").querySelector("h4").textContent = "Evaluacion Personal Nuevo Ingreso"
        document.getElementById("button_submit").style.display = "block";
        break;
      default:
        elementsToHide.forEach((id) => {
          document.getElementById(id).style.display = "none";
          campos = document
            .getElementById(id)
            .querySelectorAll("select, input");
          setRequired(campos, false); // Remover required de los campos ocultos
        });
        break;
    }

    // Función para establecer el atributo required
    function setRequired(campos, isRequired) {
      campos.forEach((campo) => {
        if (isRequired) {
          campo.setAttribute("required", true);
        } else {
          campo.removeAttribute("required");
        }
      });
    }
  });

{
  /* <!--select input validation-- > */
}
document
  .getElementById("id_form3-municipio")
  .addEventListener("change", function () {
    var select2 = document.getElementById("id_form3-parroquia");

    if (this.value !== "1") {
      select2.disabled = true;
      select2.setAttribute("required", "required"); // Agrega el atributo `required`
    } else {
      select2.disabled = false;
      select2.removeAttribute("required"); // Elimina el atributo `required`
    }
  });

{
  /* <!--desactivar primera casilla de select-- > */
}

document.addEventListener("DOMContentLoaded", function () {
  const selects = document.querySelectorAll(".disable-first-option");
  selects.forEach((select) => {
    select.options[0].disabled = true;
  });
});

// Selecciona todos los inputs de tipo checkbox
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Agrega la clase 'checkbox-styles' a cada uno de ellos
checkboxes.forEach((checkbox) => {
  checkbox.classList.add("checkbox-styles");

  // Selecciona el contenedor padre del checkbox
  const parent = checkbox.parentElement; // Cambia esto si el contenedor no es el padre directo
  parent.classList.add("flex-row"); // Agrega la clase para aplicar los estilos deseados
});
