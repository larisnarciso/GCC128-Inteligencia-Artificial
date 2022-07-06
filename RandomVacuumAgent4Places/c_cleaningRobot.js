const SIZE = 100;
const colors = {
  perceptBackground: "hsl(240,10%,85%)",
  perceptHighlight: "hsl(60,100%,90%)",
  actionBackground: "hsl(0,0%,100%)",
  actionHighlight: "hsl(150,50%,80%)",
};

function makeDiagram(selector) {
  let diagram = {}, world = new World(4);
  diagram.world = world;
  diagram.xPosition = (floorNumber) => (floorNumber % 2 != 0 ? 400 : 100);        // Posicionamento X dos pisos
  diagram.yPosition = (floorNumber) => (floorNumber >= 2 ? 400 : 100);            // Posicionamento Y dos pisos

  diagram.root = d3.select(selector);
  diagram.robot = diagram.root.append("g")
    .attr("class", "robot")
    .style("transform",`translate(${diagram.xPosition(world.location)}px,100px)`);
  diagram.robot.append("rect")
    .attr("width", SIZE)
    .attr("height", SIZE)
    .attr("fill", "hsl(199, 76%, 73%)");    // Cor do aspirador 
  diagram.perceptText = diagram.robot .append("text")
    .attr("x", SIZE / 2)
    .attr("y", -25)
    .attr("text-anchor", "middle");
  diagram.actionText = diagram.robot.append("text")
    .attr("x", SIZE / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle");

  diagram.floors = [];
  for (let floorNumber = 0; floorNumber < world.floors.length; floorNumber++) {
    diagram.floors[floorNumber] = diagram.root.append("rect")
      .attr("class", "clean floor") // for css
      .attr("x", diagram.xPosition(floorNumber))
      .attr("y", diagram.yPosition(floorNumber) + 110)        //
      .attr("width", SIZE)
      .attr("height", SIZE / 4)
      .attr("stroke", "black")
      .on("click", function () {
        world.markFloorDirty(floorNumber);
        diagram.floors[floorNumber].attr("class", "dirty floor");
      });
  }

  return diagram;
}

function renderWorld(diagram) {
  for ( let floorNumber = 0; floorNumber < diagram.world.floors.length; floorNumber++ ) {
    diagram.floors[floorNumber].attr( "class", diagram.world.floors[floorNumber].dirty ? "dirty floor" : "clean floor" );
  }
  diagram.robot.style("transform",`translate(${diagram.xPosition( diagram.world.location )}px,${diagram.yPosition(diagram.world.location)}px)`);          //
}

function renderAgentPercept(diagram, dirty) {
  let perceptLabel = { false: "It's clean", true: "It's dirty" }[dirty];
  diagram.perceptText.text(perceptLabel);
}

function renderAgentAction(diagram, action) {
  let actionLabel = {
    null: "Waiting",
    SUCK: "Vacuuming",
    LEFT: "Going Left",
    RIGHT: "Going Right",
    DOWN: "Going Down",
    UP: "Going Up",
    "DIAGONAL-P": "Going Diagonal",                       //
    "DIAGONAL-S": "Going Diagonal",                         //
  }[action];
  diagram.actionText.text(actionLabel);
}

const STEP_TIME_MS = 2500;
function makeAgentControlledDiagram() {
  let diagram = makeDiagram("#agent-controlled-diagram svg");
  
  function update() {
    let location = diagram.world.location;
    let percept = diagram.world.floors[location].dirty;
    let action = reflexVacuumAgent(diagram.world);
    diagram.world.simulate(action);
    renderWorld(diagram);
    renderAgentPercept(diagram, percept);
    renderAgentAction(diagram, action);
    makeRandomDirty(diagram);                                  // Função de piso sujo aleatoriamente
    
  }
  update();
  setInterval(update, STEP_TIME_MS);
}

// Função que deixa o piso sujo aleatoriamente

function makeRandomDirty(diagram){
  var randomDirty = Math.floor(Math.random() * 10) + 1;         // Retorna numeros inteiros de 1 a 10
  if (randomDirty > 6){                                        // Se o numero for entre 7 e 10
    var floorNumber = Math.floor(Math.random() * diagram.world.floors.length);    // Retorno de forma aleatoria algum dos pisos
    diagram.world.markFloorDirty(floorNumber);
    diagram.floors[floorNumber].attr('class', 'dirty floor');
  }
}

makeAgentControlledDiagram();
