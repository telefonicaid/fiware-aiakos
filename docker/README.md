
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

Docker allows you to deploy an Aiakos container in a few minutes. This method requires that you have installed docker or can deploy container into the FIWARE Lab (see previos detaile about it).

Consider this method if you want to try Aiakos and do not want to bother about losing data.

Follow these steps:

1. Create a directory on your system on which to work (for example, `~/fiware`).
2. Create a new file called `docker-compose.yml` inside your directory with the following contents:
	
		mongo:
		  image: mongo:3.2
		  command: --nojournal
		orion:
		  image: fiware/orion
		  links:
		    - mongo
		  ports:
		    - "1026:1026"
		  command: -dbhost mongo

3. Using the command-line and within the directory you created type: `sudo docker-compose up`.

> Regarding --nojournal it is not recommened for production, but it speeds up mongo container start up and avoids some race conditions problems if Orion container is faster and doesn't find the DB up and ready.

After a few seconds you should have your Context Broker running and listening on port `1026`.

Check that everything works with

	curl localhost:1026/version

What you have done with this method is download images for [Orion Context Broker](https://hub.docker.com/r/fiware/orion/) and [MongoDB](https://hub.docker.com/_/mongo/) from the public repository of images called [Docker Hub](https://hub.docker.com/). Then you have created two containers based on both images.

If you want to stop the scenario you have to press Control+C on the terminal where docker-compose is running. Note that you will lose any data that was being used in Orion using this method.

----
## 2. Run Unit Test of Aiakos

This method will launch a container running Orion Context Broker, but it is up to you to provide a MongoDB instance. This MongoDB instance may be running on localhost, other host on your network, another container, or anywhere you have network access to.

> TIP: If you are trying these methods or run them more than once and come across an error saying that the container already exists you can delete it with `docker rm orion1`. If you have to stop it first do `docker stop orion1`.

Keep in mind that if you use these commands you get access to the tags and specific versions of Orion. For example, you may use `fiware/orion:0.22` instead of `fiware/orion` in the following commands if you need that particular version. If you do not specify a version you are pulling from `latest` by default.

### 2A. MongoDB is on localhost

To do this run this command

	sudo docker run -d --name orion1 -p 1026:1026 fiware/orion

Check that everything works with

	curl localhost:1026/version

----
## 3. Run Acceptance tests

Building an image gives more control on what is happening within the Orion Context Broker container. Only use this method if you are familiar with building docker images or really need to change how this image is built. For most purposes you probably don't need to build an image, only deploy a container based on one already built for you (which is covered in sections 1 and 2).

Steps:

1. Download [Orion's source code](https://github.com/telefonicaid/fiware-orion/) from Github (`git clone https://github.com/telefonicaid/fiware-orion/`)
2. `cd fiware-orion/docker`
3. Modify the Dockerfile to your liking
4. Run Orion...
	* Using an automated scenario with docker-compose and building your new image: `sudo docker-compose up`. You may also modify the provided `docker-compose.yml` file if you need so.
	* Manually, running MongoDB on another container: 
        	1. `sudo docker run --name mongodb -d mongo:3.2`
		2. `sudo docker build -t orion .`
		3. `sudo docker run -d --name orion1 --link mongodb:mongodb -p 1026:1026 orion -dbhost mongodb`.
	* Manually, specifying where to find your MongoDB host:
		1. `sudo docker build -t orion .`
		2. `sudo docker run -d --name orion1 -p 1026:1026 orion -dbhost <MongoDB Host>`.

Check that everything works with

	curl localhost:1026/version

The parameter `-t orion` in the `docker build` command gives the image a name. This name could be anything, or even include an organization like `-t org/fiware-orion`. This name is later used to run the container based on the image.

If you want to know more about images and the building process you can find it in [Docker's documentation](https://docs.docker.com/userguide/dockerimages/).

----
## 4. Build a docker image to generate rpm file

----
## 5. Other info (finish)

Things to keep in mind while working with docker containers and Aiakos.

### 5.1 Data persistence (pending)
Everything you do with Aiakos when dockerized is non-persistent. *You will lose all your data* if you turn off the Aiakos container. This will happen with either method presented in this README.

If you want to prevent this from happening take a look at [this link](https://registry.hub.docker.com/_/mongo/) in section *Where to Store Data* of the MongoDB docker documentation. In it you will find instructions and ideas on how to make your MongoDB data persistent.

### 5.2 Using `sudo` (finish)

If you do not want to have to use `sudo` follow [these instructions](http://askubuntu.com/questions/477551/how-can-i-use-docker-without-sudo).
   