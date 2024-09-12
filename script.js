let jsonData = {
  scriptFiles: [],
  mainSection: { svgImage: { link: "" } },
  sections: []
};

// Start with the template
document.getElementById('startWithTemplate').addEventListener('click', function() {
  document.getElementById('jsonForm').style.display = 'block';
  document.getElementById('startWithTemplate').style.display = 'none';
  document.getElementById('loadFromFile').style.display = 'none';
  populateFields(jsonData);
  setupToggleButtons(); 
});

// Load JSON from a file
document.getElementById('loadFromFile').addEventListener('click', function() {
  document.getElementById('fileInput').style.display = 'block';
  document.getElementById('startWithTemplate').style.display = 'none';
  document.getElementById('loadFromFile').style.display = 'none';
});

// Handle file input
document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          jsonData = JSON.parse(e.target.result);
          document.getElementById('jsonForm').style.display = 'block';
          populateFields(jsonData);
          setupToggleButtons(); 
      };
      reader.readAsText(file);
  }
});

// Function to populate fields and retain user input
// Function to populate fields and retain user input
function populateFields(data) {
  const scriptFilesContainer = document.getElementById('scriptFilesContainer');
  scriptFilesContainer.innerHTML = ''; 

  // Populate scriptFiles
  data.scriptFiles.forEach((script, index) => {
      const scriptDiv = document.createElement('div');
      scriptDiv.innerHTML = `
          <input type="text" id="scriptFile-${index}" value="${script.scriptFile}" placeholder="Percorso script ${index + 1}">
          <button type="button" class="remove-btn" onclick="removeScriptFile(${index})">Rimuovi</button>
      `;
      scriptFilesContainer.appendChild(scriptDiv);

      // Add event listener to update script file input in real-time
      document.getElementById(`scriptFile-${index}`).addEventListener('input', (e) => {
          jsonData.scriptFiles[index].scriptFile = e.target.value;
      });
  });

  // Populate mainSection
  document.getElementById('svgImage').value = data.mainSection.svgImage.link;

  document.getElementById('svgImage').addEventListener('input', (e) => {
      jsonData.mainSection.svgImage.link = e.target.value;
  });

  // Populate sections
  const sectionsContainer = document.getElementById('sectionsContainer');
  sectionsContainer.innerHTML = ''; 
  data.sections.forEach((section, index) => {
      const sectionId = `section-${index + 1}`;
      section.id = sectionId;

      const sectionDiv = document.createElement('div');
      sectionDiv.innerHTML = `
          <h3 class="toggle-section" id="sectionToggle-${index}">Sezione ${index + 1}</h3>
          <div id="sectionContent-${index}" class="section-content">
              <label>ID:</label>
              <input type="text" id="sectionId-${index}" value="${section.id}" readonly>
              <label>Title:</label>
              <input type="text" id="sectionTitle-${index}" value="${section.title}" placeholder="Titolo sezione">
              <label>Subtitle:</label>
              <input type="text" id="sectionSubtitle-${index}" value="${section.subtitle}" placeholder="Sottotitolo sezione">
              <div id="contentsContainer-${index}" class="content-container"></div>
              <button type="button" class="add-btn" onclick="addContent(${index})">Aggiungi Contenuto</button>
              <button type="button" class="remove-btn" onclick="removeSection(${index})">Rimuovi Sezione</button>
          </div>
      `;
      sectionsContainer.appendChild(sectionDiv);

      // Add listeners to dynamically update the jsonData object for sections
      document.getElementById(`sectionTitle-${index}`).addEventListener('input', (e) => {
          jsonData.sections[index].title = e.target.value;
      });

      document.getElementById(`sectionSubtitle-${index}`).addEventListener('input', (e) => {
          jsonData.sections[index].subtitle = e.target.value;
      });

      // Populate contents of the section
      const contentsContainer = document.getElementById(`contentsContainer-${index}`);
      section.contents.forEach((content, contentIndex) => {
          const contentDiv = document.createElement('div');
          contentDiv.classList.add('content-block');
          const isImageChecked = content.isImage !== undefined ? content.isImage : true;
          const displayCanvasFields = isImageChecked ? 'none' : 'block';

          contentDiv.innerHTML = `
              <label>Text:</label>
              <input type="text" id="contentText-${index}-${contentIndex}" value="${content.text}" placeholder="Testo contenuto">
              <label>Image:</label>
              <input type="text" id="contentImage-${index}-${contentIndex}" value="${content.image || ''}" placeholder="Link immagine">
              <label>isImage:</label>
              <input type="checkbox" id="contentIsImage-${index}-${contentIndex}" ${isImageChecked ? 'checked' : ''} onchange="toggleCanvasFields(${index}, ${contentIndex})">
              
              <div id="canvasFields-${index}-${contentIndex}" style="display: ${displayCanvasFields};">
                  <label>Canvas Type:</label>
                  <select id="contentCanvasType-${index}-${contentIndex}">
                      <option value="chart" ${content.canvasType === 'none' ? 'selected' : ''}>None</option>
                      <option value="chart" ${content.canvasType === 'chart' ? 'selected' : ''}>Chart</option>
                      <option value="babylon" ${content.canvasType === 'babylon' ? 'selected' : ''}>Babylon</option>
                  </select>
                  <label>Content Function:</label>
                  <input type="text" id="contentFunction-${index}-${contentIndex}" value="${content.contentFunction || ''}" placeholder="Funzione del contenuto">
              </div>

              <div id="linksContainer-${index}-${contentIndex}" class="links-container">
                  <label>Links:</label>
                  ${content.links ? content.links.map((link, linkIndex) => `
                      <input type="text" class="contentLink" id="contentLink-${index}-${contentIndex}-${linkIndex}" value="${link}" placeholder="Inserisci il link">
                      <button type="button" class="remove-btn" onclick="removeLink(${index}, ${contentIndex}, ${linkIndex})">Rimuovi Link</button>
                  `).join('') : ''}
              </div>
              <button type="button" class="add-btn" onclick="addLink(${index}, ${contentIndex})">Aggiungi Link</button>
              <button type="button" class="remove-btn" onclick="removeContent(${index}, ${contentIndex})">Rimuovi Contenuto</button>
          `;
          contentsContainer.appendChild(contentDiv);

          // Add event listeners to update jsonData in real-time for content and links
          document.getElementById(`contentText-${index}-${contentIndex}`).addEventListener('input', (e) => {
              jsonData.sections[index].contents[contentIndex].text = e.target.value;
          });
          document.getElementById(`contentImage-${index}-${contentIndex}`).addEventListener('input', (e) => {
              jsonData.sections[index].contents[contentIndex].image = e.target.value;
          });
          document.getElementById(`contentIsImage-${index}-${contentIndex}`).addEventListener('change', (e) => {
              jsonData.sections[index].contents[contentIndex].isImage = e.target.checked;
          });
          document.getElementById(`contentCanvasType-${index}-${contentIndex}`).addEventListener('change', (e) => {
              jsonData.sections[index].contents[contentIndex].canvasType = e.target.value;
          });
          document.getElementById(`contentFunction-${index}-${contentIndex}`).addEventListener('input', (e) => {
              jsonData.sections[index].contents[contentIndex].contentFunction = e.target.value;
          });

          // Add listeners for each link field to update jsonData
          content.links.forEach((link, linkIndex) => {
              document.getElementById(`contentLink-${index}-${contentIndex}-${linkIndex}`).addEventListener('input', (e) => {
                  jsonData.sections[index].contents[contentIndex].links[linkIndex] = e.target.value;
              });
          });
      });
  });
}

