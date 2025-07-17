import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent, IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render ion-spinner by default', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('ion-spinner')).toBeTruthy();
    });

    it('should display loading message when provided', () => {
      component.message = 'Loading plants...';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Loading plants...');
    });
  });

  describe('Loading State Configuration', () => {
    it('should accept different spinner types', () => {
      component.spinnerType = 'dots';
      fixture.detectChanges();
      
      const spinner = fixture.nativeElement.querySelector('ion-spinner');
      expect(spinner.getAttribute('name')).toBe('dots');
    });

    it('should accept custom color', () => {
      component.color = 'success';
      fixture.detectChanges();
      
      const spinner = fixture.nativeElement.querySelector('ion-spinner');
      expect(spinner.getAttribute('color')).toBe('success');
    });

    it('should support different sizes', () => {
      component.size = 'large';
      fixture.detectChanges();
      
      const container = fixture.nativeElement.querySelector('.loading-container');
      expect(container.classList.contains('loading-large')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const container = fixture.nativeElement.querySelector('.loading-container');
      expect(container.getAttribute('role')).toBe('status');
      expect(container.getAttribute('aria-live')).toBe('polite');
    });

    it('should have screen reader text', () => {
      const srText = fixture.nativeElement.querySelector('.sr-only');
      expect(srText).toBeTruthy();
      expect(srText.textContent).toContain('Loading');
    });
  });

  describe('Loading State Integration', () => {
    it('should work with Angular Signals', () => {
      const loadingSignal = component.loading;
      expect(loadingSignal()).toBe(true);
      
      component.setLoading(false);
      expect(loadingSignal()).toBe(false);
    });

    it('should emit loading state changes', () => {
      spyOn(component.loadingStateChange, 'emit');
      
      component.setLoading(false);
      expect(component.loadingStateChange.emit).toHaveBeenCalledWith(false);
    });
  });
});