import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class JsonLoaderService { 
    httpHeader?: HttpHeaders;

    constructor(private http: HttpClient){
        this.httpHeader = new HttpHeaders().set('Content-Type', 'application/json')                                           
    }
    
    public getMapaTeste() {
        return this.http.get('../assets/geojs-100-mun.json');
    }
    
    public getMapaTeste2() {
        return this.http.get('../assets/GERAL_estados.json');
    }    
    
    public getDadosMapa() {
        return this.http.get('../assets/Dados_Mapa.json');
    }
}