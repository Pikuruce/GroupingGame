const svg = document.getElementById("circuit");

const radius = 100;
const humanTypes = 3;

let counter = 0;

// グループ円クラス
class GroupCircle {
    constructor(x, y, radius, parent) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.parent = parent;

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", radius);
        circle.style.fill = "none";
        circle.style.stroke = "black";
        circle.style.strokeWidth = "5px";

        this.parent.svg.appendChild(circle);
        
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x);
        label.setAttribute("y", y - 50);
        label.setAttribute("text-anchor", "middle");
        label.textContent = "グループ";

        this.parent.svg.appendChild(label);

        const group = {el: [circle, label], member: []};
        this.group = group;

        circle.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            this.parent.setOffset(e.offsetX - this.x, e.offsetY - this.y, this);
        });

        circle.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this.parent.removeObject(this);
        });
    }

}

// 人クラス
class Human {
    constructor(x, y, type, parent) {
        this.x = x;
        this.y = y;
        this.type = type; // 人のタイプ（例: 0, 1, 2）
        this.parent = parent;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x - 25);
        rect.setAttribute("y", y - 40);
        rect.setAttribute("width", 50);
        rect.setAttribute("height", 80);
        rect.setAttribute("fill", "white");

        this.parent.svg.appendChild(rect);

        const eye_1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        eye_1.setAttribute("x1", x - 15);
        eye_1.setAttribute("y1", y - 30);
        eye_1.setAttribute("x2", x - 15);
        eye_1.setAttribute("y2", y - 15);
        eye_1.setAttribute("stroke", "black");
        eye_1.setAttribute("stroke-width", "4");

        this.parent.svg.appendChild(eye_1);

        const eye_2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        eye_2.setAttribute("x1", x + 15);
        eye_2.setAttribute("y1", y - 30);
        eye_2.setAttribute("x2", x + 15);
        eye_2.setAttribute("y2", y - 15);
        eye_2.setAttribute("stroke", "black");
        eye_2.setAttribute("stroke-width", "4");

        this.parent.svg.appendChild(eye_2);

        const mouth = document.createElementNS("http://www.w3.org/2000/svg", "line");
        mouth.setAttribute("x1", x - 10);
        mouth.setAttribute("y1", y - 5);
        mouth.setAttribute("x2", x + 10);
        mouth.setAttribute("y2", y - 5);
        mouth.setAttribute("stroke", "black");
        mouth.setAttribute("stroke-width", "4");

        this.parent.svg.appendChild(mouth);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x);
        label.setAttribute("y", y + 20);
        label.setAttribute("text-anchor", "middle");
        label.textContent = (this.parent.humans.length+1);

        this.parent.svg.appendChild(label);

        const hand_1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        hand_1.setAttribute("x1", x - 25);
        hand_1.setAttribute("y1", y - 10);
        hand_1.setAttribute("x2", x - 30);
        hand_1.setAttribute("y2", y + 20);
        hand_1.setAttribute("stroke", "black");
        hand_1.setAttribute("stroke-width", "4");

        this.parent.svg.appendChild(hand_1);

        const hand_2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        hand_2.setAttribute("x1", x + 25);
        hand_2.setAttribute("y1", y - 10);
        hand_2.setAttribute("x2", x + 30);
        hand_2.setAttribute("y2", y + 20);
        hand_2.setAttribute("stroke", "black");
        hand_2.setAttribute("stroke-width", "4");

        this.parent.svg.appendChild(hand_2);

        const body = {el: [rect, eye_1, eye_2, mouth, hand_1, hand_2, label]};
        this.body = body;

        rect.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            this.parent.setOffset(e.offsetX - this.x, e.offsetY - this.y, this);
        });
    }
}

