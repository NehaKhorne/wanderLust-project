(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    });
    document.getElementById("search-form").addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent page reload

      const searchQuery = document.getElementById("search-box").value.trim();

      if (searchQuery === "") return; // Don't search if input is empty

      try {
          const response = await fetch(`/listings?search=${searchQuery}`);
          const listings = await response.json();
          
          const container = document.getElementById("listings-container");
          container.innerHTML = ""; // Clear previous results

          if (listings.length === 0) {
              container.innerHTML = "<p>No results found.</p>";
              return;
          }

          listings.forEach(listing => {
              const div = document.createElement("div");
              div.classList.add("listing");
              div.innerHTML = `<h3>${listing.title}</h3><p>${listing.location}</p>`;
              container.appendChild(div);
          });

      } catch (error) {
          console.error("Error fetching search results:", error);
      }
  });
  })();