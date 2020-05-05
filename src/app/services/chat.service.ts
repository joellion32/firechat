import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensajes } from '../interfaces/mensajes.interfaces';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
private itemsCollection:  AngularFirestoreCollection<Mensajes>;


public chats: Mensajes[] = [];
public usuario:any = {}

  constructor(private firestore: AngularFirestore, public auth: AngularFireAuth) {
      this.auth.authState.subscribe(user => {
        console.log('estado del usuario', user);

        if(!user){
          return;
        }else{
          this.usuario.nombre = user.displayName;
          this.usuario.uid = user.uid;
        }
      })
  }

// Autenticacion
login(metodo) {
if(metodo == "google"){
  this.auth.signInWithPopup(new auth.GoogleAuthProvider());
} else if(metodo == "github"){
  this.auth.signInWithPopup(new auth.GithubAuthProvider());
}

}
logout() {
  this.usuario = {}
  this.auth.signOut();
}




// para cargar los mensajes
  cargarMensajes(){
    // cargar los mensajes desde firebase
    this.itemsCollection = this.firestore.collection<Mensajes>('chats', ref=> ref.orderBy('fecha', 'desc').limit(10));
    


    // conviertiendo los mensajes a un array y luego mapeandolos
    return this.itemsCollection.valueChanges().pipe(
      map((mensajes: Mensajes[]) => {
        console.log(mensajes)
        this.chats = [];

        for(let mensaje of mensajes){
          this.chats.unshift(mensaje)
        }

        return this.chats;
      })
    )
  }


  AgregarMensaje(texto: string){
    let mensaje: Mensajes = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid,
    }

    // agregar a firebase 
    this.itemsCollection.add(mensaje)
  }

  
}
