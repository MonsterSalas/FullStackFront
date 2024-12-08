import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import Swal from 'sweetalert2';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let localStorageStore: { [key: string]: string } = {};

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake(key => localStorageStore[key]);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => {
      localStorageStore[key] = value;
    });
    spyOn(Swal, 'fire');

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isLoggedIn', () => {
    it('should return true when localStorage has isLoggedIn set to true', () => {
      localStorageStore['isLoggedIn'] = 'true';
      expect(component.isLoggedIn).toBeTrue();
    });

    it('should return false when localStorage has isLoggedIn set to false', () => {
      localStorageStore['isLoggedIn'] = 'false';
      expect(component.isLoggedIn).toBeFalse();
    });

    it('should return false when localStorage is empty', () => {
      localStorageStore = {};
      expect(component.isLoggedIn).toBeFalse();
    });
  });

  describe('logout', () => {
    it('should set isLoggedIn to false and navigate to login', fakeAsync(() => {
      component.logout();
      expect(localStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'false');
      expect(Swal.fire).toHaveBeenCalledWith(
        'Sesión cerrada', 
        'Has cerrado sesión exitosamente', 
        'success'
      );
      
      tick(1000);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));
  });
});