/*************************************************************************
 * Create Note Popup Logic
 **************************************************************************/

function popup() {
    const popupContainer = document.createElement("div");

    popupContainer.innerHTML = `
    <div id="popupContainer">
        <h1>New Note</h1>
        <textarea id="note-title" placeholder="Enter note title..." rows="2"></textarea>
        <textarea id="note-text" placeholder="Enter your note..." rows="5"></textarea>
        <div id="btn-container">
            <button id="submitBtn" onclick="createNote()">Create Note</button>
            <button id="closeBtn" onclick="closePopup()">Close</button>
        </div>
    </div>
    `;
    document.body.appendChild(popupContainer);

    // Add styles directly or through a CSS class
    document.getElementById("popupContainer").style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px; /* Adjusted size */
        padding: 20px;
        background-color: #cda5f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
        z-index: 1000;
    `;

    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.style.cssText = `
            width: 100%;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #ccc;
            box-sizing: border-box;
            font-size: 14px;
        `;
    });

    document.getElementById("btn-container").style.cssText = `
        display: flex;
        justify-content: space-between;
    `;

    document.querySelectorAll("#submitBtn, #closeBtn").forEach(button => {
        button.style.cssText = `
            width: 120px;
            padding: 10px;
            background-color: #8c53ff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
    });

    document.getElementById("closeBtn").style.backgroundColor = "#8c53ff"; // Close button with gray background
}


function closePopup() {
    const popupContainer = document.getElementById("popupContainer");
    if(popupContainer) {
        popupContainer.remove();
    }
}

function createNote() {
    const popupContainer = document.getElementById('popupContainer');
    const noteTitle = document.getElementById('note-title').value;
    const noteText = document.getElementById('note-text').value;

    if (noteText.trim() !== '' && noteTitle.trim() !== '') {
        const note = {
            id: new Date().getTime(),
            title: noteTitle,  // Store the title
            text: noteText
        };

        const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
        existingNotes.push(note);

        localStorage.setItem('notes', JSON.stringify(existingNotes));

        // Clear the form
        document.getElementById('note-title').value = '';
        document.getElementById('note-text').value = '';

        popupContainer.remove();
        displayNotes();
    }
}


/*************************************************************************
 * Display Notes Logic
 **************************************************************************/

function displayNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.forEach(note => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${note.title}</strong>  <!-- Display the note title -->
            <span>${note.text}</span>  <!-- Display the note text -->
            <div id="noteBtns-container">
                <button id="editBtn" onclick="editNote(${note.id})"><i class="fa-solid fa-pen"></i></button>
                <button id="deleteBtn" onclick="deleteNote(${note.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        notesList.appendChild(listItem);
    });
}


/*************************************************************************
 * Edit Note Popup Logic
 **************************************************************************/

function editNote(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteToEdit = notes.find(note => note.id == noteId);
    const noteTitle = noteToEdit ? noteToEdit.title : '';
    const noteText = noteToEdit ? noteToEdit.text : '';

    const editingPopup = document.createElement("div");
    editingPopup.setAttribute('id', 'popupContainer'); // Use the same ID as the New Note popup for consistent styling
    editingPopup.innerHTML = `
    <div id="popupContainer">
        <h1>Edit Note</h1>
        <textarea id="note-title" placeholder="Enter note title..." rows="2">${noteTitle}</textarea>
        <textarea id="note-text" placeholder="Enter your note..." rows="5">${noteText}</textarea>
        <div id="btn-container">
            <button id="submitBtn" onclick="updateNote(${noteId})">Done</button>
            <button id="closeBtn" onclick="closePopup()">Cancel</button>
        </div>
    </div>
    `;

    document.body.appendChild(editingPopup);
}

function closePopup() {
    const popup = document.getElementById('popupContainer');
    if (popup) {
        popup.remove();
    }
}

/*************************************************************************
 * Delete Note Logic
 **************************************************************************/

function deleteNote(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== noteId);

    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}

displayNotes();

/*************************************************************************
 * Delete Note Logic
 **************************************************************************/

function updateNote(noteId) {
    const noteTitle = document.getElementById('note-title').value.trim();
    const noteText = document.getElementById('note-text').value.trim();

    if (noteText !== '' && noteTitle !== '') {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];

        const updatedNotes = notes.map(note => {
            if (note.id == noteId) {
                return { id: note.id, title: noteTitle, text: noteText };
            }
            return note;
        });

        localStorage.setItem('notes', JSON.stringify(updatedNotes));

        closePopup();  // Close popup after updating the note
        displayNotes();  // Refresh the displayed notes
    }
}
