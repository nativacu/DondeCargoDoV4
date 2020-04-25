import { Injectable } from '@angular/core';
import { ConnectivityProvider } from '../connectivity/connectivity';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Lugar } from '../../models/lugar';
import { googleMapsApiKey } from '../../../environments/environment';

declare var google;

@Injectable({ providedIn: 'root' })
export class GoogleMapsProvider {

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised = false;
  navController: any;
  markers: any = [];
  locationMarker: any;
  locations: any = [];
  apiKey: string;
  chargerObserver: BehaviorSubject<Lugar>;
  infoWindow: BehaviorSubject<any>;

  constructor(public connectivityService: ConnectivityProvider, private geolocation: Geolocation) {

  }

  init(mapElement: any, pleaseConnect: any, navCtrl: NavController, chargers: Array<Lugar>): Promise<any> {

    this.locations = chargers;
    this.navController = navCtrl;
    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;
    this.chargerObserver  = new BehaviorSubject(null);
    this.infoWindow = new BehaviorSubject(null);
    this.apiKey = googleMapsApiKey;
    return this.loadGoogleMaps();

  }

  loadGoogleMaps(): Promise<any> {

    return new Promise((resolve) => {

      if (typeof google === 'undefined' || typeof google.maps === 'undefined') {

        console.log('Google maps JavaScript needs to be loaded.');
        this.disableMap();

        if (this.connectivityService.isOnline()) {

          window['mapInit'] = () => {

            this.initMap().then(() => {
              resolve(true);
            }).catch();

            this.enableMap();
          };

          const script = document.createElement('script');
          script.id = 'googleMaps';

          if (this.apiKey) {
            script.src = 'http://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
          }

          document.body.appendChild(script);

        }
      } else {

        if (this.connectivityService.isOnline()) {
          this.initMap();
          this.enableMap();
        } else {
          this.disableMap();
        }

      }

      this.addConnectivityListeners();

    });

  }

  initMap(): Promise<any> {

    this.mapInitialised = true;

    return new Promise((resolve) => {

      this.geolocation.getCurrentPosition().then((position) => {

        const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        const mapOptions = {
          center: latLng,
          zoom: 18,
          // Uncomment to disable satelite view
          mapTypeControl: false,
          // Uncomment to disable street view
          streetViewControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.mapElement, mapOptions);
        console.log(this.map.center);
        this.disableDefaultLocations();
        this.addCurrentLocationMarker(position.coords.latitude, position.coords.longitude);
        this.addMarkers();
        this.startTracking();
        resolve(true);

      }).catch((err) => {
        console.log(err);
      });

    });

  }

