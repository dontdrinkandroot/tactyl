import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ControlButtonComponent} from "../button/control-button.component";

@Component({
    selector: 'app-grid',
    imports: [
        ControlButtonComponent
    ],
    templateUrl: './grid.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {

}
