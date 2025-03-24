# Rajapinnat: 

## (requests)

### observationStationService.js

#### /api/getLocations	
        -actions:
		-actions
		-type
		-actions
		-type
	-locations
	-observatory
	-types
#### api/getObservationPeriods
	-day_id
	-endTime: ( year off )
	-id
	-startTime
	-type_id
#### api/getDaysObservationPeriods/dayId
	-day_id
	-endTime: ( only hours )
	-id
	-location
	-observationType
	-speciesCount
	-startTime: ( only hours )
… /other not working
… /standard not working
… /getObservationLocations/stationId not working


### dayService.js:

#### api/listDays
	- comment
	- day
	- id
	- observatory
	- observers
	- selectedactions
#### api/getLocationsAndTypes/observatory_id
	-actions
	-types
#### api/searchDayInfo/date/observatory
	-comment
	-id
	-observers
	-selectedactions

#### api/getCatchDetails/dayId
	[
    {
        "alku": time,
        "key": number,
        "loppu": time,
        "lukumaara": number,
        "pyyntialue": string,
        "pyyntitapa": string,
        "verkonPituus": number
    }
]

#### api/getLatestDays/observatory
	- day
	- speaciesCount
#### api/getObservationsSummary/dayId
	-constMigration
	-nightMigration
	-otherMigration
    -localGåu
    -localOther
    -scatter
	-localGåuShorthand
	-localOtherShorthand
	-scatterShorthand
	-notes
	-species
    -dayId
#### api/getShorthandText/dayId/Type/Location
	- endTime
	- obsPeriodId
	- shorthands
		-observations
			-id
		-shorthand_id
		-shorthand_text
	-startTime
	-endTime
	-obsPeriodId
	-shorthands
		-observations
			-id
		-shorthand_id
		-shorthand_text
	-startTime
#### /api/getShorthandByObsPeriod/obsPeriodId
	-id
	-shorthandBlock


### observationlistService.js
#### /api/getObservations/obsPeriodId
	- bypassSide
	- count
	- direction
	- notes
	- species 
