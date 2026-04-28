const TerrainType = {
  Sand: 'Sand',
  Quagmire: 'Quagmire',
  Water: 'Water',
  Obstacle: 'Obstacle'
};

class TerrainCells {
    constructor(target, terrainType) {
        this.target = target
        this.terrainType = terrainType
        this.isVisited = false
        this.isFrontier = false
        this.isPath = false

        switch(terrainType) {
            case 'Sand':
                this.color = color(245, 185, 65);
                this.cost = 10
                break;
            case 'Quagmire':
                this.color = color(105, 190, 70);
                this.cost = 50
                break;
            case 'Water':
                this.color = color(40, 150, 230);
                this.cost = 100
                break;
            default:
                this.color = color(130, 130, 130);
                this.cost = 100000000;
                this.isObstacle = true;
                break;
        }
    }

    setVisited(){
        this.visited = true;
    }
}