// ゲームマップクラス
class GameMap {
    constructor(svg) {
        this.svg = svg;
        this.groups = [];
        this.humans = [];
        this.draggingObj = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.turn = 0;
        this.maxturn = 0;
        this.scoreMemory = [];
        this.spy = true;
        this.difficulty = 0;
        this.colors = {0: "red", 1: "green", 2: "blue", 3: "yellow"};

        this.svg.addEventListener("dragover", e => e.preventDefault());
        this.svg.addEventListener("contextmenu", e => e.preventDefault());
        this.svg.addEventListener("drop", (e) => {
            e.preventDefault();
            if (this.turn < this.maxturn){
                const type = e.dataTransfer.getData("text/plain");
                if (type === "circle") {
                    const rect = svg.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    this.groups.push(new GroupCircle(x, y, radius, this));
                }
            }
        });

        this.svg.addEventListener("mousemove", (e) => {
            if (this.draggingObj !== null){
                const newX = e.offsetX - this.offsetX;
                const newY = e.offsetY - this.offsetY;
                const dx = newX - this.draggingObj.x;
                const dy = newY - this.draggingObj.y;

                this.draggingObj.x = newX;
                this.draggingObj.y = newY;

                if (this.draggingObj instanceof GroupCircle){
                    this.draggingObj.group.el.forEach(el => {
                        let tagName = el.tagName.toLowerCase();
                        if (tagName === "circle"){
                            let cx = parseFloat(el.getAttribute("cx"));
                            let cy = parseFloat(el.getAttribute("cy"));
                            el.setAttribute("cx", cx + dx);
                            el.setAttribute("cy", cy + dy);
                        } else if (tagName === "text"){
                            let x = parseFloat(el.getAttribute("x"));
                            let y = parseFloat(el.getAttribute("y"));
                            el.setAttribute("x", x + dx);
                            el.setAttribute("y", y + dy);
                        }
                    });
                } else if (this.draggingObj instanceof Human){
                    this.draggingObj.body.el.forEach(el => {
                        let tagName = el.tagName.toLowerCase();
                        if (tagName === "text"){
                            let x = parseFloat(el.getAttribute("x"));
                            let y = parseFloat(el.getAttribute("y"));
                            el.setAttribute("x", x + dx);
                            el.setAttribute("y", y + dy);
                        } else if (tagName === "line"){
                            let x1 = parseFloat(el.getAttribute("x1"));
                            let y1 = parseFloat(el.getAttribute("y1"));
                            let x2 = parseFloat(el.getAttribute("x2"));
                            let y2 = parseFloat(el.getAttribute("y2"));
                            el.setAttribute("x1", x1 + dx);
                            el.setAttribute("y1", y1 + dy);
                            el.setAttribute("x2", x2 + dx);
                            el.setAttribute("y2", y2 + dy);
                        } else if (tagName === "rect"){
                            let x = parseFloat(el.getAttribute("x"));
                            let y = parseFloat(el.getAttribute("y"));
                            el.setAttribute("x", x + dx);
                            el.setAttribute("y", y + dy);
                        }
                    });
                }
            }
        });
    }

    init() {
        const params = new URLSearchParams(window.location.search);
        this.difficulty = parseInt(params.get("difficulty"), 10);

        let human_number = 0;
        switch (this.difficulty){
            case 0:
                human_number = 6;
                this.maxturn = 7;
            break;
            case 1:
                human_number = 8;
                this.maxturn = 10;
            break;
            case 2:
                human_number = 10;
                this.maxturn = 15;
            break;
            case 99:
                human_number = 15;
                this.maxturn = 20;
            break;
        }
        for (let i = 0; i < human_number; i++){
            let rnd = new ReLCG(0, 100);
            let human;
            if ((rnd.random() < 100 / human_number || this.humans.length == human_number - 1) && this.spy){
                human = new Human(80, 80, humanTypes, this);
                this.spy = false;
            }else{
                let typernd = new ReLCG(0, humanTypes);
                human = new Human(80, 80, typernd.random(), this);
            }
            this.humans.push(human);
        }

        this.createTable();
    }

    setOffset(x, y, obj) {
        if (this.turn < this.maxturn) {
            this.draggingObj = obj;
            this.offsetX = x;
            this.offsetY = y;
        }
    }

