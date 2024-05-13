import { trigger, transition, style, animate } from '@angular/animations';

export const slideUpAnimation = trigger('routerTransition', [
  transition('* => slide-up', [
    style({ transform: 'translateY(100%)' }),
    animate('500ms ease-in-out', style({ transform: 'translateY(0%)' }))
  ]),
  transition('slide-up => *', [
    style({ transform: 'translateY(0%)' }),
    animate('500ms ease-in-out', style({ transform: 'translateY(-100%)' }))
  ])
]);

