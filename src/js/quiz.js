let current = document.querySelector('.quiz_current');
let amount = document.querySelector('.quiz_amount');

let count = 0;
const quizResult = new Map();
let value;
let radios;
let options;

// main blocks
const quizList = document.querySelectorAll('.quiz__tabs');
const quizHeadings = document.querySelectorAll('.quiz__heading-4');
quizList[count].classList.add('visible');
quizHeadings[count].classList.add('visible-inline');

//get amount and count
amount.innerHTML = `${quizList.length}`;
current.innerHTML = `${count + 1}`;

// pagination buttons
const prevButton = document.querySelector('.quiz__bottom_prev');
const nextButton = document.querySelector('.quiz__bottom_next');
prevButton.style.display = 'none';
nextButton.disabled = true;

//finish sending
const bottomBlock = document.querySelector('.quiz__bottom');
const inputs = document.querySelectorAll('.quiz__tabs.quiz__send-data input');
const sendButton = document.querySelector('.quiz__send-button');
const finishBlock = document.querySelector('.quiz__tabs.quiz__send-data');
/////////
setListener();
// next click
nextButton.onclick = () => {
    if (count < quizList.length - 1) {
        saveValue();
        removeListener();
        pagination();
        if (count + 1 === quizList.length) {
            bottomBlock.style.display = 'none';
            sendButton.addEventListener('click', sendData)


        } else {
            setListener();
            isSelected();
        }
    }
}
// prevent click
prevButton.onclick = () => {
    if (count > 0) {
        removeListener();
        pagination(false);
        setListener();
        isSelected();
    }
}

// pagination
function pagination(ahead = true) {
    quizList[count].classList.remove('visible');
    quizHeadings[count].classList.remove('visible-inline');
    ahead ? count++ : count--;
    quizList[count].classList.add('visible');
    quizHeadings[count].classList.add('visible-inline');
    current.innerHTML = `${count + 1}`;
    if (count === 0) {
        prevButton.style.display = 'none';
    } else {
        prevButton.style.display = 'flex';
    }
}

function setListener() {
    radios = document.querySelectorAll('.quiz__tabs.visible  input[type=radio]');
    options = document.querySelector('.quiz__tabs.visible  select');
    radios.forEach(i => {
        i.addEventListener('change', radioListener)
    })
    options?.addEventListener('change', optionListener)

}

function removeListener() {
    radios?.forEach(i => i.removeEventListener('change', radioListener));
    options?.removeEventListener('change', optionListener);
    radios = undefined;
    options = undefined;
}

function radioListener(e) {
    nextButton.disabled = false;
    value = e.target.dataset.name;
}

function optionListener(e) {
    if (!!e.target.value) {
        nextButton.disabled = false;
        value = e.target.value;
    } else {
        nextButton.disabled = true;
    }
}

function isSelected() {
    let radio;
    radios?.forEach(i => {
        if (i.checked) radio = i.dataset.name;
    })
    if (!!options?.selectedIndex) {
        value = options[options?.selectedIndex].value;
        nextButton.disabled = false;
    } else if (!!radio) {
        value = radio;
        nextButton.disabled = false;

    } else {
        value = '';
        nextButton.disabled = true;
    }

}

function saveValue() {
    quizResult.set(quizHeadings[count].innerHTML, value);
}

function sendData() {
    const keys = ['имя', 'номер телефона', 'электронная почта']
    let isFilled = 0;
    inputs.forEach((i, n) => !!i.value && isFilled++)
    if (inputs.length === isFilled) {
        inputs.forEach((i, n) => quizResult.set(keys[n], i.value))
        console.log(finishBlock);
        finishBlock.style.justifyContent = 'center';
        finishBlock.style.alignItems = 'center';
        finishBlock.style.height = '100%';
        finishBlock.innerHTML = '<div class="lds-dual-ring"></div>'
        // ..........................
        // ну а здесь fetch
        fetch(`'https://jsonplaceholder.typicode.com/posts`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "same-origin",
            body: JSON.stringify(Object.fromEntries([...quizResult]))
        })

        // ..........................
        setTimeout(() => {
            finishBlock.innerHTML = `
            <img class="finish_img" src="assets/ok.svg" alt="ok">
            <h3 class="finish_h3">Мы отправили подборку вам на почту. </h3>
            <p class ="finish_text">Если подборка не приходит — проверьте спам,<br> возможно, она попала туда.'</p>`
        }, 1500);
        console.log(JSON.stringify(Object.fromEntries([...quizResult])));
    } else {
        alert('Необходимо Заполнить все поля!');
    }
}