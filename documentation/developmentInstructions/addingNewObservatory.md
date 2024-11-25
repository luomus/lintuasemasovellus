# Adding a new observatory

1. Add basic information about the observatory to the [locations.json](../../lintuasema-backend/application/locations.json) file in this format:
```
{
  "observatories": [
    {
      "observatory": <observatory name>,
      "locations": [
        <location 1>,
        <location 2>,
        ...
      ],
      "types": [
        <type 1>
        <type 2>,
        ...
      ]
    },
    ...
  ]
}
```

2. Add the default species list for the observatory to the file [defaultBirds.json](../../frontend/src/defaultBirds.json). See [aboutDefinedSpecies.md](./aboutDefinedSpecies.md) for more information about the species.

3. Currently the daily actions and catches are hard-coded so if you need to change them you need to make changes at least to these files: [dailyActions.js](../../frontend/src/globalComponents/dayComponents/dailyActions.js), [catchType.js](../../frontend/src/globalComponents/dayComponents/catchType.js).

4. Locations for the local observation are hard-coded (the current options are "Bunkkeri" and "Luoto Gåu"). Changing them requires both backend and frontend changes. 
