
# How to use Aiakos with Docker

There are several options to use Aiakos very easily using docker. These are (in order of complexity):

- _"Have everything automatically done for me"_. See Section **1. The Fastest Way** (recommended).
- _"Check the unit tests associated to the component"_. See Seciton **2. Run Unit Test of Aiakos**.
- _"Check the acceptance tests are running properly"_ or _"I want to check that my Aiakos instance run properly"_ . See Section **3. Run Acceptance tests**.
- _"Create the proper rpm file for distributing the component"_ : See Section **4. Build a docker image to generate rpm file**.

You do not need to do all of them, just use the first one if you want to have a fully operational Aiakos instance and maybe third one to check if your Aiakos instance run properly.

You do need to have docker in your machine. See the [documentation](https://docs.docker.com/installation/) on how to do this. Additionally, you can use the proper FIWARE Lab docker functionality to deploy dockers image there. See the [documentation](https://docs.docker.com/installation/)

----
## 1. The Fastest Way

Docker allows you to deploy an Aiakos container in a few minutes. This method requires that you have installed docker or can deploy container into the FIWARE Lab (see previous details about it).

Consider this method if you want to try Aiakos and do not want to bother about losing data.

Follow these steps:

1. Create a directory on your system on which to work (for example, `~/fiware`).
2. Using the command-line and within the directory you created type: `docker build -t fiware-aiakos -f Dockerfile .`.

After a few seconds you should have your Aiakos image created. Just run the command `docker images` and you see the following response:

    REPOSITORY          TAG                 IMAGE ID            CREATED              SIZE
    fiware-aiakos       latest              bd78d006c2ea        About a minute ago   480.8 MB
    centos              7                   904d6c400333        2 weeks ago          196.8 MB
    ...

To execute the Aiakos image, execute the command `docker run -p -p 3000:3000 -d fiware-aiakos`. It will launch the Aiakos service listening on port `3000`.

Check that everything works with

	curl localhost:3000

What you have done with this method is the creation of the [Aiakos](https://hub.docker.com/r/fiware/aiakos/) image from the public repository of images called [Docker Hub](https://hub.docker.com/).

If you want to stop the scenario you have to execute `docker ps` and you see something like this:

    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
    b8e1de41deb5        fiware-aiakos       "/bin/sh -c ./start.s"   6 minutes ago       Up 6 minutes        0.0.0.0:3000->3000/tcp   fervent_davinci


Take the Container ID and execute `docker stop b8e1de41deb5` or `docker kill b8e1de41deb5`. Note that you will lose any data that was being used in Aiakos using this method.

----
## 2. Run Unit Test of Aiakos

This method will launch a container running Aiakos, and execute the unit tests associated to the component. You should move to the UnitTests folder `./UnitTests`. Just create a new docker image executind `docker build -t fiware-aiakos-unittests -f Dockerfile .`. Please keep in mind that if you do not change the name of the image it will automatically create a new one for unit tests and change the previous one to tag none.

To see that the image is created run `docker images` and you see something like this:

    REPOSITORY                TAG                 IMAGE ID            CREATED             SIZE
    fiware-aiakos-unittests   latest              103464a8ede0        30 seconds ago      551.3 MB
    centos                    latest              904d6c400333        2 weeks ago         196.8 MB

To execute the unit tests of this component, just execute `docker run --name fiware-aiakos-unittests fiware-aiakos-unittests`. Finally you can extract the information of the executed tests just executing `docker cp fiware-aiakos-unittests:/opt/fiware-aiakos/report .`


> TIP: If you are trying these methods or run them more than once and come across an error saying that the container already exists you can delete it with `docker rm fiware-aiakos-unittests`. If you have to stop it first do `docker stop fiware-aiakos-unittests`.

Keep in mind that if you use these commands you get access to the tags and specific versions of Aiakos. If you do not specify a version you are pulling from `latest` by default.

----
## 3. Run Acceptance tests

If you want to know more about images and the building process you can find it in [Docker's documentation](https://docs.docker.com/userguide/dockerimages/).

----
## 4. Build a docker image to generate rpm file

----
## 5. Other info

Things to keep in mind while working with docker containers and Aiakos.

### 5.1 Data persistence
Everything you do with Aiakos when dockerized is non-persistent. *You will lose all your data* if you turn off the Aiakos container. This will happen with either method presented in this README.

### 5.2 Using `sudo`

If you do not want to have to use `sudo` follow [these instructions](http://askubuntu.com/questions/477551/how-can-i-use-docker-without-sudo).
   