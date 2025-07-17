import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { 
  TypedFormGroup, 
  TypedFormControl, 
  CustomValidators, 
  EnvironmentalReadingFormData 
} from './typed-form-control';

@Component({
  selector: 'app-environmental-form',
  templateUrl: './environmental-form.component.html',
  styleUrls: ['./environmental-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class EnvironmentalFormComponent implements OnInit {
  
  // Environmental reading form with strongly typed controls
  environmentalForm = new TypedFormGroup<EnvironmentalReadingFormData>({
    temperature: new TypedFormControl<number>(0, [
      Validators.required,
      CustomValidators.temperatureRangeValidator
    ]),
    humidity: new TypedFormControl<number>(0, [
      Validators.required,
      CustomValidators.humidityRangeValidator
    ]),
    ph: new TypedFormControl<number>(0, [
      Validators.required,
      CustomValidators.phRangeValidator
    ]),
    lightIntensity: new TypedFormControl<number | undefined>(undefined, [
      Validators.min(0),
      Validators.max(100000) // Max PPFD for cannabis
    ]),
    co2Level: new TypedFormControl<number | undefined>(undefined, [
      Validators.min(300),
      Validators.max(1500) // Typical CO2 range for cannabis
    ]),
    timestamp: new TypedFormControl<string>(new Date().toISOString().slice(0, 16), [
      Validators.required
    ])
  });

  // Form state signals
  formValue = signal<EnvironmentalReadingFormData>({
    temperature: 0,
    humidity: 0,
    ph: 0,
    lightIntensity: undefined,
    co2Level: undefined,
    timestamp: new Date().toISOString().slice(0, 16)
  });

  formValid = signal<boolean>(false);
  formTouched = signal<boolean>(false);
  formErrors = signal<any>(null);

  // Computed values
  canSubmit = computed(() => 
    this.formValid() && this.formTouched() && !this.environmentalForm.pending
  );

  // Environmental status computed values
  temperatureStatus = computed(() => {
    const temp = this.formValue().temperature;
    if (temp < 18) return { status: 'low', color: 'primary' };
    if (temp > 28) return { status: 'high', color: 'warning' };
    return { status: 'optimal', color: 'success' };
  });

  humidityStatus = computed(() => {
    const humidity = this.formValue().humidity;
    if (humidity < 40) return { status: 'low', color: 'warning' };
    if (humidity > 70) return { status: 'high', color: 'danger' };
    return { status: 'optimal', color: 'success' };
  });

  phStatus = computed(() => {
    const ph = this.formValue().ph;
    if (ph < 6.0) return { status: 'acidic', color: 'warning' };
    if (ph > 7.0) return { status: 'alkaline', color: 'warning' };
    return { status: 'optimal', color: 'success' };
  });

  // Form field configurations
  formFields = {
    temperature: {
      label: 'Temperature (°C)',
      placeholder: 'Enter temperature in Celsius',
      type: 'number' as const,
      ionicProps: {
        fill: 'outline' as const,
        labelPlacement: 'stacked' as const,
        helperText: 'Optimal range: 18-28°C'
      }
    },
    humidity: {
      label: 'Humidity (%)',
      placeholder: 'Enter relative humidity percentage',
      type: 'number' as const,
      ionicProps: {
        fill: 'outline' as const,
        labelPlacement: 'stacked' as const,
        helperText: 'Optimal range: 40-70%'
      }
    },
    ph: {
      label: 'pH Level',
      placeholder: 'Enter pH measurement',
      type: 'number' as const,
      ionicProps: {
        fill: 'outline' as const,
        labelPlacement: 'stacked' as const,
        helperText: 'Optimal range: 6.0-7.0'
      }
    },
    lightIntensity: {
      label: 'Light Intensity (PPFD)',
      placeholder: 'Enter PPFD value (optional)',
      type: 'number' as const,
      ionicProps: {
        fill: 'outline' as const,
        labelPlacement: 'stacked' as const,
        helperText: 'Photosynthetic Photon Flux Density'
      }
    },
    co2Level: {
      label: 'CO₂ Level (ppm)',
      placeholder: 'Enter CO₂ concentration (optional)',
      type: 'number' as const,
      ionicProps: {
        fill: 'outline' as const,
        labelPlacement: 'stacked' as const,
        helperText: 'Optimal range: 800-1200 ppm'
      }
    },
    timestamp: {
      label: 'Reading Time',
      placeholder: 'Select reading timestamp',
      type: 'datetime-local' as const,
      ionicProps: {
        fill: 'outline' as const,
        labelPlacement: 'stacked' as const
      }
    }
  };

  ngOnInit() {
    this.setupFormSubscriptions();
    this.initializeFormState();
  }

  private setupFormSubscriptions(): void {
    // Subscribe to form value changes
    this.environmentalForm.valueChanges.subscribe((value: any) => {
      this.formValue.set(value);
    });

    // Subscribe to form status changes
    this.environmentalForm.statusChanges.subscribe((status: any) => {
      this.formValid.set(status === 'VALID');
    });

    // Track form touched state
    this.environmentalForm.statusChanges.subscribe(() => {
      this.formTouched.set(this.environmentalForm.touched);
    });

    // Track form errors
    this.environmentalForm.statusChanges.subscribe(() => {
      this.formErrors.set(this.environmentalForm.errors);
    });
  }

  private initializeFormState(): void {
    // Set initial state
    this.formValue.set(this.environmentalForm.value as any);
    this.formValid.set(this.environmentalForm.valid);
    this.formTouched.set(this.environmentalForm.touched);
    this.formErrors.set(this.environmentalForm.errors);
  }

  getFieldError(fieldName: keyof EnvironmentalReadingFormData): string | null {
    const control = this.environmentalForm.controls[fieldName];
    
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    // Handle standard validators
    if (control.errors['required']) {
      return `${this.formFields[fieldName].label} is required`;
    }

    if (control.errors['min']) {
      const min = control.errors['min'].min;
      return `${this.formFields[fieldName].label} must be at least ${min}`;
    }

    if (control.errors['max']) {
      const max = control.errors['max'].max;
      return `${this.formFields[fieldName].label} must be no more than ${max}`;
    }

    // Handle custom validators
    if (control.errors['temperatureRange']) {
      return control.errors['temperatureRange'].message;
    }

    if (control.errors['humidityRange']) {
      return control.errors['humidityRange'].message;
    }

    if (control.errors['phRange']) {
      return control.errors['phRange'].message;
    }

    return 'Invalid value';
  }

  hasFieldError(fieldName: keyof EnvironmentalReadingFormData): boolean {
    const control = this.environmentalForm.controls[fieldName];
    return !!(control && control.errors && control.touched);
  }

  onSubmit(): void {
    if (!this.canSubmit()) {
      // Mark all fields as touched to show validation errors
      this.environmentalForm.markAllAsTouched();
      return;
    }

    const formData = this.formValue();
    console.log('Environmental reading submitted:', formData);
    
    // Here you would typically send the data to a service
    // this.environmentalService.recordReading(formData);
    
    // Reset form after successful submission
    this.resetForm();
  }

  resetForm(): void {
    const now = new Date().toISOString().slice(0, 16);
    this.environmentalForm.reset({
      temperature: 0,
      humidity: 0,
      ph: 0,
      lightIntensity: undefined,
      co2Level: undefined,
      timestamp: now
    });
  }

  // Utility method for getting control reference with type safety
  getControl<K extends keyof EnvironmentalReadingFormData>(controlName: K): TypedFormControl<EnvironmentalReadingFormData[K]> {
    return this.environmentalForm.controls[controlName] as TypedFormControl<EnvironmentalReadingFormData[K]>;
  }

  // Quick preset methods for common environmental conditions
  setVegetativePreset(): void {
    this.environmentalForm.patchValue({
      temperature: 24,
      humidity: 60,
      ph: 6.2,
      lightIntensity: 400,
      co2Level: 1000
    });
  }

  setFloweringPreset(): void {
    this.environmentalForm.patchValue({
      temperature: 22,
      humidity: 50,
      ph: 6.5,
      lightIntensity: 600,
      co2Level: 1200
    });
  }
}