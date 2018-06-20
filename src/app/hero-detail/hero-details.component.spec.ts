import { element } from 'protractor';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';
import { HeroService } from './../hero.service';
import { HeroDetailComponent } from './hero-detail.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DEPRECATED_PLURAL_FN } from '@angular/common/src/i18n/localization';
import { FormsModule } from '@angular/forms';

describe('HeroDetailCompoenent', () => {
    let fixture: ComponentFixture<HeroDetailComponent>;
    let mockActivatedRoute, mockHeroService, mockLocation;
    beforeEach(() => {
        mockActivatedRoute = { snapshot: { paramMap: { get: () => '3'}}};
        mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
        mockLocation = jasmine.createSpyObj(['back']);
        TestBed.configureTestingModule({
            imports:[FormsModule],
            declarations: [HeroDetailComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: HeroService, useValue: mockHeroService },
                { provide: Location, useValue: mockLocation }
            ]
        });
        fixture = TestBed.createComponent(HeroDetailComponent);
        mockHeroService.getHero.and.returnValue(of({id: 3, name: 'SuperDude', strength: 100}));
    });
    it('should render hero name in h2 tab', () => {
        fixture.detectChanges();
        // const debugElement = fixture.debugElement.query(By.css('h2')).nativeElement;
        // expect(debugElement.textContent).toContain('SUPERDUDE');
        expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE');
    });
});
