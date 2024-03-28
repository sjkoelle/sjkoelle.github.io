async function loadProjects() {
  try {
    const response = await fetch("projects.json");
    const projects = await response.json();

    const container = document.getElementById("projects-container");
    if (!container) {
      console.error("Container for projects not found");
      return; // Stop execution if container isn't found
    }

    projects.forEach((project) => {
      const projectElement = document.createElement("div");

      projectElement.classList.add("customLinkContainer");
      projectElement.innerHTML = `
	  	  <div class="year">${project.year}</div> 
		  <h3>${project.title}</h3>
		  <p class="authors">${project.authors}</p>
		  <p class="venue">${project.venue}</p>
		  <div class="links">
		  <a href="${project.pdfLink}" target="_blank" class="nested-link">PDF</a> 
		  <a href="${project.codeLink}" target="_blank" class="nested-link">Code</a>
		  </div>
		  `;

      // Add event listener for the entire container to open PDF in a new tab
      projectElement.addEventListener("click", () => {
        window.open(project.url, "_blank");
      });

      // Prevent link click from bubbling up to the container's click event
      projectElement.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (e) => e.stopPropagation());
      });
      document.querySelectorAll(".customLinkContainer a").forEach((link) => {
        // Mouse enters the link, remove hover effect from parent
        link.addEventListener("mouseenter", function () {
          this.parentNode.classList.add("child-hovered");
        });

        // Mouse leaves the link, re-add hover effect to parent
        link.addEventListener("mouseleave", function () {
          this.parentNode.classList.remove("child-hovered");
        });
      });
      container.appendChild(projectElement);
    });
  } catch (error) {
    console.error("Failed to load projects:", error);
  }
}

// Call the function when the document content is fully loaded
document.addEventListener("DOMContentLoaded", loadProjects);
