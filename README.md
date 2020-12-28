# Hello Kubernetes in Docker

Deploy a simple NodeJS "counter" express application on your local machine using [KinD](https://kind.sigs.k8s.io/).

Including:

* namespace
* deployment
* service
* cronjob
* DNS-based service discovery
* kubectl port-forward (useful for [KinD](https://kind.sigs.k8s.io/) testing)

## Prerequisites

* Install Docker
* Install KinD

## Deployment

### Using pre-existing image (index.docker.io/guyrotem/node-counter:1.2)

1. Create a local Kubernetes cluster `kind create cluster --name {clusterName}`
2. kubectl apply -f kuberesources/*

### Deploying your own image

Choose an image name => {imageFullName} ~= {imageName}:{imageTag}

1. `cd app`
2. `npm install`
3. `docker build . -t {imageFullName}`
   
    To verify, run `docker images | grep {imageName}`

4. Create a local Kubernetes cluster `kind create cluster --name {clusterName}`
5. Make your image available to KinD
    1. Option 1: load the image directly to KinD's local containerd registry `kind load docker-image {imageFullName} --name {clusterName}`
    2. Option 2: push image to a public registry

6. update deployment's spec.template.spec.containers[0].image field to {imageFullName} (or leave as-is to use the published version).
7. kubectl apply -f kuberesources/*

## Exposing the service to your host 

`kubectl -n counter-ns port-forward svc/counter-svc 8081`

To verify, `curl http://localhost:8081/count`

## Result

You should now have a counting server, incremented every minute!


kubectl -n counter-ns get cj
```
NAME      SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
curling   0/1 * * * *   False     0        58s             113s
```

kubectl -n counter-ns get svc
```
NAME          TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
counter-svc   NodePort   10.102.111.199   <none>        8081:30769/TCP   2m58s
```

kubectl -n counter-ns get deploy
```
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
counter-deploy   1/1     1            1           2m59s
```

#### Server API:

`curl http://localhost:8081/count`
get counter value

`curl http://localhost:8081/info`
get all increment timestamps 

`curl -X POST http://localhost:8081/inc`
increment counter value by 1

`curl -X POST http://localhost:8081/reset`
clear all incrementations