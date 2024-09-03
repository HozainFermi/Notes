var displays = ["flex", "block"];

const addbtn = document.getElementsByClassName('add')[0];
const savebtn = document.getElementsByClassName('save')[0];
const changedisplaybtn = document.getElementsByClassName('changedisplay')[0];
const resetbtn = document.getElementsByClassName('reset')[0];

const mainwrap = document.getElementsByClassName('main-wrap')[0];

const sortcheckbox = document.getElementById('sortcheckbox');
const titleinput = document.getElementById('Title_input');
const descinput = document.getElementById('Desc_input');
const colorinput = document.getElementById('Color_input');
const isMarkedinput = document.getElementById('IsMarked_input');
const sendbtn = document.getElementById('submit_input');



let gapout = document.getElementById('gap');
const gapsld = document.getElementById('gapsld');

let rowgapout = document.getElementById('rowgap');
const rowgapsld = document.getElementById('rowgapsld');

let colgapout = document.getElementById('colgap');
const colgapsld = document.getElementById('colgapsld');

let widthout = document.getElementById('width');
const widthsld = document.getElementById('widthsld');

let heightout = document.getElementById('height');
const heightsld = document.getElementById('heightsld');


gapsld.oninput = function () {
    gapout.innerHTML = 'gap:' + this.value;
    mainwrap.setAttribute("style", `gap:${this.value}px`);
}
rowgapsld.oninput = function () {
    rowgapout.innerHTML = 'row gap:' + this.value;
    mainwrap.style.rowGap = this.value + 'px';
}
colgapsld.oninput = function () {
    colgapout.innerHTML = 'column gap:' + this.value;
    mainwrap.style.columnGap = this.value + 'px';

}
widthsld.oninput = function () {
    widthout.innerHTML = 'width:' + this.value;
    let textareas = document.getElementsByClassName('textarea');

    for (let i = 0; i < textareas.length; i++) {
        textareas[i].style.width = this.value + 'em';
    }

}

heightsld.oninput = function () {
    heightout.innerHTML = 'height:' + this.value;
    let textareas = document.getElementsByClassName('textarea');

    for (let i = 0; i < textareas.length; i++) {
        textareas[i].style.height = this.value + 'em';
    }


}

getallNotes();
changedisplaybtn.addEventListener('click', changedisplay);
sortcheckbox.addEventListener('click', sortcards);
sendbtn.addEventListener('click', function () {
    addNote(titleinput.value, descinput.value, `${colorinput.value}`, isMarkedinput.checked);
})

function changedisplay() {

    displays.push(displays[0]);
    displays.shift();

    let elem = document.getElementsByClassName('main-wrap')[0];
    elem.style.display = displays[0];

    if (displays[0] == "block") {

        let textareas = document.getElementsByClassName('textarea');

        for (let i = 0; i < textareas.length; i++) {
            textareas[i].setAttribute("style", "width:-webkit-fill-available");
        }
    }
    if (displays[0] == "flex") {
        document.querySelector(`.card textarea`).style.width = "";
    }
}

function sortcards() {
}

function addEvents(collection) {

    for (let element = 0; element < collection.length; element++) {


        collection[element].querySelector('.card_color_btn').oninput = function () {
            collection[element].querySelector('.title').style.backgroundColor = this.value;
            collection[element].querySelector('.bottomfield').style.backgroundColor = this.value;
        }

        collection[element].querySelector('.card_mark_btn').addEventListener('click', function () {

            collection[element].querySelector('.title').style.backgroundColor = 'red';
            collection[element].querySelector('.bottomfield').style.backgroundColor = 'red';
        });

        collection[element].querySelector('.card_delete_btn').addEventListener('click', function () {

            fetch(`http://localhost:5202/api/Notes/${collection[element].id}`, {
                method: 'DELETE'

            });

            collection[element].remove();

        });
    }
}

function displayNote(id, title, description, color) {

    let carddiv = document.createElement('div');
    carddiv.className = 'card';
    carddiv.id = id;

    let titletextarea = document.createElement('textarea');
    titletextarea.className = "title";
    titletextarea.spellcheck = false;
    titletextarea.style.backgroundColor = color;
    titletextarea.innerText = title;

    let mainfielddiv = document.createElement('div');

    let formelem = document.createElement('form');

    let desc = document.createElement('textarea');
    desc.className = 'textarea';
    desc.innerText = description;

    let bottomdiv = document.createElement('div');
    bottomdiv.className = "bottomfield";
    bottomdiv.style.backgroundColor = color;
    let cmb = document.createElement('button');
    cmb.className = 'card_mark_btn';
    cmb.innerText = "mark";
    let cinp = document.createElement('input');
    cinp.className = 'card_color_btn';
    cinp.type = "color";
    cinp.value = color;
    let dbtn = document.createElement('button');
    dbtn.className = "card_delete_btn";
    dbtn.innerText = "delete";

    bottomdiv.appendChild(cmb);
    bottomdiv.appendChild(cinp);
    bottomdiv.appendChild(dbtn);

    formelem.appendChild(desc);
    mainfielddiv.appendChild(formelem);

    carddiv.appendChild(titletextarea);
    carddiv.appendChild(mainfielddiv);
    carddiv.appendChild(bottomdiv);

    mainwrap.appendChild(carddiv);
}



function addNote(title, description, color, IsMarked) {

    const body = {
        Title: title,
        Description: description,
        Color: color,
        IsMarked: IsMarked
    };
    const resp = '';

    fetch('http://localhost:5202/api/Notes', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }

    })
        .then(data => data.json())
        .then(response => resp = JSON.stringify(response));

    displayNote(resp.id, resp.title, resp.description, resp.color);

}



function getallNotes() {

    fetch('http://localhost:5202/api/Notes')
        .then(data => data.json())
        .then(response => displayallNotes(response));
}

function displayallNotes(notes) {

    let all = JSON.stringify(notes);

    let allNotes = '';

    notes.forEach(element => {
        const noteElement =
            `
    <div class="card" id="${element.id}" >
        <textarea class="title" spellcheck="false" style="background-color:${element.color};">${element.title}</textarea>
        <div class="mainfield">
            <form>
                <textarea class="textarea">
                    ${element.description}
                </textarea>
            </form>
        </div>
        <div class="bottomfield" style="background-color:${element.color};" >
            <button class="card_mark_btn">mark</button>
            <input  class="card_color_btn" type="color" value="${element.color}" >
            <button class="card_delete_btn">delete</button>
        </div>
    </div>
    `;

        allNotes += noteElement;
    });

    mainwrap.innerHTML = allNotes;

    let cards = document.getElementsByClassName('card');
    addEvents(cards);
}