  disableMap(): void {

    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = 'block';
    }

  }

  enableMap(): void {

    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = 'none';
    }

  }

  addConnectivityListeners(): void {

    document.addEventListener('online', () => {

      console.log('online');

      setTimeout(() => {

        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
          this.loadGoogleMaps().catch();
        } else {
          if (!this.mapInitialised) {
            this.initMap();
          }

          this.enableMap();
        }

      }, 2000);

    }, false);

    document.addEventListener('offline', () => {

      this.disableMap();

    }, false);

  }

  public addMarker(latLng: any) {
    const scaledSize = new google.maps.Size(45, 45);
    const url =  '../../assets/imgs/active-plug.svg';

    const image = {
      url,
      scaledSize
    };

    new google.maps.Marker({
      map: this.map,
      position: latLng,
      icon: image
    });
  }

  addCurrentLocationMarker(lat: number, lng: number): void {

    const latLng = new google.maps.LatLng(lat, lng);

    const icon = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: 'DeepSkyBlue',
      fillOpacity: 10,
      strokeOpacity: 0.2,
      scale: 8,

    };

    const marker = new google.maps.Marker({
      map: this.map,
      position: latLng,
      icon
    });


    this.locationMarker = marker;

  }

  addMarkers() {

    length =  this.locations.length;


    for (let i = 0; i < length; i++) {

      const charger =  this.locations[i];
      let image;
      const contentString = this.setContentString(charger);

      const infoWindow = new google.maps.InfoWindow({
        content: contentString
      });
      image = this.setMarkerIcon(charger);

      const marker = new google.maps.Marker({
        position: {lat: +charger.Latitud, lng: +charger.Longitud},
        map: this.map,
        icon: image
      });

      const chargerObserver = this.chargerObserver;
      const current = this.infoWindow;
      const markers = this.markers;
      const locations = this.locations;

      marker.addListener('click', function() {
        const index = markers.indexOf(marker);

        if (chargerObserver.value != null) {
          current.value.close();
        }

        current.next(infoWindow);
        infoWindow.open(this.map, marker);
        chargerObserver.next(locations[index]);
        infoWindow.addListener('closeclick', function() {
          const button = document.getElementById('reserveButton');
          const buttonadd = document.getElementById('addPlugButton');
          const buttonconf = document.getElementById('ConfigurePlugButton');
          const map = document.getElementById('map');
          map.style.height = '100%';
          button.hidden = buttonadd.hidden = buttonconf.hidden = true;
        }
        );
      });
      this.markers.push(marker);

    }
  }



  startTracking() {
    const watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.locationMarker.setMap(null);
      this.addCurrentLocationMarker(data.coords.latitude, data.coords.longitude);
    });
  }

  setMarkerIcon(charger) {
    let image: any;
    let url: string;
    const scaledSize = new google.maps.Size(35, 35);
    charger.is_operational = 1;
    if (charger.is_operational === 1) {
      url = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53%0D%0AMy5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNy40NSAyMy42MSI+PGRlZnM+PHN0eWxlPi5j%0D%0AbHMtMSwuY2xzLTN7ZmlsbDojM2RiZjI2O30uY2xzLTEsLmNscy0ye3N0cm9rZTojZmZmO3N0cm9r%0D%0AZS1taXRlcmxpbWl0OjEwO3N0cm9rZS13aWR0aDowLjI1cHg7fS5jbHMtMiwuY2xzLTR7ZmlsbDoj%0D%0AZmZmO308L3N0eWxlPjwvZGVmcz48dGl0bGU+YWN0aXZlLXBsdWc8L3RpdGxlPjxwYXRoIGNsYXNz%0D%0APSJjbHMtMSIgZD0iTTEyLjQuNEE4LjUyLDguNTIsMCwwLDAsMy44LDguODVjMCw3LjUzLDguNiwx%0D%0ANC44Nyw4LjYsMTQuODdTMjEsMTYuMjQsMjEsOC44NUE4LjUyLDguNTIsMCwwLDAsMTIuNC40WiIg%0D%0AdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMuNjcgLTAuMjcpIi8+PHBhdGggY2xhc3M9ImNscy0yIiBk%0D%0APSJNMTIuNCwyQTYuNzYsNi43NiwwLDAsMCw1LjgsOC45MmMwLDYuMTYsNi42LDEyLjE2LDYuNiwx%0D%0AMi4xNlMxOSwxNSwxOSw4LjkyQTYuNzYsNi43NiwwLDAsMCwxMi40LDJaIiB0cmFuc2Zvcm09InRy%0D%0AYW5zbGF0ZSgtMy42NyAtMC4yNykiLz48cmVjdCBjbGFzcz0iY2xzLTMiIHg9IjYuMDgiIHk9IjQu%0D%0ANzciIHdpZHRoPSIxLjUiIGhlaWdodD0iNi4yMSIvPjxyZWN0IGNsYXNzPSJjbHMtMyIgeD0iOS45%0D%0AMSIgeT0iNC45OCIgd2lkdGg9IjEuNSIgaGVpZ2h0PSI1LjgzIi8+PHJlY3QgY2xhc3M9ImNscy0z%0D%0AIiB4PSI0Ljg3IiB5PSI2Ljk0IiB3aWR0aD0iMS4yMSIgaGVpZ2h0PSIxLjI5Ii8+PGVsbGlwc2Ug%0D%0AY2xhc3M9ImNscy0zIiBjeD0iOC43NCIgY3k9IjEzLjY0IiByeD0iMC45MiIgcnk9IjEuMTciLz48%0D%0AcmVjdCBjbGFzcz0iY2xzLTQiIHg9IjcuMjQiIHk9IjE0LjI3IiB3aWR0aD0iMi44OCIgaGVpZ2h0%0D%0APSIxLjIxIi8+PC9zdmc+';
    }

    // else{
    //     url = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNi42%0D%0ANiAyMi41NCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiM4ZTkzOGE7c3Ryb2tlOiNmZmY7c3Ry%0D%0Ab2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjAuMjVweDt9LmNscy0ye2ZpbGw6I2ZmZjt9%0D%0APC9zdHlsZT48L2RlZnM+PHRpdGxlPkFzc2V0IDM8L3RpdGxlPjxnIGlkPSJMYXllcl8yIiBkYXRh%0D%0ALW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHBh%0D%0AdGggY2xhc3M9ImNscy0xIiBkPSJNOC4zMy4xM0E4LjEyLDguMTIsMCwwLDAsLjEzLDguMTljMCw3%0D%0ALjE4LDguMiwxNC4xOCw4LjIsMTQuMThzOC4yLTcuMTMsOC4yLTE0LjE4QTguMTIsOC4xMiwwLDAs%0D%0AMCw4LjMzLjEzWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEyLDEwLjc5bC41LjUxQTQuNzIs%0D%0ANC43MiwwLDAsMCwxMi44Miw5czAtMS0xLjg0LTIuMzVhLjc0Ljc0LDAsMCwxLS44NS0uODJMOS40%0D%0AMSw1LjEsOC4xLDYuMzksOC43NSw3czEuNTguMDcsMSwxLjMzTDcuNDIsMTAuNjksNywxMC42Miw0%0D%0ALjI4LDEzLjI4YTEsMSwwLDAsMCwuMjksMSwxLjEzLDEuMTMsMCwwLDAsLjk0LjM0TDguMTUsMTJs%0D%0AMC0uNDMsMi42OC0yLjY0cy4xNS0uMjQuNDEsMGMwLDAsLjcuMzEuNjYsMS45M1oiLz48cGF0aCBj%0D%0AbGFzcz0iY2xzLTIiIGQ9Ik02LjE5LDkuMTUsNywxMCw4LjIsOC44Niw3LjMsOEM4LjI0LDUuODUs%0D%0ANS41Niw1LDUuNTYsNWMtLjUxLS4xMi0uNDEuMjQtLjQxLjI0LDEsLjg4Ljg5LDEuMTQuODksMS4x%0D%0ANGExLjg3LDEuODcsMCwwLDEtMSwxLjM4Yy0uOS4zNi0xLjYtLjgyLTEuNi0uODItLjI5LDAtLjI0%0D%0ALjI2LS4yNC4yNi42OCwzLDMsMS45MiwzLDEuOTJabTYuNTEsNC4xM0wxMCwxMC43Nyw4Ljg3LDEx%0D%0ALjkzbDIuNTIsMi42NGEuMjQuMjQsMCwwLDAsLjE0LjA3LjIuMiwwLDAsMCwuMTMtLjA1bDEuMDYt%0D%0AMXMwLDAsMC0uMTJhLjE5LjE5LDAsMCwwLS4wNy0uMTVabS0uNjYsMC0uMTQuNDNzLS4wNy4xLS4x%0D%0AMi4xaC0uNDZhLjE1LjE1LDAsMCwxLS4xMi0uMWwtLjE1LS40M2EuMTMuMTMsMCwwLDEsMC0uMTVs%0D%0ALjM5LS4yNmEuMTcuMTcsMCwwLDEsLjE3LDBsLjM4LjI2di4xNVoiLz48L2c+PC9nPjwvc3ZnPg==';
    // }

    image = {
      url,
      scaledSize
    };

    return image;
  }

  disableDefaultLocations() {
    const styles = {
      default: null,
      hide: [
        {
          featureType: 'poi',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{visibility: 'off'}]
        }
      ]
    };

    this.map.setOptions({styles: styles.hide});
  }

  setContentString(charger: any) {
    let state = 'Activo';
    if (charger.is_operational === 0) {
      state = 'Inactivo';
    }

    const isOpen = this.checkWorkingHours(charger);
    let open: string;

    open = (isOpen ? 'Abrierto ahora' : 'Cerrado');

    let contentString = '<div id="content">' +
          '<div id="siteNotice">' +
          '</div>' +
          '<h6 id="firstHeading" class="firstHeading">' + charger.Nombre + '</h6>' +
          '<div id="bodyContent">' + '<p>' + open + '</p>' + state + '</b><br/><b> Horario: </b>' + charger.Hora_Inicio_Operaciones + ' a ' + charger.Hora_Fin_Operaciones + '</br>' +
          charger.Dia_Inicio_Operaciones + '-' + charger.Dia_Fin_Operaciones + '</br>' +
          '<b>Tipo de cobro: </b>' + charger.TipoCostoCarga ;

    if (charger.TipoCosto !== 'Gratis') {
            contentString += '</br><b>Precio: </b>' + charger.CostoCarga + ' RD$/' + charger.TipoCostoCarga;
          }

    contentString += '</br>' +
          charger.Descripcion +
          '</div>' +
          '</div>';


    return contentString;
  }

  checkWorkingHours(charger: any): boolean {
    const currentDate = new Date();
    const weekDate = currentDate.getDay();
    const time = currentDate.getHours() + (currentDate.getMinutes() / 60);
    if (charger.Hora_Inicio_Operaciones === undefined) {
      return;
    }
    let str: string = charger.Hora_Inicio_Operaciones;
    let startHour = 0;
    startHour = +str.substr(0, str.search(':')) + +str.substr(str.search(':') + 1, 2) / 60;
    str = charger.Hora_Fin_Operaciones;
    let endHour = 0;
    endHour = +str.substr(0, str.search(':')) + +str.substr(str.search(':') + 1, 2) / 60;
    const chargerWeekStart = this.getWeekDayByNumber(charger.Dia_Inicio_Operaciones);
    const chargerWeekEnd = this.getWeekDayByNumber(charger.Dia_Fin_Operaciones);
    let isOpen = false;

    if ((weekDate >= chargerWeekStart && weekDate <= chargerWeekEnd && chargerWeekStart <= chargerWeekEnd) ||
    ((weekDate <= chargerWeekEnd || weekDate >= chargerWeekStart) && chargerWeekStart > chargerWeekEnd)) {
      // TODO revisar si eso es string
      if (time >= startHour && time < endHour) {
        isOpen = true;
      }

    }

    return isOpen;

  }

  getWeekDayByNumber(weekDay: string): number {
    let numValue: number;
    enum days {
      Domingo,
      Lunes,
      Martes,
      Miercoles,
      Jueves,
      Viernes,
      Sabado
    }

    switch (weekDay) {
      case 'Domingo': {
        numValue = days.Domingo;
        break;
      }
      case 'Lunes': {
        numValue = days.Lunes;
        break;
      }
      case 'Martes': {
        numValue = days.Martes;
        break;
      }
      case 'Miercoles': {
        numValue = days.Miercoles;
        break;
      }
      case 'Jueves': {
        numValue = days.Jueves;
        break;
      }
      case 'Viernes': {
        numValue = days.Viernes;
        break;
      }
      case 'Sabado': {
        numValue = days.Sabado;
        break;
      }
      default: {
        numValue = -1;
      }
    }

    return numValue;
  }

  getMapCenter() {


    // return this.map.center;
  }


}
