// Dynamically update jsonData when inputs change
function setupInputListeners(sectionIndex, contentIndex) {
  // Add event listener for all section and content inputs
  const sectionIdInput = document.getElementById(`sectionId-${sectionIndex}`);
  const sectionTitleInput = document.getElementById(`sectionTitle-${sectionIndex}`);
  const sectionSubtitleInput = document.getElementById(`sectionSubtitle-${sectionIndex}`);

  sectionTitleInput.addEventListener('input', (e) => {
    jsonData.sections[sectionIndex].title = e.target.value;
  });

  sectionSubtitleInput.addEventListener('input', (e) => {
    jsonData.sections[sectionIndex].subtitle = e.target.value;
  });

  if (contentIndex !== undefined) {
    const contentTextInput = document.getElementById(`contentText-${sectionIndex}-${contentIndex}`);
    const contentImageInput = document.getElementById(`contentImage-${sectionIndex}-${contentIndex}`);
    const contentIsImageCheckbox = document.getElementById(`contentIsImage-${sectionIndex}-${contentIndex}`);
    const contentCanvasType = document.getElementById(`contentCanvasType-${sectionIndex}-${contentIndex}`);
    const contentFunction = document.getElementById(`contentFunction-${sectionIndex}-${contentIndex}`);

    contentTextInput.addEventListener('input', (e) => {
      jsonData.sections[sectionIndex].contents[contentIndex].text = e.target.value;
    });

    contentImageInput.addEventListener('input', (e) => {
      jsonData.sections[sectionIndex].contents[contentIndex].image = e.target.value;
    });

    contentIsImageCheckbox.addEventListener('change', (e) => {
      jsonData.sections[sectionIndex].contents[contentIndex].isImage = e.target.checked;
      toggleCanvasFields(sectionIndex, contentIndex);
    });

    contentCanvasType.addEventListener('change', (e) => {
      jsonData.sections[sectionIndex].contents[contentIndex].canvasType = e.target.value;
    });

    contentFunction.addEventListener('input', (e) => {
      jsonData.sections[sectionIndex].contents[contentIndex].contentFunction = e.target.value;
    });
  }
}

// Function to populate fields and ensure persistence of user input
function populateFields(data) {
  const sectionsContainer = document.getElementById('sectionsContainer');
  sectionsContainer.innerHTML = ''; // Clear previous content

  data.sections.forEach((section, sectionIndex) => {
    const sectionId = `section-${sectionIndex + 1}`;
    section.id = sectionId;

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

    // Populate section contents
    const contentsContainer = document.getElementById(`contentsContainer-${sectionIndex}`);
    section.contents.forEach((content, contentIndex) => {
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('content-block');
      const isImageChecked = content.isImage !== undefined ? content.isImage : true;
      const displayCanvasFields = isImageChecked ? 'none' : 'block';

      contentDiv.innerHTML = `
        <label>Text:</label>
        <input type="text" id="contentText-${sectionIndex}-${contentIndex}" value="${content.text}" placeholder="Testo contenuto">
        <label>Image:</label>
        <input type="text" id="contentImage-${sectionIndex}-${contentIndex}" value="${content.image || ''}" placeholder="Link immagine">
        <label>isImage:</label>
        <input type="checkbox" id="contentIsImage-${sectionIndex}-${contentIndex}" ${isImageChecked ? 'checked' : ''} onchange="toggleCanvasFields(${sectionIndex}, ${contentIndex})">
        
        <div id="canvasFields-${sectionIndex}-${contentIndex}" style="display: ${displayCanvasFields};">
          <label>Canvas Type:</label>
          <select id="contentCanvasType-${sectionIndex}-${contentIndex}">
            <option value="chart" ${content.canvasType === 'chart' ? 'selected' : ''}>Chart</option>
            <option value="babylon" ${content.canvasType === 'babylon' ? 'selected' : ''}>Babylon</option>
          </select>
          <label>Content Function:</label>
          <input type="text" id="contentFunction-${sectionIndex}-${contentIndex}" value="${content.contentFunction || ''}" placeholder="Funzione del contenuto">
        </div>

        <div id="linksContainer-${sectionIndex}-${contentIndex}" class="links-container">
          <label>Links:</label>
          ${content.links ? content.links.map((link, linkIndex) => `
            <input type="text" class="contentLink" id="contentLink-${sectionIndex}-${contentIndex}-${linkIndex}" value="${link}" placeholder="Inserisci il link">
            <button type="button" class="remove-btn" onclick="removeLink(${sectionIndex}, ${contentIndex}, ${linkIndex})">Rimuovi Link</button>
          `).join('') : ''}
        </div>
        <button type="button" class="add-btn" onclick="addLink(${sectionIndex}, ${contentIndex})">Aggiungi Link</button>
        <button type="button" class="remove-btn" onclick="removeContent(${sectionIndex}, ${contentIndex})">Rimuovi Contenuto</button>
      `;
      contentsContainer.appendChild(contentDiv);

      // Add listeners to the inputs to update jsonData in real-time
      setupInputListeners(sectionIndex, contentIndex);
    });

    // Add listeners for section-level inputs
    setupInputListeners(sectionIndex);
  });
}

// Function to add a new content to a section
function addContent(sectionIndex) {
  jsonData.sections[sectionIndex].contents.push({ text: "", image: "", isImage: true, canvasType: "", contentFunction: "", links: [] });
  populateFields(jsonData); // Repopulate without losing previous data
}

// Function to add a new section
function addSection() {
  jsonData.sections.push({ id: "", title: "", subtitle: "", contents: [] });
  populateFields(jsonData); // Repopulate without losing previous data
}