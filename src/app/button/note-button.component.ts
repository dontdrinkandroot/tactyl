import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MidiService} from "../midi/midi.service";
import {NoteOffMessage, NoteOnMessage} from "../midi/midi-message";

@Component({
    selector: 'button[app-note-button]',
    imports: [],
    templateUrl: './note-button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(click)': 'trigger()'
    }
})
export class NoteButtonComponent {
    public $channel = input.required<number>({alias: 'channel'});
    public $note = input.required<number>({alias: 'note'});

    constructor(private readonly midiService: MidiService) {

    }

    protected trigger() {
        this.midiService.send(new NoteOnMessage(this.$channel(), this.$note(), 127));
        this.midiService.send(new NoteOffMessage(this.$channel(), this.$note(), 0));
    }
}
