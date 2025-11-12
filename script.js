document.getElementById("dataForm").addEventListener("submit", fetchData);

async function fetchData(event) {
  event.preventDefault();

  const status = document.getElementById("status");
  const tableBody = document.querySelector("#dataTable tbody");

  tableBody.innerHTML = "";
  status.textContent = "Ładowanie danych...";

  const datasetid = document.getElementById("datasetid").value.trim();
  const locationid = document.getElementById("locationid").value.trim();
  const startdate = document.getElementById("startdate").value;
  const enddate = document.getElementById("enddate").value;

  if (!datasetid || !locationid || !startdate || !enddate) {
    status.textContent = "Uzupełnij wszystkie pola w poprawnym formacie.";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/data?datasetid=${encodeURIComponent(datasetid)}&locationid=${encodeURIComponent(locationid)}&startdate=${startdate}&enddate=${enddate}`
    );

    if (!response.ok) {
      throw new Error(`Błąd pobierania: ${response.status}`);
    }

    const data = await response.json();
    const results = data.results || [];

    if (results.length === 0) {
      status.textContent = "Brak danych.";
      return;
    }

    results.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.date ?? "-"}</td>
        <td>${item.datatype ?? "-"}</td>
        <td>${item.value ?? "-"}</td>
      `;
      tableBody.appendChild(row);
    });

    status.textContent = `Załadowano ${results.length} rekordów.`;
  } catch (error) {
    console.error(error);
    status.textContent = "Wystąpił błąd podczas pobierania danych.";
  }
}
