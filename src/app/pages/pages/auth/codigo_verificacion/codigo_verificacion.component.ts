import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { AlertasService } from 'src/app/core/service/alertas.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-codigo_verificacion',
  templateUrl: './codigo_verificacion.component.html',
  styleUrls: ['./codigo_verificacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    NgIf,
  ]
})
export class Codigo_verificacionComponent implements OnInit {

  isLoading = false;

  codigo: any;

  error = '';

  verificationForm = this.fb.group({
    digit1: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]],
    digit2: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]],
    digit3: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]],
    digit4: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]],
    digit5: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]],
    // digit6: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]]
  });

  resendTimer = 0;
  resendInterval: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private alertaService: AlertasService,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit() {
    this.verificationForm.valueChanges.subscribe(() => {
      this.cd.markForCheck();
    });
    this.startResendTimer();
    this.codigo = this.sharedDataService.getData();
  }

  send() {
    this.router.navigate(['/home']);
  }

  async handleVerify(codigo: any) {
    if (this.verificationForm.valid) {
      this.isLoading = true;
      this.error = '';

      try {
        // Simulate API call
        await this.authService.validarCodigo(codigo).subscribe((res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.alertaService.alertaExito('Verificado', 'El código se verificó correctamente');
            this.router.navigate(['/home']);
          }
        }, (err: any) => {
          this.isLoading = false;
          this.alertaService.alertaError('Error', 'Código de verificación incorrecto');
        });
        // In a real application, you would verify the code and log the user in here
      } catch (err) {
        this.isLoading = false;
        this.alertaService.alertaError('Error', 'Código de verificación incorrecto');
      }
    }
  }

  startResendTimer() {
    this.resendTimer = 60;
    this.resendInterval = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
        this.cd.detectChanges();
      } else {
        clearInterval(this.resendInterval);
      }
    }, 1000);
  }

  async handleResendCode() {
    if (this.resendTimer === 0) {
      this.isLoading = true;
      this.error = '';

      try {
        // Simulate API call
        await this.authService.authEmail().subscribe((res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.codigo = res.result['codigo'];
            this.alertaService.alertaExito('Código reenviado', 'Se ha reenviado el código de verificación');
          }
        }, (err: any) => {
          this.isLoading = false;
          this.alertaService.alertaError('Error', 'No se pudo reenviar el código de verificación');
        });
        this.startResendTimer();
        // In a real application, you would resend the verification code here
      } catch (err) {
        this.isLoading = false;
      }
    }
  }

  onInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length === 1 && index < 6) {
      const nextInput = document.getElementById(`digit${index + 1}`);
      nextInput?.focus();
    }
  }

  onSubmit() {
    if (this.verificationForm.valid) {
      const code = Object.values(this.verificationForm.value).join('');
      this.handleVerify(code);
    } else {
      this.alertaService.alertaAdvertencia('Advertencia', 'Por favor, complete el código de verificación');
    }
  }
}
