import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class MapaService { 
    httpHeader?: HttpHeaders;

    constructor(private http: HttpClient){
        this.httpHeader = new HttpHeaders().set('Content-Type', 'application/json')
                                           .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJEQVNIQk9BUkQiOiJTIiwiRklMSUFETyI6IjEiLCJQT1NJQ0FPIjoiUyIsIlNFTUFGT1JPIjoiUyIsIlVTVUFSSU8iOiJmZWxpY2lhIiwiZXhwIjoxNzE0MTQ0NTEyLCJpYXQiOjE3MTQxNDA5MTIsImlzcyI6ImFkZGVtb25pdG9yX2FwaXdlYl9jb21lcmNpYWwiLCJuYmYiOjE3MTQxNDA5MTIsInN1YiI6IjUwOCJ9.s7GxnuAf5iL-jBLu96TChOQCDl9ZSBoc08eN80C53lQ');
    }
    
    public getMapaTeste() {
        return this.http.get('http://192.168.20.197:8088/mapateste2', {headers: this.httpHeader});
    }
}