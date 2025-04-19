import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class MidiService {
    private midiAccess: MIDIAccess | null = null

    public async init() {
        return navigator.requestMIDIAccess().then(
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

    public listInputsAndOutputs() {
        for (const entry of this.getMidiAccess().inputs) {
            const input = entry[1];
            console.log(
                `Input port [type:'${input.type}']` +
                ` id:'${input.id}'` +
                ` manufacturer:'${input.manufacturer}'` +
                ` name:'${input.name}'` +
                ` version:'${input.version}'`,
            );
        }

        for (const entry of this.getMidiAccess().outputs) {
            const output = entry[1];
            console.log(
                `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`,
            );
        }
    }
}
