import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { signal } from '@angular/core';
import { TypedFormControl, TypedFormGroup, CustomValidators } from './typed-form-control';

describe('TypedFormControl', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  describe('Typed FormControl Creation', () => {
    it('should create a typed FormControl with string type', () => {
      const control = new TypedFormControl<string>('initial value');
      
      expect(control).toBeInstanceOf(FormControl);
      expect(control.value).toBe('initial value');
      expect(typeof control.value).toBe('string');
    });

    it('should create a typed FormControl with number type', () => {
      const control = new TypedFormControl<number>(42);
      
      expect(control).toBeInstanceOf(FormControl);
      expect(control.value).toBe(42);
      expect(typeof control.value).toBe('number');
    });

    it('should create a typed FormControl with boolean type', () => {
      const control = new TypedFormControl<boolean>(true);
      
      expect(control).toBeInstanceOf(FormControl);
      expect(control.value).toBe(true);
      expect(typeof control.value).toBe('boolean');
    });

    it('should create a typed FormControl with custom interface type', () => {
      interface PlantData {
        name: string;
        stage: 'germination' | 'vegetative' | 'flowering' | 'harvest';
        daysSinceStart: number;
      }

      const plantData: PlantData = {
        name: 'Purple Kush',
        stage: 'vegetative',
        daysSinceStart: 30
      };

      const control = new TypedFormControl<PlantData>(plantData);
      
      expect(control).toBeInstanceOf(FormControl);
      expect(control.value.name).toBe('Purple Kush');
      expect(control.value.stage).toBe('vegetative');
      expect(control.value.daysSinceStart).toBe(30);
    });

    it('should support validators with type safety', () => {
      const control = new TypedFormControl<string>('', [Validators.required, Validators.minLength(3)]);
      
      expect(control.errors).toEqual({ required: true });
      
      control.setValue('ab');
      expect(control.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });
      
      control.setValue('abc');
      expect(control.errors).toBeNull();
    });
  });

  describe('TypedFormGroup', () => {
    it('should create a typed FormGroup with strongly typed controls', () => {
      interface LoginForm {
        username: string;
        password: string;
        rememberMe: boolean;
      }

      const formGroup = new TypedFormGroup<LoginForm>({
        username: new TypedFormControl<string>(''),
        password: new TypedFormControl<string>(''),
        rememberMe: new TypedFormControl<boolean>(false)
      });

      expect(formGroup.controls.username.value).toBe('');
      expect(formGroup.controls.password.value).toBe('');
      expect(formGroup.controls.rememberMe.value).toBe(false);
      
      // Type safety test - these should be properly typed
      expect(typeof formGroup.controls.username.value).toBe('string');
      expect(typeof formGroup.controls.rememberMe.value).toBe('boolean');
    });

    it('should support nested typed form groups', () => {
      interface EnvironmentalReading {
        temperature: number;
        humidity: number;
        ph: number;
      }

      interface PlantCareForm {
        plantName: string;
        careDate: string;
        environmental: EnvironmentalReading;
        notes: string;
      }

      const environmentalGroup = new TypedFormGroup<EnvironmentalReading>({
        temperature: new TypedFormControl<number>(24.5),
        humidity: new TypedFormControl<number>(65),
        ph: new TypedFormControl<number>(6.2)
      });

      const mainForm = new TypedFormGroup<PlantCareForm>({
        plantName: new TypedFormControl<string>(''),
        careDate: new TypedFormControl<string>(''),
        environmental: environmentalGroup,
        notes: new TypedFormControl<string>('')
      });

      const envGroup = mainForm.controls.environmental as TypedFormGroup<EnvironmentalReading>;
      expect(envGroup.controls.temperature.value).toBe(24.5);
      expect(envGroup.controls.humidity.value).toBe(65);
      expect(envGroup.controls.ph.value).toBe(6.2);
    });
  });

  describe('Custom Validators', () => {
    it('should validate plant name format with custom validator', () => {
      const control = new TypedFormControl<string>('invalid name!', [CustomValidators.plantNameValidator]);
      
      expect(control.errors).toEqual({
        plantName: {
          message: 'Plant name can only contain letters, numbers, spaces, and basic punctuation'
        }
      });

      control.setValue('Purple Kush #1');
      expect(control.errors).toBeNull();
    });

    it('should validate pH range with custom validator', () => {
      const control = new TypedFormControl<number>(3.0, [CustomValidators.phRangeValidator]);
      
      expect(control.errors).toEqual({
        phRange: {
          message: 'pH must be between 5.5 and 8.5',
          actualValue: 3.0,
          validRange: { min: 5.5, max: 8.5 }
        }
      });

      control.setValue(6.5);
      expect(control.errors).toBeNull();
    });

    it('should validate temperature range with custom validator', () => {
      const control = new TypedFormControl<number>(50, [CustomValidators.temperatureRangeValidator]);
      
      expect(control.errors).toEqual({
        temperatureRange: {
          message: 'Temperature must be between 15°C and 35°C',
          actualValue: 50,
          validRange: { min: 15, max: 35 }
        }
      });

      control.setValue(24.5);
      expect(control.errors).toBeNull();
    });

    it('should validate growth stage enum with custom validator', () => {
      const control = new TypedFormControl<string>('invalid-stage', [CustomValidators.growthStageValidator]);
      
      expect(control.errors).toEqual({
        growthStage: {
          message: 'Growth stage must be one of: germination, vegetative, flowering, harvest',
          actualValue: 'invalid-stage',
          validStages: ['germination', 'vegetative', 'flowering', 'harvest']
        }
      });

      control.setValue('vegetative');
      expect(control.errors).toBeNull();
    });
  });

  describe('Form State Management with Signals', () => {
    it('should integrate typed forms with Angular signals', () => {
      const formValue = signal({ username: '', password: '' });
      const formValid = signal(false);
      
      const formGroup = new TypedFormGroup({
        username: new TypedFormControl<string>(''),
        password: new TypedFormControl<string>('')
      });

      // Subscribe to form changes and update signals
      formGroup.valueChanges.subscribe((value: any) => {
        formValue.set(value);
      });

      formGroup.statusChanges.subscribe((status: any) => {
        formValid.set(status === 'VALID');
      });

      // Set initial values
      formValue.set(formGroup.value as any);
      formValid.set(formGroup.valid);

      expect(formValue().username).toBe('');
      expect(formValid()).toBe(true); // Empty form with no validators is valid by default

      formGroup.controls.username.setValue('testuser');
      expect(formValue().username).toBe('testuser');
    });

    it('should create reactive form state manager', () => {
      interface FormState<T> {
        value: T;
        valid: boolean;
        errors: any;
        dirty: boolean;
        touched: boolean;
      }

      const createFormState = <T>(initialValue: T) => {
        return signal<FormState<T>>({
          value: initialValue,
          valid: true,
          errors: null,
          dirty: false,
          touched: false
        });
      };

      const loginFormState = createFormState({ username: '', password: '' });
      
      expect(loginFormState().value.username).toBe('');
      expect(loginFormState().valid).toBe(true);
      expect(loginFormState().dirty).toBe(false);

      // Update state
      loginFormState.update(state => ({
        ...state,
        value: { username: 'testuser', password: 'password123' },
        dirty: true,
        touched: true
      }));

      expect(loginFormState().value.username).toBe('testuser');
      expect(loginFormState().dirty).toBe(true);
    });
  });

  describe('Ionic Component Integration', () => {
    it('should create form configuration for Ionic components', () => {
      interface IonicFormConfig<T> {
        controlName: string;
        label: string;
        placeholder: string;
        type: 'text' | 'email' | 'password' | 'number' | 'tel';
        validators: any[];
        ionicProps?: {
          clearInput?: boolean;
          fill?: 'outline' | 'solid';
          labelPlacement?: 'start' | 'end' | 'stacked' | 'floating';
        };
      }

      const createIonicFormConfig = <T>(config: IonicFormConfig<T>): IonicFormConfig<T> => {
        return config;
      };

      const usernameConfig = createIonicFormConfig({
        controlName: 'username',
        label: 'Username',
        placeholder: 'Enter your username',
        type: 'text',
        validators: [Validators.required, Validators.minLength(3)],
        ionicProps: {
          clearInput: true,
          fill: 'outline',
          labelPlacement: 'stacked'
        }
      });

      expect(usernameConfig.controlName).toBe('username');
      expect(usernameConfig.label).toBe('Username');
      expect(usernameConfig.ionicProps?.clearInput).toBe(true);
      expect(usernameConfig.validators).toContain(Validators.required);
    });

    it('should validate form configuration type safety', () => {
      interface PlantFormData {
        name: string;
        strain: string;
        plantedDate: string;
        expectedHarvestWeeks: number;
      }

      const formConfig = {
        name: {
          label: 'Plant Name',
          placeholder: 'Enter plant name',
          type: 'text' as const,
          validators: [Validators.required, CustomValidators.plantNameValidator]
        },
        strain: {
          label: 'Strain',
          placeholder: 'Enter strain name',
          type: 'text' as const,
          validators: [Validators.required]
        },
        plantedDate: {
          label: 'Planted Date',
          placeholder: 'Select planting date',
          type: 'text' as const,
          validators: [Validators.required]
        },
        expectedHarvestWeeks: {
          label: 'Expected Harvest (weeks)',
          placeholder: 'Enter weeks to harvest',
          type: 'number' as const,
          validators: [Validators.required, Validators.min(6), Validators.max(20)]
        }
      };

      // Verify configuration structure
      expect(formConfig.name.label).toBe('Plant Name');
      expect(formConfig.expectedHarvestWeeks.type).toBe('number');
      expect(formConfig.strain.validators).toContain(Validators.required);
    });
  });
});