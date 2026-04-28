const TerrainType = {
  Sand: 'Sand',
  Quagmire: 'Quagmire',
  Water: 'Water',
  Obstacle: 'Obstacle'
};

class TerrainCells {
    constructor(target, terrainType) {
        let alpha = 255;
        this.target = target
        this.terrainType = terrainType
        this.isVisited = false
        this.isFrontier = false
        this.isPath = false

        switch(terrainType) {
            case 'Sand':
                this.color = color(210, 105, 30, alpha);
                this.cost = 10
                break;
            case 'Quagmire':
                this.color = color(120, 130, 80, alpha);
                this.cost = 50
                break;
            case 'Water':
                this.color = color(100, 180, 240, alpha);
                this.cost = 100
                break;
            default:
                this.color = color(50);
                this.cost = 100000000;
                this.isObstacle = true;
                break;
        }
    }

    setVisited(){
        this.visited = true;
    }
}