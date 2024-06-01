import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProspectModéle } from '../Modéles/Prospect-Modéle';
import { ClientModéle } from '../Modéles/client-modéle';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProspectService } from '../Services/Prospect.service';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { AddProspectDialogComponent } from '../add-prospect-dialog/add-prospect-dialog.component';
import { ClientService } from '../Services/client.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-prospects',
  templateUrl: './prospects.component.html',
  styleUrls: ['./prospects.component.css'],
})
export class ProspectsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'nom',
    'prenom',
    'note',
    'telephone',
    'adresse',
    'statusProspect',
    'action',
  ];
  private statusProspect = [
    { value: 'Nouveau', viewValue: 'Nouveau' },
    { value: 'Tentative', viewValue: 'Tentative' },
    { value: 'Qualifié', viewValue: 'Qualifié' },
    { value: 'NonQualifie', viewValue: 'Non qualifié' }
  ];
  dataSource!: MatTableDataSource<ProspectModéle>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  prospect: ProspectModéle[] = [];

  propectToDelete!: ProspectModéle;

  AddClient!: ProspectModéle;

  constructor(
    private prospectService: ProspectService,
    private ClientService: ClientService,
    private dialog: MatDialog,
    private coreService: CoreService,
    private toast : NgToastService,
    private route:Router

  ) {}

  ngOnInit(): void {
    this.loadProspect();
    console.log("jkjkhk",localStorage.getItem("token"))
  }

  loadProspect() {
    this.prospectService.getAllProspects().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
    });
  }
  getViewValue(value: string): string {
    const status = this.statusProspect.find(status => status.value === value);
    return status ? status.viewValue : 'Inconnu';
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  confirmDelete(prospect: ProspectModéle) {
    $('#deleteModal').modal('show');
    this.propectToDelete = prospect;
  }

  confirmAdd(prospect: ProspectModéle) {
    $('#addClientModal').modal('show');
    this.AddClient = prospect;
  }

  closeConfirm() {
    $('#deleteModal').modal('hide');
  }
  closeConfirmAdd() {
    $('#addClientModal').modal('hide');
  }
  addClien(){
    const client : any = {
      nom : this.AddClient.nom,
      prenom : this.AddClient.prenom,
      telephone : this.AddClient.telephone,
      adresse : this.AddClient.adresse,
      email : this.AddClient.email,
      typeContact : "Client",
      priorite : "Faible"
    }
    this.ClientService.ajouterClient(client).subscribe(() => {
        this.toast.success({ detail: 'Succés', summary: 'Client ajouté', duration:5000 });
        this.closeConfirmAdd();
        this.route.navigateByUrl("/dashboad/contact");
    });
  }
  deleteProspect() {
    this.prospectService
      .deleteProspect(this.propectToDelete.id)
      .subscribe(() => {
        console.log('deleted');
        this.coreService.openSnackBar('Prospect supprimé', 'Fermer');
        this.closeConfirm();
        this.loadProspect();
      });
  }

  openAddEditCltForm() {
    const dialogRef = this.dialog.open(AddProspectDialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadProspect();
        }
      },
    });
  }

  openEditCltForm(data: ProspectModéle) {
    const dialogRef = this.dialog.open(AddProspectDialogComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadProspect();
        }
      },
    });
  }
}
