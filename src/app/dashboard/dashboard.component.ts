import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/http.service';


declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit  {
  businessForm: any;
  editBusiness: any;
  modalTitle: string = 'Add business';

  @ViewChild("googleMap", { static: false })
  googleMap!: GoogleMap;

  options: google.maps.MapOptions = {
    center: {lat: 40, lng: -20},
    zoom: 4
  };

  businessList$ : Observable<any[]> = this.httpService.getBusiness();
  markers: any[] = [];
  @ViewChild('businessFormAddressText') businessFormAddressText: any;

  constructor(
    private router: Router,
    private httpService: HttpService
  ) { this.clearForm(); }

  ngAfterViewInit(): void {
    this.refresh();
  }

  ngOnInit(): void {
  }


  showBusinessModal(business? : any) {
    this.clearForm();
    this.modalTitle = business ? 'Edit business' : 'Add business';
    if(business) this.businessForm = business;
    $('.ui.modal.business-modal').modal('show', () => {
      var autocomplete = new google.maps.places.Autocomplete(this.businessFormAddressText.nativeElement,
        {
            componentRestrictions: { country: 'CA' },
            types: ['address']
        });
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
          var place = autocomplete.getPlace();
          if(place.geometry) {
            this.businessForm.location.coordinates[0] = place.geometry.location.lat();
            this.businessForm.location.coordinates[1] = place.geometry.location.lng();
          }
          if(place.formatted_address) {
            this.businessForm.location.address = place.formatted_address;
          }
      })
    });
  }

  submit() {
    var obs;
    if(this.businessForm._id) {
      obs = this.httpService.updateBusiness(this.businessForm._id, this.businessForm);
    } else {
      delete this.businessForm._id;
      obs = this.httpService.createBusiness(this.businessForm);
    }
    obs.subscribe(() => {
      this.clearForm();
      this.refresh();
      $('.ui.modal.business-modal').modal('hide');
    })
  }

  refresh() {
    var bounds = new google.maps.LatLngBounds();
    this.businessList$ = this.httpService.getBusiness();
    this.markers = [];
    this.httpService.getVisit().subscribe((data: any[]) => {
      for(var visit of data) {
        var marker = {
          position: {
            lat: visit.location.coordinates[0],
            lng: visit.location.coordinates[1]
          },
          options: {
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          }
        }
        this.markers.push(marker)
        bounds.extend({ lat: visit.location.coordinates[0], lng: visit.location.coordinates[1] });
      }
      this.googleMap.fitBounds(bounds);
    })
    this.businessList$.subscribe((data: any[]) => {
      for(var busi of data) {
        var marker = {
          position: {
            lat: busi.location.coordinates[0],
            lng: busi.location.coordinates[1]
          },
          title: busi.name
        }
        this.markers.push(marker)
        bounds.extend({ lat: busi.location.coordinates[0], lng: busi.location.coordinates[1] });
      }
      this.googleMap.fitBounds(bounds);
    })
    
  }

  clearForm() {
    this.businessForm = {
      _id: '',
      name: '',
      email: '',
      location: {
        type: 'Point',
        coordinates: [] as any,
        address: ''
      }
    }
  }

  signOut() {
    localStorage.removeItem('jwt');
    this.router.navigate(['login']);
  }

  delete(business: any) {
    this.httpService.deleteBusiness(business._id).subscribe(() => this.refresh());
  }

  moveToLocation(business: any) {
    this.googleMap.panTo({ lat: business.location.coordinates[0], lng: business.location.coordinates[1] })
  }
}
