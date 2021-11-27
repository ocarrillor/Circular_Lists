class Base {
    constructor(name, minutes) {
        this.name = name;
        this.minutes = minutes;
        this.before = null;
        this.next = null;
    }

    getName() {
        return this.name;
    }

    getMinutes() {
        return this.minutes;
    }

    getInfo() {
        return `Base: ${this.name}, Duración: ${this.minutes} minutos`
    }

}

class Route {
    constructor() {
        this.start = null;
        //this.before = null;
        //this.next = null;
    }

    add(base) {
        if(this.start == null) {
            this.start = base;
            base.next = this.start;
            base.before = this.start;
        } else {
            let last = this.start.before;
            base.next = this.start;
            base.before = last;
            last.next = base;
            this.start.before = base;
        }
    }
 
    delete(name) {
        let temp = this.start;
        let last = this.start.before;
        let del = null;
        if(this.start == null) {
            return null;
        } else if(this.start.getName() == name){
            del = this.start;
            if(this.start.next == this.start) { //Eliminar primer base cuando solo hay una.
                this.start = null;
                this.start.next = null;
                this.start.before = null;
            } else{ //Eliminar primer base cuando hay mas de una.
                last.next = this.start.next;
                this.start.next.before = last;
                this.start = this.start.next;
            }
        } else{ //Eliminar base de en medio.
            temp = this.start.next;
            while(temp != this.start && del == null) { 
                if(temp.getName() == name) { 
                    del = temp;
                    temp.before.next = temp.next;
                    temp.next.before = temp.before;
                    temp.next = null;
                    temp.before = null;
                } else{ 
                    temp = temp.next;
                }
            }
        }
        return del;
    }

    list() {
        if(this.start == null) {
            return '<div>La lista está vacía </div>';
        }
        else {
            console.log(this.start.before);
            let listInfo = '';
            console.log(this.start);
            let temp = this.start;
            do {
               listInfo += `<div>${temp.getInfo()}</div></br>`;
                temp = temp.next;
            } while (temp != this.start);
            return listInfo;
        }
    }
}

let route = new Route();

let details = document.getElementById('details');

const btnAdd = document.getElementById('btnAdd');
btnAdd.addEventListener('click', () => {
    let name = document.getElementById('nameA').value;
    let duration = document.getElementById('minA').value;
    let newBase = new Base(name, duration);
    route.add(newBase);
    details.innerHTML = `<div>La base "${newBase.getName()}" se ha añadido con éxito</div>`;
});

const btnDelete = document.getElementById('btnDelete');
btnDelete.addEventListener('click', () =>{
    let name = document.getElementById('nameD').value;
    if(route.delete(name) == null) {
        details.innerHTML = '<div> No se ha eliminado ninguna base </div>';
    }else{
        details.innerHTML = `<div>La base "${name}" ha sido eliminada con éxito</div>`;
    }
});

const btnList = document.getElementById('btnList');
btnList.addEventListener('click', () =>  {

    if(route.list() == null) {
        details.innerHTML = '<div>La lista está vacía </div>';
    }else{
        details.innerHTML = `${route.list()}`
    }
});