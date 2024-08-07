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

      let projectContent = `<div class="columns"><div class="content">`;

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
        projectContent += `<p class="venue">${project.venue}</p>`;
      }

      // Close the content div
      projectContent += `</div>`;
      if (project.year) {
        projectContent += `<div class="year">${project.year}</div></div>`;
      } else {
        projectContent += `</div>`;
      }
      // Always add links container but only add links if they exist
      let linksContent = `<div class="links">`;

      // Ensure the project.links array exists and has elements
      if (project.links && project.links.length) {
        project.links.forEach((link) => {
          // Append each link to linksContent
          if (link.url) {
            // Check if the url key exists
            linksContent += `<a href="${link.url}" target="_blank" class="nested-link">${link.name}</a>`;
          }
        });
      }

      linksContent += `</div>`;

      projectElement.innerHTML = projectContent + linksContent;

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

      // Simplified animation on hover
      projectElement.classList.add("simple-animation");
      projectElement.addEventListener("mouseenter", function () {
        this.style.transform = "scale(1.05)";
        this.style.transition = "transform 0.3s ease-in-out";
      });
      projectElement.addEventListener("mouseleave", function () {
        this.style.transform = "scale(1)";
      });

      container.appendChild(projectElement);
    });
  } catch (error) {
    console.error("Failed to load projects:", error);
  }
}

// Call the function when the document content is fully loaded
document.addEventListener("DOMContentLoaded", loadProjects);
