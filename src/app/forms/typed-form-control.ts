import { FormControl, FormGroup, AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';

/**
 * Strongly typed FormControl that extends Angular's FormControl
 * with TypeScript generics for type safety
 */
export class TypedFormControl<T = any> extends FormControl {
  declare value: T;

  constructor(
    formState?: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(formState as any, validatorOrOpts, asyncValidator);
  }

  /**
   * Sets the value with type safety
   */
  override setValue(value: T, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.setValue(value, options);
  }

  /**
   * Patches the value with type safety
   */
  override patchValue(value: Partial<T>, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.patchValue(value, options);
  }
}

/**
 * Strongly typed FormGroup that extends Angular's FormGroup
 * with TypeScript generics for type safety
 */
export class TypedFormGroup<T extends Record<string, any> = any> extends FormGroup {
  declare value: T;
  declare controls: { [K in keyof T]: AbstractControl };

  constructor(controls: { [K in keyof T]: AbstractControl }) {
    super(controls as any);
  }

  /**
   * Gets a control with type safety
   */
  override get<K extends keyof T>(controlName: K): AbstractControl {
    return super.get(controlName as string) as AbstractControl;
  }

  /**
   * Sets the value with type safety
   */
  override setValue(value: T, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.setValue(value as any, options);
  }

  /**
   * Patches the value with type safety
   */
  override patchValue(value: Partial<T>, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.patchValue(value as any, options);
  }
}

/**
 * Custom validators for Growmon application
 */
export class CustomValidators {
  
  /**
   * Validates plant name format - allows letters, numbers, spaces, and basic punctuation
   */
  static plantNameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values, use Validators.required for that
    }

    const plantNamePattern = /^[a-zA-Z0-9\s\-_#.()]+$/;
    const isValid = plantNamePattern.test(control.value);

    return isValid ? null : {
      plantName: {
        message: 'Plant name can only contain letters, numbers, spaces, and basic punctuation'
      }
    };
  };

  /**
   * Validates pH range (5.5 - 8.5)
   */
  static phRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value && control.value !== 0) {
      return null; // Don't validate empty values
    }

    const phValue = Number(control.value);
    const minPh = 5.5;
    const maxPh = 8.5;

    if (phValue < minPh || phValue > maxPh) {
      return {
        phRange: {
          message: 'pH must be between 5.5 and 8.5',
          actualValue: phValue,
          validRange: { min: minPh, max: maxPh }
        }
      };
    }

    return null;
  };

  /**
   * Validates temperature range (15°C - 35°C)
   */
  static temperatureRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value && control.value !== 0) {
      return null; // Don't validate empty values
    }

    const tempValue = Number(control.value);
    const minTemp = 15;
    const maxTemp = 35;

    if (tempValue < minTemp || tempValue > maxTemp) {
      return {
        temperatureRange: {
          message: 'Temperature must be between 15°C and 35°C',
          actualValue: tempValue,
          validRange: { min: minTemp, max: maxTemp }
        }
      };
    }

    return null;
  };

  /**
   * Validates growth stage enum values
   */
  static growthStageValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values
    }

    const validStages = ['germination', 'vegetative', 'flowering', 'harvest'];
    const isValid = validStages.includes(control.value);

    return isValid ? null : {
      growthStage: {
        message: 'Growth stage must be one of: germination, vegetative, flowering, harvest',
        actualValue: control.value,
        validStages: validStages
      }
    };
  };

  /**
   * Validates humidity range (30% - 80%)
   */
  static humidityRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value && control.value !== 0) {
      return null; // Don't validate empty values
    }

    const humidityValue = Number(control.value);
    const minHumidity = 30;
    const maxHumidity = 80;

    if (humidityValue < minHumidity || humidityValue > maxHumidity) {
      return {
        humidityRange: {
          message: 'Humidity must be between 30% and 80%',
          actualValue: humidityValue,
          validRange: { min: minHumidity, max: maxHumidity }
        }
      };
    }

    return null;
  };

  /**
   * Validates nutrient concentration (ppm)
   */
  static nutrientPpmValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value && control.value !== 0) {
      return null; // Don't validate empty values
    }

    const ppmValue = Number(control.value);
    const minPpm = 100;
    const maxPpm = 2000;

    if (ppmValue < minPpm || ppmValue > maxPpm) {
      return {
        nutrientPpm: {
          message: 'Nutrient concentration must be between 100 and 2000 ppm',
          actualValue: ppmValue,
          validRange: { min: minPpm, max: maxPpm }
        }
      };
    }

    return null;
  };
}

/**
 * Type definitions for common form structures in Growmon
 */
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface PlantFormData {
  name: string;
  strain: string;
  source: 'seed' | 'clone';
  plantedDate: string;
  expectedHarvestWeeks: number;
  notes?: string;
}

export interface EnvironmentalReadingFormData {
  temperature: number;
  humidity: number;
  ph: number;
  lightIntensity?: number;
  co2Level?: number;
  timestamp: string;
}

export interface WateringEventFormData {
  amount: number; // in liters
  phLevel: number;
  nutrientPpm?: number;
  waterType: 'tap' | 'distilled' | 'ro' | 'rainwater';
  timestamp: string;
  notes?: string;
}

export interface NutrientMixFormData {
  name: string;
  type: 'vegetative' | 'flowering' | 'flush';
  nutrients: Array<{
    name: string;
    amount: number;
    unit: 'ml' | 'g' | 'tsp' | 'tbsp';
  }>;
  totalVolume: number; // in liters
  finalPh: number;
  finalPpm: number;
  notes?: string;
}

/**
 * Form state interface for use with Angular Signals
 */
export interface FormState<T> {
  value: T;
  valid: boolean;
  errors: ValidationErrors | null;
  dirty: boolean;
  touched: boolean;
  pending: boolean;
}

/**
 * Ionic form field configuration interface
 */
export interface IonicFormFieldConfig {
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'datetime-local';
  validators: ValidatorFn[];
  ionicProps?: {
    clearInput?: boolean;
    fill?: 'outline' | 'solid';
    labelPlacement?: 'start' | 'end' | 'stacked' | 'floating';
    helperText?: string;
    errorText?: string;
    counter?: boolean;
    maxlength?: number;
  };
}

/**
 * Utility function to create a typed form group with proper type inference
 */
export function createTypedFormGroup<T extends Record<string, any>>(
  config: { [K in keyof T]: AbstractControl }
): TypedFormGroup<T> {
  return new TypedFormGroup<T>(config);
}

/**
 * Utility function to create a typed form control with proper type inference
 */
export function createTypedFormControl<T>(
  initialValue: T,
  validators?: ValidatorFn | ValidatorFn[]
): TypedFormControl<T> {
  return new TypedFormControl<T>(initialValue, validators);
}