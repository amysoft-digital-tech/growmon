import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PlantFormComponent } from './plant-form.component';

describe('PlantFormComponent', () => {
  let component: PlantFormComponent;
  let fixture: ComponentFixture<PlantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantFormComponent, ReactiveFormsModule, IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with default values', () => {
      expect(component.plantForm.value.name).toBe('');
      expect(component.plantForm.value.strain).toBe('');
      expect(component.plantForm.value.source).toBe('seed');
      expect(component.plantForm.value.expectedHarvestWeeks).toBe(8);
    });

    it('should initialize form state signals', () => {
      expect(component.formValid()).toBe(false); // Form should be invalid initially (required fields empty)
      expect(component.formTouched()).toBe(false);
      expect(component.canSubmit()).toBe(false);
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const nameControl = component.getControl('name');
      const strainControl = component.getControl('strain');
      const plantedDateControl = component.getControl('plantedDate');

      expect(nameControl.errors?.['required']).toBeTruthy();
      expect(strainControl.errors?.['required']).toBeTruthy();
      expect(plantedDateControl.errors?.['required']).toBeTruthy();
    });

    it('should validate plant name with custom validator', () => {
      const nameControl = component.getControl('name');
      
      nameControl.setValue('invalid name!@#$');
      expect(nameControl.errors?.['plantName']).toBeTruthy();
      
      nameControl.setValue('Valid Plant Name #1');
      expect(nameControl.errors?.['plantName']).toBeFalsy();
    });

    it('should validate expected harvest weeks range', () => {
      const weeksControl = component.getControl('expectedHarvestWeeks');
      
      weeksControl.setValue(5); // Below minimum
      expect(weeksControl.errors?.['min']).toBeTruthy();
      
      weeksControl.setValue(25); // Above maximum
      expect(weeksControl.errors?.['max']).toBeTruthy();
      
      weeksControl.setValue(12); // Valid range
      expect(weeksControl.errors).toBeNull();
    });

    it('should validate minimum length for name and strain', () => {
      const nameControl = component.getControl('name');
      const strainControl = component.getControl('strain');
      
      nameControl.setValue('a'); // Too short
      expect(nameControl.errors?.['minlength']).toBeTruthy();
      
      strainControl.setValue('b'); // Too short
      expect(strainControl.errors?.['minlength']).toBeTruthy();
      
      nameControl.setValue('Valid Name');
      strainControl.setValue('Valid Strain');
      expect(nameControl.errors?.['minlength']).toBeFalsy();
      expect(strainControl.errors?.['minlength']).toBeFalsy();
    });
  });

  describe('Form State Management', () => {
    it('should update form value signal when form changes', () => {
      const testName = 'Test Plant';
      component.getControl('name').setValue(testName);
      
      expect(component.formValue().name).toBe(testName);
    });

    it('should update form valid signal when validation state changes', () => {
      // Initially invalid
      expect(component.formValid()).toBe(false);
      
      // Fill in all required fields with valid data
      component.getControl('name').setValue('Test Plant');
      component.getControl('strain').setValue('Test Strain');
      component.getControl('plantedDate').setValue('2024-01-01');
      
      expect(component.formValid()).toBe(true);
    });

    it('should calculate canSubmit based on form state', () => {
      expect(component.canSubmit()).toBe(false);
      
      // Fill form and mark as touched
      component.getControl('name').setValue('Test Plant');
      component.getControl('strain').setValue('Test Strain');
      component.getControl('plantedDate').setValue('2024-01-01');
      component.plantForm.markAsTouched();
      
      expect(component.canSubmit()).toBe(true);
    });
  });

  describe('Computed Values', () => {
    it('should calculate estimated harvest date', () => {
      component.getControl('plantedDate').setValue('2024-01-01');
      component.getControl('expectedHarvestWeeks').setValue(8);
      
      const estimatedDate = component.estimatedHarvestDate();
      expect(estimatedDate).toBeTruthy();
      
      // Should be approximately 8 weeks (56 days) after planted date
      const plantedDate = new Date('2024-01-01');
      const expectedHarvest = new Date(plantedDate.getTime() + (8 * 7 * 24 * 60 * 60 * 1000));
      expect(estimatedDate).toBe(expectedHarvest.toLocaleDateString());
    });

    it('should return null for estimated harvest date when data is missing', () => {
      component.getControl('plantedDate').setValue('');
      component.getControl('expectedHarvestWeeks').setValue(8);
      
      expect(component.estimatedHarvestDate()).toBeNull();
      
      component.getControl('plantedDate').setValue('2024-01-01');
      component.getControl('expectedHarvestWeeks').setValue(0);
      
      expect(component.estimatedHarvestDate()).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should return appropriate error messages', () => {
      const nameControl = component.getControl('name');
      nameControl.markAsTouched();
      
      // Required error
      expect(component.getFieldError('name')).toContain('required');
      
      // Min length error
      nameControl.setValue('a');
      expect(component.getFieldError('name')).toContain('at least');
      
      // Custom validator error
      nameControl.setValue('invalid!@#$');
      expect(component.getFieldError('name')).toContain('letters, numbers, spaces');
    });

    it('should detect field errors correctly', () => {
      const nameControl = component.getControl('name');
      
      expect(component.hasFieldError('name')).toBe(false); // Not touched yet
      
      nameControl.markAsTouched();
      expect(component.hasFieldError('name')).toBe(true); // Now touched and invalid
      
      nameControl.setValue('Valid Name');
      expect(component.hasFieldError('name')).toBe(false); // Now valid
    });
  });

  describe('Form Actions', () => {
    it('should handle form submission when valid', () => {
      spyOn(console, 'log');
      
      // Fill form with valid data
      component.getControl('name').setValue('Test Plant');
      component.getControl('strain').setValue('Test Strain');
      component.getControl('source').setValue('seed');
      component.getControl('plantedDate').setValue('2024-01-01');
      component.getControl('expectedHarvestWeeks').setValue(8);
      component.plantForm.markAsTouched();
      
      component.onSubmit();
      
      expect(console.log).toHaveBeenCalledWith('Plant form submitted:', jasmine.any(Object));
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      spyOn(component.plantForm, 'markAllAsTouched');
      
      component.onSubmit(); // Form is invalid
      
      expect(component.plantForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should reset form to default values', () => {
      // Change form values
      component.getControl('name').setValue('Test Plant');
      component.getControl('strain').setValue('Test Strain');
      
      component.resetForm();
      
      expect(component.getControl('name').value).toBe('');
      expect(component.getControl('strain').value).toBe('');
      expect(component.getControl('source').value).toBe('seed');
      expect(component.getControl('expectedHarvestWeeks').value).toBe(8);
    });
  });

  describe('Type Safety', () => {
    it('should provide type-safe control access', () => {
      const nameControl = component.getControl('name');
      const sourceControl = component.getControl('source');
      const weeksControl = component.getControl('expectedHarvestWeeks');
      
      // These should compile without errors due to proper typing
      nameControl.setValue('Test');
      sourceControl.setValue('clone');
      weeksControl.setValue(10);
      
      expect(nameControl.value).toBe('Test');
      expect(sourceControl.value).toBe('clone');
      expect(weeksControl.value).toBe(10);
    });

    it('should maintain type safety in form value signal', () => {
      component.getControl('name').setValue('Typed Plant');
      component.getControl('expectedHarvestWeeks').setValue(12);
      
      const formValue = component.formValue();
      
      // These should be properly typed
      expect(typeof formValue.name).toBe('string');
      expect(typeof formValue.expectedHarvestWeeks).toBe('number');
      expect(formValue.source).toMatch(/^(seed|clone)$/);
    });
  });

  describe('Ionic Integration', () => {
    it('should have proper form field configurations', () => {
      expect(component.formFields.name.label).toBe('Plant Name');
      expect(component.formFields.name.ionicProps?.fill).toBe('outline');
      expect(component.formFields.name.ionicProps?.labelPlacement).toBe('stacked');
      expect(component.formFields.name.ionicProps?.clearInput).toBe(true);
    });

    it('should configure different input types correctly', () => {
      expect(component.formFields.name.type).toBe('text');
      expect(component.formFields.plantedDate.type).toBe('date');
      expect(component.formFields.expectedHarvestWeeks.type).toBe('number');
    });
  });
});