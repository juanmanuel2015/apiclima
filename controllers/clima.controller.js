const mostrarInicio = (req, res) => {
  res.render("index", { error: null });
};

const buscarClima = async (req, res) => {
  try {
    const ciudad = req.body.ciudad;

    if (!ciudad || ciudad.trim() === "") {
      return res.render("index", {
        error: "Por favor, ingresá una ciudad."
      });
    }

    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es&format=json`;

    const respuestaGeo = await fetch(urlGeo);
    const datosGeo = await respuestaGeo.json();

    if (!datosGeo.results || datosGeo.results.length === 0) {
      return res.render("index", {
        error: "No se encontró la ciudad."
      });
    }

    const lugar = datosGeo.results[0];

    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${lugar.latitude}&longitude=${lugar.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,pressure_msl,weather_code&timezone=auto`;

    const respuestaClima = await fetch(urlClima);
    const datosClima = await respuestaClima.json();

    const clima = {
      ciudad: lugar.name,
      pais: lugar.country,
      provincia: lugar.admin1,
      temperatura: Math.round(datosClima.current.temperature_2m),
      humedad: datosClima.current.relative_humidity_2m,
      viento: datosClima.current.wind_speed_10m,
      presion: Math.round(datosClima.current.pressure_msl),
      codigo: datosClima.current.weather_code,
      fecha: datosClima.current.time,
      descripcion: obtenerDescripcionClima(datosClima.current.weather_code)
    };

    res.render("clima", { clima });
  } catch (error) {
    console.error(error);
    res.render("index", {
      error: "Ocurrió un error al consultar la API pública."
    });
  }
};

function obtenerDescripcionClima(codigo) {
  const codigos = {
    0: "Cielo despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna débil",
    53: "Llovizna moderada",
    55: "Llovizna intensa",
    61: "Lluvia débil",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    80: "Chubascos débiles",
    81: "Chubascos moderados",
    82: "Chubascos fuertes",
    95: "Tormenta"
  };

  return codigos[codigo] || "Condición climática";
}

module.exports = {
  mostrarInicio,
  buscarClima
};