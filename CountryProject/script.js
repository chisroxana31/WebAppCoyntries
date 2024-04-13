document.addEventListener("DOMContentLoaded", function () {
    const country1Select = document.getElementById("country1");
    const country2Select = document.getElementById("country2");
    const compareBtn = document.getElementById("compareBtn");
    const comparisonResult = document.getElementById("comparisonResult");
    const flag1 = document.getElementById("flag1");
    const flag2 = document.getElementById("flag2");

    // Fetch list of countries from REST Countries API
    fetch("https://restcountries.com/v3.1/all")
        .then(response => response.json())
        .then(data => {
            // Sort countries alphabetically by name
            data.sort((a, b) => a.name.common.localeCompare(b.name.common));

            // Add sorted countries to dropdown menus
            data.forEach(country => {
                const option1 = document.createElement("option");
                const option2 = document.createElement("option");
                option1.textContent = country.name.common;
                option1.setAttribute("data-flag", country.flags.png);
                option2.textContent = country.name.common;
                option2.setAttribute("data-flag", country.flags.png);
                country1Select.appendChild(option1);
                country2Select.appendChild(option2);
            });
        });

    // Event listener for the Compare button
    compareBtn.addEventListener("click", function () {
        if (country1Select.value === country2Select.value) {
            comparisonResult.innerHTML = `
          <div class="alert alert-danger" role="alert">
            Please select two different countries.
          </div>`;
            return;
        }

        // Fetch country data for selected countries
        Promise.all([
            fetch(`https://restcountries.com/v3.1/name/${country1Select.value}`),
            fetch(`https://restcountries.com/v3.1/name/${country2Select.value}`)
        ])
            .then(responses => Promise.all(responses.map(response => response.json())))
            .then(data => {
                const country1Data = data[0][0];
                const country2Data = data[1][0];

                // Set the flag URLs
                flag1.src = country1Data.flags.png;
                flag2.src = country2Data.flags.png;

                // Display comparison result
                comparisonResult.innerHTML = `
          <div class="alert alert-success" role="alert">
            <h3>${country1Data.name.common} vs ${country2Data.name.common}</h3>
            <p>Population: ${country1Data.population.toLocaleString()} vs ${country2Data.population.toLocaleString()}</p>
            <p>Area: ${country1Data.area.toLocaleString()} km² vs ${country2Data.area.toLocaleString()} km²</p>
            <p>Region: ${country1Data.region} vs ${country2Data.region}</p>
            <p>Capital: ${country1Data.capital} vs ${country2Data.capital}</p>
          </div>`;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                comparisonResult.innerHTML = `
          <div class="alert alert-danger" role="alert">
            An error occurred. Please try again.
          </div>`;
            });
    });
});
