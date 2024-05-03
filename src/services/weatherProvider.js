function parseAPIData(apiData) {
  const timestamps = apiData.map(item => {
    const date = new Date(item.payload.timestamp);

    // Ensuring two-digit representation for hours, minutes, and seconds
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  });
  const temperatures = apiData.map(item => item.payload.temperature.toFixed(2));
  const humidities = apiData.map(item => item.payload.humidity.toFixed(2));
  const pressures = apiData.map(item => item.payload.pressure.toFixed(2));
  return { timestamps, temperatures, humidities, pressures };
}

export async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const data = await response.json();

    const parsedData = parseAPIData(data);

    return parsedData;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

