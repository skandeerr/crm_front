import { Component } from '@angular/core';
import { AddRoleDialogComponent } from '../add-role-dialog/add-role-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/core.service';
import { NgToastService } from 'ng-angular-popup';
import { RoleService } from 'src/app/Services/Role.service';
import { Role } from 'src/app/Modéles/Role';
import {MatTabsModule} from '@angular/material/tabs';
import { PermissionService } from 'src/app/Services/Permission.service';
import { Permission } from 'src/app/Modéles/Permission';
declare var $: any;

@Component({
  selector: 'app-gestion-roles',
  templateUrl: './gestion-roles.component.html',
  styleUrls: ['./gestion-roles.component.css']
})
export class GestionRolesComponent {
  roles: Role[] = [

  ];
  permission: Permission[] = [

  ];
  propectToDelete!: Role
  taskRoles: Permission[] = [];
  prospectRoles: Permission[] = [];
  contactRoles: Permission[] = [];
  constructor(
    private dialog: MatDialog,
    private coreService: CoreService,
    private toast : NgToastService,
    private roleService : RoleService, private permissionService: PermissionService
    
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermission()
  }
  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        this.roles=res
        console.log(this.roles)
    
      },
    });
  }
  
  loadPermission() {
    this.permissionService.getAllPermissions().subscribe({
      next: (res) => {
        this.permission=res
        this.filterRoles();
      },
    });
  }
  roleAndPermissionExists(roleName: string, permissionName: string): boolean {
    const role = this.roles.find(role => role.name === roleName);
    console.log(role)
    if (role) {
      return role.roles.some(permission => permission.name === permissionName);
    }
    return false;
  }
  
  filterRoles() {
    this.taskRoles = this.permission.filter(role => role.feature === 'task');
    this.prospectRoles = this.permission.filter(role => role.feature === 'prospect');
    this.contactRoles = this.permission.filter(role => role.feature === 'contact');
  }
  onCheckboxChange(event: Event, roleName: string, permission: Permission) {
    const isChecked = (event.target as HTMLInputElement).checked;

    const role = this.roles.find(role => role.name === roleName);
    if (role) {
      if (isChecked) {
        // Ajouter la permission
        if (!role.roles.some(p => p.id === permission.id)) {
          role.roles.push(permission);
          const r :any = {
            name : roleName,
            roles : role.roles.map((permission:any) => permission.name)
          }
          this.roleService
          .updateRole(role.id, r)
          .subscribe({
            next: (val: any) => {
              this.toast.info({
                detail: 'Information',
                summary: 'Permission modifié',
                sticky: false,
                duration : 5000,
              });
            },

            error: (err: any) => {
              console.error(err);
            },
          });
        }
      } else {
        // Supprimer la permission
       const roleOfUser = role.roles = role.roles.filter(p => p.id !== permission.id);
        const r :any = {
          name : roleName,
          roles : roleOfUser.map((permission:any) => permission.name)
        }
        this.roleService
        .updateRole(role.id, r)
        .subscribe({
          next: (val: any) => {
            this.toast.info({
              detail: 'Information',
              summary: 'Permission modifié',
              sticky: false,
              duration : 5000,
            });
          },

          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }

    console.log(`Permission ${permission.name} for role ${roleName} is now ${isChecked ? 'checked' : 'unchecked'}`);
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
