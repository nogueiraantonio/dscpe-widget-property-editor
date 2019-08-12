# GitLab-CI Setup for widgetlab

## Prereq

- A running Docker engine, that can access to GitLab server URL

- A Docker image [**gitlab/gitlab-runner**](https://hub.docker.com/r/gitlab/gitlab-runner/) running on this engine *(--name gitlab-runner)*

To pull & run a gitlab-runner Docker image, use this command:

```
docker run -d --restart always --name gitlab-runner
    -v /var/run/docker.sock:/var/run/docker.sock
    -v /srv/gitlab-runner/config:/etc/gitlab-runner
    gitlab/gitlab-runner
```

where */srv/gitlab-runner/config* is the gitlab-runner configuration folder on the Docker host machine.

## enable CI/CD for the repository

- Edit your GitLab repository settings : [**Settings > General**](https://itgit.dsone.3ds.com/widget-lab/widget-template-vue/edit)
- Expand block **Visibility, project features, permissions**
- Then enable **Pipelines**

- A new Settings block should appear now :  [**Settings > CI/CD**](https://itgit.dsone.3ds.com/widget-lab/widget-template-vue/-/settings/ci_cd)
- Expand block **Runners**
- Search for **Set up a specific Runner manually**
- Take note of given **URL** and **registration token**, there will be useful for the next steps

## register GitLab runner for the current repository

- Connect to your Docker engine server
- identify gitlab/gitlab-runner image running: 

```
docker ps
```
    
- Then register a new runner with this command:

```
docker exec -ti gitlab-runner gitlab-runner register
```
   
- Fill in information comming from GitLab Settings > CI/CD > Runner (URL and Token)
- then add tag 'widgetlab' to limit usage to widgetlab CI
- Finally set executor to "docker", this will use Docker image (from Dockerhub) to run jobs.
(default Docker image should be "node:lts")

- Return to repository:  [**Settings > CI/CD**](https://itgit.dsone.3ds.com/widget-lab/widget-template-vue/-/settings/ci_cd)
- Expand block **Runners**
- The new named runner should apear now

## setup AWS Credentials

- Go to [**Settings > CI/CD**](https://itgit.dsone.3ds.com/widget-lab/widget-template-vue/-/settings/ci_cd)
- Expand block **Variables**
- Set variables (get key/secret from AWS) :

| variable | value |
| ------ | ------ |
| AWS_ACCESS_KEY_ID | ??????? |
| AWS_SECRET_ACCESS_KEY | ???????/?????? |
| AWS_DEFAULT_REGION | eu-west-1 | 

## expected result

As soon as there are new commits or merges to any branch (if the .gitlab-ci.yml file is present at the repo's root), a new Pipline is executed.

You can check status on the [**Repository > Files page**](https://itgit.dsone.3ds.com/widget-lab/widget-template-vue/tree/master), or on the [**CI/CD > Pipelines**](https://itgit.dsone.3ds.com/widget-lab/widget-template-vue/pipelines) page. 
