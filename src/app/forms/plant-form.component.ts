import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { 
  TypedFormGroup, 
  TypedFormControl, 
  CustomValidators, 
  PlantFormData 
} from './typed-form-control';

@Component({
  selector: 'app-plant-form',
  templateUrl: './plant-form.component.html',
  styleUrls: ['./plant-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class PlantFormComponent implements OnInit {
  
  // Form with strongly typed controls
  plantForm = new TypedFormGroup<PlantFormData>({
    name: new TypedFormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
      CustomValidators.plantNameValidator
    ]),
    strain: new TypedFormControl<string>('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    source: new TypedFormControl<'seed' | 'clone'>('seed', [
      Validators.required
    ]),
    plantedDate: new TypedFormControl<string>('', [
      Validators.required
    ]),
    expectedHarvestWeeks: new TypedFormControl<number>(8, [
      Validators.required,
      Validators.min(6),
      Validators.max(20)
    ]),
    notes: new TypedFormControl<string>('')
  });

  // Form state signals
  formValue = signal<PlantFormData>({
    name: '',
    strain: '',
    source: 'seed',
    plantedDate: '',
    expectedHarvestWeeks: 8,
    notes: ''
  });

  formValid = signal<boolean>(false);
  formTouched = signal<boolean>(false);
  formErrors = signal<any>(null);

  // Computed values
  canSubmit = computed(() => 
    this.formValid() && this.formTouched() && !this.plantForm.pending
  );

  estimatedHarvestDate = computed(() => {
    const plantedDate = this.formValue().plantedDate;
    const weeks = this.formValue().expectedHarvestWeeks;
    
    if (!plantedDate || !weeks) return null;
    
    const planted = new Date(plantedDate);
    const harvest = new Date(planted.getTime() + (weeks * 7 * 24 * 60 * 60 * 1000));
    return harvest.toLocaleDateString();
  });

  // Form field configurations
  formFields = {
    name: {
      label: 'Plant Name',
      placeholder: 'Enter a unique name for this plant',
      type: 'text' as const,
      ionicProps: {
        clearInput: true,
        fill: 'outline' as const,
        labelPlacement: 'stacked' as const,
        helperText: 'Choose a memorable name for tracking'
      }
    },
    strain: {
      label: 'Strain',
      placeholder: 'Enter strain name (e.g., Purple Kush)',
      type: 'text' as const,
      ionicProps: {
        clearInput: true,
        fill: 'outline' as const,
        labelPlacement: 'stacked' as const
      }
    },
    source: {
      label: 'Source',
      placeholder: 'Select plant source',
      type: 'text' as const,
      ionicProps: {
        fill: 'outline' as const,
        labelPlacement: 'stacked' as const
      }
    },
    plantedDate: {
      label: 'Planted Date',
      placeholder: 'Select when you planted',
      type: 'date' as const,
      ionicProps: {
        fill: 'outline' as const,
        labelPlacement: 'stacked' as const
      }
    },
    expectedHarvestWeeks: {
      label: 'Expected Harvest (weeks)',
      placeholder: 'Enter weeks to harvest',
      type: 'number' as const,
      ionicProps: {
        fill: 'outline' as const,
        labelPlacement: 'stacked' as const,
        helperText: 'Typical range: 6-20 weeks'
      }
    },
    notes: {
      label: 'Notes',
      placeholder: 'Any additional notes about this plant',
      type: 'text' as const,
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
    this.plantForm.valueChanges.subscribe((value: any) => {
      this.formValue.set(value);
    });

    // Subscribe to form status changes
    this.plantForm.statusChanges.subscribe((status: any) => {
      this.formValid.set(status === 'VALID');
    });

    // Track form touched state
    this.plantForm.statusChanges.subscribe(() => {
      this.formTouched.set(this.plantForm.touched);
    });

    // Track form errors
    this.plantForm.statusChanges.subscribe(() => {
      this.formErrors.set(this.plantForm.errors);
    });
  }

  private initializeFormState(): void {
    // Set initial state
    this.formValue.set(this.plantForm.value as any);
    this.formValid.set(this.plantForm.valid);
    this.formTouched.set(this.plantForm.touched);
    this.formErrors.set(this.plantForm.errors);
  }

  getFieldError(fieldName: keyof PlantFormData): string | null {
    const control = this.plantForm.controls[fieldName];
    
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    // Handle standard validators
    if (control.errors['required']) {
      return `${this.formFields[fieldName].label} is required`;
    }

    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `${this.formFields[fieldName].label} must be at least ${requiredLength} characters`;
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
    if (control.errors['plantName']) {
      return control.errors['plantName'].message;
    }

    return 'Invalid value';
  }

  hasFieldError(fieldName: keyof PlantFormData): boolean {
    const control = this.plantForm.controls[fieldName];
    return !!(control && control.errors && control.touched);
  }

  onSubmit(): void {
    if (!this.canSubmit()) {
      // Mark all fields as touched to show validation errors
      this.plantForm.markAllAsTouched();
      return;
    }

    const formData = this.formValue();
    console.log('Plant form submitted:', formData);
    
    // Here you would typically send the data to a service
    // this.plantService.createPlant(formData);
    
    // Reset form after successful submission
    this.resetForm();
  }

  resetForm(): void {
    this.plantForm.reset({
      name: '',
      strain: '',
      source: 'seed',
      plantedDate: '',
      expectedHarvestWeeks: 8,
      notes: ''
    });
  }

  // Utility method for getting control reference with type safety
  getControl<K extends keyof PlantFormData>(controlName: K): TypedFormControl<PlantFormData[K]> {
    return this.plantForm.controls[controlName] as TypedFormControl<PlantFormData[K]>;
  }
}