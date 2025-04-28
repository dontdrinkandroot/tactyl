import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MidiService} from "../midi/midi.service";
import {ControlChangeMessage} from "../midi/midi-message";

@Component({
    selector: 'button[app-control-button]',
    imports: [],
    templateUrl: './control-button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(click)': 'trigger()'
    }
})
export class ControlButtonComponent {
    public $channel = input.required<number>({alias: 'channel'});
    public $control = input.required<number>({alias: 'control'});

    constructor(private readonly midiService: MidiService) {

    }

    protected trigger() {
        this.midiService.send(new ControlChangeMessage(this.$channel(), this.$control(), 127));
        this.midiService.send(new ControlChangeMessage(this.$channel(), this.$control(), 0));
    }
}
