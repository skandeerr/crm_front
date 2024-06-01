import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { TaskService } from 'src/app/Services/Task.service';
import { ClientService } from 'src/app/Services/client.service';
import { CoreService } from 'src/app/core/core.service';
declare var $: any;
@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css']
})
export class AddTaskDialogComponent implements OnInit{
  ClientForm: FormGroup;
  statusTask = [
    {value: 'EN_ATTENTE', viewValue: 'En attente'},
    {value: 'FAIT', viewValue: 'Fait'},
  ];
  typeActivity = [
    {value: 'REUNION', viewValue: 'Réunion'},
    {value: 'APPEL_TELEPHONIQUE', viewValue: 'Appel Téléphonique'},
    {value: 'RESUME_APPEL', viewValue: 'Résumé de l’appel'},
    {value: 'DESCRIPTION', viewValue: 'Description'}
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coreService: CoreService,
    private toast: NgToastService
  ) {
    this.ClientForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3)]], // Seuls les caractères alphabétiques sont autorisés
      dateDebut: ['', [Validators.required]], // Seuls les caractères alphabétiques sont autorisés
      dateFin: ['', [Validators.required]], // Format numérique de 8 à 10 chiffres
      description: ['', [Validators.required, Validators.minLength(5)]], // Exiger une longueur
      typeActivity : ['', [Validators.required]],
      statusTask : ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
    this.ClientForm.patchValue(this.data);
    console.log(this.data)

    // Surveillance des changements de valeur dans le champ de nom
    this.applyFirstLetterUppercaseValidation('nom');
    // Surveillance des changements de valeur dans le champ de prénom
    this.applyFirstLetterUppercaseValidation('description');
    // Surveillance des changements de valeur dans le champ d'adresse
    this.applyFirstLetterUppercaseValidation('adresse');
  }

  applyFirstLetterUppercaseValidation(fieldName: string): void {
    const control = this.ClientForm.get(fieldName);
    if (control) {
      control.valueChanges.subscribe((value: string) => {
        // Convertir la première lettre en majuscule
        const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
        // Mettre à jour la valeur du champ avec la première lettre en majuscule
        control.setValue(capitalizedValue, { emitEvent: false });
      });
    }
  }

  onFormSubmit() {
    if (this.ClientForm.valid) {
      if (this.data) {
        if(this.data.id==undefined){
          this.taskService.ajouterTask(this.ClientForm.value).subscribe({
            next: (val: any) => {
              this.toast.success({ detail: 'Succés', summary: 'Task ajouté', duration:5000 });
              this.dialogRef.close(true);
            },
          });
        }else {
        this.taskService
          .updateTask(this.data.id, this.ClientForm.value)
          .subscribe({
            next: (val: any) => {
              this.toast.info({
                detail: 'Information',
                summary: 'Task modifié',
                sticky: false,
                duration : 5000,
              });
              this.dialogRef.close(true);
            },

            error: (err: any) => {
              console.error(err);
            },
          });}
      } else {
        this.taskService.ajouterTask(this.ClientForm.value).subscribe({
          next: (val: any) => {
            this.toast.success({ detail: 'Succés', summary: 'Task ajouté', duration:5000 });
            this.dialogRef.close(true);
          },
        });
      }
    } else {
      // Affichage d'un message d'erreur si le formulaire n'est pas valide
      this.toast.error({
        detail: 'Erreur',
        summary: "Le formulaire n'est pas valide.",
        duration: 5000
      });
    }
  }
}
