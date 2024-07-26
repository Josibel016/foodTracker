const formMeal = document.getElementById('mealForm');
const inputMeal = document.getElementById('mealName');
const refeicaoAdd = JSON.parse(localStorage.getItem('meal') || '[]');
const mealList = document.getElementById('mealList');
const inputQnt = document.getElementById('quantity');

formMeal.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const meal = {
        descricao: inputMeal.value,
        quantidade: parseInt(inputQnt.value), // Converter para número
        data: getcurrentDate() 
    };

    // Verifica se o item já existe
    const index = refeicaoAdd.findIndex(elemento =>
        elemento.descricao === meal.descricao
    );

    if (index > -1) {
        // Se o item já existe, atualiza a quantidade somando
        refeicaoAdd[index].quantidade = parseInt(refeicaoAdd[index].quantidade) + meal.quantidade;
    } else {
        // Se o item não existe, adiciona-o à lista
        refeicaoAdd.push(meal);
    }

    salvarMeal();
    inputMeal.value = '';
    inputQnt.value = '';

    mostrarNaTela(); // Atualizar a lista após adicionar ou atualizar uma refeição
    console.log(refeicaoAdd);
});

function getcurrentDate(){
    return new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD // estudar
}



function salvarMeal() {
    localStorage.setItem('meal', JSON.stringify(refeicaoAdd));
}

function mostrarNaTela() {
    mealList.innerHTML = ''; // Limpar a lista antes de exibir
    refeicaoAdd.forEach(meal => {
        const li = criarElemento(meal); // Passar o objeto 'meal' completo
        mealList.appendChild(li); // Adicionar cada elemento 'li' criado à 'mealList'
    });
}

function criarElemento(meal) {
    const li = document.createElement('li');
    li.classList.add('li-list-item');

    const paragrafoDescricao = document.createElement('p');
    paragrafoDescricao.textContent = meal.descricao;
    paragrafoDescricao.classList.add('task-list-item-description');

    const paragrafoQuantidade = document.createElement('p');
    paragrafoQuantidade.textContent = meal.quantidade;
    paragrafoQuantidade.classList.add('task-list-item-description');

    const paragrafoData = document.createElement('p')
    paragrafoData.textContent= meal.data;
    paragrafoData.classList.add('task-list-item-description')

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
            li.remove(); // Remover o elemento 'li' do DOM
            mostrarNaTela(); // Atualizar a lista após a exclusão
        }
    });

    li.append(svg);
    li.append(paragrafoQuantidade); // Adicionar quantidade primeiro
    li.append(paragrafoDescricao); // Adicionar descrição depois
    li.append(paragrafoData);
    li.append(btnDelete); // Botão de deletar ao final

    return li;
}

document.addEventListener('DOMContentLoaded', mostrarNaTela);
console.log('veio do localStorage', refeicaoAdd);
