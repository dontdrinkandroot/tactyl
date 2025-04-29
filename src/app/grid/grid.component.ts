import {ChangeDetectionStrategy, Component, HostBinding} from '@angular/core';
import {NoteButtonComponent} from "../button/note-button.component";

@Component({
    selector: 'app-grid',
    imports: [
        NoteButtonComponent
    ],
    templateUrl: './grid.component.html',
    styleUrl: './grid.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {

    protected cols: number[] = Array.from(Array(16).keys());

    protected rows: number[] = Array.from(Array(16).keys());

    @HostBinding('style.grid-template-columns')
    protected get gridTemplateColumns(): string {
        return `repeat(${this.cols.length + 1}, 1fr)`;
    }

    @HostBinding('style.grid-template-rows')
    protected get gridTemplateRows(): string {
        return `repeat(${this.rows.length + 2}, 1fr)`;
    }

    protected getChanel(row: number, col: number): number {
        const idx = col + (row * 32);
        return Math.floor(idx / 128);
    }

    protected getNote(row: number, col: number): number {
        const idx = col + (row * 32);
        return idx % 128;
    }
}
