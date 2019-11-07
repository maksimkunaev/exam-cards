const cardsData = [
    {
        front: { text: 'text', title: 'task', image: 'https://avatars3.githubusercontent.com/u/38328222?s=460&v=4' },
        back: { text: 'text', title: 'answer', image: 'https://i0.wp.com/sitn.hms.harvard.edu/wp-content/uploads/2019/08/Moon.jpg?resize=1920%2C768' }
    },
    {
        front: { text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.', title: 'task', image: 'https://avatars3.githubusercontent.com/u/38328222?s=460&v=4' },
        back: { text: 'Сегодня этот текст используют практически все дизайнеры, набирающие рыбу латиницей. Абзац считается каноническим во всех справочниках по типографике и предлагается к использованию в статьях, посвященных изготовлению макета верстки при отсутствии финальных текстов. В руководствах по работе с фирменным стилем крупных международных компаний именно с этих слов начинаются образцы верстки. Существуют даже издания с названием Lorem ipsum.\n' +
                '\n', title: 'answer', image: 'https://i0.wp.com/sitn.hms.harvard.edu/wp-content/uploads/2019/08/Moon.jpg?resize=1920%2C768' }
    },
];
const cardElements = document.querySelector('.cards');
const addForm = document.querySelector('.add-card');

const frontAddCard = document.querySelector('.flip-card-front');
const backAddCard = document.querySelector('.flip-card-back');

const addButtonIcon = document.querySelector('.add-card-button');
const closeButton = document.querySelector('.close-icon');
const modalWindow = document.querySelector('.modal');
const flipButton = document.querySelector('.flip-icon');
const addFormInner = addForm.querySelector('.add-card-inner');
const addNewCardButton = document.querySelector('.add-new-card');

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

function createTask(data) {
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

    const frontImg = document.createElement('img');
    frontImg.classList.add('image');
    frontImg.src = front.image;

    // fill back card
    const flipCardBack = document.createElement('div');
    flipCardBack.classList.add('flip-card-back');

    const backTitle = document.createElement('h2');
    backTitle.textContent = back.title;
    backTitle.classList.add('title');

    const backText = document.createElement('p');
    backText.textContent = back.text;
    backText.classList.add('text');

    const backImg = document.createElement('img');
    backImg.classList.add('image');
    backImg.src = back.image;

    // append elements to inner
    flipCardFront.appendChild(frontTitle);
    flipCardFront.appendChild(frontText);
    flipCardFront.appendChild(frontImg);

    // append elements to inner
    flipCardBack.appendChild(backTitle);
    flipCardBack.appendChild(backText);
    flipCardBack.appendChild(backImg);

    // append cards to inner
    flipCardInner.appendChild(flipCardFront);
    flipCardInner.appendChild(flipCardBack);

    card.appendChild(flipCardInner);

    card.addEventListener('click', flipCard.bind(card, flipCardInner));

    cardElements.appendChild(card);
}

cardsData.forEach(function (data) {
    createTask(data)
});

function addNewCard(e) {
    e.preventDefault();
    const frontTitle = frontAddCard.querySelector('.card-title').value;
    const frontDescription = frontAddCard.querySelector('.card-text').value;
    const frontImageSrc = 'https://thenypost.files.wordpress.com/2019/08/space-signals-3246.jpg?quality=90&strip=all&strip=all'

    const backTitle = backAddCard.querySelector('.card-title').value;
    const backDescription = backAddCard.querySelector('.card-text').value;
    const backImageSrc = 'https://ichef.bbci.co.uk/news/660/cpsprodpb/7D66/production/_105120123_gettyimages-831502910.jpg'

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

    createTask(data);
    addForm.reset();
}
