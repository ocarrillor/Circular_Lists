class Base {
    constructor(name, minutes) {
        this.name = name;
        this.minutes = Number(minutes);
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

    infoCard(hour, minutes) {
        return `<div><p>Base: ${this.getName()}</p><p>Hora de llegada: ${hour}</p><p>Minutos restantes: ${minutes}</p>                                 
                </div>`;
    }
}

class Route {
    constructor() {
        this.start = null;
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
                this.start.next = null;
                this.start.before = null;
                this.start = null;
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
            let listInfo = '';
            let temp = this.start;
            do {
               listInfo += `<div>${temp.getInfo()}</div></br>`;
                temp = temp.next;
            } while (temp != this.start);
            return listInfo;
        }
    }

    createCard(base, hour, minutesR) {
        let card = '';   
        let time = 0;
        let find = this._findBase(base);

        if(!find) {
            return null;
        } else {
            do{
                card += find.infoCard(this._hoursConvert(hour, time), minutesR) + '\n' + '------------------------------';               
                time += find.next.getMinutes();
                minutesR -= find.next.getMinutes();
                find = find.next;
            }while(minutesR >= 0);
            return card;
        }   
    }
    
    _hoursConvert(hour, minutes) {
        let hourMinutes = ((hour * 60) + minutes) / 60;
        let hoursTotal = Math.trunc(hourMinutes);
        let minusMinutes = Math.round((hourMinutes - hoursTotal) * 60);
        if(minusMinutes < 10) {
            return `${hoursTotal}:0${minusMinutes}`;
        } else {
            return `${hoursTotal}:${minusMinutes}`;
        }
    }

    _findBase(name) {
        let base = this.start;
        if(!base) {
            return null;
        } else {
            do{
                if(base.getName() == name) {
                    return base;
                } else {
                    base = base.next;
                }
            } while(base !== this.start);
            return null;
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

let btnCreateCard = document.getElementById('btnCreateCard');
btnCreateCard.addEventListener('click', () =>{
    let base = document.getElementById('base').value;
    let hour = Number(document.getElementById('hour').value);
    let minutes = Number(document.getElementById('minC').value); 
    let cardCreated = route.createCard(base, hour, minutes);
    if(!route) {
        details.innerHTML = '<div>La lista está vacía</div>';
    } else if(!cardCreated) {
        details.innerHTML = `<div>La base: ${base} no existe</div>`;
    } else {
        details.innerHTML = `<div>${cardCreated}</div>`;
    }
});