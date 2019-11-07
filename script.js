const store = {
    status: 'fetching',
    cardsData: [],
};

const cardElements = document.querySelector('.cards');
const addForm = document.querySelector('.add-card');

const frontAddCard = document.querySelector('.flip-card-front');
const backAddCard = document.querySelector('.flip-card-back');

const addButtonContainer = document.querySelector('.add-card-container');
const loadingBlock = document.querySelector('.loading');
const addButtonIcon = document.querySelector('.add-card-button');
const closeButton = document.querySelector('.close-icon');
const modalWindow = document.querySelector('.modal');
const flipButton = document.querySelector('.flip-icon');
const addFormInner = addForm.querySelector('.add-card-inner');
const addNewCardButton = document.querySelector('.add-new-card');

document.addEventListener('updateStore', function (event) {
    console.log('updateStore', event);

    if (event.customType === 'cardsLoaded') {
        store.status = 'success';
        store.cardsData = event.cardsData;

        console.log('cardsLoaded',event);
        // addButtonContainer.style.display = 'flex';
        loadingBlock.style.display = 'none';

        for (let key in store.cardsData) {
            createTask(store.cardsData[key], key);
        }

        localStorage.setItem('cardsData', JSON.stringify(store.cardsData));
    }
}, false);


flipButton.addEventListener('click', flipCard.bind(addForm, addFormInner));
addButtonIcon.addEventListener('click', onAddButtonClick);
addForm.addEventListener('submit', addNewCard);

modalWindow.addEventListener('click', onClose, true);

function flipCard(card) {
    card.classList.toggle('recovered');

    setTimeout(function () {
        if (card.classList.contains('recovered')) {
            card.querySelector('.flip-card-front').classList.remove('scrollable');
            card.querySelector('.flip-card-back').classList.add('scrollable');
        } else {
            card.querySelector('.flip-card-front').classList.add('scrollable');
            card.querySelector('.flip-card-back').classList.remove('scrollable');
        }
    }, 500)
}

function onAddButtonClick() {
    modalWindow.classList.toggle('visible')
}

function onClose(e) {
    if (e.target === closeButton) {
        return modalWindow.classList.remove('visible')
    }

    if (e.target === addNewCardButton) {
        return modalWindow.classList.remove('visible')
    }

    if (e.target.closest('.add-card')) {
        return;
    }

    return modalWindow.classList.remove('visible')
}

function createTask(data, cardId) {
    const { front, back } = data;

    const card = document.createElement('div');
    card.classList.add('flip-card');

    const flipCardInner = document.createElement('div');
    flipCardInner.classList.add('flip-card-inner');

    // fill front card
    const flipCardFront = document.createElement('div');
    flipCardFront.classList.add('flip-card-front');

    const frontTitle = document.createElement('h2');
    frontTitle.textContent = front.title;
    frontTitle.classList.add('title');

    const frontText = document.createElement('p');
    frontText.textContent = front.text;
    frontText.classList.add('text');

    // fill back card
    const flipCardBack = document.createElement('div');
    flipCardBack.classList.add('flip-card-back');

    const backTitle = document.createElement('h2');
    backTitle.textContent = back.title;
    backTitle.classList.add('title');

    const backText = document.createElement('p');
    backText.textContent = back.text;
    backText.classList.add('text');

    const deleteIcon = document.createElement('div');
    deleteIcon.classList.add('remove-icon');
    deleteIcon.addEventListener('click', removeCard.bind(this, cardId));

    // append elements to inner
    flipCardFront.appendChild(frontTitle);
    flipCardFront.appendChild(frontText);
    if (front.image) {
        const frontImg = document.createElement('div');
        frontImg.classList.add('image');
        // frontImg.src = front.image;
        frontImg.style.backgroundImage = `url(${front.image})` ;

        flipCardFront.appendChild(frontImg);
    }

    // append elements to inner
    flipCardBack.appendChild(backTitle);
    flipCardBack.appendChild(backText);
    if (back.image) {
        const backImg = document.createElement('div');
        backImg.classList.add('image');
        // backImg.src = back.image;
        backImg.style.backgroundImage = `url(${back.image})`;

        flipCardBack.appendChild(backImg);
    }

    // append cards to inner
    flipCardInner.appendChild(flipCardFront);
    flipCardInner.appendChild(flipCardBack);
    card.appendChild(deleteIcon);

    card.appendChild(flipCardInner);

    card.addEventListener('click', flipCard.bind(card, flipCardInner));

    const insertedElement = cardElements.insertBefore(card, addButtonContainer);

    async function removeCard(cardId, e) {
        e.preventDefault();

        deleteIcon.removeEventListener('click', removeCard);
        card.removeEventListener('click', flipCard);
        card.parentNode.removeChild(card);
        deleteCard(cardId);
    }
}

async function addNewCard(e) {
    e.preventDefault();
    const frontTitle = frontAddCard.querySelector('.card-title').value;
    const frontDescription = frontAddCard.querySelector('.card-text').value;
    const frontFile = frontAddCard.querySelector("input[name='front-file']");
    const frontImageSrc = await getImageSource(frontFile);

    const backTitle = backAddCard.querySelector('.card-title').value;
    const backDescription = backAddCard.querySelector('.card-text').value;
    const backFile = backAddCard.querySelector("input[name='back-file']");
    const backImageSrc = await getImageSource(backFile);

    const data = {
        front: {
            title: frontTitle,
            text: frontDescription,
            image: frontImageSrc,
        },
        back: {
            title: backTitle,
            text: backDescription,
            image: backImageSrc,
        }
    };

    const cardId = Date.now();

    writeCard(cardId, data)
    createTask(data, cardId);
    addForm.reset();
}

async function getImageSource(inputElement) {
    return new Promise(function (resolve, reject) {
        if (!inputElement || !inputElement.files || !inputElement.files[0]) resolve(null);
        const file = inputElement.files[0];
        const reader  = new FileReader();
        let src = '';

        reader.onloadend = function() {
            src = reader.result;
            resolve(src);
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            reject('error reading file')
        }
    })
}
