document.getElementById("loadBtn").addEventListener("click", fetchDatasets);

async function fetchDatasets() {
  const status = document.getElementById("status");
  const tableBody = document.querySelector("#datasetsTable tbody");

  tableBody.innerHTML = "";
  status.textContent = "Ładowanie danych";

  const limit = 100;

  try {
    const response = await fetch(`http://localhost:5000/datasets?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Błąd pobierania: ${response.status}`);
    }

    const data = await response.json();
    const datasets = data.results || [];

    if (datasets.length === 0) {
      status.textContent = "Brak danych.";
      return;
    }

    const today = new Date();

    datasets.forEach((ds) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${ds.id ?? "-"}</td>
        <td>${ds.name ?? "-"}</td>
        <td>${ds.mindate ?? "-"}</td>
        <td>${ds.maxdate ?? "-"}</td>
      `;
      tableBody.appendChild(row);
    });

    status.textContent = `Załadowano ${datasets.length} datasetów.`;
  } catch (error) {
    console.error("Błąd:", error);
    status.textContent = "Wystąpił błąd podczas pobierania danych.";
  }
}
