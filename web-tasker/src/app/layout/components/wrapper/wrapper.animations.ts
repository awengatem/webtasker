import {
    animate,
    state,
    style,
    transition,
    trigger,
  } from '@angular/animations';
  
  /*
   * animation: sideNaveAnimation
   * trigger: 'openClose'
   *
   * comments: sets the width of an element to 200px when 'open' and to 60px
   *   when closed.  Animates in between these two states over '0.3s'
   */
  
  export const sideNavAnimation = trigger('openCloseSidenav', [
      // ...
      state('open', style({
        width: '14rem',
      })),
      state('closed', style({
        width: '5rem',
      })),
      transition('open <=> closed', [
        animate('0.3s')
      ]),
    ]);
  
  /*
   * animation: sideNavContainerAnimation
   * trigger: 'openCloseSidenavContent'
   *
   * comments: Sets the margin-left to 201px when "open" and 61px when "closed".
   */
  
  export const sideNavContainerAnimation = trigger('openCloseSidenavContent', [
      state('open', style({
        'margin-left': '14rem',        
      })),
      state('closed', style({
        'margin-left': '5rem',               
      })),
      transition('open <=> closed', [
        animate('0.3s')
      ]),
    ]);