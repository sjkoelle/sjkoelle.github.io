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
      if (project.year) {
        projectYear = `<div class="year">${project.year}</div>`;
      }
      let projectContent = `<div class="content">`;

      //   // Conditionally add authors

      // Conditionally add the title
      if (project.title) {
        projectContent += `<h3>${project.title}</h3>`;
      }

      // Conditionally add authors
      if (project.authors) {
        projectContent += `<h5>${project.authors}</h5>`;
      }

      // Conditionally add venue and year
      if (project.venue) {
        projectContent += `<p class="venue">for ${project.venue}</p>`;
      }

      // Close the content div
      projectContent += `</div>`;
      // Always add links container but only add links if they exist
      let linksContent = `<div class="links">`;

      if (project.pdfLink) {
        linksContent += `<a href="${project.pdfLink}" target="_blank" class="nested-link">PDF</a>`;
      }

      if (project.codeLink) {
        linksContent += `<a href="${project.codeLink}" target="_blank" class="nested-link">Code</a>`;
      }
      linksContent += `</div>`;

      projectElement.innerHTML = projectContent + linksContent + projectYear;

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
