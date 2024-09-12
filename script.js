let jsonData = {
    scriptFiles: [],
    mainSection: { svgImage: { link: "" } },
    sections: []
  };
  
  // Inizia con il template vuoto
  document.getElementById('startWithTemplate').addEventListener('click', function() {
    document.getElementById('jsonForm').style.display = 'block';
    document.getElementById('startWithTemplate').style.display = 'none';
    document.getElementById('loadFromFile').style.display = 'none';
    populateFields(jsonData); // Popola i campi iniziali
    setupToggleButtons(); // Imposta i pulsanti per il toggle
  });
  
  // Carica JSON da file
  document.getElementById('loadFromFile').addEventListener('click', function() {
    document.getElementById('fileInput').style.display = 'block';
    document.getElementById('startWithTemplate').style.display = 'none';
    document.getElementById('loadFromFile').style.display = 'none';
  });
  
  // Caricamento del file JSON
  document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        jsonData = JSON.parse(e.target.result);
        document.getElementById('jsonForm').style.display = 'block';
        populateFields(jsonData); // Popola i campi con i dati caricati
        setupToggleButtons(); // Imposta i pulsanti per il toggle
      };
      reader.readAsText(file);
    }
  });
  
  // Funzione per popolare i campi editabili con il JSON
  function populateFields(data) {
    // Clear previous content
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
    });
  
    // Populate mainSection
    document.getElementById('svgImage').value = data.mainSection.svgImage.link;
  
    // Populate sections
    const sectionsContainer = document.getElementById('sectionsContainer');
    sectionsContainer.innerHTML = ''; 
    data.sections.forEach((section, index) => {
      // Automatically generate the id as "section-X"
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
          <br>
          <button type="button" class="remove-btn" onclick="removeSection(${index})">Rimuovi Sezione</button>
        </div>
      `;
      sectionsContainer.appendChild(sectionDiv);
  
      // Populate contents of the section
      const contentsContainer = document.getElementById(`contentsContainer-${index}`);
      section.contents.forEach((content, contentIndex) => {
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content-block');
        contentDiv.innerHTML = `
          <label>Text:</label>
          <input type="text" id="contentText-${index}-${contentIndex}" value="${content.text}" placeholder="Testo contenuto">
          <label>Image:</label>
          <input type="text" id="contentImage-${index}-${contentIndex}" value="${content.image || ''}" placeholder="Link immagine">
          <label>isImage:</label>
          <input type="checkbox" id="contentIsImage-${index}-${contentIndex}" ${content.isImage ? 'checked' : ''}>
          <label>Canvas Type:</label>
          <input type="text" id="contentCanvasType-${index}-${contentIndex}" value="${content.canvasType || ''}" placeholder="Tipo di canvas">
          <label>Content Function:</label>
          <input type="text" id="contentFunction-${index}-${contentIndex}" value="${content.contentFunction || ''}" placeholder="Funzione del contenuto">
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
      });
    });
  }
  
  // Automatically add section with ID generation
  function addSection() {
    const newSectionIndex = jsonData.sections.length;
    const newSectionId = `section-${newSectionIndex + 1}`; // Generate "section-X"
    jsonData.sections.push({ id: newSectionId, title: "", subtitle: "", contents: [] });
    populateFields(jsonData); // Refresh the fields
    setupToggleButtons(); // Re-apply toggle functionality
  }
  // Imposta i pulsanti di toggle per le sezioni
  function setupToggleButtons() {
    const toggles = document.querySelectorAll('.toggle-section');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
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
  
  // Funzioni per aggiungere e rimuovere campi dinamicamente
  function addScriptFile() {
    jsonData.scriptFiles.push({ scriptFile: "" });
    populateFields(jsonData); // Ricarica i campi
    setupToggleButtons(); // Riassegna i pulsanti di toggle
  }
  
  function removeScriptFile(index) {
    jsonData.scriptFiles.splice(index, 1);
    populateFields(jsonData); // Ricarica i campi
    setupToggleButtons(); // Riassegna i pulsanti di toggle
  }
  
  function addSection() {
    jsonData.sections.push({ id: "", title: "", subtitle: "", contents: [] });
    populateFields(jsonData); // Ricarica i campi
    setupToggleButtons(); // Riassegna i pulsanti di toggle
  }
  
  function removeSection(index) {
    jsonData.sections.splice(index, 1);
    populateFields(jsonData); // Ricarica i campi
    setupToggleButtons(); // Riassegna i pulsanti di toggle
  }
  
  function addContent(sectionIndex) {
    jsonData.sections[sectionIndex].contents.push({ text: "", image: "", isImage: false, canvasType: "", contentFunction: "" });
    populateFields(jsonData); // Ricarica i campi
    setupToggleButtons(); // Riassegna i pulsanti di toggle
  }
  
  function removeContent(sectionIndex, contentIndex) {
    jsonData.sections[sectionIndex].contents.splice(contentIndex, 1);
    populateFields(jsonData); // Ricarica i campi
    setupToggleButtons(); // Riassegna i pulsanti di toggle
  }
  
  // Scarica il JSON aggiornato
  document.getElementById('downloadBtn').addEventListener('click', function() {
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
          contentFunction: document.getElementById(`contentFunction-${index}-${contentIndex}`).value
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
  