// Toggle canvas fields based on the isImage checkbox
function toggleCanvasFields(sectionIndex, contentIndex) {
  const isImageCheckbox = document.getElementById(`contentIsImage-${sectionIndex}-${contentIndex}`);
  const canvasFields = document.getElementById(`canvasFields-${sectionIndex}-${contentIndex}`);
  
  if (isImageCheckbox.checked) {
      canvasFields.style.display = 'none'; // Hide canvas fields if it's an image
  } else {
      canvasFields.style.display = 'block'; // Show canvas fields if it's not an image
  }
}


// Add a new section
function addSection() {
  const newSectionIndex = jsonData.sections.length;
  const newSectionId = `section-${newSectionIndex + 1}`; // Generate new ID as "section-X"
  jsonData.sections.push({ id: newSectionId, title: "", subtitle: "", contents: [] });
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Add a new content item to the section
function addContent(sectionIndex) {
  jsonData.sections[sectionIndex].contents.push({ text: "", image: "", isImage: true, canvasType: "", contentFunction: "", links: [] });
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Remove a section
function removeSection(index) {
  jsonData.sections.splice(index, 1);
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Remove content from a section
function removeContent(sectionIndex, contentIndex) {
  jsonData.sections[sectionIndex].contents.splice(contentIndex, 1);
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Add a link field to content
function addLink(sectionIndex, contentIndex) {
  jsonData.sections[sectionIndex].contents[contentIndex].links.push(""); // Add empty link
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Remove a link
function removeLink(sectionIndex, contentIndex, linkIndex) {
  jsonData.sections[sectionIndex].contents[contentIndex].links.splice(linkIndex, 1); // Remove the link
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Toggle the sections (expand/collapse)
function setupToggleButtons() {
  const toggles = document.querySelectorAll('.toggle-section');
  toggles.forEach(toggle => {
      toggle.addEventListener('click', function () {
          const sectionId = this.id.replace('sectionToggle-', 'sectionContent-');
          const sectionContent = document.getElementById(sectionId);
          if (sectionContent.style.display === 'none' || sectionContent.style.display === '') {
              sectionContent.style.display = 'block';
          } else {
              sectionContent.style.display = 'none';
          }
      });
  });
}

function addScriptFile() {
  jsonData.scriptFiles.push({ scriptFile: "" }); // Add a new script file entry
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Function to remove a script file
function removeScriptFile(index) {
  jsonData.scriptFiles.splice(index, 1); // Remove the script file from jsonData
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Download updated JSON
document.getElementById('downloadBtn').addEventListener('click', function () {
  const updatedJson = {
      scriptFiles: jsonData.scriptFiles.map((_, index) => ({
          scriptFile: document.getElementById(`scriptFile-${index}`).value
      })),
      mainSection: {
          svgImage: { link: document.getElementById('svgImage').value }
      },
      sections: jsonData.sections.map((section, index) => ({
          id: document.getElementById(`sectionId-${index}`).value,
          title: document.getElementById(`sectionTitle-${index}`).value,
          subtitle: document.getElementById(`sectionSubtitle-${index}`).value,
          contents: section.contents.map((content, contentIndex) => ({
              text: document.getElementById(`contentText-${index}-${contentIndex}`).value,
              image: document.getElementById(`contentImage-${index}-${contentIndex}`).value,
              isImage: document.getElementById(`contentIsImage-${index}-${contentIndex}`).checked,
              canvasType: document.getElementById(`contentCanvasType-${index}-${contentIndex}`).value,
              contentFunction: document.getElementById(`contentFunction-${index}-${contentIndex}`).value,
              links: content.links.map((_, linkIndex) => document.getElementById(`contentLink-${index}-${contentIndex}-${linkIndex}`).value)
          }))
      }))
  };



  const blob = new Blob([JSON.stringify(updatedJson, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'updated_data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});