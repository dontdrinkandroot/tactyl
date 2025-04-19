import {ChangeDetectionStrategy, Component, signal, WritableSignal} from '@angular/core';
import {MidiService} from "../midi.service";

export type MidiMessage = {
    timestamp: number,
    data: string
}

@Component({
    selector: 'app-io',
    imports: [],
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
            input.onmidimessage = (event) => {
                const hexData = event.data ? Array.from(event.data)
                    .map(byte => `0x${byte.toString(16)}`)
                    .join(' ') : 'No data';
                this.$messages.update(messages => [
                    {
                        timestamp: event.timeStamp,
                        data: hexData
                    }, ...messages
                ]);

            }
        });

    }
}
