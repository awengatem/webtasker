import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { AccountService } from 'src/app/services/account-service.service';
import { SiteService } from 'src/app/services/api/site.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any;
  siteName!: string;

  constructor(
    public modalRef: MdbModalRef<UserProfileComponent>,
    private accountService: AccountService,
    private siteService: SiteService
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  /**get user details */
  getUserDetails() {
    const user = this.accountService.getUser();
    console.log(user);
    if (user) {
      this.user = user;
      this.getSiteName(user.site_id);
    }
  }

  /**Get the site name */
  getSiteName(siteId: string) {
    this.siteService.getSpecifiedSite(siteId).subscribe({
      next: (site) => {
        console.log(site);
        this.siteName = site.siteName;
      },
      error: () => {},
    });
  }

  /**Method to close modal */
  close(): void {
    this.modalRef.close();
  }
}