    removeObject(obj) {
        if (this.turn < this.maxturn) {
            obj.group.el.forEach(el => el.remove());
            const index = this.groups.indexOf(obj);
            if (index !== -1) {
                this.groups.splice(index, 1);
            }
        }
    }

    getScore() {
        let score = 0;
        this.grouping();
        
        this.groups.forEach(pe => {
            let classes = new Array(humanTypes+1).fill(0);
            pe.group.member.forEach(e => {
                classes[e.type]++;
            });
            score += this.calculation(classes);
        });

        return score;
    }

    grouping() {
        this.groups.forEach(e => {
            e.group.member = [];
        });
        this.humans.forEach(e => {
            for (let i = 0; i < this.groups.length; i++){
                if (Math.sqrt(Math.pow(e.x - this.groups[i].x, 2) + Math.pow(e.y - this.groups[i].y, 2)) < this.groups[i].radius){
                    this.groups[i].group.member.push(e);
                    break;
                }
            }
        });
    }

    calculation(list){
        let maxType = Math.max(...list);
        if (list[humanTypes] > 0) return 0
        return Math.floor(Math.pow(2, maxType-1));
    }

    executeTurn() {
        if (this.turn < this.maxturn){
            this.scoreMemory.push(this.getScore());
            this.createTable();
            this.turn++;

            if (this.turn == this.maxturn){
                this.showHumanTypes();
                this.insertAnswer();
            }
        }
    }

    createTable() {
        let table = document.getElementById("scoreTable");
        table.innerHTML = "";
        let tr1 = document.createElement("tr");
        let th1 = document.createElement("th");
        let th2 = document.createElement("th");
        th1.textContent = this.maxturn + "日中";
        th2.textContent = "スコア";
        tr1.appendChild(th1);
        tr1.appendChild(th2);
        table.appendChild(tr1);

        for (let i = 0; i < this.scoreMemory.length; i++){
            let trn = document.createElement("tr");
            let td1 = document.createElement("td");
            let td2 = document.createElement("td");
            td1.textContent = (i+1) + "日目";
            td2.textContent = this.scoreMemory[i];
            trn.appendChild(td1);
            trn.appendChild(td2);
            table.appendChild(trn);
        }
    }

    showHumanTypes() {
        this.humans.forEach(e => {
            if (e.type == humanTypes) e.body.el[0].setAttribute("fill", "black");
            else e.body.el[0].setAttribute("fill", this.colors[e.type]);
        });
    }

    insertAnswer() {
        let table = document.getElementById("scoreTable");
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        td1.textContent = "理想値";
        td2.textContent = this.getAnswer();
        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);
    }

    getAnswer() {
        let humanslist = new Array(humanTypes).fill(0);
        this.humans.forEach(e => {
            if (e.type < humanTypes) humanslist[e.type]++;
        });

        let bestScore = 0;
        humanslist.forEach(e => {
            bestScore += Math.floor(Math.pow(2, e - 1));
        });

        return bestScore;
    }
}

let gameMap = new GameMap(svg);
gameMap.init();

document.addEventListener("selectstart", e => { e.preventDefault(); });

document.addEventListener("mouseup", (e) => {
    if (gameMap.draggingObj !== null){
        gameMap.draggingObj = null;
    }
});

document.querySelector(".groupCircle").addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", "circle");
});

document.getElementById("executeScore").addEventListener("click", (e) => {
    gameMap.executeTurn();
});

document.getElementById("showTable").addEventListener("click", () => {
    counter++;

    if (counter > 32){
        location.href = location.pathname + "?difficulty=99";
    }
});

document.getElementById("startGame").addEventListener("click", () => {
    const difficultySelect = document.getElementById("difficulty");
    switch (difficultySelect.value) {
        case "easy":
            location.href = location.pathname + "?difficulty=0";
            break;
        case "normal":
            location.href = location.pathname + "?difficulty=1";
            break;
        case "hard":
            location.href = location.pathname + "?difficulty=2";
            break;
    }
});