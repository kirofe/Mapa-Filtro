import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Map, Overlay, View } from 'ol';
// import GoogleLayer from 'olgm/layer/Google.js';
// import {defaults} from 'olgm/interaction.js';
// import OLGoogleMaps from 'olgm/OLGoogleMaps.js';
import OSM from 'ol/source/OSM';
import { Style, Fill, Stroke } from 'ol/style';
import { click, platformModifierKeyOnly } from 'ol/events/condition';
import {DragBox, Extent, Select} from 'ol/interaction.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { fromLonLat } from 'ol/proj';
import RenderFeature from 'ol/render/Feature';
import { Feature } from 'ol';
import { getWidth } from 'ol/extent';
import cidades from './cidades.json';
import { first } from 'rxjs';
import TileLayer from 'ol/layer/Tile';
import { MapaService } from '../services/mapa-teste.service';
import { JsonLoaderService } from '../services/jsonloader.service';

@Component({
  selector: 'app-mapa1',
  templateUrl: `./mapa1.component.html`,
  styleUrls: ['./mapa1.component.scss'],
})
export class Mapa1Component { 
  title = 'Mapa-Filtro';
  selected: Array<any> = [];
  // googleLayer = new GoogleLayer();
  // map!: Map;
  // select!: Select;

  // ngOnInit() {
  //   this.initializeMap();
  //   this.initializeClickEvent();
  // }

  constructor(private mapaService: MapaService, private jsonLoader: JsonLoaderService) {

  }

