import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'src/app/core/service/auth.service';
import Swal from 'sweetalert2';
import { AlertasService } from 'src/app/core/service/alertas.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class LoginComponent {

  isLoading = false;
  showPassword = false;
  error = '';
  step: 'login' | 'verify' = 'login';


  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });



  inputType = 'password';
  visible = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private alertasService: AlertasService,
    private sharedDataService: SharedDataService,
  ) { }

  async handleLogin() {
    if (this.form.valid) {
      this.isLoading = true;
      this.error = '';

      try {
        // Simulate API call
        await this.authService.login(this.form.value).subscribe((res) => {
          if (res.success) {
            this.isLoading = false;
            localStorage.setItem('token', res.result.token);
            this.mandarCodigo();


          } else {
            this.isLoading = false;
            this.error = res.message;
          }
        }, (error) => {
          this.isLoading = false;
          this.error = error.message || 'Error al iniciar sesión';
        });
      } catch (err) {
        this.isLoading = false;
        this.error = 'Error al iniciar sesión';
      }
    }
  }

  mandarCodigo() {
    this.isLoading = true;
    this.authService.authEmail().subscribe((res) => {
      this.isLoading = false;
      if (res.success) {
        this.sharedDataService.setData(res.result['codigo']);
        this.alertasService.alertaExito('Código enviado', 'Hemos enviado un código de verificación a tu correo electrónico');
        this.router.navigate(['/codigo_verificacion']);
      }
    }, (error) => {
      this.isLoading = false;
      this.alertasService.alertaError('Error', 'Error al enviar el código de verificación');
    });
  }



}
