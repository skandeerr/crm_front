import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionService } from '../Services/Permission.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-permission-dialog',
  templateUrl: './add-permission-dialog.component.html',
  styleUrls: ['./add-permission-dialog.component.css']
})
export class AddPermissionDialogComponent {
  PermissionForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private dialogRef: MatDialogRef<AddPermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coreService: CoreService,
    private toast: NgToastService
  ) {
    this.PermissionForm = this.fb.group({
      name: ['', [Validators.required]], // Seuls les caractères alphabétiques sont autorisés
    });
  }

  ngOnInit(): void {
    this.PermissionForm.patchValue(this.data);
    console.log(this.data)

    // Surveillance des changements de valeur dans le champ de nom
    this.applyFirstLetterUppercaseValidation('nom');
    // Surveillance des changements de valeur dans le champ de prénom
    this.applyFirstLetterUppercaseValidation('prenom');
    // Surveillance des changements de valeur dans le champ d'adresse
    this.applyFirstLetterUppercaseValidation('adresse');
  }

  // Fonction pour appliquer la validation de la première lettre en majuscule
  applyFirstLetterUppercaseValidation(fieldName: string): void {
    const control = this.PermissionForm.get(fieldName);
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
    if (this.PermissionForm.valid) {
      if (this.data) {
        this.permissionService
          .updatePermission(this.data.id, this.PermissionForm.value)
          .subscribe({
            next: (val: any) => {
              this.toast.info({
                detail: 'Information',
                summary: 'Permission modifié',
                sticky: false,
                duration : 5000,
              });
              this.dialogRef.close(true);
            },

            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this.permissionService.ajouterPermission(this.PermissionForm.value).subscribe({
          next: (val: any) => {
            this.toast.success({ detail: 'Succés', summary: 'Client permission', duration:5000 });
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
