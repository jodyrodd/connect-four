import { Component, Input, Output, EventEmitter } from '@angular/core';

export class Column {
    id: number;
    button_text: string;

    constructor(id) {
        this.id = id;
        this.button_text = "&darr;";
    };
}

const COLUMNS: Column[] = [
    new Column(0),
    new Column(1),
    new Column(2),
    new Column(3),
    new Column(4),
    new Column(5),
    new Column(6)
];

@Component({
  selector: 'game-head',
  template: `
    <tr>
      <td *ngFor="let column of columns" (click)="onClick(column)">
          <span *ngIf="waitingForPlayer" innerHtml="{{column.button_text}}"></span>
      </td>
    </tr>
  `
})
export class HeadComponent {
    @Input() gameActive: boolean;
    @Input() waitingForPlayer: boolean = true;
    @Output() notifyParent: EventEmitter<any> = new EventEmitter();
    columns = COLUMNS;


    onClick(column): void {
        if(!this.gameActive || !this.waitingForPlayer) return;
        this.notifyParent.emit(column.id);
    }
}
