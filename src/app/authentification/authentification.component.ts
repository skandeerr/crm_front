import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../Services/Auth.service';
import { CoreService } from '../core/core.service';


@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css'],
})
export class AuthentificationComponent implements OnInit {
  signUpForm: FormGroup;
  signInForm: FormGroup;
  isSignDivVisiable: boolean = true;
  showPassword: boolean = false;
  roles = [
    {value: 'ADMIN', viewValue: 'Admin'},
    {value: 'Responsable de Commercial', viewValue: 'Responsable de Commercial'},
    {value: 'Responsable de Marketing', viewValue: 'Responsable de Marketing'},
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private coreService: CoreService
  ) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      fullName: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      role : ['', [Validators.required]]
    });

    this.signInForm = this.fb.group({
      un: ['', Validators.required],
      pass: ['', Validators.required],
    });
  }

  basculerVisibiliteMotDePasse(): void {
    this.showPassword = !this.showPassword;
  }

  isPasswordVisible(): boolean {
    return this.showPassword;
  }

  ngOnInit(): void {
    if(localStorage.getItem('token')!=null){
      this.router.navigate(['dashboad/statistic']);
    }
  }

  SignUp() {
    if (this.signUpForm.valid) {
      const userData = this.signUpForm.value;
      console.log(userData)
      this.userService.SignUp(userData).subscribe(
        (response) => {
          console.log('Utilisateur enregistré avec succès :', response);
          this.coreService.openSnackBar('Utilisateur enregistré avec succès');
          // Réinitialiser le formulaire après l'enregistrement réussi
          this.signUpForm.reset();
          this.isSignDivVisiable=false
        },
        (error) => {
          console.log(error.message)
          console.error(
            "Erreur lors de l'enregistrement de l'utilisateur :",
            error
          );
          this.coreService.openSnackBar(
            "Erreur lors de l'enregistrement de l'utilisateur"
          );
        }
      );
    }
  }

  SignIn() {
    const { un ,pass } = this.signInForm.value;
    this.userService.SignIn(un,pass).subscribe(
      (response: any) => {
        console.log(response);

        // const accessToken = response['access_token'];
         localStorage.setItem('token', response.accessToken);
         localStorage.setItem('id',response.id)
        localStorage.setItem('role',response.roles)
        // const jwtData = this.getDataFromJWTtoken();
        // console.log('Données JWT :', jwtData);

        // console.log('Utilisateur connecté');

        this.coreService.openSnackBar('Utilisateur connecté avec succès');
        this.router.navigate(['dashboad/statistic']);
      },
      (error) => {
        console.error("Erreur lors de la connexion de l'utilisateur :", error);
        this.coreService.openSnackBar(
          "Vérifier le nom d'utilisateur ou le mot de passe"
        );
      }
    );
  }

  getDataFromJWTtoken() {
    const token = localStorage.getItem('accessToken') ?? '';
    if (token) {
      let jwtData = token.split('.')[1];
      let decodedJwtJsonData = window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);

      // Stockage des données dans le local storage
      localStorage.setItem('jwtData', JSON.stringify(decodedJwtData));

      return decodedJwtData;
    }
  }
}
