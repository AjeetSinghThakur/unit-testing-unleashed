import { HeroComponent } from './../hero/hero.component';
import { By } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { ComponentFixture } from '@angular/core/testing';
import { HeroService } from '../hero.service';
import { NO_ERRORS_SCHEMA, Component, Input, Directive } from '@angular/core';
import { of } from 'rxjs/observable/of';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[routerLink]',
    // tslint:disable-next-line:use-host-property-decorator
    host: { '(click)' : 'onClick()' }
})
export class RouterLinkStubDirective {
    // tslint:disable-next-line:no-input-rename
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;
    onClick() {
        this.navigatedTo = this.linkParams;
    }
}

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
                HeroComponent,
                RouterLinkStubDirective
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            // schemas: [NO_ERRORS_SCHEMA]
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
    it(`should call heroService.deleteHero when the Hero Component's
    delete button is called`, () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        heroComponentDEs[0].query(By.css('button'))
        .triggerEventHandler('click', { stopPropagation: () => {} });
        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
    });
    it(`should call heroService.deleteHero when the Hero Component's
    delete button is called : Same as above just rewritting in different style`, () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        // (<HeroComponent>heroComponentDEs[0].componentInstance).delete.emit(undefined);
        // Same line of code will do the similar operations.
        heroComponentDEs[0].triggerEventHandler('delete', null);
        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
    });
    it(`should add new hero to hero list when add button is clicked`, () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const name = 'Superman';
        mockHeroService.addHero.and.returnValue(of({ id: 5, name: name, strength: 5 }));
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];
        inputElement.value = name;
        addButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
        expect(heroText).toContain(name);
    });
    it('should have the correct route for the first hero', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        const routerLink = heroComponents[0]
        .query(By.directive(RouterLinkStubDirective))
        .injector.get(RouterLinkStubDirective);
        heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);
        expect(routerLink.navigatedTo).toBe('/detail/1');
    });
});
