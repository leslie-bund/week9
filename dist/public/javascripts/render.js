
requestAnimationFrame(renderView);

const darkSwitch = document.getElementById("mySwitch");
darkSwitch.addEventListener('change', function toggleDark(e) {
    document.body.classList.toggle('darkmode');
})

function createIngredient(name, price) {
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
                document.querySelector('.ingreBoard')
                    .removeChild(document.getElementById(y));
            }
        })
        label.appendChild(inputTag)
        return label;
    }
}

document.getElementById('adder')
    .addEventListener('click', function addIngredients() {
        const name = document.getElementById('name')
        const price = document.getElementById('price')

        document.querySelector('.ingreBoard').appendChild(createIngredient(name.value, price.value)());
        name.setAttribute('value', '');
        price.setAttribute('value', '')
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
    console.log(data);
    return data;
}


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

                // Got the Data
                // change page to be rendered
                if(data.status === 'ok') {
                    if(data.page === 'recipes') {
                        await recipesHome(data.data, 1);
                    }
                    if(data.page === 'add-recipes'){
                        savedNewRecipe(data.data);
                    }
                }
            } catch (error) {
                console.log(error)
            }

        })
    })

function savedNewRecipe(data) {
    Array.from(document.querySelectorAll(".ingreBoard label"))
        .forEach(element => {
            element.parentNode.removeChild(element);
        })
    document.querySelector('#tmz').textContent = `${data.title}`
    document.querySelector('#usable-alert').classList.toggle('show');
    return;
}

async function recipesHome(data, pageNum) {
    // Set id of page to be viewed to title attribute of body tag
    document.body.setAttribute('title', 'recipes');

    document.getElementById('fullname').textContent = `${data.fullname}`;
    document.getElementById('email').textContent = `${data.email}`;
    document.getElementById('joinDate').textContent = `Joined since: ${new Date(data.createdAt).toDateString()}`;
    
    // Fetch Data about Users Recipes, then Render on page
    // try {
    //     const request = await fetch(`/recipes?page=1&time=300`, {
    //         credentials: 'include',
    //         method: 'GET',
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     });
    // } catch (error) {
        
    // }
    renderView();
}

function renderView() {
    const currentView = document.body.getAttribute('title');
    const pages = document.querySelectorAll('.container > div');
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
    buttons.forEach(element => element.addEventListener('click', function toggleViews(e) {
            document.body.setAttribute('title', e.target.dataset.replace);
            renderView();
        })
    )
    return;
})