import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { Tasks } from 'src/app/Modéles/Tasks';
import { TaskService } from 'src/app/Services/Task.service';
import { CoreService } from 'src/app/core/core.service';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Role } from 'src/app/Modéles/Role';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
declare var $: any;
@Component({
  selector: 'app-gestion-task',
  templateUrl: './gestion-task.component.html',
  styleUrls: ['./gestion-task.component.css']
})


export class GestionTaskComponent {
  tasks : Tasks[]=[]
  dataSource!: MatTableDataSource<Tasks>;
  taskToDelete!: Tasks;
  AddClient!: Tasks;
  roles: Role[] = [

  ];
  add_task: string = 'add_prospect';
  edit_task: string = 'edit_prospect';
  delete_task: string = 'delete_prospect';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'id',
    'name',
    'dateDebut',
    'dateFin',
    'statusTask',
    'typeActivity',
    'description',
    'action'
  ];
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
    private tasksService: TaskService,
    private dialog: MatDialog,
    private coreService: CoreService,
    private toast : NgToastService
  ) {}
  ngOnInit(): void {
    this.loadClients();
  }
  roleAndPermissionExists(permissionName: string): boolean {
    console.log(localStorage.getItem("role"))
    const role = this.roles.find(role => role.name === localStorage.getItem("role")?.toString());
    console.log(role)
    if(localStorage.getItem("role")==="ADMIN"){
      return true
    }
    if (role) {
      console.log(role)
      return role.roles.some(permission => permission.name === permissionName);
    }
    return false;
  }
  loadClients() {
    this.tasksService.getAllTasks().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  confirmDelete(task: Tasks) {
    $('#deleteModal').modal('show');
    this.taskToDelete = task;
    
  }

  closeConfirm() {
    $('#deleteModal').modal('hide');
  }
  deleteClient() {
    this.tasksService.deleteTask(this.taskToDelete.id).subscribe(() => {
      console.log('deleted');
      this.toast.success({detail:"Succés",summary:'Task supprimé',duration: 5000});
      this.closeConfirm();
      this.loadClients();
    });
  }
  getViewValueStatus(value: string): string {
    const status = this.statusTask.find(status => status.value === value);
    return status ? status.viewValue : 'Inconnu';
  }
  getViewValueActivity(value: string): string {
    const status = this.typeActivity.find(status => status.value === value);
    return status ? status.viewValue : 'Inconnu';
  }
  openAddEditCltForm() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadClients();
        }
      },
    });
  }

  openEditCltForm(data: Tasks) {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadClients();
        }
      },
    });
  }
}
