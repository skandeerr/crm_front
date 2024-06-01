import { Component } from '@angular/core';
import { AddRoleDialogComponent } from '../add-role-dialog/add-role-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/core.service';
import { NgToastService } from 'ng-angular-popup';
import { RoleService } from 'src/app/Services/Role.service';
import { Role } from 'src/app/Modéles/Role';
declare var $: any;

@Component({
  selector: 'app-gestion-roles',
  templateUrl: './gestion-roles.component.html',
  styleUrls: ['./gestion-roles.component.css']
})
export class GestionRolesComponent {
  roles: Role[] = [

  ];
  propectToDelete!: Role

  constructor(
    private dialog: MatDialog,
    private coreService: CoreService,
    private toast : NgToastService,
    private roleService : RoleService
    
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }
  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        this.roles=res
        
      },
    });
  }
  openAddEditCltForm() {
    const dialogRef = this.dialog.open(AddRoleDialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadRoles();
        }
      },
    });
  }
  openEditCltForm(data: Role) {
    const dialogRef = this.dialog.open(AddRoleDialogComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadRoles();
        }
      },
    });
  }

  confirmDelete(prospect: Role) {
    $('#deleteModal').modal('show');
    this.propectToDelete = prospect;
  }
  closeConfirm() {
    $('#deleteModal').modal('hide');
  }
  deleteProspect() {
    this.roleService
      .deleteRole(this.propectToDelete.id)
      .subscribe(() => {
        console.log('deleted');
        this.coreService.openSnackBar('Role supprimé', 'Fermer');
        this.closeConfirm();
        this.loadRoles();
      });
  }
}
