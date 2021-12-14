// https://get.geojs.io/
// https://get.geojs.io/v1/ip/geo.json
// https://www.geojs.io/docs/v1/endpoints/geo/

export interface GeoJsResponse {
    accuracy: number // Radius in kilometers around the specified location where the IP address is likely to be
    asn: number // The autonomous system number associated with the IP address (Note: 64512 is returned when the ASN is unknown)
    continent_code: string // Three letter continent code
    country: string // Country name in English
    country_code: string // Two letter country code
    country_code3: string // Three letter country code
    ip: string  // Requested IP
    latitude: string // IP latitude (Note: this is a string due to historic reasons)
    longitude: string // IP longitude (Note: this is a string due to historic reasons)
    organization: string // The organization that the IP is registered to (Note: Unknown is returned when this field is unknown)
    organization_name: string // The ASN and organization field combined (Note: this field is depricated)

    area_code?: string
    city?: string // City name in English	Mountain
    region?: string // Subdivison of the country the IP is within (State, region etc)
    timezone?: string // Time zone as specified by the IANA Time Zone Database
}