import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'acme';

  columnDefs = [
    { field: 'account_number', sortable: true, filter: true },
    { field: 'account_type', sortable: true, filter: true },
    { field: 'balance', sortable: true, filter: true }
  ];

  rowData: any[];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    const self = this;
    let service = this.http.get('http://localhost:8080/api/accounts');
    service.subscribe(data => {
      self.rowData = data as any[];
    });
  }
}
