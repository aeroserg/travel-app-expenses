
DOCKER_USER = aeroserg

FRONTEND_IMAGE = $(DOCKER_USER)/travel-exp-frontend
BACKEND_IMAGE  = $(DOCKER_USER)/travel-exp-backend

TAG = latest

.PHONY: all build push up down

build: build-backend build-frontend

build-frontend:
	docker build -t $(FRONTEND_IMAGE):$(TAG) ./frontend

build-backend:
	docker build -t $(BACKEND_IMAGE):$(TAG) ./backend

push: push-backend push-frontend

push-frontend:
	docker push $(FRONTEND_IMAGE):$(TAG)

push-backend:
	docker push $(BACKEND_IMAGE):$(TAG)

up:
	docker-compose up -d --build

down:
	docker-compose down
