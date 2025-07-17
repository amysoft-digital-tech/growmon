import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ErrorDisplayComponent } from './error-display.component';

describe('ErrorDisplayComponent', () => {
  let component: ErrorDisplayComponent;
  let fixture: ComponentFixture<ErrorDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDisplayComponent, IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorDisplayComponent);
    component = fixture.componentInstance;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not render error UI when no error', () => {
      component.error.set(null);
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.error-container')).toBeFalsy();
    });

    it('should render error UI when error is set', () => {
      component.error.set({ message: 'Test error' });
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.error-container')).toBeTruthy();
    });
  });

  describe('Error Display', () => {
    beforeEach(() => {
      component.error.set({
        message: 'Failed to load plants',
        code: 'NETWORK_ERROR',
        details: 'Connection timeout'
      });
      fixture.detectChanges();
    });

    it('should display error message', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Failed to load plants');
    });

    it('should display error icon', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('ion-icon[name="alert-circle-outline"]')).toBeTruthy();
    });

    it('should show retry button when retryable', () => {
      component.retryable = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.retry-button')).toBeTruthy();
    });

    it('should hide retry button when not retryable', () => {
      component.retryable = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.retry-button')).toBeFalsy();
    });
  });

  describe('Error Types', () => {
    it('should apply network error styling', () => {
      component.error.set({ message: 'Network error', type: 'network' });
      fixture.detectChanges();
      
      const container = fixture.nativeElement.querySelector('.error-container');
      expect(container.classList.contains('error-network')).toBe(true);
    });

    it('should apply validation error styling', () => {
      component.error.set({ message: 'Validation error', type: 'validation' });
      fixture.detectChanges();
      
      const container = fixture.nativeElement.querySelector('.error-container');
      expect(container.classList.contains('error-validation')).toBe(true);
    });

    it('should apply server error styling', () => {
      component.error.set({ message: 'Server error', type: 'server' });
      fixture.detectChanges();
      
      const container = fixture.nativeElement.querySelector('.error-container');
      expect(container.classList.contains('error-server')).toBe(true);
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      component.error.set({ message: 'Test error' });
      component.retryable = true;
      fixture.detectChanges();
    });

    it('should emit retry event when retry button clicked', () => {
      spyOn(component.retryAction, 'emit');
      
      const retryButton = fixture.nativeElement.querySelector('.retry-button');
      retryButton.click();
      
      expect(component.retryAction.emit).toHaveBeenCalled();
    });

    it('should emit dismiss event when dismiss button clicked', () => {
      spyOn(component.dismissError, 'emit');
      
      const dismissButton = fixture.nativeElement.querySelector('.dismiss-button');
      dismissButton.click();
      
      expect(component.dismissError.emit).toHaveBeenCalled();
    });

    it('should clear error when dismiss is called', () => {
      component.onDismiss();
      expect(component.error()).toBeNull();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.error.set({ message: 'Test error' });
      fixture.detectChanges();
    });

    it('should have proper ARIA attributes', () => {
      const container = fixture.nativeElement.querySelector('.error-container');
      expect(container.getAttribute('role')).toBe('alert');
      expect(container.getAttribute('aria-live')).toBe('assertive');
    });

    it('should have screen reader text', () => {
      const srText = fixture.nativeElement.querySelector('.sr-only');
      expect(srText).toBeTruthy();
      expect(srText.textContent).toContain('Error');
    });
  });

  describe('Angular Signals Integration', () => {
    it('should work with Angular signals', () => {
      const errorSignal = component.error;
      expect(errorSignal()).toBeNull();
      
      const testError = { message: 'Test error' };
      component.setError(testError);
      expect(errorSignal()).toEqual(testError);
    });

    it('should emit error state changes', () => {
      spyOn(component.errorStateChange, 'emit');
      
      const testError = { message: 'Test error' };
      component.setError(testError);
      expect(component.errorStateChange.emit).toHaveBeenCalledWith(testError);
    });
  });
});