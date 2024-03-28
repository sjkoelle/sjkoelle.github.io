document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".customLinkContainer").forEach((container) => {
    const title = container.getAttribute("data-title");
    const url = container.getAttribute("data-url");
    const pdfLink = container.getAttribute("data-pdf-link");
    const codeLink = container.getAttribute("data-code-link");

    container.innerHTML = `<h3>${title}</h3>
                               <a href="${url}" target="_blank">Visit</a> 
                               <a href="${pdfLink}" target="_blank">PDF</a> 
                               <a href="${codeLink}" target="_blank">Code</a>`;
  });
});
