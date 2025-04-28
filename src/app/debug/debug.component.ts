import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MidiService} from "../midi/midi.service";
import {NoteOnMessage} from "../midi/midi-message";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
    selector: 'app-debug',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    templateUrl: './debug.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebugComponent {
    protected noteOnFormGroup = new FormGroup({
        channel: new FormControl<number>(0, {nonNullable: true}),
        note: new FormControl<number>(0, {nonNullable: true}),
        velocity: new FormControl<number>(0, {nonNullable: true})
    });

    protected noteOffFormGroup = new FormGroup({
        channel: new FormControl<number>(0, {nonNullable: true}),
        note: new FormControl<number>(0, {nonNullable: true}),
        velocity: new FormControl<number>(0, {nonNullable: true})
    });

    protected controlChangeFormGroup = new FormGroup({
        channel: new FormControl<number>(0, {nonNullable: true}),
        control: new FormControl<number>(0, {nonNullable: true}),
        value: new FormControl<number>(0, {nonNullable: true})
    })

    constructor(private readonly midiService: MidiService) {
    }

    protected sendNoteOn() {
        this.midiService.send(new NoteOnMessage(this.noteOnFormGroup.value.channel!, this.noteOnFormGroup.value.note!, this.noteOnFormGroup.value.velocity!));
    }

    protected sendNoteOff() {
        this.midiService.send(new NoteOnMessage(this.noteOffFormGroup.value.channel!, this.noteOffFormGroup.value.note!, this.noteOffFormGroup.value.velocity!));
    }

    protected sendControlChange() {
        this.midiService.send(new NoteOnMessage(this.controlChangeFormGroup.value.channel!, this.controlChangeFormGroup.value.control!, this.controlChangeFormGroup.value.value!));
    }
}
