//======TRIES==================================================================================
const items = ['nike','adidas','kfc','chocoshop','big bazaar','dominos','hnm', 'shoes','accessories', 'shirts',  'jeans', 'chips', 'wheat', 'sugar','fast food', 'chicken', 'sportswear', 'pizza', 'pasta', 'brownies',  'chocolates'];

const root = new makeNode('\0');
for(const i of items){
    add(i ,0 ,root);
}

const text = document.getElementById("in");
const list = document.getElementById('hi');

function handler(e) {
    const str = e.target.value;
    if(str ==="") 
    {
        list.innerHTML = "";
    }
    else{
        const predictions = search(str, 0, root);
        
        list.innerHTML = "";
        for (const prediction of predictions)
            list.innerHTML += `<li class="list-group-item clickable" onclick="searchClick(this)"><b>${str}</b>${prediction.substring(str.length)}</li>`;
    }        
    
}

text.addEventListener("keyup",handler);

function makeNode(ch) {
    this.ch = ch;
    this.isTerminal = false;
    this.map = {};
    this.words = [];
}

function add(str, i, root) {

    if (i === str.length) {
        root.isTerminal = true;
        return;
    }

    if (!root.map[str[i]])
        root.map[str[i]] = new makeNode(str[i]);

    root.words.push(str);
    add(str, i + 1, root.map[str[i]]);
}

function search(str, i, root) {
    if (i === str.length)
        return root.words;

    if (!root.map[str[i]])
        return [];
    return search(str, i + 1, root.map[str[i]]);

}
//==================================================================================

//===================================POP UP SEARCH ===============================================
var modal = document.getElementById("myModal");

function displaySearch(){
    modal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
      text.value = "";
      list.innerHTML = "";
      modal.style.display = "none";
  }
}
//==================================================================================


/////////===================================MOVEMENT AND LIGHTING UP CELLS==========================================////////////////////////
var speedX = 37;
var speedY = 24;
var numDiv = 1600;
var currCell = -119;

objImage = document.getElementById("man");				
objImage.style.position='relative';
objImage.style.left='0px';
objImage.style.top='96px';

var visited = [];

function moveLeft(){
    objImage.style.transform = 'scaleX(-1)';
    objImage.style.left=parseInt(objImage.style.left)-speedX +'px';
    currCell -= 1;
}

function moveUp(){
    objImage.style.top=parseInt(objImage.style.top)-speedY +'px';
    currCell -= rows;
}
function moveRight(){
    objImage.style.transform = 'none';
    objImage.style.left=parseInt(objImage.style.left)+speedX +'px';
    currCell += 1;
}
function moveDown(){
    objImage.style.top=parseInt(objImage.style.top)+speedY +'px';
    currCell += rows;
}


function getKeyAndMove(e){
    
    var key_code=e.which||e.keyCode;
    
    switch(key_code){
        case 37: //left arrow key
            moveLeft();
				break;
        case 38: //Up arrow key
            moveUp();
				break;
        case 39: //right arrow key
            moveRight();
				break;
        case 40: //down arrow key
            moveDown();
				break;		
        case 83: //s  key
            displaySearch();
				break;	
        case 73: //i  key
            instructionDisplay();
				break;
		}
}

//==================================================================================

//=============================FINDING PATH=====================================================

// defining the rows an columns for the implementation of shopping mall map

var rows=40;
var cols=40;

Graph= new Array(rows);

for(var i=0;i<rows;i++)
{
    // making graph into a 2D Array form.......
    Graph[i]=new Array(cols);
}

for(var i=0;i<rows;i++)
{
    for(var j=0;j<cols;j++)
    {
        var index=rows*i+j+1;
        Graph[i][j]=index.toString();
    }
}

//============================================== A STAR ALGORITHM  =================


var path=[];
var prevPath = [];
var Choice=[[1,1],[1,0],[0,1],[-1,0],[0,-1],[1,-1],[-1,1],[-1,-1]];
var OpenSet=[];
var CloseSet=[];

