import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';

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
    MatProgressSpinnerModule
  ]
})
export class Codigo_verificacionComponent implements OnInit {

  isLoading = false;
  error = '';

  verificationForm = this.fb.group({
    digit1: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]],
    digit2: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]],
    digit3: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]],
    digit4: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]],
    digit5: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]],
    digit6: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)]]
  });

  resendTimer = 0;
  resendInterval: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.verificationForm.valueChanges.subscribe(() => {
      this.cd.markForCheck();
    });
    this.startResendTimer();
  }

  send() {
    this.router.navigate(['/home']);
  }

  async handleVerify() {
    if (this.verificationForm.valid) {
      this.isLoading = true;
      this.error = '';

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulated successful verification
        this.isLoading = false;
        alert('Login successful!');
        // In a real application, you would verify the code and log the user in here
      } catch (err) {
        this.isLoading = false;
        this.error = 'Invalid verification code. Please try again.';
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
        await new Promise(resolve => setTimeout(resolve, 1500));

        this.isLoading = false;
        alert('Verification code resent to your email');
        this.startResendTimer();
        // In a real application, you would resend the verification code here
      } catch (err) {
        this.isLoading = false;
        this.error = 'Failed to resend verification code. Please try again.';
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
      console.log('Código ingresado:', code);
      this.router.navigate(['/home']);
    } else {
      console.log('Formulario no válido');
    }
  }
}
