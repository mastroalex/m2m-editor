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
    const sectionsContainer = document.getElementById('sectionsContainer');
    sectionsContainer.innerHTML = ''; 

    data.sections.forEach((section, sectionIndex) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.innerHTML = `
            <h3 class="toggle-section" id="sectionToggle-${sectionIndex}">Sezione ${sectionIndex + 1}</h3>
            <div id="sectionContent-${sectionIndex}" class="section-content">
                <label>ID:</label>
                <input type="text" id="sectionId-${sectionIndex}" value="${section.id}" readonly>
                <label>Title:</label>
                <input type="text" id="sectionTitle-${sectionIndex}" value="${section.title}" placeholder="Titolo sezione">
                <label>Subtitle:</label>
                <input type="text" id="sectionSubtitle-${sectionIndex}" value="${section.subtitle}" placeholder="Sottotitolo sezione">
                <div id="contentsContainer-${sectionIndex}" class="content-container"></div>
                <button type="button" class="add-btn" onclick="addContent(${sectionIndex})">Aggiungi Contenuto</button>
                <button type="button" class="remove-btn" onclick="removeSection(${sectionIndex})">Rimuovi Sezione</button>
            </div>
        `;
        sectionsContainer.appendChild(sectionDiv);

        const contentsContainer = document.getElementById(`contentsContainer-${sectionIndex}`);
        section.contents.forEach((content, contentIndex) => {
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('content-block');
            contentDiv.innerHTML = `
                <label>Text:</label>
                <input type="text" id="contentText-${sectionIndex}-${contentIndex}" value="${content.text}" placeholder="Testo contenuto">
                <label>Image:</label>
                <input type="text" id="contentImage-${sectionIndex}-${contentIndex}" value="${content.image || ''}" placeholder="Link immagine">
                <label>isImage:</label>
                <input type="checkbox" id="contentIsImage-${sectionIndex}-${contentIndex}" ${content.isImage ? 'checked' : ''} onchange="toggleCanvasFields(${sectionIndex}, ${contentIndex})">
                
                <div id="linksContainer-${sectionIndex}-${contentIndex}" class="links-container">
                    <label>Links:</label>
                    ${content.links ? content.links.map((link, linkIndex) => `
                        <div class="link-entry">
                            <label>Nome:</label>
                            <input type="text" id="linkNome-${sectionIndex}-${contentIndex}-${linkIndex}" value="${link.nome}" placeholder="Nome link">
                            <label>URL:</label>
                            <input type="text" id="linkUrl-${sectionIndex}-${contentIndex}-${linkIndex}" value="${link.url}" placeholder="URL link">
                            <button type="button" class="remove-btn" onclick="removeLink(${sectionIndex}, ${contentIndex}, ${linkIndex})">Rimuovi Link</button>
                        </div>
                    `).join('') : ''}
                </div>
                <button type="button" class="add-btn" onclick="addLink(${sectionIndex}, ${contentIndex})">Aggiungi Link</button>
                <button type="button" class="remove-btn" onclick="removeContent(${sectionIndex}, ${contentIndex})">Rimuovi Contenuto</button>
            `;
            contentsContainer.appendChild(contentDiv);

            // Add event listeners to update jsonData in real-time for each link
            content.links.forEach((link, linkIndex) => {
                document.getElementById(`linkNome-${sectionIndex}-${contentIndex}-${linkIndex}`).addEventListener('input', (e) => {
                    jsonData.sections[sectionIndex].contents[contentIndex].links[linkIndex].nome = e.target.value;
                });
                document.getElementById(`linkUrl-${sectionIndex}-${contentIndex}-${linkIndex}`).addEventListener('input', (e) => {
                    jsonData.sections[sectionIndex].contents[contentIndex].links[linkIndex].url = e.target.value;
                });
            });
        });
    });
}