  ngOnInit() {
    this.jsonLoader.getMapaTeste().pipe(first()).subscribe((json) => {    
      // Faça o que quiser com o objeto JSON
      console.log(json);
      const feature = new GeoJSON().readFeatures(json)

      this.mapaService.getMapaTeste().pipe(first()).subscribe(
        (response) => {      
          console.log(response);
        }, (err) => {
          console.log(err);
        }
      );
    
      const highlightStyle = new Style({
        fill: new Fill({
          color: 'rgba(0,0,0,0.3)',
        }),
        stroke: new Stroke({
          // color: '#3399CC',
          color: 'blue',
          width: 1,
        }),
      });
      const unselectedStyle = new Style({
        image: undefined,
        fill: new Fill({
          color: 'rgba(0,0,0,0)',
  
        }),
        stroke: new Stroke({
          color: '#3399CC',
          // color: 'blue',
          width: 1,
        }),
      });
      
      const vectorSource = new VectorSource({
        // background: '#1a2b39',
        // url: 'assets/geojs-100-mun.json',
        // url: 'assets/geojs-41-mun.json',
        url: 'assets/GERAL_estados.json',
        // url: 'assets/GERAL_malhas.json',
        // url: 'assets/PR_malhas.json',
        // url: 'assets/PR_municipios.json',
        // features: feature,
        format: new GeoJSON(),
      });

      vectorSource.addFeatures(feature);
    
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: unselectedStyle
      });
  
      // vectorSource.forEachFeature((feature) => {
      //   console.log("oi");
        
      // });
  
      const container = document.getElementById('popup');
      const content = document.getElementById('popup-content');
      const closer = document.getElementById('popup-closer');    
  
      const overlay = new Overlay({
        element: container ? container : undefined,
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });
      
      if (closer != null) {
        closer.onclick = function () {
          overlay.setPosition(undefined);
          closer.blur();
          return false;
        };
      }
  
      const map = new Map({
        layers: [new TileLayer({
          source: new OSM(),
        }), vectorLayer],
        // layers: [this.googleLayer, vectorLayer],
        // layers: [vectorLayer],
        target: 'map',
        view: new View({
          center: fromLonLat([-50, -24.5]),
          zoom: 8,
          multiWorld: true,
        }),      
        overlays: [overlay]
      });
  
      // var olGM = new OLGoogleMaps({map: map}); // map is the ol.Map instance
      // olGM.activate();
  
      // const selected: Array<any> = this.selected;
      let selected: any = undefined;
  
      const soma: number = 0;
  
      const status = document.getElementById('status');
  
      const dragBox = new DragBox({
        condition: platformModifierKeyOnly,
      });
      
      map.addInteraction(dragBox);
  
      map.on('pointermove', function (e) {
        const coordinate = e.coordinate;
        coordinate[0] += 5000;
        coordinate[1] += 3000;
        console.log(selected);
        console.log(coordinate);
        console.log(map);
        map.forEachFeatureAtPixel(e.pixel, function (feature) {
          let property;
          console.log(feature);
          if (selected != feature) {
            if (selected != undefined) {            
              (selected as Feature).setStyle(unselectedStyle);
            }
  
            selected = feature;
            console.log((feature as Feature).getProperties());
            property = (feature as Feature).getProperties();
            (feature as Feature).setStyle(highlightStyle);
          } else if (feature) {          
            console.log((feature as Feature).getProperties());
            property = (feature as Feature).getProperties();
          } else {
            selected = undefined;
            property = undefined;
          }
          
          if (content != null && overlay != null && property) {
            content.innerHTML = '<p>You clicked here:</p><code>' + property['description'] + '</code>';
            overlay.setPosition(coordinate);
          } else if (closer && overlay){
            overlay.setPosition(undefined);
            closer.blur();
          }
        });
  
        status!.innerHTML = '&nbsp;' + selected.length + ' selected features';
      });
    });
    
    

    // map.on('pointermove', function (e) {
    //   const coordinate = e.coordinate;
    //   console.log(selected);
    //   console.log(e);
    //   map.forEachFeatureAtPixel(e.pixel, function (feature) {
    //     const selIndex = selected.indexOf(feature);
    //     if (selIndex < 0) {
    //       selected.push(feature);
    //       console.log((feature as Feature).getProperties());
    //       (feature as Feature).setStyle(highlightStyle);
    //       if (content != null && overlay != null) {
    //         content.innerHTML = '<p>You clicked here:</p><code>' + '</code>';
    //         overlay.setPosition(coordinate);
    //       }
    //     } else {
    //       selected.splice(selIndex, 1);
    //       (feature as Feature).setStyle(unselectedStyle);
    //     }
    //   });

    //   status!.innerHTML = '&nbsp;' + selected.length + ' selected features';
    // });

    // dragBox.on('boxend', function () {
    //   const boxExtent = dragBox.getGeometry().getExtent();
    
    //   // if the extent crosses the antimeridian process each world separately
    //   const worldExtent = map.getView().getProjection().getExtent();
    //   const worldWidth = getWidth(worldExtent);
    //   const startWorld = Math.floor((boxExtent[0] - worldExtent[0]) / worldWidth);
    //   const endWorld = Math.floor((boxExtent[2] - worldExtent[0]) / worldWidth);
    
    //   for (let world = startWorld; world <= endWorld; ++world) {
    //     const left = Math.max(boxExtent[0] - world * worldWidth, worldExtent[0]);
    //     const right = Math.min(boxExtent[2] - world * worldWidth, worldExtent[2]);
    //     const extent = new Extent([left, boxExtent[1], right, boxExtent[3]]);
    
    //     const boxFeatures = vector
    //       .getFeaturesInExtent(extent)
    //       .filter(
    //         (feature) =>
    //           !selected.getArray().includes(feature) &&
    //           feature.getGeometry().intersectsExtent(extent)
    //       );
    
    //     // features that intersect the box geometry are added to the
    //     // collection of selected features
    
    //     // if the view is not obliquely rotated the box geometry and
    //     // its extent are equalivalent so intersecting features can
    //     // be added directly to the collection
    //     const rotation = map.getView().getRotation();
    //     const oblique = rotation % (Math.PI / 2) !== 0;
    
    //     // when the view is obliquely rotated the box extent will
    //     // exceed its geometry so both the box and the candidate
    //     // feature geometries are rotated around a common anchor
    //     // to confirm that, with the box geometry aligned with its
    //     // extent, the geometries intersect
    //     if (oblique) {
    //       const anchor = [0, 0];
    //       const geometry = dragBox.getGeometry().clone();
    //       geometry.translate(-world * worldWidth, 0);
    //       geometry.rotate(-rotation, anchor);
    //       const extent = geometry.getExtent();
    //       boxFeatures.forEach(function (feature) {
    //         const geometry = feature.getGeometry().clone();
    //         geometry.rotate(-rotation, anchor);
    //         if (geometry.intersectsExtent(extent)) {
    //           selected.push(feature);
    //         }
    //       });
    //     } else {
    //       selected.extend(boxFeatures);
    //     }
    //   }
    // });
  }

  criarSelect() {
    let insertQuery = "";

    for(const cidade of cidades){
      insertQuery += `UPDATE cidades SET cd_micro = '${cidade.microrregiao.id}' where cd_ibge = '${cidade.id}';\n`;
    }
    console.log(insertQuery);
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
