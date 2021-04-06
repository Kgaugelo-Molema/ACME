import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'acme';
  @ViewChild('agGrid', { static: true }) agGrid: AgGridAngular;

  columnDefs = [
    { field: 'account_number', sortable: true, filter: true },
    { field: 'account_type', sortable: true, filter: true },
    { field: 'balance', sortable: true, filter: true },
    { field: 'withdraw', sortable: true, filter: true, checkboxSelection: true },
  ];

  rowData: any[];

  gridOptions = {
    onRowSelected: this.doRowSelect()
  }

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    const self = this;
    let service = this.http.get('http://localhost:8080/api/accounts');
    service.subscribe(data => {
      self.rowData = data as any[];
    });
  }

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data );
    let error = '';
    selectedData.forEach(node => {
      if (node.account_type == 'savings' && node.balance <= 0)
        error += `\nAccount Number ${node.account_number} is overdrawn!`;
      if (node.account_type == 'cheque' && node.balance < 500)
        error += `\nAccount Number ${node.account_number} has reached the maximum over draft limit!`;
    });
    const selectedDataStringPresentation = selectedData.map(node => `${node.account_number} ${node.account_type} ${node.balance}`).join(', ');

    alert(`Errors: ${error}`);
  }

  doRowSelect() {
    //alert('Row select');
  }

}
