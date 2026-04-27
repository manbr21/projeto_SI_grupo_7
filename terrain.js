const TerrainType = {
  Sand: 'Sand',
  Quagmire: 'Quagmire',
  Water: 'Water',
  Obstacle: 'Obstacle'
};

class TerrainCells {
    constructor(target, terrainType) {
        let alpha = 50;
        this.target = target
        this.terrainType = terrainType
        switch(terrainType) {
            case 'Sand':
                this.color = color(194, 178, 128, alpha);
                this.cost = 10
                break;
            case 'Quagmire':
                this.color = color(100, 110, 60, alpha);
                this.cost = 50
                break;
            case 'Water':
                this.color = color(0, 105, 148, alpha);
                this.cost = 100
                break;
            default:
                this.color = color(100, 100, 105, alpha);
                this.cost = 100000000
                break;
        }
    }
}