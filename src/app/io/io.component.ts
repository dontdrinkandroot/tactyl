import {ChangeDetectionStrategy, Component, signal, WritableSignal} from '@angular/core';
import {MidiService} from "../midi/midi.service";
import {DatePipe, JsonPipe} from "@angular/common";
import {HighResTimestampToTimestampPipe} from "../util/highres-timestamp-to-timestamp.pipe";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatRadioModule} from "@angular/material/radio";
import {MessageType, MidiMessage, parseMidiEvent} from "../midi/midi-message";

@Component({
    selector: 'app-io',
    imports: [
        DatePipe,
        HighResTimestampToTimestampPipe,
        MatToolbarModule,
        MatRadioModule,
        JsonPipe
    ],
    templateUrl: './io.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IoComponent {

    protected inputs: MIDIInput[];
    protected outputs: MIDIOutput[];

    protected $timestampedMessages: WritableSignal<{ timestamp: DOMHighResTimeStamp, message: MidiMessage }[]> = signal<{
        timestamp: DOMHighResTimeStamp,
        message: MidiMessage
    }[]>([]);

    constructor(private readonly midiService: MidiService) {
        this.inputs = this.midiService.getInputs();
        this.outputs = this.midiService.getOutputs();

        this.inputs.forEach(input => {
            input.onmidimessage = (event: MIDIMessageEvent) => {
                let timestampedMessage = {
                    timestamp: event.timeStamp,
                    message: parseMidiEvent(event)
                };
                console.log(timestampedMessage);
                this.$timestampedMessages.update(timestampedMessages => [timestampedMessage, ...timestampedMessages]);

            }
        });
    }

    protected clear() {
        this.$timestampedMessages.set([]);
    }

    protected readonly MessageType = MessageType;
}
