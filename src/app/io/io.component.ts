import {ChangeDetectionStrategy, Component, effect, model, signal, WritableSignal} from '@angular/core';
import {MidiService} from "../midi/midi.service";
import {DatePipe, JsonPipe} from "@angular/common";
import {HighResTimestampToTimestampPipe} from "../util/highres-timestamp-to-timestamp.pipe";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatRadioModule} from "@angular/material/radio";
import {MessageType, MidiMessage, parseMidiEvent} from "../midi/midi-message";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-io',
    imports: [
        DatePipe,
        HighResTimestampToTimestampPipe,
        MatToolbarModule,
        MatRadioModule,
        JsonPipe,
        FormsModule
    ],
    templateUrl: './io.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IoComponent {

    protected inputs: MIDIInput[];

    protected outputs: MIDIOutput[];

    protected $input = model<MIDIInput | null>(null);

    protected $output = model<MIDIOutput | null>(null);

    protected $timestampedMessages: WritableSignal<{ timestamp: DOMHighResTimeStamp, message: MidiMessage }[]> = signal<{
        timestamp: DOMHighResTimeStamp,
        message: MidiMessage
    }[]>([]);

    constructor(private readonly midiService: MidiService) {
        this.inputs = this.midiService.getInputs();
        this.outputs = this.midiService.getOutputs();
        this.$input.set(this.midiService.getInput());
        this.$output.set(this.midiService.getOutput());

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

        effect(() => {
            this.midiService.setInput(this.$input());
        });

        effect(() => {
            this.midiService.setOutput(this.$output());
        });
    }

    protected clear() {
        this.$timestampedMessages.set([]);
    }

    protected readonly MessageType = MessageType;
}