function Point(i,j)
{
    this.i=i;
    this.j=j;
    this.f=0;
    this.g=0;
    this.h=0;
    this.neighbors=[];
    this.parent=undefined;  // for backtracking the path..
    this.wall=false;

    // adding all the neighbors for a specific point...
    this.addNeighbors = function(Grid)
    {
        var x=this.i;
        var y=this.j;

        for(var k=0;k<8;k++)
        {
            var NewX=x+Choice[k][0];
            var NewY=y+Choice[k][1];

            if(NewX>=0 && NewX<rows && NewY>=0 && NewY<cols)  // to ensure the person chooses a possible path in mall
            {
                this.neighbors.push(Grid[NewX][NewY]);
            }
        }
    }

}

function makeGrid(){
    
    var Grid= new Array(rows);
    
    for(var i=0;i<rows;i++) 
        Grid[i]=new Array(cols);
    
    for(var i=0;i<rows;i++){
        
        for(var j=0;j<cols;j++)
            Grid[i][j]= new Point(i,j);
    }
    
    for(var i=0;i<rows;i++){

        for(var j=0;j<cols;j++)
            Grid[i][j].addNeighbors(Grid); // adding possible neighbors..

    }

    // marking the shops as walls 

    // choco shop
    for(var i = 0; i<3; i++){
        for(var j = 12; j<24;j++)
            Grid[i][j].wall = true;
    }
    
    // hnm
    for(var i = 4; i<16; i++){
        for(var j = 0; j<4;j++)
            Grid[i][j].wall = true;
    }
    // adidas
    for(var i = 8; i<16; i++){
        for(var j = 12; j<20;j++)
            Grid[i][j].wall = true;
    }


    // big bazaar
    for(var i = 4; i<17; i++){
        for(var j = 33; j<40;j++)
            Grid[i][j].wall = true;
    }

    // nike
    for(var i = 20; i<28; i++){
        for(var j = 32; j<40;j++)
            Grid[i][j].wall = true;
    }

    // kfc
    for(var i = 25; i<33; i++){
        for(var j = 0; j<8;j++)
            Grid[i][j].wall = true;
    }

    // dominos
    for(var i = 33; i<40; i++){
        for(var j = 16; j<24;j++)
            Grid[i][j].wall = true;
    }
    
    return Grid;
}



function manHattanDistance(sr,sc,er,ec) {
    return Math.max(Math.abs(er-sr),Math.abs(ec-sc));  // shortcut if diagonals are possible
}

function RemoveElement(arr,ele)
{
    for(var i=arr.length-1;i>=0;i--){
        if(arr[i]==ele)
          arr.splice(i,1);
    }
}



function AstarAlgorithm(sr,sc,er,ec)
{
    
    Grid = makeGrid();
    OpenSet.push(Grid[sr][sc]);
    var end=Grid[er][ec];

    // almost like a djikstra's loop but consider the modified manhattan distance
    while(OpenSet.length > 0)
    {
       var LowestIndex=0;
       for(var i=0;i<OpenSet.length;i++)
       {
           if(OpenSet[i].f < OpenSet[LowestIndex].f)
           {
               LowestIndex=i;
           }

           else if (OpenSet[i].f == OpenSet[LowestIndex].f) // preference in a tied case handle by initially heavy route..
           {

              if (OpenSet[i].g > OpenSet[LowestIndex].g) {
                  LowestIndex = i;
               }
           }
       }

       var current=OpenSet[LowestIndex];

       if(current==end)
       {
           var temp=current;
           path.push(temp);

           while(temp.parent)
           {
               path.push(temp.parent);
               temp=temp.parent;
           }

           break;
       }
 
        RemoveElement(OpenSet,current);
        CloseSet.push(current);

        var neighbors=current.neighbors;

        for(var i=0;i<neighbors.length;i++)
        {
            var neighbor=neighbors[i];

            if(!CloseSet.includes(neighbor) && !neighbor.wall)
            {
                var smallans=current.g+1;

                if(OpenSet.includes(neighbor))
                {
                    neighbor.g=Math.min(neighbor.g,smallans);
                }

                else 
                {
                    neighbor.g=smallans;
                    OpenSet.push(neighbor);
                }

                neighbor.h=manHattanDistance(neighbor.i,neighbor.j,end.i,end.j);
                neighbor.f=neighbor.g + neighbor.h;
                neighbor.parent=current;
            }
        }
    }
    var newpath=[];
    newpath.push(end);
    for(var i=path.length-1;i>0;)
    {
       var element=path[i];
       for(var j=0;j<i;j++)
       {
          if(element.neighbors.includes(path[j]))
          {
              newpath.push(path[j]);
              i=j;
              break;
          }
       }
    }

    path=[];
    path.push(Grid[sr][sc]);
    for(var i=newpath.length-1;i>=0;i--)
    {
        path.push(newpath[i]);
    }


}

