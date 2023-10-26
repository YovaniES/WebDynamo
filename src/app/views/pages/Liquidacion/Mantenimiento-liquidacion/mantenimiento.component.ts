import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.scss'],
})
export class MantenimientoComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;

  loading = false;
  showingidx = 0;

  constructor(
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
  }


  liquidacionForm!: FormGroup;
  newFilfroForm(){
    this.liquidacionForm = this.fb.group({
      import             : ['']
    })
  };



}
