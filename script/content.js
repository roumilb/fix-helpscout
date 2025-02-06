function getElement(cssQuery, callback) {
    const element = document.querySelector(cssQuery);

    if (!element) {
        setTimeout(() => {
            getElement(cssQuery, callback);
        }, 100);
    } else {
        callback(element);
    }
}

const onContainerElement = (containerElement) => {
    const replyContainer = containerElement.querySelector('[data-testid="reply-bar"]');
    const conversationListContainer = containerElement.querySelector('[data-testid="ThreadContainer"]');

    containerElement.insertBefore(replyContainer, conversationListContainer);
};

const onNoteElement = () => {
    const notes = document.querySelectorAll('li.ThreadListItem.is-note > div');
    if (notes.length < 1) {
        return;
    }

    const notesSelectOptions = [];
    notes.forEach((note) => {
        const username = note.querySelector('span[data-nocollapse]').innerText;
        const time = note.querySelector('[data-testid="timestamp"] time').innerText;
        notesSelectOptions.push(`<option value="${note.getAttribute('id')}">${username} - ${time}</option>`);
    });
    notesSelectOptions.push('<option>Jump to a note</option>');

    const noteSelect = `<select id="fix-helpscout-select-note">${notesSelectOptions.reverse().join('')}</select>`;
    document.querySelector('[data-testid="note-button"]').insertAdjacentHTML('afterend', noteSelect);

    document.querySelector('#fix-helpscout-select-note').addEventListener('change', (event) => {
        const noteId = event.target.value;
        const noteElement = document.getElementById(noteId);
        noteElement.scrollIntoView();
    });
};

function init() {
    getElement('[class^="Contentcss__ConversationAreaUI"]', onContainerElement);
    getElement('.ThreadListItem.is-note', onNoteElement);
}

init();


window.navigation.addEventListener('navigate', (event) => {
    init();
});
