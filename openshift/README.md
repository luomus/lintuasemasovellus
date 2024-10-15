# Openshift Deployment Instructions

1. Process the Template 
Create an env file (you can take example-env file as an example) and fill in the values. The values need to be base64
encoded.
```
oc process -f template.yaml --param-file=test.env > processed-template.yaml
```

2. Add Objects from the Processed Template
```
oc apply -f processed-template.yaml
```