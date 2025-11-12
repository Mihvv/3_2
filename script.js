document.getElementById("loadBtn").addEventListener("click", fetchStations);

async function fetchStations() {
  const status = document.getElementById("status");
  const tableBody = document.querySelector("#stationsTable tbody");

  tableBody.innerHTML = "";
  status.textContent = "Ładowanie danych...";

  try {
    const response = await fetch("http://localhost:5000/stations");

    if (!response.ok) {
      throw new Error(`Błąd pobierania: ${response.status}`);
    }

    const data = await response.json();

    const stations = data.results || [];

    if (stations.length === 0) {
      status.textContent = "Brak danych o stacjach.";
      return;
    }

    stations.forEach((station) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${station.id ?? "-"}</td>
        <td>${station.name ?? "-"}</td>
        <td>${station.latitude ?? "-"}</td>
        <td>${station.longitude ?? "-"}</td>
      `;
      tableBody.appendChild(row);
    });

    status.textContent = `Załadowano ${stations.length} stacji.`;
  } catch (error) {
    console.error("Błąd:", error);
    status.textContent = "Wystąpił błąd podczas pobierania danych.";
  }
}
