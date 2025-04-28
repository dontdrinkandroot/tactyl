import {Injectable} from "@angular/core";
import {MidiMessage} from "./midi-message";

@Injectable({providedIn: 'root'})
export class MidiService {

    private midiAccess: MIDIAccess | null = null;

    private input: MIDIInput | null = null;

    private output: MIDIOutput | null = null;

    public async init() {
        return navigator.requestMIDIAccess({
            sysex: true,
            software: true
        }).then(
            (midiAccess) => {
                console.log("MIDI ready!");
                this.midiAccess = midiAccess;
            },
            (msg) => {
                console.error(`Failed to get MIDI access - ${msg}`);
            }
        );
    }

    public getMidiAccess(): MIDIAccess {
        if (this.midiAccess) {
            return this.midiAccess;
        }
        throw new Error("MIDI not initialized");
    }

    public getInputs(): MIDIInput[] {
        return Array.from(this.getMidiAccess().inputs.values());
    }

    public getOutputs(): MIDIOutput[] {
        return Array.from(this.getMidiAccess().outputs.values());
    }

    public send(message: MidiMessage): void {
        const output = this.output;
        if (null === output) {
            throw new Error("MIDI output not initialized");
        }
        output.send(message.toData());
    }

    public getInput(): MIDIInput | null {
        return this.input;
    }

    public setInput(input: MIDIInput | null) {
        this.input = input;
    }

    public getOutput(): MIDIOutput | null {
        return this.output;
    }

    public setOutput(output: MIDIOutput | null) {
        this.output = output;
    }
}
