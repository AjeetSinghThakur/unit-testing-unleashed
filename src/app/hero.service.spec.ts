import { MessageService } from './message.service';
import { HeroService } from './hero.service';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('HeroService', () => {
    let mockMessageService;
    let httpTestingController: HttpTestingController;
    let service: HeroService;
    beforeEach(() => {
        mockMessageService = jasmine.createSpyObj(['add', 'clear']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HeroService,
                { provide: MessageService, useValue: mockMessageService }
            ]
        });
       httpTestingController = TestBed.get(HttpTestingController);
       service = TestBed.get(HeroService);
    });
    describe('getHero', () => {
        it('should call get with the correct url', () => {
            service.getHero(4).subscribe();
            // service.getHero(3).subscribe();
            const req = httpTestingController.expectOne('api/heroes/4');
            req.flush({ id: 4, name: 'SuperDude', strength: 100 });
            httpTestingController.verify();
        });
    });
});