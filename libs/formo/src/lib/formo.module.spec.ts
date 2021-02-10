import { async, TestBed } from '@angular/core/testing';
import { FormoModule } from './formo.module';

describe('FormoModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormoModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(FormoModule).toBeDefined();
  });
});
