const apiKey = '34af2859d57e5b15b740104a48274a0b'; 
const appId = 'd3e5c5dd'; 

const form = document.getElementById('mealForm');
const mealDate = document.getElementById('mealDate');
const mealType = document.getElementById('mealType');
const mealName = document.getElementById('mealName');
const quantity = document.getElementById('quantity');
const mealList = document.getElementById('mealList');

let mealsByDate = getMealsByDate();

// Função para obter a data atual
function getcurrentDate(){
    const date = new Date();
    return date.toISOString().split('T')[0];
}

// Função para salvar os dados no localStorage
function saveMealsByDate(){
    localStorage.setItem('mealsByDate', JSON.stringify(mealsByDate));
}

// Função para recuperar os dados do localStorage
function getMealsByDate(){
    return JSON.parse(localStorage.getItem('mealsByDate')) || {}; 
}

// Função para buscar dados nutricionais usando a API da Nutritionix
async function buscarNutrientes(foodName, foodQuantity) {
    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-app-id': appId,
            'x-app-key': apiKey,
            'x-remote-user-id': '0'
        },
        body: JSON.stringify({ "query": `${foodName} ${foodQuantity}` })
    });

    const data = await response.json();
    if (data && data.foods && data.foods.length > 0) {
        const food = data.foods[0];
        return {
            calories: food.nf_calories,
            protein: food.nf_protein,
            carbs: food.nf_total_carbohydrate,
            fat: food.nf_total_fat
        };
    }

    return null;
}

// Função para mostrar as refeições na tela
function mostrarNaTela() {
    mealList.innerHTML = ''; // Limpa a lista antes de exibir

    for (const [date, meals] of Object.entries(mealsByDate)) {
        // Adiciona a linha da data
        const dateRow = document.createElement('tr');
        const dateTd = document.createElement('td');
        dateTd.textContent = `Date: ${date}`;
        dateTd.colSpan = 7; // Faz com que a célula ocupe toda a linha
        dateRow.appendChild(dateTd);
        mealList.appendChild(dateRow);

        // Agrupa as refeições por tipo
        const mealsByType = meals.reduce((acc, meal) => {
            if (!acc[meal.type]) acc[meal.type] = [];
            acc[meal.type].push(meal);
            return acc;
        }, {});

        // Para cada tipo de refeição, adicione uma linha com o nome do tipo e o cabeçalho da tabela
        for (const [type, mealsOfType] of Object.entries(mealsByType)) {
            // Adiciona a linha do tipo de refeição
            const typeRow = document.createElement('tr');
            const typeTd = document.createElement('td');
            typeTd.textContent = `Meal Type: ${type}`;
            typeTd.colSpan = 7; // Faz com que a célula ocupe toda a linha
            typeRow.appendChild(typeTd);
            mealList.appendChild(typeRow);

            // Adiciona o cabeçalho da tabela
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th>Meal</th>
                <th>Quantity</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fat</th>
                <th>Delete</th>
            `;
            mealList.appendChild(headerRow);

            // Adiciona as refeições desse tipo
            mealsOfType.forEach((meal, mealIndex) => {
                const tr = document.createElement('tr');

                const tdFood = document.createElement('td');
                tdFood.textContent = meal.food;
                tr.appendChild(tdFood);

                const tdQuantity = document.createElement('td');
                tdQuantity.textContent = meal.quantity;
                tr.appendChild(tdQuantity);

                const tdCalories = document.createElement('td');
                tdCalories.textContent = meal.nutrition?.calories ?? 'N/A';
                tr.appendChild(tdCalories);

                const tdProtein = document.createElement('td');
                tdProtein.textContent = meal.nutrition?.protein ?? 'N/A';
                tr.appendChild(tdProtein);

                const tdCarbs = document.createElement('td');
                tdCarbs.textContent = meal.nutrition?.carbs ?? 'N/A';
                tr.appendChild(tdCarbs);

                const tdFat = document.createElement('td');
                tdFat.textContent = meal.nutrition?.fat ?? 'N/A';
                tr.appendChild(tdFat);

                // Botão de deletar
                const tdDelete = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    mealsByDate[date].splice(mealIndex, 1);
                    if (mealsByDate[date].length === 0) {
                        delete mealsByDate[date];
                    }
                    saveMealsByDate();
                    mostrarNaTela();
                });
                tdDelete.appendChild(deleteButton);
                tr.appendChild(tdDelete);

                mealList.appendChild(tr);
            });

            // Calcular e mostrar os totais
            const totals = calcularTotaisDeNutrientes(mealsOfType);
            const totalRow = document.createElement('tr');
            totalRow.innerHTML = `
                <td>Total</td>
                <td></td>
                <td>${totals.calories}</td>
                <td>${totals.protein}</td>
                <td>${totals.carbs}</td>
                <td>${totals.fat}</td>
                <td></td>
            `;
            mealList.appendChild(totalRow);
        }
    }
}

// Event listener para o formulário
form.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const date = mealDate.value || getcurrentDate();
    const meal = {
        type: mealType.value,
        food: mealName.value,
        quantity: parseInt(quantity.value, 10),
    };
    
    const nutritionData = await buscarNutrientes(meal.food, meal.quantity);
    meal.nutrition = nutritionData;

    if (!mealsByDate[date]) {
        mealsByDate[date] = [];
    }
    mealsByDate[date].push(meal);

    saveMealsByDate();
    mostrarNaTela(); // Atualiza a exibição
});

// Mostrar as refeições na tela ao carregar a página
document.addEventListener('DOMContentLoaded', mostrarNaTela);

function calcularTotaisDeNutrientes(meals) {
    return meals.reduce((totals, meal) => {
        if (meal.nutrition) {
            totals.calories += meal.nutrition.calories * meal.quantity;
            totals.protein += meal.nutrition.protein * meal.quantity;
            totals.carbs += meal.nutrition.carbs * meal.quantity;
            totals.fat += meal.nutrition.fat * meal.quantity;
        }
        return totals;
    }, {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    });
}
