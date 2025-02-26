import { Component, Inject } from '@angular/core';
import { MatDialogActions, MatDialogTitle, MatDialogContent, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { data } from 'jquery';


@Component({
    selector: 'dialog-animations-example-dialog',
    templateUrl: 'modal-mis-turnos.html',
    standalone: true,
    imports: [MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent, CommonModule, MatDialogModule],
    providers: [DialogAnimationsExampleDialog],
})
export class DialogAnimationsExampleDialog {

    constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>,
        @Inject(MAT_DIALOG_DATA) public data: {isConfirmed: boolean}) {}

    confirmar(): void{
        this.dialogRef.close(true);//Retorna true si el usuario confirma la acción
    }

    cancelar(): void{
        this.dialogRef.close(false);//Retorna false si el usuario cancela la acción
    }

}