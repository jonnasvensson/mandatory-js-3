let main = document.querySelector('main');
let imgContainer = document.querySelector('.imgContainer');
let h1 = document.querySelector('h1');
let iconheader = document.querySelector('.iconheader');
let footer = document.querySelector('footer');
let iconfooter = document.querySelector('.iconfooter');

let select = document.createElement('select');
let ul = document.createElement('ul')
let p = document.createElement('p');

iconfooter.addEventListener('click', reloadPage);
iconheader.addEventListener('click', clicki)

let currentBreed;
let allSubBreeds;
let option;

axios.get("https://dog.ceo/api/breeds/list/all")
.then(respons => {
    let breeds = respons.data.message;
    renderBreeds(breeds);
    reloadPage();
})

function renderBreeds(message) {
    let startOption = document.createElement('option');
    select.appendChild(startOption);
    startOption.textContent = "";

    for (let dogs in message) {
        option = document.createElement('option');
        
        footer.appendChild(select);
        select.appendChild(option);
        option.textContent = capitalize(dogs);
    }    

}    

function selected(select) {
    for (let i = 0; i < select.length; i++) {
        if (select.options[i].selected) {
            currentBreed = select.options[i].text;
        }        
    }
} 

select.addEventListener('change', function() {
    imgContainer.innerHTML = "";
    ul.innerHTML = "";
    p.innerHTML = "";
    h1.textContent = select.value; 
    
    console.log("breedpics", this.value);
    getBreedspics(this.value);
    
    console.log("subbreeds", this.value);
    getSubBreeds(this.value);
});


function getimgs() {
    axios.get("https://dog.ceo/api/breeds/image/random/3")
    .then(respons => {
    let images = respons.data.message;
    renderImg(images);
    })
}


function getBreedspics(value) {
    window.location.hash = value;    
    value = value.toLowerCase();
    axios.get("https://dog.ceo/api/breed/" + value + "/images/random/3")
    .then(respons => {
        let subBreeds2 = respons.data.message;
        renderImgByBreed(subBreeds2);
    })
}

function renderImg(images) {
    imgContainer.innerHTML = "";
    for (let img of images) {
    let div = document.createElement('div');
    let imgs = document.createElement('img');
    imgContainer.appendChild(div);
    div.appendChild(imgs);

    div.classList = 'imgdiv';
    imgs.src = img;
   }
}

function reloadPage() {
    imgContainer.innerHTML = "";
    let currentBreed = window.location.hash;
    let split = window.location.hash.substring(1).split("-"); 
    ul.innerHTML = "";

    if (split.length === 2) {
        let breed = split[0];
        let subbreed = split[1];
        getimgsSubBreeds(breed, subbreed);
        h1.textContent = capitalize(subbreed);
        select.value = breed;
        getSubBreeds(breed);
    } else if (split.length === 1 && window.location.hash){  
        let breed = split[0];
        getBreedspics(breed);
        select.value = breed;
        h1.textContent = capitalize(breed);
        getSubBreeds(breed);
    } else {       
        getimgs();   
    }
}

function clicki() {    
    window.location.href = "index.html"; 
    getimgsSubBreeds()
}

function renderImgByBreed(arr) { 
    for (let imageByBread of arr) {
        console.log(imageByBread);
        let divBreed = document.createElement('div');
        console.log(divBreed);
        
        divBreed.classList = 'imgdiv';
        imgContainer.appendChild(divBreed);
        let imgsBreed = document.createElement('img');
        imgsBreed.setAttribute("src", imageByBread);  
        divBreed.appendChild(imgsBreed);
    }
}

function reqListenerSubBreeds() {
    let subBreeds = JSON.parse(this.responseText).message;
    if (subBreeds.length > 0) {
        p.remove();
        renderSubBreeds(subBreeds);
    } else {
        ul.remove();
        noSubBreeds();
    }
}

function getSubBreeds(breedValue) {
    let oReqSubBreeds = new XMLHttpRequest();
    oReqSubBreeds.addEventListener("load", reqListenerSubBreeds);
    breedValue = breedValue.toLowerCase();
    oReqSubBreeds.open("GET", "https://dog.ceo/api/breed/" + breedValue + "/list");
    oReqSubBreeds.send();   
}

function renderSubBreeds(array) {
    footer.appendChild(ul);    
    for (let allSubBreeds of array) {
        let li = document.createElement('li');
        ul.appendChild(li);
        li.textContent = capitalize(allSubBreeds);

        li.addEventListener('click', (e) => {
            let breed = window.location.hash.substring(1).toLowerCase().split("-")[0];
            window.location.hash = breed + "-" + allSubBreeds; 
            console.log('Hej');
            getimgsSubBreeds(breed, allSubBreeds);         
            let h1 = document.querySelector('h1');
            li = e.target;
            h1.textContent = capitalize(li.innerHTML);
        });
    }   
}

function noSubBreeds() {
    footer.appendChild(p);
    p.textContent = "No sub breed on this beautiful dog"
}

function getimgsSubBreeds(breed, getSubBreedsPics) {    
    axios.get("https://dog.ceo/api/breed/" + breed + "/" + getSubBreedsPics + "/images/random/3")
    .then(respons => {
    let imagesSubBreeds = respons.data.message;
    renderImg(imagesSubBreeds);    
    })
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

