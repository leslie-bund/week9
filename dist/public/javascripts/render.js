const darkSwitch = document.getElementById("mySwitch");
darkSwitch.addEventListener('change', function toggleDark(e) {
    document.body.classList.toggle('darkmode');
})

function createIngredient(name, price, clas) {
    let count = -1;
    
    return function () {
        count += 1;
        const label = document.createElement('label')
        label.classList.add(
            'col-sm-4',
            'col-md-3', 
            'col-lg-2', 
            'card', 
            'p-1', 
            'mx-1', 
            'text-light',
            'bg-transparent',
        );
        label.setAttribute('for', `${count}`);
        label.setAttribute('id', `${name+price}`)
        const newName = document.createTextNode(`Name: ${name}`);
        const brk = document.createElement('br');
        const newPrice = document.createTextNode(`Price: ${price}`);
        label.appendChild(newName);
        label.appendChild(brk);
        label.appendChild(newPrice);
        const inputTag = document.createElement('input');
        inputTag.setAttribute('type', 'checkbox');
        inputTag.setAttribute('name', `ingredients-${count}`);
        inputTag.setAttribute('value', `${JSON.stringify({name, price})}`);
        inputTag.setAttribute('id', `${count}`);
        inputTag.setAttribute('data-off', `${name+price}`);
        inputTag.checked = true;
        inputTag.style.opacity = '0%';
        inputTag.addEventListener('change', (e) => {
            let x = e.target;
            const y = e.target.dataset.off
            if(!x.checked) {
                document.querySelector(clas)
                    .removeChild(document.getElementById(y));
            }
        })
        label.appendChild(inputTag)
        return label;
    }
}

document.getElementById('adder')
    .addEventListener('click', function addIngredients() {
        const name = document.getElementById('name');
        const price = document.getElementById('price');
        document.querySelector('.ingreBoard').appendChild(createIngredient(name.value, price.value, '.ingreBoard')());
    })

document.getElementById('adder-up')
    .addEventListener('click', function addIngredients() {
        const name = document.getElementById('name-up');
        const price = document.getElementById('price-up');
        document.querySelector('.ingreBoard-up').appendChild(createIngredient(name.value, price.value, '.ingreBoard-up')());
    })


function collectFormData(e){
    // Loop through enumerated Iterable form inputs
    const data = {}
    for(let j = 0; j < e.length - 1; j++) {
        if(e[j]['name'].includes('ingredients')) {
            const tuple = e[j]['name'].split('-');
            if(!data[tuple[0]]) {
                data[tuple[0]] = [];
            }
            data[tuple[0]].push(JSON.parse(JSON.stringify(e[j]['value'])));
            continue;
        }
        data[e[j]['name']] = e[j]['value'];
    }
    // console.log(data)
    return data;
}

function setupForms() {
    Array.from(document.forms)
        .forEach(element => {
            element.addEventListener('submit', async function(e) {
                e.preventDefault();
                try {
                    const request = await fetch(e.target.action, {
                        credentials: 'include',
                        method: e.target.method,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(collectFormData(e.target))
                    });
                    const response = await request.json();
                    const data = await response;
                    // console.log(data);
                    // Got the Data
                    if(data.error) {
                        createAlert(data.error, 'danger');
                        return;
                    }
                    // change page to be rendered
                    if(data.status === 'ok') {
                        if(data.page === 'recipes') {
                            // console.log(data.data);
                            await recipesHome(data.data, 1);
                            return;
                        }
                        if(data.page === 'add-recipes'){
                            savedNewRecipe(data.data, element);
                            return;
                        }
                    }
                } catch (error) {
                    // console.log(JSON.stringify(error, null, 2));
                }

            })
        })
}
setupForms();

function savedNewRecipe(data, form) {
    if(Object.keys(data).length === 0) {
        Array.from(document.querySelectorAll(".ingreBoard-up label"))
            .forEach(element => {
                element.parentNode.removeChild(element);
            })
        createAlert(`Update Successful`, 'success');
    } else {
        Array.from(document.querySelectorAll(".ingreBoard label"))
            .forEach(element => {
                element.parentNode.removeChild(element);
            })
        createAlert(`${data.title} Successfully Added`, 'success');
    }
    form.reset();
    return;
}

async function recipesHome(data, pageNum) {
    // Set id of page to be viewed to title attribute of body tag
    document.body.setAttribute('data-title', 'recipes');

    document.getElementById('fullname').textContent += `${data.fullname}`;
    document.getElementById('email').textContent += `${data.email}`;
    document.getElementById('joinDate').textContent += `Joined since: ${new Date(data.createdAt).toDateString()}`;

    await getRecipes();
    renderView();
}

function renderView() {
    const currentView = document.body.getAttribute('data-title');
    // console.log(currentView)
    const pages = document.querySelectorAll('.container > div');
    // console.log(pages);
    pages.forEach(element => {
        if(element.id === currentView) {
            element.classList.toggle('d-none')
        } else {
            element.classList.contains('d-none')
                ?   void 0
                :   element.classList.add('d-none');
        }
    })
}

