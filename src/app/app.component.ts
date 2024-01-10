import { Component, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Style, Fill, Stroke } from 'ol/style';
import { click } from 'ol/events/condition';
import Select from 'ol/interaction/Select';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import { fromLonLat } from 'ol/proj';
import RenderFeature from 'ol/render/Feature';
import { Feature } from 'ol';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Mapa-Filtro';
  // map!: Map;
  // select!: Select;

  // ngOnInit() {
  //   this.initializeMap();
  //   this.initializeClickEvent();
  // }

  ngOnInit() {
    const highlightStyle = new Style({
      fill: new Fill({
        color: 'blue',
      }),
      stroke: new Stroke({
        color: '#3399CC',
        width: 2,
      }),
    });
    
    const vector = new VectorLayer({
      // background: '#1a2b39',
      source: new VectorSource({
        // url: 'assets/geojs-100-mun.json',
        url: 'assets/geojs-41-mun.json',
        format: new GeoJSON(),
      }),
    });
    
    const map = new Map({
      layers: [new TileLayer({
        source: new OSM(),
      }), vector],
      target: 'map',
      view: new View({
        center: fromLonLat([-50, -24.5]),
        zoom: 8,
        multiWorld: true,
      }),
    });

    const selected: Array<any> = [];

    const status = document.getElementById('status');

    map.on('singleclick', function (e) {
      console.log(selected)
      map.forEachFeatureAtPixel(e.pixel, function (feature) {
        const selIndex = selected.indexOf(feature);
        if (selIndex < 0) {
          selected.push(feature);
          console.log((feature as Feature).getProperties());
          (feature as Feature).setStyle(highlightStyle);
        } else {
          selected.splice(selIndex, 1);
          (feature as Feature).setStyle(undefined);
        }
      });

      status!.innerHTML = '&nbsp;' + selected.length + ' selected features';
    });
  }

  // initializeMap() {
  //   this.map = new Map({
  //     target: 'map',
  //     layers: [this.GetVector()],
  //     view: new View({
  //       center: [0, 0],
  //       zoom: 2
  //     })
  //   });    
  // }

  // initializeClickEvent() {
  //   const clickCondition = click;

  //   this.select = new Select({
  //     condition: (event) => clickCondition(event as any),
  //     layers: [/* Add your layers here */],
  //     style: new Style({
  //       fill: new Fill({
  //         color: 'rgba(255, 255, 255, 0.7)'
  //       }),
  //       stroke: new Stroke({
  //         color: '#3399CC',
  //         width: 3
  //       })
  //     })
  //   });

  //   this.map.addInteraction(this.select);

  //   this.select.on('select', (event) => {
  //     const selectedFeatures = event.selected;
  //     const deselectedFeatures = event.deselected;

  //     selectedFeatures.forEach((f) => {
  //       // Perform actions for selected features
  //       f.setStyle(this.getHighlightStyle());
  //     });

  //     deselectedFeatures.forEach((f) => {
  //       // Perform actions for deselected features
  //       f.setStyle(undefined);
  //     });
  //   });
  // }

  // getHighlightStyle(): Style {
  //   return new Style({
  //     fill: new Fill({
  //       color: 'rgba(255, 0, 0, 0.7)'
  //     }),
  //     stroke: new Stroke({
  //       color: '#FF0000',
  //       width: 3
  //     })
  //   });
  // }

  // GetVector() : any {
  //   return new VectorLayer({
  //     background: 'white',
  //     source: new VectorSource({
  //       url: 'https://openlayers.org/data/vector/us-states.json',
  //       format: new GeoJSON(),
  //     }),
  //   });
  // }

}
