import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AccountService } from 'src/app/services/account-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { TimerService } from 'src/app/services/timer.service';
import Swal from 'sweetalert2';
import { UserProfileComponent } from '../views/user/user-profile/user-profile.component';
import {
  sideNavAnimation,
  sideNavContainerAnimation,
} from './wrapper.animations';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
  animations: [sideNavAnimation, sideNavContainerAnimation],
  providers: [MdbModalService],
})
export class WrapperComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<any> = new EventEmitter();
  //@ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  /**define modal */
  modalRef: MdbModalRef<UserProfileComponent> | null = null;
  isModalOpen: boolean = false; //add background blur/

  /**Variables used by sidenav status */
  isExpanded!: boolean;
  sublist!: boolean;
  isAdmin!: boolean;
  isSupervisor!: boolean;

  constructor(
    private authService: AuthService,
    private modalService: MdbModalService,
    private accountService: AccountService,
    private sidenavService: SidenavService,
    private timerService: TimerService
  ) {}

  ngOnInit(): void {
    // check whether user is admin(supervisor) or manager to update menu
    this.checkAdmin();
    this.checkSupervisor();

    const expanded = this.sidenavService.getIsExpanded();
    const sublist = this.sidenavService.getSublist();
    if (expanded === 'true') {
      this.isExpanded = true;
    } else {
      this.isExpanded = false;
    }
    if (sublist === 'true') {
      //check if admin first
      this.authService.verifyAdmin().then((result) => {
        if (result === true) {
          this.sublist = true;
        } else {
          this.sublist = false;
        }
      });
    } else {
      this.sublist = false;
    }
  }

  toggle() {
    if (this.isExpanded === true) {
      this.isExpanded = false;
      this.sidenavService.setIsExpanded('false');
    } else {
      this.isExpanded = true;
      this.sidenavService.setIsExpanded('true');
    }
  }

  logout1() {
    this.authService.logout();
    //console.log("logout works!!");
  }

  logout(): void {
    this.authService.logout();

    //window.location.reload();
  }

  showSublist() {
    /**prevent showing sublist if user is not an admin */
    this.authService
      .verifyAdmin()
      .then((result) => {
        let status;
        if (result === true) {
          this.sublist = !this.sublist;
          if (this.sublist === true) {
            status = 'true';
          } else {
            status = 'false';
          }
        } else {
          /**hide sublist */
          this.sublist = false;
          status = 'false';
          /**notify user */
          Swal.fire('Unauthorized!', `You are not an admin.`, 'warning');
        }
        //update local storage
        this.sidenavService.setSublist(status);
      })
      .catch((error) => {
        console.log(error);
        Swal.fire('Error!', `Some error ocurred`, 'error');
      });
  }

  /**Check if user is supervisor */
  checkSupervisor() {
    this.authService.verifySupervisor().then((result) => {
      if (result === true) this.isSupervisor = result;
      else this.isSupervisor = false;
    });
  }

  /**Check if user is admin */
  checkAdmin() {
    this.authService.verifyAdmin().then((result) => {
      if (result === true) this.isAdmin = result;
      else this.isAdmin = false;
    });
  }

  /**METHODS USED BY MODAL */
  /**open user profile modal */
  openUserProfileModal() {
    this.isModalOpen = true;
    this.modalRef = this.modalService.open(UserProfileComponent, {
      modalClass: 'modal-dialog-centered modal-xl',
    });
    //listen when closed
    this.modalRef.onClose.subscribe(() => {
      this.isModalOpen = false;
    });
  }
}
