import { Component, Input } from '@angular/core';
import { Row } from './board';

@Component({
  selector: 'game-row',
  template: `
    <td *ngFor="let cell of row.cells" [style.background-color]="owner()"></td>
   `
})
export class RowComponent {
    @Input()
    row: Row;

    owner(): void {
        var background = "lightblue";
        if(this.row.owner === 0 ) {
            //computer player
            background = "yellow";
        } else if (this.row.owner === 1) {
            //human player
            background = "red";
        }
        return background;
    }
}
