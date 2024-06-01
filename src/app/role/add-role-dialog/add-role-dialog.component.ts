import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { Permission } from 'src/app/Modéles/Permission';
import { PermissionService } from 'src/app/Services/Permission.service';
import { RoleService } from 'src/app/Services/Role.service';
import { ClientService } from 'src/app/Services/client.service';
import { AddClientDialogComponent } from 'src/app/add-client-dialog/add-client-dialog.component';
import { AddPermissionDialogComponent } from 'src/app/add-permission-dialog/add-permission-dialog.component';
import { AddProspectDialogComponent } from 'src/app/add-prospect-dialog/add-prospect-dialog.component';
import { CoreService } from 'src/app/core/core.service';

@Component({
  selector: 'app-add-role-dialog',
  templateUrl: './add-role-dialog.component.html',
  styleUrls: ['./add-role-dialog.component.css']
})
export class AddRoleDialogComponent {
  PermissionForm: FormGroup;
  permissions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private roleService: RoleService,
    private dialogRef: MatDialogRef<AddPermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coreService: CoreService,
    private toast: NgToastService
  ) {
    this.PermissionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      roles: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    if(this.data!=null){
    this.PermissionForm.patchValue({
      name: this.data.name,
      roles:  this.data.roles.map((permission:any) => permission.name)  // Extraire les noms
    });
    }
    console.log(this.data)
    this.loadPermission()
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
  loadPermission() {
    this.permissionService.getAllPermissions().subscribe({
      next: (res) => {
        console.log(res)
        this.permissions = res.map(permission => permission.name);
      },
    });
    console.log(this.permissions)

  }
  onFormSubmit() {
    if (this.PermissionForm.valid) {
      if (this.data) {
        this.roleService
          .updateRole(this.data.id, this.PermissionForm.value)
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
        this.roleService.ajouterRole(this.PermissionForm.value).subscribe({
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
