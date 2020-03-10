import {Component, OnInit} from '@angular/core';
import {DigiteamService, OrderDetailModel} from './service/digiteam.service';

declare var ZAFClient: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'zendesk-integration';

  appStatus = 'loading';

  orderDetail: OrderDetailModel;

  constructor(private digiteamService: DigiteamService) {
  }

  ngOnInit(): void {
    const client = ZAFClient.init();
    client.invoke('resize', {width: '100%', height: '500px'});

    if (this.digiteamService.isLoggedIn()) {
      client.get('ticket.id').then(data => {

        const ticketId = data['ticket.id'];

        this.digiteamService.getOrder(ticketId)
          .subscribe(
            result => {
              this.appStatus = 'detail';
              this.orderDetail = result;
            },
            error => {
              this.appStatus = 'create';
            }
          );
      });
    } else {
      this.appStatus = 'login';
    }
  }

  onLoginSuccess($event: any) {

    const client = ZAFClient.init();

    client.get('ticket.id').then((data) => {
      const ticketId = data['ticket.id'];

      this.digiteamService.getOrder(ticketId)
        .subscribe(
          result => {
            this.appStatus = 'detail';
            this.orderDetail = result;
          },
          error => {
            this.appStatus = 'create';
          }
        );
    });
  }

  onCreatedSuccess($event: any) {
    this.onLoginSuccess($event);
  }
}