//==================================================================================


function colourPath(){
     
    for(var i = 0; i < path.length; i++){
        var x=path[i].i;
        var y=path[i].j;
        document.getElementById(Graph[x][y]).classList.add("colourPath");
    }
}

function makePath(sr, sc, er, ec) {
    
    AstarAlgorithm(sr,sc,er,ec);
    colourPath();
    
}

//==================================================================================
var map={};   // the hashmap ..


//SHOPS
map["adidas"]=460;
map["hnm"]=364;
map["big bazaar"]=392;
map["kfc"]=1168;
map["nike"]=1156;
map["dominos"]=1299;
map["chocoshop"]=177;
//ITEMS
map["shoes"]=460;
map["accessories"]=364;
map["shirts"]=364;
map["jeans"]=364;
map["chips"]=392;
map["wheat"]=392;
map["sugar"]=392;
map["fast food"]=1168;
map["chicken"]=1168;
map["sportswear"]=1156;
map["pizza"]=1299;
map["pasta"]=1299;
map["chocolates"]=177;
map["brownies"]=177;

function GetCoordinates(str)
{
    var temp=map[str]; // getting the coordinates in a string form

    var index=[];
    index.push(Math.floor(temp / rows));
    index.push(temp % rows);

    return index;
}

function getCurrentLocation(){
    
    var value = currCell - 1;
    
    if(currCell <= 0)
        value = 0;
    
    startingLocation = [];
    startingLocation.push(Math.floor(value / rows));
    startingLocation.push(value % rows);
    return startingLocation;
}

function searchClick(e){
    
    
    for(var i = 0; i < prevPath.length; i++){
        var x=prevPath[i].i;
        var y=prevPath[i].j;
        document.getElementById(Graph[x][y]).classList.remove("colourPath");
    }
    
    
    text.value = e.innerText;
    list.innerHTML = "";
    modal.style.display = "none";
    
    endLocation = GetCoordinates(e.innerText);
    startingLocation = getCurrentLocation();
    makePath(startingLocation[0], startingLocation[1], endLocation[0], endLocation[1]);
    prevPath = path.reverse();
    text.value = "";
    list.innerHTML = "";
    
    path = [];
    OpenSet = [];
    CloseSet = [];
}

function getPathByImage(str){
    
    for(var i = 0; i < prevPath.length; i++){
        var x=prevPath[i].i;
        var y=prevPath[i].j;
        document.getElementById(Graph[x][y]).classList.remove("colourPath");
    }
    
    endLocation = GetCoordinates(str);
    startingLocation = getCurrentLocation();
    makePath(startingLocation[0], startingLocation[1], endLocation[0], endLocation[1]);
    prevPath = path.reverse();
    path = [];
    OpenSet = [];
    CloseSet = [];
    
}
//==============================ADDING CLICKS TO EACH SHOP====================================================
chocoshop = document.getElementsByClassName("lindt")[0];
bb = document.getElementsByClassName("bb")[0];
kfc = document.getElementsByClassName("kfc")[0];
dm = document.getElementsByClassName("dominos")[0];
ad = document.getElementsByClassName("adidas")[0];
hm = document.getElementsByClassName("hm")[0];
nike = document.getElementsByClassName("nike")[0];

chocoshop.addEventListener("click", function(){
    getPathByImage("chocoshop")});
bb.addEventListener("click", function(){
    getPathByImage("big bazaar")});
kfc.addEventListener("click", function(){
    getPathByImage("kfc")});
dm.addEventListener("click", function(){
    getPathByImage("dominos")});
ad.addEventListener("click", function(){
    getPathByImage("adidas")});
hm.addEventListener("click", function(){
    getPathByImage("hnm")});
nike.addEventListener("click", function(){
    getPathByImage("nike")}); 
//==================================================================================
//=================================INSTRUCTION MANUAL=================================================

function instructionDisplay(){
        modal2.style.display = "block";
}

var modal2 = document.getElementById("myModal2");
ins = document.getElementById("instr-btn");
ins.addEventListener("click", instructionDisplay);

window.onclick = function(event) {
    
  if (event.target == modal2) 
      modal2.style.display = "none";
}
//==================================================================================