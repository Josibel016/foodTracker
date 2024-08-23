const formMeal = document.getElementById('mealForm');
const inputMeal = document.getElementById('mealName');
const inputQnt = document.getElementById('quantity');
const inputDate = document.getElementById('mealDate'); // Adicionando o campo de data
const inputType = document.getElementById('mealType'); // Adicionando o campo de tipo
const mealList = document.getElementById('mealList');

// Function to get the current date in DD-MM format
function getcurrentDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}`;
}

// Function to retrieve meals for the current date
function getMeals() {
    const date = getcurrentDate();
    return JSON.parse(localStorage.getItem(date) || '[]');
}

// Function to save meals to localStorage
function salvarMeal(meals) {
    const date = getcurrentDate();
    localStorage.setItem(date, JSON.stringify(meals));
}

// Function to show meals on the screen
function mostrarNaTela() {
    mealList.innerHTML = ''; // Clear the list before displaying
    const refeicaoAdd = getMeals(); // Get meals for the current date

    refeicaoAdd.forEach(meal => {
        const li = criarElemento(meal);
        mealList.appendChild(li);
    });
}

// Function to create a list item for each meal
function criarElemento(meal) {
    const li = document.createElement('li');
    li.classList.add('li-list-item');

    const paragrafoDescricao = document.createElement('p');
    paragrafoDescricao.textContent = ` ${meal.descricao}`;
    paragrafoDescricao.classList.add('task-list-item-description');

    const paragrafoQuantidade = document.createElement('p');
    paragrafoQuantidade.textContent = ` ${meal.quantidade}`;
    paragrafoQuantidade.classList.add('task-list-item-description');

    const paragrafoData = document.createElement('p');
    paragrafoData.textContent = ` ${meal.data}`;
    paragrafoData.classList.add('task-list-item-description');

    const paragrafoTipo = document.createElement('p');
    paragrafoTipo.textContent = ` ${meal.tipo}`;
    paragrafoTipo.classList.add('task-list-item-description');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.classList.add('app_button-edit');

    btnDelete.addEventListener('click', () => {
        let refeicaoAdd = getMeals(); // Retrieve meals for the current date
        const index = refeicaoAdd.findIndex(elemento =>
            elemento.descricao === meal.descricao && elemento.data === meal.data
        );
        
        if (index > -1) {
            refeicaoAdd.splice(index, 1);
            salvarMeal(refeicaoAdd);
            li.remove(); // Remove the 'li' element from the DOM
        }
    });

    li.append(paragrafoTipo);
    li.append(paragrafoData);
    li.append(paragrafoQuantidade);
    li.append(paragrafoDescricao);
    li.append(svg);
    li.append(btnDelete);

    return li;
}

formMeal.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const meal = {
        descricao: inputMeal.value,
        quantidade: parseInt(inputQnt.value, 10),
        data: inputDate.value, // Use the date from input
        tipo: inputType.value // Include meal type
    };

    let refeicaoAdd = getMeals(); // Retrieve meals for the current date

    // Check if the meal already exists
    const index = refeicaoAdd.findIndex(elemento =>
        elemento.descricao === meal.descricao && elemento.data === meal.data
    );

    if (index > -1) {
        // If the meal exists, update the quantity
        refeicaoAdd[index].quantidade += meal.quantidade;
    } else {
        // Otherwise, add the new meal
        refeicaoAdd.push(meal);
    }

    salvarMeal(refeicaoAdd);
    inputMeal.value = '';
    inputQnt.value = '';
    inputDate.value = ''; // Clear the date field
    mostrarNaTela(); // Update the list after adding or updating a meal
});

document.addEventListener('DOMContentLoaded', mostrarNaTela);
console.log('Data from localStorage:', getMeals());
