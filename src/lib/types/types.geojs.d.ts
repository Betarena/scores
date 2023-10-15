// https://get.geojs.io/
// https://get.geojs.io/v1/ip/geo.json
// https://www.geojs.io/docs/v1/endpoints/geo/

export interface GeoJsResponse 
{
  /** approx. radius around location from IP */
	accuracy:         number;
  /** autonomous system number associated with the IP */
	asn:              number;
  /** 3-letter continent code */
	continent_code:   string;
  /** country name in English */
	country:          string;
  /** 2-letter country code */
	country_code:     string;
  /** 3-letter country code */
	country_code3:    string;
  /** requested IP */
	ip:               string;
  /** IP latitude (Note: this is a string due to historic reasons) */
	latitude:         string;
  /** IP longitude (Note: this is a string due to historic reasons) */
	longitude:        string;
  /** The organization that the IP is registered to (Note: Unknown is returned when this field is unknown) */
	organization:     string;
  /** The ASN and organization field combined (Note: this field is depricated) */
	organization_name: string;
  /** Area code of IP */
	area_code?:       string;
  /** City name in English */
	city?:            string;
  /** Subdivison of the country the IP is within (State, region etc) */
	region?:          string;
  /** Time zone as specified by the IANA Time Zone Database */
	timezone?:        string;
}