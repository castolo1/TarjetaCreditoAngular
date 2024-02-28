import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl }  from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';import { TarjetaService } from '../../services/tarjeta.service';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from '../../models/tarjeta-credito/tarjeta-credito.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-tarjeta',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule],
  templateUrl: './crear-tarjeta.component.html',
  styleUrl: './crear-tarjeta.component.css'
})
export class CrearTarjetaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  titulo = 'Agregar Tarjeta';
  id: string | undefined;

  constructor(private fb: FormBuilder, private _tarjetaService: TarjetaService, private toastr: ToastrService) {
    this.form = this.fb.group({
      titular: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z ]+$')
      ]],
      numeroTarjeta: ['', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        Validators.pattern('^[0-9]+$')
      ]],
      fechaExpiracion: ['', [
        Validators.required, 
      ]],
      cvv: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(4),
        Validators.pattern('^[0-9]+$')
      ]],
    })
  }

  ngOnInit(): void {
    this._tarjetaService.getTarjetaEdit().subscribe(data => {
      this.id = data.id;
      this.titulo = 'Editar Tarjeta';
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion,
        cvv: data.cvv,
      })
    })
  }

  guardarTarjeta() {

    if(this.id === undefined) {
      // Creamos una nueva tarjeta
      this.agregarTarjeta();

    } else {
      // Editamos una nueva tarjeta
      this.editarTarjeta(this.id);
    }
    
  }

  editarTarjeta(id: string) {
    const TARJETA: any = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaActualizacion: new Date(),
    }
    this.loading = true;
    this._tarjetaService.editarTarjeta(id, TARJETA).then(() =>{
      this.loading = false;
      this.titulo = 'Agregar Tarjeta';
      this.form.reset();
      this.id = undefined;
      this.toastr.info('La Tarjeta fue actualizada con exito!', 'Registro Actualizado');
    }, error => {
      console.log(error);
    })
  }

  agregarTarjeta() {
    const TARJETA: TarjetaCredito = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    }

    this.loading = true;
    this._tarjetaService.guardarTarjeta(TARJETA).then(() => {
      this.loading = false;
      console.log('tarjeta registrado');
      this.toastr.success('La tarjete fue registrada con exito!', 'Tarjeta registrada')
      this.form.reset();
    }, error => {
      this.loading = false;
      this.toastr.error('Opps.. ocurrio un error', 'Error');
      console.log(error);
    })
  }

}