import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menusidebar',
  templateUrl: './menusidebar.component.html',
  styleUrls: ['./menusidebar.component.css']
})
export class MenusidebarComponent {
  role : any
  constructor(private router : Router){}
  ngOnInit(): void {
    if(localStorage.getItem('role')=="ADMIN"){
      this.role = true;
    }else {
      this.role=false
    }
  }

  isMenuClosed: boolean = true;

  toggleMenu() {
    this.isMenuClosed = !this.isMenuClosed;
  }
  
}
