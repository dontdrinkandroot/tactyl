import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ControlButtonComponent} from "../button/control-button.component";
import {NoteButtonComponent} from "../button/note-button.component";

@Component({
    selector: 'app-grid',
    imports: [
        ControlButtonComponent,
        NoteButtonComponent
    ],
    templateUrl: './grid.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {

}
