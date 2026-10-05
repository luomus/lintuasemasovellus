# Openshift Deployment Instructions

1. Process the Template 
Create an env file (you can take example-env file as an example) and fill in the values. Other values than BRANCH and
HOST need to be base64 encoded. You can use for example the following command to encode a value:
```
echo -n value | base64
```
Then run the following command to process the template:
```
oc process -f template.yaml --param-file=test.env > processed-template.yaml
```

2. Add Objects from the Processed Template
```
oc apply -f processed-template.yaml
```
