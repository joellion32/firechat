import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
mensaje:string = "";
elemento: any;

  constructor(public chat: ChatService) {
    this.chat.cargarMensajes().subscribe(
      () => {
        // para que el scroll siempre quede abajo
        setTimeout(() => {
          this.elemento.scrollTop = this.elemento.scrollHeight;
        }, 20)
      }
    );
   }

  ngOnInit(): void {
    this.elemento = document.getElementById('app-mensajes');

  }


  enviarMensaje(){
    console.log(this.mensaje);
    let campo = document.getElementById('campo');

    if(this.mensaje.length === 0){
      return;
    }else{
      campo.value = "";
      this.chat.AgregarMensaje(this.mensaje);
      console.log('mensaje enviado');
    }
  }
}
