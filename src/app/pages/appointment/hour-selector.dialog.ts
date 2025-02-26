import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-hour-selector-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Seleccione un horario</h2>
    <div class="demo-inline-calendar-card" *ngFor="let hour of data.hours" [ngClass]="{ 'disabled-hour': hour.disabled }">
      <button
        mat-raised-button
        color="primary"
        (click)="selectHour(hour.time)"
        [disabled]="hour.disabled"
      >
        {{ hour.time }}
      </button>
    </div>
  `,
  styles: [`
    .disabled-hour button {
      background-color: #ccc;
      pointer-events: none;
    }
  `],
})
export class HourSelectorDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<HourSelectorDialog>
  ) {}

  selectHour(hour: string): void {
    this.dialogRef.close(hour);
  }
}
