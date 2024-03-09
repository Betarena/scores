// https://get.geojs.io/
// https://get.geojs.io/v1/ip/geo.json
// https://www.geojs.io/docs/v1/endpoints/geo/

export interface GeoJsResponse
{
  /**
   * @description
   *  📣 approx. radius around location from IP
   */
	accuracy:         number;
  /**
   * @description
   *  📣 autonomous system number associated with the IP
   */
	asn:              number;
  /**
   * @description
   *  📣 3-letter continent code
   */
	continent_code:   string;
  /**
   * @description
   *  📣 country name in English
   */
	country:          string;
  /**
   * @description
   *  📣 2-letter country code
   */
	country_code?:     string;
  /**
   * @description
   *  📣 3-letter country code
   */
	country_code3:    string;
  /**
   * @description
   *  📣 requested IP
   */
	ip:               string;
  /**
   * @description
   *  📣 IP latitude (Note: this is a string due to historic reasons)
   */
	latitude:         string;
  /**
   * @description
   *  📣 IP longitude (Note: this is a string due to historic reasons)
   */
	longitude:        string;
  /**
   * @description
   *  📣 The organization that the IP is registered to (Note: Unknown is returned when this field is unknown)
   */
	organization:     string;
  /**
   * @description
   *  📣 The ASN and organization field combined (Note: this field is depricated)
   */
	organization_name: string;
  /**
   * @description
   *  📣 Area code of IP
   */
	area_code?:       string;
  /**
   * @description
   *  📣 City name in English
   */
	city?:            string;
  /**
   * @description
   *  📣 Subdivison of the country the IP is within (State, region etc)
   */
	region?:          string;
  /**
   * @description
   *  📣 Time zone as specified by the IANA Time Zone Database
   */
	timezone?:        string;
}