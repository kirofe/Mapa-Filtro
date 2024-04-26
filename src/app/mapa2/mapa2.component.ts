import { Component } from '@angular/core';
import { JsonLoaderService } from '../services/jsonloader.service';
import { first } from 'rxjs';
import * as L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';
import { MapaService } from '../services/mapa-teste.service';

@Component({
  selector: 'app-mapa2',
  templateUrl: `./mapa2.component.html`,
  styleUrls: ['./mapa2.component.scss'],
})
export class Mapa2Component {
  map: any 

  constructor(private jsonLoader: JsonLoaderService, private mapaService: MapaService) {    
    
  }

  ngOnInit(): void {
    this.map = L.map('map').setView([-10, -44.5], 5);
    const map = this.map;
    let geoJsonEstados: any;

    this.jsonLoader.getMapaTeste2().pipe(first()).subscribe((json: any) => {
      geoJsonEstados = L.geoJSON(json, {
        style: this.styleEstados,
      }).addTo(map);
    });

    this.jsonLoader.getMapaTeste().pipe(first()).subscribe((json: any) => {
      this.jsonLoader.getDadosMapa().pipe(first()).subscribe(
      // this.mapaService.getMapaTeste().pipe(first()).subscribe(
        (response: any) => {
          console.log(response);
          
          for (let i = 0; i < json.features.length; i++) {
            let properties: any = {};
            let key;

            for (key in json.features[i].properties) {
              if(json.features[i].properties.hasOwnProperty(key)){
                properties[key] = json.features[i].properties[key];
              }
            } 
            
            for (key in response[json.features[i].properties.id]) {            
              if(response[json.features[i].properties.id].hasOwnProperty(key)){
                properties[key] = response[json.features[i].properties.id][key];
              }
            }
            json.features[i].properties = properties;
          }
          this.startMap(json, geoJsonEstados);
        }, (err) => {
          console.log(err);
        }
      );
      // L.marker([51.5, -0.09]).addTo(map)
      // .bindPopup('A pretty CSS popup.<br> Easily customizable.')
      // .openPopup();
    });
  }

  startMap(json: any, geoJsonEstados: any) {
    const map = this.map;
    // const googleLayer = L.gridLayer.googleMutant({
    //   type: 'roadmap' // Pode ser 'roadmap', 'satellite', 'terrain' ou 'hybrid'
    // });

    // map.addLayer(googleLayer);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);      

    const geoJson = L.geoJSON(json, {
      style: this.style,
      onEachFeature: onEachFeature
    }).addTo(map);

    const selected:any = [];

    function highlightFeature(event: any) {
      var layer = event.target;
      
      layer.setStyle({
        weight: 5,
        opacity: 1,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });
      showTooltip(event);
      layer.bringToFront();
      update(layer.feature.properties);
    }

    // function highlightFeature(e: any) {
    //   var layer = e.target;

    //   if (selected.includes(layer)) {
    //     selected.splice(selected.indexOf(layer), 1);
    //     resetHighlight(layer)
    //   } else {        
    //     layer.setStyle({
    //       weight: 5,
    //       opacity: 1,
    //       color: '#666',
    //       dashArray: '',
    //       fillOpacity: 0.7
    //     });

    //     selected.push(layer);

    //     layer.bringToFront();
    //     update(layer.feature.properties);
    //   }
    // }

    function resetHighlight(event: any) {
      map.closeTooltip(tooltip);
      geoJson.resetStyle(event.target);
      update();
    }

    // function resetHighlight(layer: any) {
    //   geoJson.resetStyle(layer);
    //   update();
    // }

    function onEachFeature(feature: any, layer: any) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        mousemove: showTooltip
        // click: highlightFeature
      });
    }

    var tooltip: any;

    function showTooltip(event: any) {      
      if(tooltip) map.closeTooltip(tooltip);     
      tooltip = L.tooltip({
        permanent: true,
        direction: 'right'
      })
      .setContent(htmlToolTip(event.target.feature.properties))
      .setLatLng(event.latlng)
      .addTo(map);
    }

    function htmlToolTip(props: any) {
      return `<div style="width: 300px; padding: 5px;"> \n` +
             `     <div style="width: 300px; font-weight: bold; display: flex;"> \n` +
             `         <div style="width: 225px;text-align: start;">Municipio:</div> \n` +
             `         <div>${props.nome}</div> \n` +
             `     </div> \n` +
             `     <div style="width: 300px; font-weight: bold; display: flex;"> \n` +
             `         <div style="width: 225px;text-align: start;">População:</div> \n` +
             `         <div>${props.populacao}</div> \n` +
             `     </div> \n` +
             `     <div style="width: 300px; font-weight: bold; display: flex;"> \n` +
             `         <div style="width: 225px;text-align: start;">Venda 365d AddeMonitor R$:</div> \n` +
             `         <div>${props.adde['Venda 365d AddeMonitor']}</div> \n` +
             `     </div> \n` +
             `     <div style="width: 300px; font-weight: bold; display: flex;"> \n` +
             `         <div style="width: 225px;text-align: start;">Venda 365d Filiado R$:</div> \n` +
             `         <div>0</div> \n` +
             `     </div> \n` +
             `     <div style="width: 300px; font-weight: bold; display: flex;"> \n` +
             `         <div style="width: 225px;text-align: start;">Participação na Venda Filiado %:</div> \n` +
             `         <div>0</div> \n` +
             `     </div> \n` +
             `     <div style="width: 300px; font-weight: bold; display: flex;"> \n` +
             `         <div style="width: 225px;text-align: start;">Qtd Compradores 365d AddeMonitor:</div> \n` +
             `         <div>${props.adde['Qtd Compradores 365d Adde']}</div> \n` +
             `     </div> \n` +
             `     <div style="width: 300px; font-weight: bold; display: flex;"> \n` +
             `         <div style="width: 225px;text-align: start;">Qtd Compradores 365d Filiado:</div> \n` +
             `         <div>0</div> \n` +
             `     </div> \n` +
             `     <div style="width: 300px; font-weight: bold; display: flex;"> \n` +
             `         <div style="width: 225px;text-align: start;">Evolução 120d AddeMonitor %:</div> \n` +
             `         <div>${props.adde['Evolucao 120d AddeMonitor']}</div> \n` +
             `     </div> \n` +
             `     <div style="width: 300px; font-weight: bold; display: flex;"> \n` +
             `         <div style="width: 225px;text-align: start;">Evolução 120d Filiado %:</div> \n` +
             `         <div>0</div> \n` +
             `     </div> \n` +
             `</div>`;
    }

    const info = new L.Control;

    let _div: any;

    function update (props: any = undefined) {
      _div.innerHTML = '<h4>BR População</h4>' +  (props ?
          '<b>' + props.nome + '</b><br />' + props.populacao + ' people / mi<sup>2</sup>'
          : 'Hover over a state');
    };

    info.onAdd = function (map: any) {
        _div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        update();
        return _div;
    };

    // method that we will use to update the control based on feature properties passed
    

    info.addTo(map);
  }

  style() {
    return {
      // fillColor: '#FFEDA0',
      weight: 1,
      opacity: 1,
      color: 'gray',
      dashArray: '1',
      fillOpacity: 0,
    };
  }

  styleEstados() {
    return {
      // fillColor: '#FFEDA0',
      weight: 5,
      opacity: 1,
      color: 'black',
      dashArray: '1',
      fillOpacity: 0
    };
  }
}
