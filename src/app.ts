import axios, { Axios } from "axios";
declare var google: any;

enum GoogleStatus {
    OK = 'OK',
    ZERO_RESULTS = 'ZERO_RESULTS'
}

type GoogleGeocodingResponse = {
    results: {
        geometry: {
            location: {
                lat: number,
                lng: number
            }
        },
        formatted_address: string
    }[];
    status: GoogleStatus;
}

abstract class BaseService {
    protected axiosInstance: Axios

    constructor(axiosInstance: Axios){
        this.axiosInstance = axiosInstance
    }
}

class MapsService extends BaseService {
    formElement: HTMLFormElement;
    addressInput: HTMLInputElement;

    constructor() {
        super(
            axios.create({
                baseURL: 'https://maps.googleapis.com/maps/api',
                params: {
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            })
        )
        this.formElement = document.querySelector('form')! as HTMLFormElement;
        this.addressInput = document.getElementById('address')! as HTMLInputElement;

        this.formElement.addEventListener('submit', this.searchAddressHandler.bind(this));
    }

    private async searchAddressHandler(event: Event): Promise<void> {
        event.preventDefault();
        const enteredAddress = this.addressInput.value;
        const { data } = (await this.axiosInstance.get<GoogleGeocodingResponse>('/geocode/json', {params:{address: enteredAddress}}));
        if (data.status !== GoogleStatus.OK) {
            throw new Error(`Status Error: ${data.status}`)
        }

        const position = data.results[0].geometry.location;
        const title = data.results[0].formatted_address;

        this.initMap(position, title);
    }

    private async initMap(position: { lat: number, lng: number}, title: string) {
        //@ts-ignore
        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        //@ts-ignore
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

        const map = new Map(
            document.getElementById('map') as HTMLElement,
            {
            zoom: 16,
            center: position,
            mapId: 'DEMO_MAP_ID',
            }
        );

        new AdvancedMarkerElement({
            map: map,
            position: position,
            title: title
        });
    }
}

new MapsService()