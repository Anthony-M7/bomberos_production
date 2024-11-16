// Información de estaciones
const stations = {
  0: {
    address:
      "QQ9P+9C8, Av. 19 de Abril, San Cristóbal 5001, Táchira, Venezuela",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d494.150335348621!2d-72.21435923777214!3d7.768319283748523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e666cbf9c23cba1%3A0xb510c881c0b32597!2sCuerpo%20de%20Bomberos%20de%20San%20Crist%C3%B3bal!5e0!3m2!1ses-419!2sus!4v1731684840657!5m2!1ses-419!2sus",
  },
  1: {
    address: "PQX7+5CF, San Cristóbal 5001, Táchira, Venezuela",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d494.17427373401506!2d-72.23660161060488!3d7.747946626524347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6614aa78b16275%3A0x70d3838611fe538c!2sSud%20Estaci%C3%B3n%20De%20Bomberos%20El%20Terminal!5e0!3m2!1ses-419!2sus!4v1731687969643!5m2!1ses-419!2sus",
  },
  2: {
    address: "Avenida Siempre Viva, Ciudad B",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151!2d-0.123!3d51.503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d3453453453453%3A0x23423423423423!2sLondres!5e0!3m2!1ses!2suk!4v0987654321",
  },
  3: {
    address: "Plaza Central, Ciudad C",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151!2d-74.006!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x000000000000000!2sNew+York!5e0!3m2!1ses!2sus!4v1122334455",
  },
};

// Elementos DOM
const select = document.getElementById("stationSelect");
const addressSpan = document.getElementById("stationAddress");
const mapIframe = document.getElementById("mapIframe");
mapIframe.src =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d494.150335348621!2d-72.21435923777214!3d7.768319283748523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e666cbf9c23cba1%3A0xb510c881c0b32597!2sCuerpo%20de%20Bomberos%20de%20San%20Crist%C3%B3bal!5e0!3m2!1ses-419!2sus!4v1731684840657!5m2!1ses-419!2sus";
addressSpan.textContent =
  "QQ9P+9C8, Av. 19 de Abril, San Cristóbal 5001, Táchira, Venezuela";

// Evento para cambiar de estación
select.addEventListener("change", (event) => {
  const stationId = event.target.value;
  if (stations[stationId]) {
    const { address, map } = stations[stationId];
    addressSpan.textContent = address;
    mapIframe.src = map;
  }
});