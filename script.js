const formMeal = document.getElementById('mealForm');
const inputMeal = document.getElementById('mealName');
const refeicaoAdd = JSON.parse(localStorage.getItem('meal') || '[]');
const mealList = document.getElementById('mealList');

formMeal.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const meal = {
        descricao: inputMeal.value
    };

    refeicaoAdd.push(meal);
    salvarMeal();
    inputMeal.value = '';
    mostrarNaTela(); // Refresh the list after adding a new meal
    console.log(refeicaoAdd);
});

function salvarMeal() {
    localStorage.setItem('meal', JSON.stringify(refeicaoAdd));
}

function mostrarNaTela() {
    mealList.innerHTML = ''; // Clear the list before displaying
    refeicaoAdd.forEach(meal => {
        const li = criarElemento(meal); // Pass the entire 'meal' object
        mealList.appendChild(li); // Append each created 'li' element to 'mealList'
    });
}

function criarElemento(meal) {
    const li = document.createElement('li');
    li.classList.add('li-list-item');

    const paragrafo = document.createElement('p');
    paragrafo.textContent = meal.descricao;
    paragrafo.classList.add('task-list-item-description');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E"></path>
        </svg>
    `;

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'delete';
    btnDelete.classList.add('app_button-edit');

    btnDelete.addEventListener('click', () => {
        const index = refeicaoAdd.indexOf(meal);
        if (index > -1) {
            refeicaoAdd.splice(index, 1);
            salvarMeal();
            li.remove(); // Remove the 'li' element from the DOM
            mostrarNaTela(); // Refresh the list after deletion
        }
    });

    li.append(svg);
    li.append(paragrafo);
    li.append(btnDelete);

    return li;
}

document.addEventListener('DOMContentLoaded', mostrarNaTela);
console.log('veio do localStorage', refeicaoAdd);
