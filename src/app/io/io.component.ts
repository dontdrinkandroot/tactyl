import {ChangeDetectionStrategy, Component, effect, model} from '@angular/core';
import {MidiService} from "../midi/midi.service";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-io',
    imports: [
        MatToolbarModule,
        MatRadioModule,
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

    constructor(private readonly midiService: MidiService) {
        this.inputs = this.midiService.getInputs();
        this.outputs = this.midiService.getOutputs();
        this.$input.set(this.midiService.getInput());
        this.$output.set(this.midiService.getOutput());

        effect(() => {
            this.midiService.setInput(this.$input());
        });

        effect(() => {
            this.midiService.setOutput(this.$output());
        });
    }
}
