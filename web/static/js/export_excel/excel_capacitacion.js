let mesExcel = ""

// Función para descargar el archivo Excel con los datos de capacitación
function descargarExcelCapacitacion(mes) {
  fetch(`/descargar-excel-capacitacion?mes=${mes}`) // Cambié la ruta para coincidir con el backend
    .then((response) => response.json())
    .then((data) => {
      const wb = XLSX.utils.book_new();
      const sheetData = [];
      const encabezados = [
        "División",
        "Solicitante",
        "Instructor",
        "Municipio",
        "Parroquia",
        "Fecha",
        "Hora",
        "Dirección",
        "Tipo de Procedimiento",
        "Dependencia",
        "Detalles",
        "Descripción",
        "Material Utilizado",
        "Status",
      ];

      // Agregar encabezados al arreglo de datos de la hoja
      sheetData.push(encabezados);

      // Procesar los datos recibidos para agregar cada fila a la hoja
      data.forEach((procedimiento) => {
        sheetData.push([
          procedimiento.division,
          procedimiento.solicitante,
          procedimiento.jefe_comision,
          procedimiento.municipio,
          procedimiento.parroquia,
          procedimiento.fecha,
          procedimiento.hora,
          procedimiento.direccion,
          procedimiento.tipo_procedimiento,
          procedimiento.dependencia,
          procedimiento.detalles,
          procedimiento.descripcion,
          procedimiento.material_utilizado,
          procedimiento.status,
        ]);
      });

      // Crear la hoja de trabajo y agregarla al libro
      const ws = XLSX.utils.aoa_to_sheet(sheetData);

      // Calcular el ancho máximo de cada columna
      const colWidths = sheetData[0].map((col, index) => {
        let maxLength = col ? col.toString().length : 0;
        sheetData.forEach((row) => {
          maxLength = Math.max(
            maxLength,
            row[index] ? row[index].toString().length : 0
          );
        });
        return { wch: maxLength + 2 }; // Agregamos un margen de 2 caracteres
      });

      // Asignar los anchos de columna calculados a la hoja
      ws["!cols"] = colWidths;

      // Agregar la hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, "Capacitación");

      // Descargar el archivo Excel
      XLSX.writeFile(wb, "Capacitacion.xlsx");
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
    });
}


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("mes_excel").addEventListener("change", function () {
    mesExcel = document.getElementById("mes_excel").value;

    if (this.value) {
      const boton = document.getElementById("exportarExcel");
      boton.removeAttribute("disabled");
      
      boton.addEventListener("click", function () {
        descargarExcelCapacitacion(mesExcel);
      });
    } else {
      document.getElementById("exportarExcel").setAttribute("disabled", true);
    }
  });
});
  
  