requestAnimationFrame(() => {
    const buttons = document.querySelectorAll('.card-header button')
    buttons.forEach(element => element.addEventListener('click', async function toggleViews(e) {
            document.body.setAttribute('data-title', e.target.dataset.replace);
            if(e.target.dataset.replace === 'recipes') {
                await getRecipes(1);
            }
            renderView();
        })
    )
    return;
})

function createAlert(message, type) {
    
    const alertBox = document.createElement('div')
    alertBox.classList.add(
        'alert',
        `alert-${type}`,
        'alert-dismissible',
        'fade',
        'show',
        'mx-5',
        'mt-5',
        'position-absolute',
        'end-0'
    )
    alertBox.setAttribute('role', 'alert');
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('btn-close');
    closeBtn.setAttribute('type', 'button');
    closeBtn.setAttribute('data-bs-dismiss', 'alert');
    closeBtn.setAttribute('aria-label', 'Close');
    const msg = document.createTextNode(`${message}`);
    alertBox.appendChild(msg);
    alertBox.appendChild(closeBtn);
    document.body.prepend(alertBox);
}

async function getRecipes(pageNumber = 1) {
    // Fetch Data about Users Recipes, then Render on page
    try {
        const request = await fetch(`/recipes?page=${pageNumber}`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });
        const response = await request.json();
        const data = await response;
        // console.log(data);
        
        const paginationTab = document.querySelector('#pagination');
        document.querySelector('#pagination').innerHTML = '';
        document.querySelector('#recipes-tab').innerHTML = '';

        paginationTab.appendChild(createPageLink('prev', (data.currentPage - 1 || 1), false));
        for(let i = 0, j = 1; i < data.count; i+=5, j++) {
            paginationTab.appendChild(createPageLink(`${j}`, j, (j === data.currentPage ? true : false)));
        }
        paginationTab.appendChild(createPageLink('next', (data.currentPage + 1), false));
        data.data.forEach(async (recipe) => {
            document.querySelector('#recipes-tab').appendChild(createRecipeCard(recipe))
        })
    } catch (error) {
        
    }

    return;
}

function createPageLink(text, pageNum, isActive) {
    const linkEle = document.createElement('li');
    linkEle.classList.add('page-item');
    const anchor = document.createElement('a');
    anchor.appendChild(document.createTextNode(text));
    anchor.classList.add('page-link');
    if(isActive) {
        linkEle.classList.add('active');
    }
    linkEle.appendChild(anchor);
    linkEle.addEventListener('click', () => getRecipes(pageNum))
    return linkEle;
}


function createRecipeCard(recipe) {
    const recipeCard = document.createElement('div');
    recipeCard.style.position = 'relative';

    const delForm = document.createElement('form');
    delForm.setAttribute('action', `/recipes/${recipe._id}?_method=DELETE`);
    delForm.setAttribute('method', 'POST')

    const delButton = document.createElement('input');
    delButton.classList.add('mx-2', 'btn', 'btn-sm', 'btn-secondary');
    delButton.setAttribute('type', 'submit');
    delButton.setAttribute('value', 'Delete');
    delForm.style.position = 'absolute';
    delForm.style.right = 0;

    // Start test
    delForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        try {
            const request = await fetch(e.target.action, {
                credentials: 'include',
                method: e.target.method,
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const response = await request.json();
            const data = await response;
            // console.log('From Delete: ', data);
            if(data.status === 'deleted') {
                await getRecipes();
            }
        } catch(error) {
            // console.log('From Deletion: ', error)
        }
    })

    // end of test
    const holder = document.createElement('div');
    const info_1 = document.createTextNode(`Title:  ${recipe.title}`);
    const info_2 = document.createTextNode(`Preparation:  ${recipe.preparation}`);

    delForm.appendChild(delButton);
    recipeCard.appendChild(delForm);
    holder.appendChild(info_1);
    holder.appendChild(document.createElement('br'));
    holder.appendChild(info_2);

    holder.addEventListener('click', async () => {
        await handleRecipeGet(recipe._id)
    })

    recipeCard.appendChild(holder)
    recipeCard.classList.add('card','p-3','mb-2', 'bg-transparent', 'text-light');
    return recipeCard;
}

async function handleRecipeGet(id) {
    try {
        const request = await fetch(`/recipes/${id}`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });
        const response = await request.json();
        const data = await response;
        await showSingle(data);
        // console.log('From single get: ', data);
    } catch(error) {
        // console.log('Single GET: ', error)
    }
}

async function showSingle(data) {

    document.body.setAttribute('data-title', 'upDate-recipes');
    document.getElementById('creator').reset();
    document.getElementById('creator').setAttribute('action', `/recipes/${data.data._id}?_method=PUT`);
    document.getElementById('title').value = data.data.title;
    document.getElementById('difficulty_level').value = data.data.difficulty_level;
    document.getElementById('meal_type').value = data.data.meal_type;
    document.getElementById('preparation').value = data.data.preparation;
    data.data.ingredients.forEach((element) => {
        document.querySelector('.ingreBoard-up').appendChild(createIngredient(element.name, element.price, '.ingreBoard-up')());
    });

    renderView();
}