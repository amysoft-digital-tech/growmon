import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SkeletonLoaderComponent } from './skeleton-loader.component';

describe('SkeletonLoaderComponent', () => {
  let component: SkeletonLoaderComponent;
  let fixture: ComponentFixture<SkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLoaderComponent, IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render skeleton elements by default', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('ion-skeleton-text')).toBeTruthy();
    });

    it('should not render skeleton when loading is false', () => {
      component.loading.set(false);
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.skeleton-container')).toBeFalsy();
    });
  });

  describe('Skeleton Types', () => {
    it('should render text skeleton type', () => {
      component.type = 'text';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.skeleton-text')).toBeTruthy();
    });

    it('should render card skeleton type', () => {
      component.type = 'card';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.skeleton-card')).toBeTruthy();
    });

    it('should render list skeleton type', () => {
      component.type = 'list';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.skeleton-list')).toBeTruthy();
    });

    it('should render avatar skeleton type', () => {
      component.type = 'avatar';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.skeleton-avatar')).toBeTruthy();
    });
  });

  describe('Configuration Options', () => {
    it('should support custom animation', () => {
      component.animated = false;
      fixture.detectChanges();
      
      const skeletonText = fixture.nativeElement.querySelector('ion-skeleton-text');
      expect(skeletonText.getAttribute('animated')).toBe('false');
    });

    it('should support repeat count for list items', () => {
      component.type = 'list';
      component.repeat = 5;
      fixture.detectChanges();
      
      const items = fixture.nativeElement.querySelectorAll('.skeleton-list-item');
      expect(items.length).toBe(5);
    });

    it('should apply custom width', () => {
      component.width = '75%';
      fixture.detectChanges();
      
      const container = fixture.nativeElement.querySelector('.skeleton-container');
      expect(container.style.width).toBe('75%');
    });

    it('should apply custom height', () => {
      component.height = '100px';
      fixture.detectChanges();
      
      const container = fixture.nativeElement.querySelector('.skeleton-container');
      expect(container.style.height).toBe('100px');
    });
  });

  describe('Angular Signals Integration', () => {
    it('should work with loading signal', () => {
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

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const container = fixture.nativeElement.querySelector('.skeleton-container');
      expect(container.getAttribute('aria-busy')).toBe('true');
      expect(container.getAttribute('aria-live')).toBe('polite');
    });

    it('should have screen reader text', () => {
      const srText = fixture.nativeElement.querySelector('.sr-only');
      expect(srText).toBeTruthy();
      expect(srText.textContent).toContain('Loading content');
    });
  });

  describe('Performance Optimization', () => {
    it('should improve perceived performance', () => {
      // Test that skeleton shows immediately while content loads
      expect(component.loading()).toBe(true);
      
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.skeleton-container')).toBeTruthy();
    });

    it('should provide smooth transition when content loads', () => {
      const container = fixture.nativeElement.querySelector('.skeleton-container');
      expect(container.classList.contains('skeleton-fade')).toBe(true);
    });
  });
});