// Save all form values into jsonData before adding new elements
function saveFormValues() {
    // Save script files
    jsonData.scriptFiles.forEach((_, index) => {
        const scriptFileInput = document.getElementById(`scriptFile-${index}`);
        if (scriptFileInput) {
            jsonData.scriptFiles[index].scriptFile = scriptFileInput.value;
        }
    });

    // Save mainSection
    const svgImageInput = document.getElementById('svgImage');
    if (svgImageInput) {
        jsonData.mainSection.svgImage.link = svgImageInput.value;
    }

    // Save sections, contents, and links
    jsonData.sections.forEach((section, sectionIndex) => {
        const sectionTitleInput = document.getElementById(`sectionTitle-${sectionIndex}`);
        const sectionSubtitleInput = document.getElementById(`sectionSubtitle-${sectionIndex}`);

        if (sectionTitleInput) {
            jsonData.sections[sectionIndex].title = sectionTitleInput.value;
        }
        if (sectionSubtitleInput) {
            jsonData.sections[sectionIndex].subtitle = sectionSubtitleInput.value;
        }

        // Save content fields
        jsonData.sections[sectionIndex].contents.forEach((content, contentIndex) => {
            const contentTextInput = document.getElementById(`contentText-${sectionIndex}-${contentIndex}`);
            const contentImageInput = document.getElementById(`contentImage-${sectionIndex}-${contentIndex}`);
            const contentIsImageCheckbox = document.getElementById(`contentIsImage-${sectionIndex}-${contentIndex}`);
            const contentCanvasTypeInput = document.getElementById(`contentCanvasType-${sectionIndex}-${contentIndex}`);
            const contentFunctionInput = document.getElementById(`contentFunction-${sectionIndex}-${contentIndex}`);

            if (contentTextInput) {
                jsonData.sections[sectionIndex].contents[contentIndex].text = contentTextInput.value;
            }
            if (contentImageInput) {
                jsonData.sections[sectionIndex].contents[contentIndex].image = contentImageInput.value;
            }
            if (contentIsImageCheckbox) {
                jsonData.sections[sectionIndex].contents[contentIndex].isImage = contentIsImageCheckbox.checked;
            }
            if (contentCanvasTypeInput) {
                jsonData.sections[sectionIndex].contents[contentIndex].canvasType = contentCanvasTypeInput.value;
            }
            if (contentFunctionInput) {
                jsonData.sections[sectionIndex].contents[contentIndex].contentFunction = contentFunctionInput.value;
            }

            // Save link fields
            jsonData.sections[sectionIndex].contents[contentIndex].links.forEach((link, linkIndex) => {
                const linkNomeInput = document.getElementById(`linkNome-${sectionIndex}-${contentIndex}-${linkIndex}`);
                const linkUrlInput = document.getElementById(`linkUrl-${sectionIndex}-${contentIndex}-${linkIndex}`);

                if (linkNomeInput) {
                    jsonData.sections[sectionIndex].contents[contentIndex].links[linkIndex].nome = linkNomeInput.value;
                }
                if (linkUrlInput) {
                    jsonData.sections[sectionIndex].contents[contentIndex].links[linkIndex].url = linkUrlInput.value;
                }
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
  // Save all current form values before adding the link
  saveFormValues();
  const newSectionIndex = jsonData.sections.length;
  const newSectionId = `section-${newSectionIndex + 1}`; // Generate new ID as "section-X"
  jsonData.sections.push({ id: newSectionId, title: "", subtitle: "", contents: [] });
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Add a new content item to the section
function addContent(sectionIndex) {
    // Save all current form values before adding the link
  saveFormValues();
  jsonData.sections[sectionIndex].contents.push({ text: "", image: "", isImage: true, canvasType: "", contentFunction: "", links: [] });
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Remove a section
function removeSection(index) {
    // Save all current form values before adding the link
  saveFormValues();
  jsonData.sections.splice(index, 1);
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Remove content from a section
function removeContent(sectionIndex, contentIndex) {
    // Save all current form values before adding the link
  saveFormValues();
  jsonData.sections[sectionIndex].contents.splice(contentIndex, 1);
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Add a link field to content
function addLink(sectionIndex, contentIndex) {
    // Save all current form values before adding the link
  saveFormValues();
    const content = jsonData.sections[sectionIndex].contents[contentIndex];
    
    // Add a new object with `nome` and `url`
    content.links.push({ nome: "", url: "" }); 

    // Re-populate fields to show the new link
    populateFields(jsonData); 
    setupToggleButtons(); // Re-apply toggle functionality
}

// Remove a link
function removeLink(sectionIndex, contentIndex, linkIndex) {// Save all current form values before adding the link
    saveFormValues();
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
// Save all current form values before adding the link
saveFormValues();
  jsonData.scriptFiles.push({ scriptFile: "" }); // Add a new script file entry
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Function to remove a script file
function removeScriptFile(index) {
    // Save all current form values before adding the link
  saveFormValues();
  jsonData.scriptFiles.splice(index, 1); // Remove the script file from jsonData
  populateFields(jsonData); // Re-populate the fields
  setupToggleButtons(); // Re-apply toggle functionality
}

// Download updated JSON
document.getElementById('downloadBtn').addEventListener('click', function () {
    // First, save the form values to jsonData to ensure all inputs are captured
    saveFormValues();

    const updatedJson = {
        scriptFiles: jsonData.scriptFiles.map((_, index) => ({
            scriptFile: jsonData.scriptFiles[index].scriptFile // Directly from jsonData
        })),
        mainSection: {
            svgImage: { link: jsonData.mainSection.svgImage.link } // Directly from jsonData
        },
        sections: jsonData.sections.map((section, index) => ({
            id: section.id, // Directly from jsonData
            title: section.title, // Directly from jsonData
            subtitle: section.subtitle, // Directly from jsonData
            contents: section.contents.map((content, contentIndex) => ({
                text: content.text, // Directly from jsonData
                image: content.image, // Directly from jsonData
                isImage: content.isImage, // Directly from jsonData
                canvasType: content.canvasType, // Directly from jsonData
                contentFunction: content.contentFunction, // Directly from jsonData
                links: content.links.map(link => ({
                    nome: link.nome, // Directly from jsonData
                    url: link.url  // Directly from jsonData
                }))
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