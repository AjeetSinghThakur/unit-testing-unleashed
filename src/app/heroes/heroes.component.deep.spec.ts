import { HeroComponent } from './../hero/hero.component';
import { By } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { ComponentFixture } from '@angular/core/testing';
import { HeroService } from '../hero.service';
import { NO_ERRORS_SCHEMA, Component, Input } from '@angular/core';
import { of } from 'rxjs/observable/of';

describe('Hero Component(deep test)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach(() => {
        HEROES = [
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'Wonderful Woman', strength: 24},
            {id: 3, name: 'SuperDude', strength: 55}
          ];
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero ']);
        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroesComponent);
    });
    it('should render each hero as HeroComponent', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        // run ngOnInit
        fixture.detectChanges();
        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentDEs.length).toBe(3);
        for (let i = 0; i < heroComponentDEs.length; i++) {
            expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    });
});
