import {ChangeDetectionStrategy, Component, signal, WritableSignal} from '@angular/core';
import {MidiService} from "../midi.service";
import {NumberToHexStringPipe} from "../util/number-to-hex-string.pipe";
import {DatePipe} from "@angular/common";
import {HighResTimestampToTimestampPipe} from "../util/highres-timestamp-to-timestamp.pipe";
import {MatToolbarModule} from "@angular/material/toolbar";

export type MidiMessage = {
    timestamp: number,
    data: Uint8Array | null
}

@Component({
    selector: 'app-io',
    imports: [
        NumberToHexStringPipe,
        DatePipe,
        HighResTimestampToTimestampPipe,
        MatToolbarModule
    ],
    templateUrl: './io.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IoComponent {

    protected inputs: MIDIInput[];
    protected outputs: MIDIOutput[];

    protected $messages: WritableSignal<MidiMessage[]> = signal<MidiMessage[]>([]);

    constructor(private readonly midiService: MidiService) {
        this.inputs = this.midiService.getInputs();
        this.outputs = this.midiService.getOutputs();

        /* Add all input messages to messages, newest first */
        this.inputs.forEach(input => {
            input.onmidimessage = (event: MIDIMessageEvent) => {
                this.$messages.update(messages => [
                    {
                        timestamp: event.timeStamp,
                        data: event.data
                    }, ...messages
                ]);

            }
        });

    }

    protected clear() {
        this.$messages.set([]);
    }
}
