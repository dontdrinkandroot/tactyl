import {Injectable} from "@angular/core";

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

    public parseMidiMessage(event: MIDIMessageEvent) {

    }
}
