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
    { field: 'amount', sortable: true, filter: true, editable: true },
    { field: 'status', sortable: true, filter: true }
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
    let messages = 'Message Log\n';
    this.agGrid.api.forEachNode(node => {
      let status = '';
      const amount = Number(node.data.amount);
      if (amount == NaN || node.data.amount == undefined || node.data.amount == '') {
        node.setDataValue('status', 'Invalid Amount!');
      }
      else {
        const balance = node.data.balance - amount;
        if (node.data.account_type == 'savings' && balance <= 0) {
          status = 'Declined';
          messages += `\nAccount Number ${node.data.account_number} is overdrawn!`
        }
        else if (node.data.account_type == 'cheque' && balance < 500) {
          status = 'Declined';
          messages += `\nAccount Number ${node.data.account_number} has reached the maximum over draft limit!`
        }
        else 
          status = 'Approved';
        node.setDataValue('status', status);  
        node.setDataValue('balance', balance.toFixed(2));  
      }       
    });
    if (messages != 'Message Log\n')
      alert(messages); 
}

  sizeToFit() {
    this.agGrid.api.sizeColumnsToFit();
  }

  autoSizeAll(skipHeader) {
    const cols = this.agGrid.columnApi.getAllColumns().forEach(column => {
      this.agGrid.columnApi.autoSizeColumn(column.getColId());
      if (column.getColId() == 'status') 
        column.setActualWidth(200);
    });
    return;

    let json = JSON.stringify(cols);
    alert(`${json}`);

    this.agGrid.columnApi.getAllColumns().forEach(function (column) {
      json = JSON.stringify(column);
      alert(`${json}`);
      //this.agGrid.columnApi.autoSizeColumn(column);
    });
  }

  doRowSelect() {
    //alert('Row select');
  }

}
