class World {
  constructor(numFloors) {
    this.location = 2;
    this.floors = [];
    for (let i = 0; i < numFloors; i++) {
      this.floors.push({ dirty: false });
    }
  }

  markFloorDirty(floorNumber) {
    this.floors[floorNumber].dirty = true; //Deixa o chão sujo
  }


  simulate(action) {
    switch (action) {

      case "SUCK":
        this.floors[this.location].dirty = false;
        break;

      case "LEFT":
        this.location = 2;
        break;

      case "RIGHT":
        this.location = 1;
        break;

      case "DOWN":
        this.location = 3;
        break;
      
      case "UP":
        this.location = 0;
        break;

      case "DIAGONAL-P":
        if (this.location == 0){
          this.location = 3
        }else if (this.location == 3){
          this.location = 0
        }
        break;

      case "DIAGONAL-S":
        if (this.location == 1){
          this.location = 2;
        }else if (this.location == 2){
          this.location = 1;
        }
    }

    return action;
  }
}

/* 
Regras - Ação - Diagonal
Posição A0:  RIGHT       Posição B1:  DOWN
Posição C2:  UP          Posição D3:  LEFT
*/
function reflexVacuumAgent(world) {
  if (world.floors[world.location].dirty) {
    return "SUCK";

  }else if (world.location == 0) {
    if (world.floors[3].dirty == true && world.floors[1].dirty == false){
      return "DIAGONAL-P"
    }else{
      return "RIGHT";
    }

  }else if (world.location == 1) {
    if (world.floors[2].dirty == true && world.floors[3].dirty == false){
      return "DIAGONAL-S"
    }else{
      return "DOWN";
    }

  }else if (world.location == 2) {
    if (world.floors[1].dirty == true && world.floors[0].dirty == false){
      return "DIAGONAL-S"
    }else{
      return "UP"
    }

  }else if (world.location == 3) {
    if (world.floors[0].dirty == true && world.floors[2].dirty == false){
      return "DIAGONAL-P"
    }else{
      return "LEFT"
    }
  }

}

function tableVacuumAgent(world, table) {
  let location = world.location;
  let dirty = world.floors[location].dirty ? 1 : 0;
  return table[location][dirty];
}