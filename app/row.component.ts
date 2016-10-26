import { Component, Input } from '@angular/core';
import { Row, PLAYER, COMPUTER } from './board';

@Component({
  selector: 'game-row',
  template: `
    <td *ngFor="let cell of row.cells" [style.background-color]="owner(cell)"></td>
   `
})
export class RowComponent {
    @Input()
    row: Row;

    owner(cell): void {
        var background = "lightblue";
        if(cell.owner === COMPUTER ) {
            //computer player
            background = "yellow";
        } else if (cell.owner === PLAYER) {
            //human player
            background = "red";
        }
        return background;
    }
}
