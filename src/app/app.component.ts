import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MidiService} from "./midi.service";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor(private readonly midiService: MidiService) {
        this.midiService.listInputsAndOutputs();
    }
}
